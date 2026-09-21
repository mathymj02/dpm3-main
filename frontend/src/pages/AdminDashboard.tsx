/**
 * ============================================================================
 * Archivo: AdminDashboard.tsx
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Es el Centro de Control y Gestión Oficial exclusivo para directivos y 
 * administradores de Deportes Puerto Montt.
 * 
 * CAPACIDADES EXCLUSIVAS DEL ADMINISTRADOR:
 * 1. Tabla de Posiciones: Registrar resultados de partidos fecha a fecha, 
 *    recalcular puntos y editar estadísticas que se reflejan de inmediato en la web.
 * 2. Novedades: Publicar noticias oficiales, comunicados del club y fotos reales.
 * 3. Tienda y Stock: Gestionar inventario de camisetas, entradas y accesorios.
 * 4. Plantel: Gestionar nómina de futbolistas y estadísticas.
 * 5. Control de Accesos: Supervisar torniquetes y validación de entradas QR en Chinquihue.
 * ============================================================================
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { toastSuccess, toastInfo } from '../components/ui/Toast';
import { 
  FaTrophy, 
  FaNewspaper, 
  FaStore, 
  FaUserFriends, 
  FaQrcode, 
  FaFutbol, 
  FaPlus, 
  FaTrash, 
  FaSave, 
  FaUndo,
  FaCheckCircle,
  FaExternalLinkAlt
} from 'react-icons/fa';
import { Posicion, Novedad, Producto, Jugador } from '../types';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'posiciones' | 'novedades' | 'productos' | 'jugadores'>('posiciones');

  // =========================================================================
  // 1. ESTADO DE TABLA DE POSICIONES
  // =========================================================================
  const defaultPosiciones: Posicion[] = [
    { equipo: 'Deportes Puerto Montt', escudoUrl: '/images/logo-deportes-puertomontt.png', pj: 12, pg: 7, pe: 3, pp: 2, gf: 22, gc: 12, dg: 10, pts: 24 },
    { equipo: 'San Marcos de Arica', escudoUrl: '/images/escudo-sanmarcos.jpg', pj: 12, pg: 6, pe: 3, pp: 3, gf: 18, gc: 13, dg: 5, pts: 21 },
    { equipo: 'Deportes Valdivia', escudoUrl: '/images/escudo-valdivia.png', pj: 12, pg: 5, pe: 4, pp: 3, gf: 20, gc: 16, dg: 4, pts: 19 },
    { equipo: 'Deportes Melipilla', escudoUrl: '/images/escudo-sanmarcos.jpg', pj: 12, pg: 5, pe: 2, pp: 5, gf: 17, gc: 16, dg: 1, pts: 17 },
    { equipo: 'Provincial Osorno', escudoUrl: '/images/escudo-osorno.jpg', pj: 12, pg: 4, pe: 4, pp: 4, gf: 15, gc: 14, dg: 1, pts: 16 },
    { equipo: 'Deportes Concepción', escudoUrl: '/images/escudo-concepcion.png', pj: 12, pg: 4, pe: 3, pp: 5, gf: 14, gc: 16, dg: -2, pts: 15 },
    { equipo: 'Deportes Temuco', escudoUrl: '/images/escudo-temuco.png', pj: 12, pg: 4, pe: 2, pp: 6, gf: 13, gc: 17, dg: -4, pts: 14 },
    { equipo: 'Magallanes', escudoUrl: '/images/escudo-magallanes.png', pj: 12, pg: 3, pe: 3, pp: 6, gf: 12, gc: 17, dg: -5, pts: 12 },
    { equipo: 'Rangers de Talca', escudoUrl: '/images/escudo-rangers.png', pj: 12, pg: 3, pe: 1, pp: 8, gf: 10, gc: 21, dg: -11, pts: 10 },
    { equipo: 'Iberia Los Ángeles', escudoUrl: '/images/club-atletico-iberia.png', pj: 12, pg: 2, pe: 2, pp: 8, gf: 9, gc: 21, dg: -12, pts: 8 },
  ];

  const [posiciones, setPosiciones] = useState<Posicion[]>(() => {
    const saved = localStorage.getItem('dpm_posiciones_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultPosiciones;
      }
    }
    return defaultPosiciones;
  });

  // Campos para el Registro Oficial de Resultados
  const [equipoLocalIdx, setEquipoLocalIdx] = useState(0);
  const [equipoVisitaIdx, setEquipoVisitaIdx] = useState(6); // Deportes Temuco por defecto
  const [golesLocal, setGolesLocal] = useState(2);
  const [golesVisita, setGolesVisita] = useState(0);

  // =========================================================================
  // 2. ESTADO DE NOVEDADES
  // =========================================================================
  const defaultNovedades: Novedad[] = [
    { id: '1', titulo: 'Deportes Puerto Montt denuncia robo de balones desde Estadio Chinquihue', contenido: '¡35 balones profesionales de fútbol, propiedad del plantel de Deportes Puerto Montt, fueron sustraídos desde el Estadio Bicentenario de Chinquihue! El club ya presentó las denuncias pertinentes ante Carabineros de Chile.', imagenUrl: '/images/robo-balon.jpg', fechaPublicacion: '06-06-2025', autorNombre: 'Comunicaciones DPM' },
    { id: '2', titulo: 'Inauguración de Sala de Acondicionamiento Físico en el Chinquihue', contenido: 'Este lunes, Deportes Puerto Montt llevó a cabo la inauguración de una moderna sala de musculación en el Estadio Regional de Chinquihue, equipada con tecnología de punta para la preparación de los futbolistas albiverdes.', imagenUrl: '/images/novedades1.jpg', fechaPublicacion: '11-03-2025', autorNombre: 'Comunicaciones DPM' },
    { id: '3', titulo: 'Partimos con un triunfo la temporada: 4 a cero a Brujas de Salamanca', contenido: 'Con un contundente triunfo debutó Deportes Puerto Montt en el campeonato de la Segunda División Profesional del fútbol chileno, goleando en condición de local y desatando la fiesta en las tribunas del Chinquihue.', imagenUrl: '/images/novedad3.jpeg', fechaPublicacion: '03-07-2025', autorNombre: 'Comunicaciones DPM' },
  ];

  const [novedades, setNovedades] = useState<Novedad[]>(() => {
    const saved = localStorage.getItem('dpm_novedades_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultNovedades;
      }
    }
    return defaultNovedades;
  });

  // Formulario de nueva noticia
  const [showFormNoticia, setShowFormNoticia] = useState(false);
  const [nuevoTitulo, setNuevoTitulo] = useState('');
  const [nuevoContenido, setNuevoContenido] = useState('');
  const [nuevaImagen, setNuevaImagen] = useState('/images/puerto-montt-gol.jpeg');
  const [nuevoAutor] = useState('Comunicaciones DPM');

  // =========================================================================
  // 3. ESTADO DE PRODUCTOS Y STOCK
  // =========================================================================
  const [productos] = useState<Producto[]>([
    { id: '1', nombre: 'Polera Oficial DPM 2026', precio: 15000, imagenUrl: '/images/polera.jpg', stock: 100, categoria: 'Indumentaria' },
    { id: '2', nombre: 'Short Oficial DPM 2026', precio: 10000, imagenUrl: '/images/short.webp', stock: 80, categoria: 'Indumentaria' },
    { id: '3', nombre: 'Calcetas Oficiales', precio: 5000, imagenUrl: '/images/calcetas.webp', stock: 150, categoria: 'Indumentaria' },
    { id: '4', nombre: 'Gorro DPM Oficial', precio: 8000, imagenUrl: '/images/yoki.jpg', stock: 50, categoria: 'Accesorios' },
    { id: '5', nombre: 'Entrada Estadio Chinquihue (vs Temuco)', precio: 7000, imagenUrl: '/images/entrada.png', stock: 500, categoria: 'Tickets' },
  ]);

  // =========================================================================
  // 4. ESTADO DE JUGADORES
  // =========================================================================
  const [jugadores] = useState<Jugador[]>([
    { id: '1', nombre: 'Kevin Catalán', nacionalidad: 'Chile', edad: 27, posicion: 'PORTERO', fotoUrl: '/images/jugador-5.png', descripcion: '🧱 Muro en el arco con reflejos felinos y seguridad aérea.' },
    { id: '2', nombre: 'Carlos Rodríguez', nacionalidad: 'Chile', edad: 32, posicion: 'CENTROCAMPISTA', fotoUrl: '/images/jugador-rodriguez.jpg', descripcion: '🧠 Capitán y líder táctico en la distribución.' },
    { id: '3', nombre: 'Maximiliano Riveros', nacionalidad: 'Chile', edad: 29, posicion: 'DEFENSA', fotoUrl: '/images/jugador-riveros.jpg', descripcion: '🦁 Fuerza, quite limpio y juego aéreo en ambas áreas.' },
    { id: '4', nombre: 'Kevin Flores', nacionalidad: 'Chile', edad: 30, posicion: 'CENTROCAMPISTA', fotoUrl: '/images/jugador-flores.jpg', descripcion: '⚡ Dinamismo, recuperación y salida rápida.' },
    { id: '5', nombre: 'Yakob Yousef', nacionalidad: 'Chile', edad: 26, posicion: 'DELANTERO', fotoUrl: '/images/jugador-yousef.jpg', descripcion: '🎯 Definición implacable y olfato de gol.' },
  ]);

  // Guardar Posiciones en LocalStorage
  const guardarPosiciones = (nuevas: Posicion[]) => {
    setPosiciones(nuevas);
    localStorage.setItem('dpm_posiciones_data', JSON.stringify(nuevas));
  };

  // Registrar resultado de partido oficial
  const handleRegistrarPartido = () => {
    if (equipoLocalIdx === equipoVisitaIdx) {
      toastInfo('El equipo local y visita deben ser diferentes.');
      return;
    }

    const local = posiciones[equipoLocalIdx];
    const visita = posiciones[equipoVisitaIdx];

    const actualizadas = posiciones.map((pos) => {
      if (pos.equipo === local.equipo) {
        const gano = golesLocal > golesVisita;
        const empato = golesLocal === golesVisita;
        const ptsGanados = gano ? 3 : empato ? 1 : 0;
        return {
          ...pos,
          pj: pos.pj + 1,
          pg: pos.pg + (gano ? 1 : 0),
          pe: pos.pe + (empato ? 1 : 0),
          pp: pos.pp + (!gano && !empato ? 1 : 0),
          gf: pos.gf + golesLocal,
          gc: pos.gc + golesVisita,
          dg: (pos.gf + golesLocal) - (pos.gc + golesVisita),
          pts: pos.pts + ptsGanados
        };
      }

      if (pos.equipo === visita.equipo) {
        const gano = golesVisita > golesLocal;
        const empato = golesLocal === golesVisita;
        const ptsGanados = gano ? 3 : empato ? 1 : 0;
        return {
          ...pos,
          pj: pos.pj + 1,
          pg: pos.pg + (gano ? 1 : 0),
          pe: pos.pe + (empato ? 1 : 0),
          pp: pos.pp + (!gano && !empato ? 1 : 0),
          gf: pos.gf + golesVisita,
          gc: pos.gc + golesLocal,
          dg: (pos.gf + golesVisita) - (pos.gc + golesLocal),
          pts: pos.pts + ptsGanados
        };
      }

      return pos;
    });

    // Reordenar por Puntos y Diferencia de Gol
    actualizadas.sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      return b.dg - a.dg;
    });

    guardarPosiciones(actualizadas);
    toastSuccess(`¡Resultado guardado! ${local.equipo} ${golesLocal} - ${golesVisita} ${visita.equipo}. Tabla oficial actualizada.`);
  };

  // Restablecer tabla oficial
  const handleResetTabla = () => {
    guardarPosiciones(defaultPosiciones);
    toastSuccess('Tabla de posiciones restablecida a los valores oficiales.');
  };

  // Agregar nueva noticia
  const handleCrearNoticia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoTitulo.trim() || !nuevoContenido.trim()) {
      toastInfo('Completa el título y contenido de la noticia.');
      return;
    }

    const nuevaNoticia: Novedad = {
      id: `nov-${Date.now()}`,
      titulo: nuevoTitulo,
      contenido: nuevoContenido,
      imagenUrl: nuevaImagen || '/images/puerto-montt-gol.jpeg',
      fechaPublicacion: new Date().toLocaleDateString('es-CL'),
      autorNombre: nuevoAutor || 'Comunicaciones DPM'
    };

    const actualizadas = [nuevaNoticia, ...novedades];
    setNovedades(actualizadas);
    localStorage.setItem('dpm_novedades_data', JSON.stringify(actualizadas));
    
    setNuevoTitulo('');
    setNuevoContenido('');
    setShowFormNoticia(false);
    toastSuccess('¡Noticia publicada oficialmente en el sitio web!');
  };

  // Eliminar noticia
  const handleEliminarNoticia = (id: string) => {
    const actualizadas = novedades.filter(n => n.id !== id);
    setNovedades(actualizadas);
    localStorage.setItem('dpm_novedades_data', JSON.stringify(actualizadas));
    toastSuccess('Noticia eliminada del portal.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Cabecera del Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-verde-dpm">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Rol: Administrador Oficial Club Deportes Puerto Montt
          </div>
          <h1 className="text-3xl font-black text-azul-dpm mt-1">Panel de Control y Administración</h1>
          <p className="text-sm text-gray-500">
            Gestiona resultados de partidos, noticias oficiales, stock y el validador de entradas para el Chinquihue.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/validador"
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow transition"
          >
            <FaQrcode /> Torniquetes Estadio <FaExternalLinkAlt size={10} />
          </Link>
          <Link
            to="/posiciones"
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs font-bold py-2.5 px-4 rounded-xl transition"
          >
            <FaTrophy /> Ver Tabla Pública
          </Link>
        </div>
      </div>

      {/* Tarjetas Resumen de Gestión */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-5 bg-white border-l-4 border-verde-dpm shadow-sm">
          <span className="text-xs font-bold text-gray-500 uppercase">Posición DPM</span>
          <p className="text-2xl font-black text-emerald-700 mt-1">
            {posiciones.findIndex(p => p.equipo.toLowerCase().includes('puerto montt')) + 1}° Lugar
          </p>
          <span className="text-[11px] text-gray-400">
            {posiciones.find(p => p.equipo.toLowerCase().includes('puerto montt'))?.pts || 24} Puntos oficiales
          </span>
        </Card>

        <Card className="p-5 bg-white border-l-4 border-azul-dpm shadow-sm">
          <span className="text-xs font-bold text-gray-500 uppercase">Noticias Publicadas</span>
          <p className="text-2xl font-black text-azul-dpm mt-1">{novedades.length}</p>
          <span className="text-[11px] text-gray-400">Visibles para todos los hinchas</span>
        </Card>

        <Card className="p-5 bg-white border-l-4 border-amber-500 shadow-sm">
          <span className="text-xs font-bold text-gray-500 uppercase">Productos en Catálogo</span>
          <p className="text-2xl font-black text-gray-900 mt-1">{productos.length}</p>
          <span className="text-[11px] text-gray-400">Entradas y merchandising</span>
        </Card>

        <Link to="/validador" className="group">
          <Card className="p-5 bg-slate-900 text-white border-l-4 border-emerald-400 shadow-sm hover:border-sky-400 transition cursor-pointer">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase">Control Torniquete</span>
              <FaQrcode className="text-emerald-400 group-hover:scale-110 transition" />
            </div>
            <p className="text-2xl font-black text-emerald-300 mt-1 font-mono">EN VIVO</p>
            <span className="text-[11px] text-slate-400">Lector de entradas QR →</span>
          </Card>
        </Link>
      </div>

      {/* Navegación por Pestañas */}
      <div className="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 bg-slate-50 px-6">
          <nav className="flex gap-6 overflow-x-auto" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('posiciones')}
              className={`py-4 border-b-2 font-bold text-sm flex items-center gap-2 whitespace-nowrap transition ${
                activeTab === 'posiciones'
                  ? 'border-verde-dpm text-verde-dpm'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <FaTrophy /> Tabla de Posiciones & Resultados
            </button>

            <button
              onClick={() => setActiveTab('novedades')}
              className={`py-4 border-b-2 font-bold text-sm flex items-center gap-2 whitespace-nowrap transition ${
                activeTab === 'novedades'
                  ? 'border-verde-dpm text-verde-dpm'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <FaNewspaper /> Novedades y Prensa del Club
            </button>

            <button
              onClick={() => setActiveTab('productos')}
              className={`py-4 border-b-2 font-bold text-sm flex items-center gap-2 whitespace-nowrap transition ${
                activeTab === 'productos'
                  ? 'border-verde-dpm text-verde-dpm'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <FaStore /> Tienda & Stock Entradas
            </button>

            <button
              onClick={() => setActiveTab('jugadores')}
              className={`py-4 border-b-2 font-bold text-sm flex items-center gap-2 whitespace-nowrap transition ${
                activeTab === 'jugadores'
                  ? 'border-verde-dpm text-verde-dpm'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <FaUserFriends /> Plantel Profesional
            </button>
          </nav>
        </div>

        {/* ================================================================= */}
        {/* PESTAÑA 1: TABLA DE POSICIONES Y RESULTADOS                       */}
        {/* ================================================================= */}
        {activeTab === 'posiciones' && (
          <div className="p-6 space-y-6">
            {/* Panel de Registro Oficial de Fecha */}
            <div className="bg-gradient-to-br from-slate-900 to-azul-dpm text-white rounded-xl p-6 shadow-md border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FaFutbol className="text-amber-400 text-lg" />
                  <h3 className="font-bold text-base text-white">
                    Registrar Resultado Oficial de Fecha (Actualización Automática de Tabla)
                  </h3>
                </div>
                <span className="text-[11px] bg-slate-800 text-sky-300 px-3 py-1 rounded-full font-mono">
                  ANFP 2025
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                {/* Equipo Local */}
                <div className="md:col-span-2">
                  <label className="block text-xs text-gray-300 font-semibold mb-1">Equipo Local</label>
                  <select
                    value={equipoLocalIdx}
                    onChange={(e) => setEquipoLocalIdx(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white font-medium focus:ring-1 focus:ring-emerald-500 outline-none"
                  >
                    {posiciones.map((p, idx) => (
                      <option key={p.equipo} value={idx}>{p.equipo}</option>
                    ))}
                  </select>
                </div>

                {/* Marcador */}
                <div className="flex items-center justify-center gap-2 md:col-span-1">
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={golesLocal}
                    onChange={(e) => setGolesLocal(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-12 h-11 text-center text-xl font-black bg-slate-800 border border-emerald-500 rounded-lg text-white"
                  />
                  <span className="font-bold text-gray-400 text-lg">-</span>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={golesVisita}
                    onChange={(e) => setGolesVisita(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-12 h-11 text-center text-xl font-black bg-slate-800 border border-sky-500 rounded-lg text-white"
                  />
                </div>

                {/* Equipo Visita */}
                <div className="md:col-span-2">
                  <label className="block text-xs text-gray-300 font-semibold mb-1">Equipo Visita</label>
                  <select
                    value={equipoVisitaIdx}
                    onChange={(e) => setEquipoVisitaIdx(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white font-medium focus:ring-1 focus:ring-emerald-500 outline-none"
                  >
                    {posiciones.map((p, idx) => (
                      <option key={p.equipo} value={idx}>{p.equipo}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
                <p className="text-xs text-gray-400">
                  💡 Al guardar, se sumará +1 partido jugado a ambos equipos, se distribuirán los 3 puntos (o 1 por empate) y se actualizará la diferencia de goles en todo el sitio.
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleResetTabla}
                    className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-gray-300 text-xs font-semibold py-2 px-3 rounded-lg transition"
                  >
                    <FaUndo size={11} /> Restablecer
                  </button>
                  <button
                    type="button"
                    onClick={handleRegistrarPartido}
                    className="flex items-center gap-2 bg-verde-dpm hover:bg-green-700 text-white text-xs font-bold py-2 px-5 rounded-lg shadow transition"
                  >
                    <FaCheckCircle /> Guardar Resultado Oficial
                  </button>
                </div>
              </div>
            </div>

            {/* Vista Previa de la Tabla Modificable */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700 uppercase">Tabla Actual Guardada en el Sistema:</span>
                <span className="text-xs text-emerald-700 font-semibold">✓ Sincronizada con la vista pública</span>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
                    <tr>
                      <th className="py-2.5 px-3 text-center">Pos</th>
                      <th className="py-2.5 px-4 text-left">Club</th>
                      <th className="py-2.5 px-2 text-center">PJ</th>
                      <th className="py-2.5 px-2 text-center">PG</th>
                      <th className="py-2.5 px-2 text-center">PE</th>
                      <th className="py-2.5 px-2 text-center">PP</th>
                      <th className="py-2.5 px-2 text-center">GF</th>
                      <th className="py-2.5 px-2 text-center">GC</th>
                      <th className="py-2.5 px-2 text-center">DG</th>
                      <th className="py-2.5 px-3 text-center font-black text-azul-dpm">PTS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {posiciones.map((p, idx) => (
                      <tr key={p.equipo} className={p.equipo.includes('Puerto Montt') ? 'bg-emerald-50 font-bold' : ''}>
                        <td className="py-2.5 px-3 text-center text-xs font-bold">{idx + 1}</td>
                        <td className="py-2.5 px-4 flex items-center gap-2 font-medium">
                          <img src={p.escudoUrl} alt={p.equipo} className="w-5 h-5 object-contain" />
                          {p.equipo}
                        </td>
                        <td className="py-2.5 px-2 text-center text-gray-600">{p.pj}</td>
                        <td className="py-2.5 px-2 text-center text-gray-600">{p.pg}</td>
                        <td className="py-2.5 px-2 text-center text-gray-600">{p.pe}</td>
                        <td className="py-2.5 px-2 text-center text-gray-600">{p.pp}</td>
                        <td className="py-2.5 px-2 text-center text-gray-500">{p.gf}</td>
                        <td className="py-2.5 px-2 text-center text-gray-500">{p.gc}</td>
                        <td className="py-2.5 px-2 text-center font-bold text-gray-700">{p.dg}</td>
                        <td className="py-2.5 px-3 text-center font-black text-verde-dpm">{p.pts}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* PESTAÑA 2: NOVEDADES Y PRENSA                                     */}
        {/* ================================================================= */}
        {activeTab === 'novedades' && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Comunicados y Noticias Oficiales</h3>
                <p className="text-xs text-gray-500">Publica notas de prensa y novedades para la hinchada</p>
              </div>
              <button
                onClick={() => setShowFormNoticia(!showFormNoticia)}
                className="bg-verde-dpm hover:bg-green-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 transition"
              >
                <FaPlus /> {showFormNoticia ? 'Cerrar Formulario' : 'Nueva Noticia'}
              </button>
            </div>

            {/* Formulario de Nueva Noticia */}
            {showFormNoticia && (
              <form onSubmit={handleCrearNoticia} className="bg-slate-50 border border-gray-200 rounded-xl p-5 space-y-4 animate-fadeIn">
                <h4 className="text-sm font-bold text-azul-dpm border-b pb-2">Redactar Noticia Oficial</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Titular de la Noticia</label>
                    <input
                      type="text"
                      value={nuevoTitulo}
                      onChange={(e) => setNuevoTitulo(e.target.value)}
                      placeholder="Ej: Triunfazo del Velero ante Deportes Temuco"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-verde-dpm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">URL de la Foto</label>
                    <select
                      value={nuevaImagen}
                      onChange={(e) => setNuevaImagen(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                    >
                      <option value="/images/puerto-montt-gol.jpeg">Celebración de Gol DPM</option>
                      <option value="/images/equipo-dpm.png">Plantel Oficial DPM</option>
                      <option value="/images/EstadioChinquihue.png">Estadio Chinquihue</option>
                      <option value="/images/novedades1.jpg">Sala Acondicionamiento</option>
                      <option value="/images/novedad3.jpeg">Victoria en Chinquihue</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Cuerpo / Contenido de la Noticia</label>
                  <textarea
                    rows={3}
                    value={nuevoContenido}
                    onChange={(e) => setNuevoContenido(e.target.value)}
                    placeholder="Escribe el reporte completo del partido o comunicado..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-verde-dpm"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowFormNoticia(false)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-semibold py-2 px-4 rounded-lg transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-verde-dpm hover:bg-green-700 text-white text-xs font-bold py-2 px-5 rounded-lg transition flex items-center gap-1.5"
                  >
                    <FaSave /> Publicar en el Sitio Web
                  </button>
                </div>
              </form>
            )}

            {/* Listado de Novedades */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {novedades.map((nov) => (
                <div key={nov.id} className="border border-gray-200 rounded-xl p-4 flex gap-4 bg-white hover:shadow-sm transition">
                  <img 
                    src={nov.imagenUrl} 
                    alt={nov.titulo} 
                    className="w-24 h-24 object-cover rounded-lg bg-gray-100 flex-shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 font-semibold">{nov.fechaPublicacion} • {nov.autorNombre}</span>
                      <h4 className="text-sm font-bold text-gray-900 line-clamp-2 mt-0.5">{nov.titulo}</h4>
                    </div>
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => handleEliminarNoticia(nov.id)}
                        className="text-rose-600 hover:text-rose-800 text-xs font-semibold flex items-center gap-1"
                      >
                        <FaTrash size={11} /> Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* PESTAÑA 3: TIENDA & STOCK                                         */}
        {/* ================================================================= */}
        {activeTab === 'productos' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Catálogo de Productos y Entradas</h3>
                <p className="text-xs text-gray-500">Administra precios e inventario disponible para la venta online</p>
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <tr>
                    <th className="py-3 px-4 text-left">Producto</th>
                    <th className="py-3 px-3 text-left">Categoría</th>
                    <th className="py-3 px-3 text-center">Precio CLP</th>
                    <th className="py-3 px-3 text-center">Stock</th>
                    <th className="py-3 px-4 text-right">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {productos.map((prod) => (
                    <tr key={prod.id}>
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img src={prod.imagenUrl} alt={prod.nombre} className="w-10 h-10 object-contain rounded bg-gray-50 border p-1" />
                        <span className="font-bold text-gray-900">{prod.nombre}</span>
                      </td>
                      <td className="py-3 px-3 text-xs text-gray-500">{prod.categoria}</td>
                      <td className="py-3 px-3 text-center font-bold text-azul-dpm">
                        ${prod.precio.toLocaleString('es-CL')}
                      </td>
                      <td className="py-3 px-3 text-center font-mono">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          prod.stock > 20 ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {prod.stock} un.
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-emerald-600 font-bold text-xs">ACTIVO</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* PESTAÑA 4: PLANTEL PROFESIONAL                                    */}
        {/* ================================================================= */}
        {activeTab === 'jugadores' && (
          <div className="p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Plantel Oficial Deportes Puerto Montt</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {jugadores.map((j) => (
                <div key={j.id} className="border rounded-xl p-3 flex items-center gap-3 bg-white">
                  <img src={j.fotoUrl} alt={j.nombre} className="w-14 h-14 object-cover rounded-full border-2 border-verde-dpm" />
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">{j.nombre}</h4>
                    <span className="text-xs text-verde-dpm font-semibold">{j.posicion} • {j.edad} años</span>
                    <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">{j.descripcion}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
