import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { 
  FaQrcode, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaExclamationTriangle, 
  FaHistory, 
  FaDoorOpen, 
  FaUsers, 
  FaCamera, 
  FaKeyboard,
  FaVolumeUp,
  FaVolumeMute,
  FaArrowLeft
} from 'react-icons/fa';

interface TicketRecord {
  codigo: string;
  tipo?: 'TICKET' | 'SOCIO';
  partido: string;
  titular: string;
  rut: string;
  sector: string;
  puerta: string;
  estado: 'DISPONIBLE' | 'UTILIZADO' | 'INVALIDO' | 'MOROSO';
  horaIngreso?: string;
  puertaIngreso?: string;
  planSocio?: string;
  cuotaEstado?: 'AL DÍA' | 'PENDIENTE';
  numeroSocio?: string;
}

interface LogIngreso {
  id: string;
  codigo: string;
  titular: string;
  resultado: 'PERMITIDO' | 'DENEGADO';
  motivo: string;
  hora: string;
  sector: string;
}

export const ValidadorTicket: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [codigoInput, setCodigoInput] = useState('');
  const [puertaActual, setPuertaActual] = useState('Puerta 2 - Galería Sur');
  const [sonidoHabilitado, setSonidoHabilitado] = useState(true);
  const [resultadoActual, setResultadoActual] = useState<{
    tipo: 'IDLE' | 'EXITO' | 'DENEGADO' | 'ERROR';
    mensaje: string;
    detalle?: TicketRecord;
  }>({ tipo: 'IDLE', mensaje: 'Listo para escanear entrada o carnet de socio...' });

  const [aforoActual, setAforoActual] = useState(1420);
  const [totalValidadas, setTotalValidadas] = useState(1420);
  const [totalRechazos, setTotalRechazos] = useState(14);
  const [historial, setHistorial] = useState<LogIngreso[]>([
    {
      id: 'log-1',
      codigo: 'DPM-TKT-8491-01',
      titular: 'Carlos Alvarado',
      resultado: 'PERMITIDO',
      motivo: 'Entrada verificada con éxito',
      hora: '17:35:12',
      sector: 'Galería Sur'
    },
    {
      id: 'log-2',
      codigo: 'DPM-TKT-8491-02',
      titular: 'Matías Soto',
      resultado: 'DENEGADO',
      motivo: 'Entrada ya utilizada a las 17:15',
      hora: '17:38:40',
      sector: 'Tribuna Chinquihue'
    }
  ]);

  // Base de datos local simulada de entradas y credenciales de socio
  const [ticketsDB, setTicketsDB] = useState<Record<string, TicketRecord>>({
    'DPM-TKT-DEMO-VALID': {
      codigo: 'DPM-TKT-DEMO-VALID',
      tipo: 'TICKET',
      partido: 'DPM vs Deportes Temuco',
      titular: 'Juan Ignacio Pérez',
      rut: '18.943.201-4',
      sector: 'Galería Sur',
      puerta: 'Puerta 2 - Galería Sur',
      estado: 'DISPONIBLE'
    },
    'DPM-TKT-DEMO-USADA': {
      codigo: 'DPM-TKT-DEMO-USADA',
      tipo: 'TICKET',
      partido: 'DPM vs Deportes Temuco',
      titular: 'Rodrigo Gómez Muñoz',
      rut: '15.342.119-K',
      sector: 'Tribuna Chinquihue',
      puerta: 'Puerta 1 - Tribuna Principal',
      estado: 'UTILIZADO',
      horaIngreso: '17:12:05',
      puertaIngreso: 'Puerta 1'
    },
    'DPM-SOCIO-2026-0842': {
      codigo: 'DPM-SOCIO-2026-0842',
      tipo: 'SOCIO',
      partido: 'Membresía Anual 2026 • Torneo Oficial',
      titular: 'Matías Hincha Albiverde',
      rut: '18.492.301-8',
      sector: 'Tribuna Chinquihue (Sector Socios)',
      puerta: 'Puerta 1 - Exclusiva Socios',
      planSocio: 'Socio Tribuna Chinquihue',
      numeroSocio: 'DPM-2026-0842',
      cuotaEstado: 'AL DÍA',
      estado: 'DISPONIBLE'
    },
    'DPM-SOCIO-MOROSO': {
      codigo: 'DPM-SOCIO-MOROSO',
      tipo: 'SOCIO',
      partido: 'Membresía Anual 2026',
      titular: 'Gonzalo Silva Vera',
      rut: '14.281.902-3',
      sector: 'Galería Sur',
      puerta: 'Puerta 2',
      planSocio: 'Socio Galería Popular',
      numeroSocio: 'DPM-2026-0115',
      cuotaEstado: 'PENDIENTE',
      estado: 'MOROSO'
    }
  });

  const inputRef = useRef<HTMLInputElement>(null);

  // Reproducir efectos de sonido audibles de torniquete con Web Audio API
  const emitirSonido = (esExito: boolean) => {
    if (!sonidoHabilitado) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();

      if (esExito) {
        // Tono doble ascendente "Pi-piip" (Torniquete aprobado)
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.frequency.setValueAtTime(800, ctx.currentTime);
        osc1.frequency.setValueAtTime(1200, ctx.currentTime + 0.08);
        gain1.gain.setValueAtTime(0.3, ctx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start();
        osc1.stop(ctx.currentTime + 0.25);
      } else {
        // Zumbido grave "Bzzzz" (Acceso denegado)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, ctx.currentTime);
        gain.gain.setValueAtTime(0.4, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.45);
      }
    } catch {
      // AudioContext no disponible o bloqueado por navegador
    }
  };

  // Procesar código recibido de URL si existe o de localStorage
  useEffect(() => {
    const rawSaved = localStorage.getItem('dpm_ultimo_ticket');
    if (rawSaved) {
      try {
        const saved = JSON.parse(rawSaved);
        setTicketsDB(prev => ({
          ...prev,
          [saved.codigo]: {
            codigo: saved.codigo,
            partido: saved.partido,
            titular: saved.titular,
            rut: saved.rut,
            sector: saved.sector,
            puerta: saved.puerta,
            estado: 'DISPONIBLE'
          }
        }));
      } catch (e) {
        console.error(e);
      }
    }

    const paramCodigo = searchParams.get('codigo');
    if (paramCodigo) {
      setCodigoInput(paramCodigo);
    }
  }, [searchParams]);

  // Cargar métricas oficiales de aforo en vivo desde el Backend Spring Boot
  useEffect(() => {
    const cargarAforo = async () => {
      try {
        const res = await api.get('/entradas/aforo');
        if (res.data && res.data.ingresados) {
          setAforoActual(res.data.ingresados);
        }
      } catch (err) {
        // En modo local mantiene el aforo base
      }
    };
    cargarAforo();
  }, []);

  // Validar código contra la API de Spring Boot (con fallback local)
  const procesarCodigo = async (codigo: string) => {
    const cleanCode = codigo.trim().toUpperCase();
    if (!cleanCode) return;

    const ahora = new Date().toLocaleTimeString('es-CL');

    // 1. Intento de Validación en el Backend Spring Boot
    try {
      const res = await api.post('/entradas/validar', { 
        codigo: cleanCode, 
        puerta: puertaActual 
      });
      const data = res.data;

      if (data.valido) {
        emitirSonido(true);
        setTotalValidadas(prev => prev + 1);
        if (data.aforoActual) setAforoActual(data.aforoActual);

        const ticketExito: TicketRecord = {
          codigo: cleanCode,
          tipo: cleanCode.includes('SOCIO') ? 'SOCIO' : 'TICKET',
          partido: data.partido || 'Deportes Puerto Montt • Temporada 2026',
          titular: data.titular || 'Hincha Albiverde',
          rut: data.rut || '18.492.301-8',
          sector: data.sector || 'Galería Sur',
          puerta: puertaActual,
          estado: 'UTILIZADO',
          horaIngreso: data.horaIngreso || ahora,
          puertaIngreso: puertaActual
        };

        setResultadoActual({
          tipo: 'EXITO',
          mensaje: data.mensaje || 'ACCESO PERMITIDO - BIENVENIDO A CHINQUIHUE',
          detalle: ticketExito
        });

        setHistorial(prev => [
          {
            id: `log-${Date.now()}`,
            codigo: cleanCode,
            titular: data.titular,
            resultado: 'PERMITIDO',
            motivo: data.mensaje || 'Acceso verificado en servidor',
            hora: data.horaIngreso || ahora,
            sector: data.sector || 'Galería Sur'
          },
          ...prev.slice(0, 19)
        ]);

        setCodigoInput('');
        if (inputRef.current) inputRef.current.focus();
        return;
      } else {
        // Rechazo devuelto por el servidor (duplicado, moroso o inexistente)
        emitirSonido(false);
        setTotalRechazos(prev => prev + 1);

        const ticketRechazo: TicketRecord = {
          codigo: cleanCode,
          tipo: cleanCode.includes('SOCIO') ? 'SOCIO' : 'TICKET',
          partido: data.partido || 'Deportes Puerto Montt',
          titular: data.titular || 'Desconocido',
          rut: data.rut || '---',
          sector: data.sector || '---',
          puerta: puertaActual,
          estado: data.estado === 'YA_UTILIZADO' ? 'UTILIZADO' : (data.estado === 'SOCIO_MOROSO' ? 'MOROSO' : 'INVALIDO'),
          horaIngreso: data.horaIngreso || ahora
        };

        setResultadoActual({
          tipo: data.estado === 'YA_UTILIZADO' ? 'DENEGADO' : 'ERROR',
          mensaje: data.mensaje || 'ACCESO RECHAZADO',
          detalle: ticketRechazo
        });

        setHistorial(prev => [
          {
            id: `log-${Date.now()}`,
            codigo: cleanCode,
            titular: data.titular || 'Desconocido',
            resultado: 'DENEGADO',
            motivo: data.mensaje || 'Entrada no permitida por torniquete',
            hora: ahora,
            sector: data.sector || 'N/A'
          },
          ...prev.slice(0, 19)
        ]);

        setCodigoInput('');
        if (inputRef.current) inputRef.current.focus();
        return;
      }
    } catch (error) {
      // 2. Modo Offline / Fallback si el servidor está apagado
      const ticket = ticketsDB[cleanCode];

      if (!ticket) {
        emitirSonido(false);
        setTotalRechazos(prev => prev + 1);
        setResultadoActual({
          tipo: 'ERROR',
          mensaje: 'CÓDIGO NO REGISTRADO O FRAUDULENTO',
        });
        setHistorial(prev => [
          {
            id: `log-${Date.now()}`,
            codigo: cleanCode,
            titular: 'Desconocido',
            resultado: 'DENEGADO',
            motivo: 'Código no existe en el sistema oficial (Modo Local)',
            hora: ahora,
            sector: 'N/A'
          },
          ...prev.slice(0, 19)
        ]);
      } else if (ticket.estado === 'MOROSO') {
        emitirSonido(false);
        setTotalRechazos(prev => prev + 1);
        setResultadoActual({
          tipo: 'ERROR',
          mensaje: 'SOCIO CON CUOTA PENDIENTE (ACCESO BLOQUEADO)',
          detalle: ticket
        });
        setHistorial(prev => [
          {
            id: `log-${Date.now()}`,
            codigo: ticket.codigo,
            titular: ticket.titular,
            resultado: 'DENEGADO',
            motivo: 'Cuota de socio impaga. Regularizar en sede o web',
            hora: ahora,
            sector: ticket.sector
          },
          ...prev.slice(0, 19)
        ]);
      } else if (ticket.estado === 'UTILIZADO') {
        emitirSonido(false);
        setTotalRechazos(prev => prev + 1);
        setResultadoActual({
          tipo: 'DENEGADO',
          mensaje: ticket.tipo === 'SOCIO' ? 'SOCIO YA INGRESÓ HOY AL ESTADIO' : 'ENTRADA YA UTILIZADA',
          detalle: ticket
        });
        setHistorial(prev => [
          {
            id: `log-${Date.now()}`,
            codigo: ticket.codigo,
            titular: ticket.titular,
            resultado: 'DENEGADO',
            motivo: `Ya ingresó a las ${ticket.horaIngreso || 'previamente'} por ${ticket.puertaIngreso || 'otra puerta'}`,
            hora: ahora,
            sector: ticket.sector
          },
          ...prev.slice(0, 19)
        ]);
      } else {
        emitirSonido(true);
        const ticketActualizado: TicketRecord = {
          ...ticket,
          estado: 'UTILIZADO',
          horaIngreso: ahora,
          puertaIngreso: puertaActual
        };

        setTicketsDB(prev => ({
          ...prev,
          [cleanCode]: ticketActualizado
        }));

        setTotalValidadas(prev => prev + 1);
        setAforoActual(prev => prev + 1);
        setResultadoActual({
          tipo: 'EXITO',
          mensaje: ticket.tipo === 'SOCIO' 
            ? 'ACCESO LIBERADO • BIENVENIDO SOCIO' 
            : 'ACCESO PERMITIDO - BIENVENIDO A CHINQUIHUE',
          detalle: ticketActualizado
        });

        setHistorial(prev => [
          {
            id: `log-${Date.now()}`,
            codigo: ticket.codigo,
            titular: ticket.titular,
            resultado: 'PERMITIDO',
            motivo: ticket.tipo === 'SOCIO' ? 'Acceso liberado por membresía' : 'Acceso concedido (Modo Local)',
            hora: ahora,
            sector: ticket.sector
          },
          ...prev.slice(0, 19)
        ]);
      }
    }

    setCodigoInput('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    procesarCodigo(codigoInput);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-16">
      {/* Barra de Control Superior */}
      <div className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link 
              to="/admin" 
              className="flex items-center gap-2 text-xs bg-slate-800 hover:bg-slate-700 text-sky-300 px-3 py-1.5 rounded-lg transition"
            >
              <FaArrowLeft /> Volver a Admin
            </Link>
            <div className="h-6 w-px bg-slate-700 hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse"></span>
              <h1 className="text-base sm:text-lg font-black tracking-wide uppercase text-white">
                Control de Accesos • Estadio Chinquihue
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Selector de Puerta de Control */}
            <div className="flex items-center gap-2 text-xs">
              <FaDoorOpen className="text-sky-400" />
              <select
                value={puertaActual}
                onChange={(e) => setPuertaActual(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-white rounded-lg px-2.5 py-1 text-xs focus:ring-1 focus:ring-emerald-500 outline-none"
              >
                <option value="Puerta 1 - Tribuna Chinquihue">Puerta 1 - Tribuna Chinquihue</option>
                <option value="Puerta 2 - Galería Sur">Puerta 2 - Galería Sur</option>
                <option value="Puerta 3 - Galería Norte (Visita)">Puerta 3 - Galería Norte (Visita)</option>
                <option value="Puerta 4 - Palcos VIP">Puerta 4 - Palcos VIP</option>
              </select>
            </div>

            {/* Alternar Sonido */}
            <button
              onClick={() => setSonidoHabilitado(!sonidoHabilitado)}
              className={`p-2 rounded-lg text-sm transition ${
                sonidoHabilitado ? 'bg-emerald-900/60 text-emerald-300' : 'bg-slate-800 text-gray-400'
              }`}
              title={sonidoHabilitado ? 'Sonido Activado' : 'Sonido Silenciado'}
            >
              {sonidoHabilitado ? <FaVolumeUp /> : <FaVolumeMute />}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* Métricas de Aforo y Entradas en Vivo */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
              <span>Aforo en Estadio</span>
              <FaUsers className="text-sky-400" />
            </div>
            <div className="text-2xl font-black text-sky-300 font-mono">
              {aforoActual.toLocaleString('es-CL')} <span className="text-xs text-gray-500 font-normal">/ 10.000</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
              <span>Validadas Hoy</span>
              <FaCheckCircle className="text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              {totalValidadas.toLocaleString('es-CL')}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
              <span>Rechazadas / Alertas</span>
              <FaTimesCircle className="text-rose-400" />
            </div>
            <div className="text-2xl font-black text-rose-400 font-mono">
              {totalRechazos}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
              <span>Estado Torniquete</span>
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
            </div>
            <div className="text-sm font-bold text-white mt-1">ONLINE • SINCRONIZADO</div>
            <div className="text-[10px] text-gray-400">{puertaActual}</div>
          </div>
        </div>

        {/* ÁREA CENTRAL DEL ESCÁNER Y PANTALLA DE RESULTADO */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Columna Izquierda: Visor del Escáner y Lector Óptico */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-gray-300 flex items-center gap-2">
                  <FaCamera className="text-emerald-400" /> Visor de Escaneo QR
                </h2>
                <span className="text-[11px] bg-slate-800 text-sky-300 px-2 py-0.5 rounded font-mono">
                  Óptica / Pistola Láser
                </span>
              </div>

              {/* Visor simulado de cámara con mira láser animada */}
              <div className="relative aspect-video bg-black rounded-xl overflow-hidden border-2 border-slate-700 flex items-center justify-center group">
                <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/80"></div>
                
                {/* Cuadro de enfoque de escáner */}
                <div className="relative w-48 h-48 border-2 border-emerald-500/60 rounded-xl flex items-center justify-center">
                  <div className="w-full h-0.5 bg-red-500 shadow-[0_0_12px_#ef4444] animate-pulse"></div>
                  <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-emerald-400"></div>
                  <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-emerald-400"></div>
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-emerald-400"></div>
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-emerald-400"></div>
                </div>

                <div className="absolute bottom-3 left-4 right-4 text-center text-xs text-gray-400 bg-black/60 py-1 rounded backdrop-blur">
                  Acerque el código QR del hincha o ingrese el código con pistola USB
                </div>
              </div>

              {/* Entrada de Código Manual o Pistola Barcode */}
              <form onSubmit={handleFormSubmit} className="mt-5 space-y-3">
                <label className="text-xs font-semibold text-gray-300 flex items-center gap-2">
                  <FaKeyboard className="text-sky-400" /> Código de Entrada / Token QR:
                </label>
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={codigoInput}
                    onChange={(e) => setCodigoInput(e.target.value)}
                    placeholder="Ej: DPM-TKT-2026-8942-A8F1"
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-mono text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="bg-verde-dpm hover:bg-green-700 text-white font-bold px-5 py-2.5 rounded-xl transition flex items-center gap-2 text-sm shadow-lg shadow-green-900/30"
                  >
                    <FaQrcode /> Validar
                  </button>
                </div>
              </form>

              {/* Botones de Prueba Rápida (Simuladores de Casos Reales en el Estadio) */}
              <div className="mt-6 pt-5 border-t border-slate-800">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2.5">
                  🧪 Pruebas Rápidas de Simulación (1 Click):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => procesarCodigo('DPM-TKT-DEMO-VALID')}
                    className="bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-200 text-xs py-2 px-3 rounded-lg font-medium transition text-left"
                  >
                    🟢 Entrada Válida
                  </button>
                  <button
                    type="button"
                    onClick={() => procesarCodigo('DPM-SOCIO-2026-0842')}
                    className="bg-gradient-to-r from-emerald-900 to-teal-900 hover:from-emerald-800 hover:to-teal-800 border border-teal-500/60 text-amber-300 text-xs py-2 px-3 rounded-lg font-bold transition text-left"
                  >
                    🎖️ Carnet Socio (Al Día)
                  </button>
                  <button
                    type="button"
                    onClick={() => procesarCodigo('DPM-TKT-DEMO-USADA')}
                    className="bg-amber-950/80 hover:bg-amber-900 border border-amber-700/60 text-amber-200 text-xs py-2 px-3 rounded-lg font-medium transition text-left"
                  >
                    🟡 Entrada Ya Usada
                  </button>
                  <button
                    type="button"
                    onClick={() => procesarCodigo('DPM-SOCIO-MOROSO')}
                    className="bg-purple-950/80 hover:bg-purple-900 border border-purple-700/60 text-purple-200 text-xs py-2 px-3 rounded-lg font-medium transition text-left"
                  >
                    ⚠️ Socio Moroso
                  </button>
                  <button
                    type="button"
                    onClick={() => procesarCodigo('CODIGO-FALSO-999')}
                    className="bg-rose-950/80 hover:bg-rose-900 border border-rose-700/60 text-rose-200 text-xs py-2 px-3 rounded-lg font-medium transition text-left"
                  >
                    🔴 Entrada Falsa
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Columna Derecha: Pantalla de Aprobación/Rechazo de Torniquete */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Visualizador de Decisión de Acceso */}
            <div className={`rounded-2xl p-6 border-2 transition-all duration-300 shadow-2xl min-h-[360px] flex flex-col justify-center ${
              resultadoActual.tipo === 'EXITO'
                ? 'bg-emerald-950/90 border-emerald-500 shadow-emerald-900/40'
                : resultadoActual.tipo === 'DENEGADO'
                ? 'bg-amber-950/90 border-amber-500 shadow-amber-900/40'
                : resultadoActual.tipo === 'ERROR'
                ? 'bg-rose-950/90 border-rose-500 shadow-rose-900/40'
                : 'bg-slate-900 border-slate-800'
            }`}>
              
              {resultadoActual.tipo === 'IDLE' && (
                <div className="text-center py-10 text-gray-400 space-y-3">
                  <FaQrcode size={56} className="mx-auto text-slate-700 animate-pulse" />
                  <h3 className="text-lg font-bold text-gray-300">Torniquete en Espera</h3>
                  <p className="text-xs max-w-sm mx-auto text-gray-500">
                    Escanee un boleto para verificar su autenticidad y permitir el paso a las tribunas.
                  </p>
                </div>
              )}

              {resultadoActual.tipo === 'EXITO' && resultadoActual.detalle && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center gap-3 border-b border-emerald-800 pb-3">
                    <FaCheckCircle className="text-emerald-400 text-4xl" />
                    <div>
                      <span className="text-[11px] font-bold tracking-widest uppercase text-emerald-300">Torniquete Desbloqueado</span>
                      <h3 className="text-xl sm:text-2xl font-black text-white">{resultadoActual.mensaje}</h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs bg-slate-900/80 p-4 rounded-xl border border-emerald-700/50">
                    <div>
                      <span className="text-gray-400 block text-[11px]">
                        {resultadoActual.detalle.tipo === 'SOCIO' ? 'Socio / Titular:' : 'Hincha / Titular:'}
                      </span>
                      <span className="font-bold text-white text-sm">{resultadoActual.detalle.titular}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[11px]">
                        {resultadoActual.detalle.tipo === 'SOCIO' ? 'N° Socio / RUT:' : 'RUT:'}
                      </span>
                      <span className="font-mono font-bold text-white">
                        {resultadoActual.detalle.numeroSocio ? `${resultadoActual.detalle.numeroSocio} • ` : ''}
                        {resultadoActual.detalle.rut}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[11px]">
                        {resultadoActual.detalle.tipo === 'SOCIO' ? 'Categoría & Sector:' : 'Sector Autorizado:'}
                      </span>
                      <span className="font-bold text-emerald-300 uppercase">
                        {resultadoActual.detalle.planSocio ? `${resultadoActual.detalle.planSocio} • ` : ''}
                        {resultadoActual.detalle.sector}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[11px]">Hora de Acceso:</span>
                      <span className="font-mono text-white">{resultadoActual.detalle.horaIngreso}</span>
                    </div>
                  </div>

                  {resultadoActual.detalle.tipo === 'SOCIO' ? (
                    <div className="text-center text-xs text-amber-300 font-bold bg-amber-950/60 border border-amber-600/40 py-2.5 rounded-lg flex items-center justify-center gap-2">
                      <span>🎖️ CUOTA AL DÍA (2026) • Acceso Liberado por Membresía Oficial</span>
                    </div>
                  ) : (
                    <div className="text-center text-xs text-emerald-300 font-semibold bg-emerald-900/40 py-2 rounded-lg">
                      ✓ Boleto marcado como UTILIZADO. Prohibido segundo reingreso.
                    </div>
                  )}
                </div>
              )}

              {resultadoActual.tipo === 'DENEGADO' && resultadoActual.detalle && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center gap-3 border-b border-amber-800 pb-3">
                    <FaExclamationTriangle className="text-amber-400 text-4xl" />
                    <div>
                      <span className="text-[11px] font-bold tracking-widest uppercase text-amber-300">Alerta de Seguridad</span>
                      <h3 className="text-xl sm:text-2xl font-black text-white">{resultadoActual.mensaje}</h3>
                    </div>
                  </div>

                  <div className="bg-slate-900/80 p-4 rounded-xl border border-amber-700/50 text-xs space-y-2">
                    <p className="text-amber-200">
                      Esta entrada ya fue validada con anterioridad para este partido:
                    </p>
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-700">
                      <div>
                        <span className="text-gray-400 block text-[11px]">Titular:</span>
                        <span className="font-bold text-white">{resultadoActual.detalle.titular}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[11px]">Hora 1er Ingreso:</span>
                        <span className="font-mono text-amber-300 font-bold">{resultadoActual.detalle.horaIngreso}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[11px]">Puerta 1er Ingreso:</span>
                        <span className="text-white">{resultadoActual.detalle.puertaIngreso}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[11px]">Sector:</span>
                        <span className="text-white">{resultadoActual.detalle.sector}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-center text-xs text-amber-300 font-semibold bg-amber-900/40 py-2 rounded-lg">
                    ⛔ BLOQUEO DE TORNIQUETE: Retener a portador si no presenta acreditación adicional.
                  </div>
                </div>
              )}

              {resultadoActual.tipo === 'ERROR' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center gap-3 border-b border-rose-800 pb-3">
                    <FaTimesCircle className="text-rose-400 text-4xl" />
                    <div>
                      <span className="text-[11px] font-bold tracking-widest uppercase text-rose-300">Fraude o Código Inválido</span>
                      <h3 className="text-xl sm:text-2xl font-black text-white">{resultadoActual.mensaje}</h3>
                    </div>
                  </div>
                  <div className="bg-slate-900/80 p-4 rounded-xl border border-rose-700/50 text-xs text-gray-300">
                    El código escaneado no coincide con ningún token criptográfico emitido por el Club de Deportes Puerto Montt para la fecha.
                  </div>
                  <div className="text-center text-xs text-rose-300 font-semibold bg-rose-900/40 py-2 rounded-lg">
                    ⛔ ACCESO DENEGADO
                  </div>
                </div>
              )}

            </div>

            {/* Bitácora / Historial en Vivo de Accesos */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                  <FaHistory className="text-sky-400" /> Bitácora de Accesos Recientes
                </h3>
                <span className="text-[10px] text-gray-500">Últimos movimientos</span>
              </div>

              <div className="divide-y divide-slate-800 max-h-48 overflow-y-auto pr-1">
                {historial.map((item) => (
                  <div key={item.id} className="py-2 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${
                        item.resultado === 'PERMITIDO' ? 'bg-emerald-400' : 'bg-rose-500'
                      }`}></span>
                      <div>
                        <span className="font-bold text-white">{item.titular}</span>
                        <span className="text-gray-500 block text-[10px]">{item.codigo} • {item.sector}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`font-bold font-mono text-[11px] ${
                        item.resultado === 'PERMITIDO' ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {item.resultado}
                      </span>
                      <span className="text-gray-500 block text-[10px] font-mono">{item.hora}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
