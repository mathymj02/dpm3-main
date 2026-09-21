import React, { useState } from 'react';
import { FaCheckCircle, FaDownload, FaEnvelope, FaQrcode, FaTimes, FaShieldAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketData: {
    codigo: string;
    partido: string;
    estadio: string;
    fecha: string;
    hora: string;
    sector: string;
    puerta: string;
    asiento: string;
    titular: string;
    rut: string;
    email: string;
    precio: number;
  };
}

export const TicketModal: React.FC<TicketModalProps> = ({ isOpen, onClose, ticketData }) => {
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    ticketData.codigo
  )}&bgcolor=ffffff&color=0b2545&margin=2`;

  const handlePrint = () => {
    window.print();
  };

  const handleGoToValidator = () => {
    // Guardar el código en localStorage para que el validador pueda probarlo fácilmente
    localStorage.setItem('dpm_ultimo_ticket', JSON.stringify(ticketData));
    navigate(`/validador?codigo=${encodeURIComponent(ticketData.codigo)}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full text-white shadow-2xl overflow-hidden animate-fadeIn">
        
        {/* Encabezado con estado de compra */}
        <div className="bg-gradient-to-r from-verde-dpm to-emerald-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaCheckCircle className="text-white text-2xl" />
            <div>
              <h3 className="font-bold text-lg text-white">¡Compra Confirmada con Éxito!</h3>
              <p className="text-xs text-green-100">Tu entrada digital ha sido generada y enviada</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-200 p-1 rounded-lg transition"
            aria-label="Cerrar modal"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Notificación de envío de correo */}
        <div className="bg-emerald-950/60 border-b border-emerald-800/50 px-6 py-3 flex items-center justify-between text-xs text-emerald-300">
          <div className="flex items-center gap-2">
            <FaEnvelope className="text-emerald-400" />
            <span>Enviada automáticamente a: <strong className="text-white">{ticketData.email}</strong></span>
          </div>
          <button 
            onClick={() => setShowEmailPreview(!showEmailPreview)}
            className="underline text-emerald-400 hover:text-emerald-200 font-semibold"
          >
            {showEmailPreview ? 'Ocultar Correo' : 'Ver Correo Simulado'}
          </button>
        </div>

        {/* Simulación del Correo Electrónico Recibido */}
        {showEmailPreview && (
          <div className="bg-slate-800 p-4 border-b border-slate-700 text-xs text-gray-200">
            <div className="bg-white text-gray-800 rounded-lg p-4 shadow">
              <div className="border-b pb-2 mb-3">
                <div className="text-xs text-gray-500">De: <strong>entradas@dpm.cl</strong> (Club Deportes Puerto Montt)</div>
                <div className="text-xs text-gray-500">Para: <strong>{ticketData.email}</strong></div>
                <div className="font-bold text-sm text-azul-dpm mt-1">🎟️ Tu entrada para Deportes Puerto Montt vs Temuco está lista</div>
              </div>
              <p className="mb-2">¡Hola <strong>{ticketData.titular}</strong>!</p>
              <p className="text-gray-600 mb-3">
                Adjuntamos tu E-Ticket oficial para el partido en el Estadio Bicentenario Chinquihue. 
                Preséntalo directamente en la pantalla de tu celular o impreso en la puerta de acceso.
              </p>
              <div className="bg-gray-100 p-2 rounded text-center font-mono text-xs border border-gray-300">
                Código de Entrada: <strong className="text-azul-dpm">{ticketData.codigo}</strong>
              </div>
            </div>
          </div>
        )}

        {/* DISEÑO DEL E-TICKET FÍSICO / DIGITAL DE PUERTO MONTT */}
        <div className="p-6">
          <div className="bg-gradient-to-br from-slate-800 via-slate-850 to-blue-950 rounded-xl border border-sky-500/30 shadow-xl overflow-hidden relative">
            
            {/* Marca de agua de fondo */}
            <div className="absolute right-0 top-0 bottom-0 opacity-5 pointer-events-none flex items-center justify-center pr-4">
              <img src="/images/logo-deportes-puertomontt.png" alt="DPM" className="w-80" />
            </div>

            {/* Cabecera del Boleto */}
            <div className="bg-azul-dpm/90 border-b border-sky-500/20 px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img 
                  src="/images/logo-deportes-puertomontt.png" 
                  alt="DPM Escudo" 
                  className="h-9 w-9 object-contain filter drop-shadow" 
                />
                <div>
                  <h4 className="font-black text-sm tracking-wider uppercase text-white">Deportes Puerto Montt</h4>
                  <span className="text-[10px] text-sky-200 font-semibold tracking-widest uppercase">E-TICKET OFICIAL • CHILE</span>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono font-bold">
                  <FaShieldAlt size={10} /> QR VERIFICADO
                </span>
              </div>
            </div>

            {/* Cuerpo del Boleto */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Info Partido y Hincha */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <div className="text-xs text-sky-400 font-bold uppercase tracking-wide">Partido</div>
                  <div className="text-xl font-extrabold text-white">{ticketData.partido}</div>
                  <div className="text-xs text-gray-300">{ticketData.estadio}</div>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-slate-900/60 p-3 rounded-lg border border-slate-700/50">
                  <div>
                    <span className="text-[11px] text-gray-400 block">Fecha y Hora</span>
                    <span className="text-xs font-bold text-white">{ticketData.fecha} - {ticketData.hora}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 block">Sector / Tribuna</span>
                    <span className="text-xs font-bold text-verde-dpm uppercase">{ticketData.sector}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 block">Acceso / Puerta</span>
                    <span className="text-xs font-bold text-sky-300">{ticketData.puerta}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 block">Asiento</span>
                    <span className="text-xs font-bold text-white">{ticketData.asiento}</span>
                  </div>
                </div>

                <div className="border-t border-slate-700/50 pt-2 text-xs">
                  <div className="flex justify-between text-gray-300">
                    <span>Titular: <strong>{ticketData.titular}</strong></span>
                    <span>RUT: <strong>{ticketData.rut}</strong></span>
                  </div>
                </div>
              </div>

              {/* Columna QR con Stub desprendible */}
              <div className="flex flex-col items-center justify-center md:border-l md:border-dashed md:border-slate-600 md:pl-6">
                <div className="bg-white p-2.5 rounded-xl shadow-lg border-2 border-sky-400/40">
                  <img 
                    src={qrUrl} 
                    alt={`QR Entrada ${ticketData.codigo}`}
                    className="w-36 h-36 object-contain"
                  />
                </div>
                <span className="font-mono text-[11px] text-sky-300 font-bold mt-2 tracking-widest text-center">
                  {ticketData.codigo}
                </span>
                <span className="text-[9px] text-gray-400 uppercase tracking-wider text-center mt-1">
                  Escanear en Torniquete
                </span>
              </div>

            </div>

            {/* Aviso de Seguridad */}
            <div className="bg-slate-950/80 px-6 py-2 text-[10px] text-gray-400 flex items-center justify-between border-t border-slate-800">
              <span>⚠️ Entrada intransferible. Válida para un (1) solo ingreso al estadio.</span>
              <span className="font-mono text-emerald-400">STATUS: ACTIVA</span>
            </div>

          </div>
        </div>

        {/* Botones de Acción */}
        <div className="bg-slate-850 px-6 py-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold py-2.5 px-4 rounded-lg transition"
          >
            <FaDownload /> Descargar / Imprimir Entrada
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleGoToValidator}
              className="flex items-center gap-2 bg-gradient-to-r from-azul-dpm to-sky-600 hover:from-blue-700 hover:to-sky-500 text-white text-xs font-bold py-2.5 px-4 rounded-lg shadow-md transition"
            >
              <FaQrcode /> Probar en Validador de Acceso
            </button>
            <button
              onClick={onClose}
              className="bg-verde-dpm hover:bg-green-700 text-white text-xs font-bold py-2.5 px-5 rounded-lg transition"
            >
              Cerrar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
