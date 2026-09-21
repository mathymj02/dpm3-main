import React from 'react';
import { FaCheckCircle, FaDownload, FaTruck, FaTimes, FaBoxOpen } from 'react-icons/fa';

interface BoletaDespachoModalProps {
  isOpen: boolean;
  onClose: () => void;
  ordenData: {
    numeroOrden: string;
    fecha: string;
    cliente: string;
    email: string;
    items: Array<{
      nombre: string;
      cantidad: number;
      precio: number;
      subtotal: number;
    }>;
    total: number;
    direccionEnvio: string;
    numeroSeguimiento: string;
    metodoEntrega: string;
  };
}

export const BoletaDespachoModal: React.FC<BoletaDespachoModalProps> = ({ isOpen, onClose, ordenData }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full text-white shadow-2xl overflow-hidden animate-fadeIn">
        
        {/* Encabezado */}
        <div className="bg-gradient-to-r from-azul-dpm to-slate-900 border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <FaCheckCircle className="text-2xl" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">¡Orden de Compra Confirmada!</h3>
              <p className="text-xs text-gray-300">Boleta Electrónica & Despacho de Productos DPM</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg transition"
            aria-label="Cerrar"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Cuerpo de la Boleta */}
        <div className="p-6 space-y-6">
          
          {/* Tarjeta de Orden */}
          <div className="bg-slate-800/80 border border-white/10 rounded-xl p-4 flex flex-wrap justify-between items-center gap-4">
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-semibold">Número de Orden</span>
              <p className="text-base font-mono font-bold text-amarillo-dpm">{ordenData.numeroOrden}</p>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-semibold">Fecha de Compra</span>
              <p className="text-xs text-gray-200 font-medium">{ordenData.fecha}</p>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-semibold">Estado</span>
              <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold">
                Pagado • En Preparación
              </span>
            </div>
          </div>

          {/* Desglose de Productos */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
              <FaBoxOpen className="text-amarillo-dpm" /> Productos en el Paquete
            </h4>
            <div className="bg-slate-950/60 border border-white/10 rounded-xl divide-y divide-white/10 overflow-hidden">
              {ordenData.items.map((item, idx) => (
                <div key={idx} className="p-3 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-white">{item.nombre}</span>
                    <p className="text-gray-400 text-[11px]">{item.cantidad} x ${item.precio.toLocaleString('es-CL')} CLP</p>
                  </div>
                  <span className="font-mono font-bold text-emerald-400">
                    ${item.subtotal.toLocaleString('es-CL')} CLP
                  </span>
                </div>
              ))}
              <div className="p-3 bg-white/5 flex justify-between items-center text-sm font-bold">
                <span className="text-gray-300">Total Facturado (IVA incluido)</span>
                <span className="text-lg text-emerald-400 font-black">
                  ${ordenData.total.toLocaleString('es-CL')} CLP
                </span>
              </div>
            </div>
          </div>

          {/* Información de Envío y Despacho */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-sky-500/30 space-y-2">
            <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase">
              <FaTruck /> Información de Entrega a Domicilio
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-300 pt-1">
              <div>
                <span className="text-[10px] text-gray-400 block">Titular del Pedido:</span>
                <strong className="text-white">{ordenData.cliente}</strong>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block">Correo de Notificación:</span>
                <strong className="text-white truncate block">{ordenData.email}</strong>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block">Operador Logístico:</span>
                <span>Chilexpress (24-72 hrs hábiles)</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block">N° de Seguimiento:</span>
                <span className="font-mono text-amarillo-dpm font-bold">{ordenData.numeroSeguimiento}</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-[11px] text-amber-200 flex items-start gap-2">
            <span>ℹ️</span>
            <span>
              Recibirás un correo con la boleta electrónica del SII y el enlace de seguimiento en tiempo real cuando el paquete salga del Estadio Chinquihue.
            </span>
          </div>

        </div>

        {/* Pie con Botones de Acción */}
        <div className="bg-slate-950 px-6 py-4 flex flex-wrap justify-between items-center gap-3 border-t border-white/10">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 text-xs bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2.5 rounded-xl border border-white/15 transition"
          >
            <FaDownload /> Descargar / Imprimir Boleta
          </button>
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl shadow transition"
          >
            Entendido, Continuar
          </button>
        </div>

      </div>
    </div>
  );
};
