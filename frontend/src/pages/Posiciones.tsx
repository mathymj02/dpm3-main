/**
 * ============================================================================
 * Archivo: Posiciones.tsx
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Renderiza la tabla oficial de posiciones de la Segunda División Profesional.
 * Incluye un simulador interactivo de partidos en tiempo real para actualizar
 * estadísticas (PJ, PG, PE, PP, GF, GC, DG, Pts) dinámicamente y zonas de ascenso/descenso.
 * ============================================================================
 */
import { useState, useEffect } from 'react';
import { Posicion } from '../types';
import api from '../api/axiosConfig';
import { Spinner } from '../components/ui/Spinner';
import { motion } from 'framer-motion';
import { toastSuccess, toastInfo } from '../components/ui/Toast';
import { Link } from 'react-router-dom';
import { FaFutbol, FaTrophy, FaTicketAlt } from 'react-icons/fa';

export const Posiciones = () => {
  const [posiciones, setPosiciones] = useState<Posicion[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para el simulador interactivo de partidos
  const [showSimulador, setShowSimulador] = useState(false);
  const [localIndex, setLocalIndex] = useState(0);
  const [visitaIndex, setVisitaIndex] = useState(1);
  const [golesLocal, setGolesLocal] = useState(2);
  const [golesVisita, setGolesVisita] = useState(1);

  useEffect(() => {
    const fetchPosiciones = async () => {
      try {
        const response = await api.get('/posiciones?temporada=2025');
        setPosiciones(response.data);
      } catch (error) {
        setPosiciones([
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
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchPosiciones();
  }, []);

  // Función para procesar un resultado en vivo y recalcular la tabla
  const handleRegistrarPartido = () => {
    if (localIndex === visitaIndex) {
      toastInfo('El equipo local y visita deben ser distintos.');
      return;
    }

    const equipoLocal = posiciones[localIndex];
    const equipoVisita = posiciones[visitaIndex];

    const nuevasPosiciones = posiciones.map((pos) => {
      if (pos.equipo === equipoLocal.equipo) {
        const esGanador = golesLocal > golesVisita;
        const esEmpate = golesLocal === golesVisita;
        const nuevosPuntos = esGanador ? 3 : esEmpate ? 1 : 0;
        return {
          ...pos,
          pj: pos.pj + 1,
          pg: pos.pg + (esGanador ? 1 : 0),
          pe: pos.pe + (esEmpate ? 1 : 0),
          pp: pos.pp + (!esGanador && !esEmpate ? 1 : 0),
          gf: pos.gf + golesLocal,
          gc: pos.gc + golesVisita,
          dg: (pos.gf + golesLocal) - (pos.gc + golesVisita),
          pts: pos.pts + nuevosPuntos
        };
      }

      if (pos.equipo === equipoVisita.equipo) {
        const esGanador = golesVisita > golesLocal;
        const esEmpate = golesLocal === golesVisita;
        const nuevosPuntos = esGanador ? 3 : esEmpate ? 1 : 0;
        return {
          ...pos,
          pj: pos.pj + 1,
          pg: pos.pg + (esGanador ? 1 : 0),
          pe: pos.pe + (esEmpate ? 1 : 0),
          pp: pos.pp + (!esGanador && !esEmpate ? 1 : 0),
          gf: pos.gf + golesVisita,
          gc: pos.gc + golesLocal,
          dg: (pos.gf + golesVisita) - (pos.gc + golesLocal),
          pts: pos.pts + nuevosPuntos
        };
      }

      return pos;
    });

    // Reordenar por puntos (PTS descendente) y diferencia de goles (DG)
    nuevasPosiciones.sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      return b.dg - a.dg;
    });

    setPosiciones(nuevasPosiciones);
    toastSuccess(`¡Partido registrado! ${equipoLocal.equipo} ${golesLocal} - ${golesVisita} ${equipoVisita.equipo}. Tabla actualizada.`);
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-3 flex items-center justify-center gap-3">
          <FaTrophy className="text-amarillo-dpm" /> Tabla de Posiciones 2025
        </h1>
        <p className="text-lg text-amarillo-dpm font-bold drop-shadow">
          Segunda División Profesional del Fútbol Chileno — Actualizada Fecha a Fecha
        </p>
      </div>

      {/* Botón para desplegar el Simulador de Partidos en Vivo */}
      <div className="flex justify-center mb-8">
        <button
          onClick={() => setShowSimulador(!showSimulador)}
          className="bg-amarillo-dpm hover:bg-yellow-400 text-azul-dpm font-extrabold px-6 py-3 rounded-full shadow-lg flex items-center gap-2 transition transform hover:scale-105"
        >
          <FaFutbol /> {showSimulador ? 'Ocultar Simulador de Fecha' : 'Simular / Actualizar Resultado de Partido'}
        </button>
      </div>

      {/* Panel del Simulador de Partido */}
      {showSimulador && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-6 md:p-8 mb-10 border-4 border-verde-dpm"
        >
          <h2 className="text-2xl font-bold text-azul-dpm mb-6 text-center border-b pb-3 flex items-center justify-center gap-2">
            <FaFutbol className="text-verde-dpm" /> Actualizar Estadísticas por Partido
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center max-w-4xl mx-auto">
            {/* Local */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">Equipo Local</label>
              <select 
                value={localIndex} 
                onChange={(e) => setLocalIndex(Number(e.target.value))}
                className="w-full p-2.5 border border-gray-300 rounded-lg bg-white font-medium focus:ring-2 focus:ring-verde-dpm"
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
                max="15" 
                value={golesLocal}
                onChange={(e) => setGolesLocal(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-14 h-12 text-center text-2xl font-black border-2 border-verde-dpm rounded-lg"
              />
              <span className="font-bold text-gray-400 text-xl">-</span>
              <input 
                type="number" 
                min="0" 
                max="15" 
                value={golesVisita}
                onChange={(e) => setGolesVisita(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-14 h-12 text-center text-2xl font-black border-2 border-azul-dpm rounded-lg"
              />
            </div>

            {/* Visita */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">Equipo Visita</label>
              <select 
                value={visitaIndex} 
                onChange={(e) => setVisitaIndex(Number(e.target.value))}
                className="w-full p-2.5 border border-gray-300 rounded-lg bg-white font-medium focus:ring-2 focus:ring-verde-dpm"
              >
                {posiciones.map((p, idx) => (
                  <option key={p.equipo} value={idx}>{p.equipo}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-center mt-6">
            <button
              onClick={handleRegistrarPartido}
              className="bg-verde-dpm hover:bg-green-700 text-white font-black px-8 py-3 rounded-lg shadow-md transition"
            >
              Registrar Resultado y Recalcular Tabla
            </button>
          </div>
        </motion.div>
      )}

      {/* Tabla Oficial de Posiciones */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl overflow-hidden overflow-x-auto border border-gray-100"
      >
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-verde-dpm to-azul-dpm text-white">
            <tr>
              <th scope="col" className="px-5 py-4 text-center text-xs font-black uppercase tracking-wider">Pos</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider">Club</th>
              <th scope="col" className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider">PJ</th>
              <th scope="col" className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider">PG</th>
              <th scope="col" className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider">PE</th>
              <th scope="col" className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider">PP</th>
              <th scope="col" className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider">GF</th>
              <th scope="col" className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider">GC</th>
              <th scope="col" className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider">DG</th>
              <th scope="col" className="px-6 py-4 text-center text-sm font-black uppercase tracking-wider text-amarillo-dpm">Pts</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 font-medium">
            {posiciones.map((pos, index) => {
              const isDPM = pos.equipo.includes('Puerto Montt');
              const isAscenso = index === 0;
              const isLiguilla = index >= 1 && index <= 4;
              const isDescenso = index >= posiciones.length - 2;

              return (
                <tr 
                  key={pos.equipo} 
                  className={`transition-colors hover:bg-gray-100 ${
                    isDPM 
                      ? 'bg-green-100/90 font-extrabold border-l-8 border-verde-dpm shadow-sm' 
                      : index % 2 === 0 ? 'bg-white/80' : 'bg-gray-50/80'
                  }`}
                >
                  <td className="px-5 py-4 whitespace-nowrap text-center text-sm">
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-black text-xs ${
                      isAscenso ? 'bg-amarillo-dpm text-azul-dpm shadow' : 
                      isLiguilla ? 'bg-blue-100 text-azul-dpm' : 
                      isDescenso ? 'bg-red-100 text-red-600' : 'text-gray-600'
                    }`}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                    <img 
                      src={pos.escudoUrl} 
                      alt={pos.equipo} 
                      className="w-8 h-8 object-contain bg-white rounded-full p-0.5 shadow-sm"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/logo-deportes-puertomontt.png';
                      }} 
                    />
                    <span className={`text-base ${isDPM ? 'text-verde-dpm font-black tracking-wide' : 'text-gray-900'}`}>
                      {pos.equipo} {isDPM && '⭐ (Velero)'}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-gray-700">{pos.pj}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-gray-700">{pos.pg}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-gray-700">{pos.pe}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-gray-700">{pos.pp}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-gray-700">{pos.gf}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-gray-700">{pos.gc}</td>
                  <td className={`px-4 py-4 whitespace-nowrap text-center text-sm font-bold ${pos.dg > 0 ? 'text-green-600' : pos.dg < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                    {pos.dg > 0 ? `+${pos.dg}` : pos.dg}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-lg font-black text-azul-dpm">
                    {pos.pts}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Leyenda de Clasificación */}
        <div className="p-4 bg-gray-100 border-t border-gray-200 flex flex-wrap gap-6 text-xs font-bold text-gray-600 justify-center">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amarillo-dpm"></span>
            <span>1° Campeón (Ascenso Directo a Primera B)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-400"></span>
            <span>2° al 5° Zona de Liguilla de Ascenso</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span>9° y 10° Zona de Descenso a Tercera A</span>
          </div>
        </div>
      </motion.div>

      {/* Widget de Próximo Partido */}
      <div className="mt-12 bg-gradient-to-r from-azul-dpm to-verde-dpm text-white rounded-2xl shadow-xl p-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <span className="bg-amarillo-dpm text-azul-dpm text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
            Próxima Fecha — Estadio Chinquihue
          </span>
          <h3 className="text-2xl md:text-3xl font-black mt-2">
            Deportes Puerto Montt vs Provincial Osorno
          </h3>
          <p className="text-gray-200 mt-1">Sábado 18:00 hrs &bull; Clásico del Sur &bull; ¡Llenemos el Chinquihue!</p>
        </div>
        <Link 
          to="/tienda" 
          className="bg-amarillo-dpm hover:bg-white text-azul-dpm font-black px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 transition"
        >
          <FaTicketAlt /> Asegurar Entrada Oficial
        </Link>
      </div>
    </div>
  );
};
