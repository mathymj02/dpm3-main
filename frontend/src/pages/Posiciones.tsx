/**
 * ============================================================================
 * Archivo: Posiciones.tsx
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Renderiza la tabla de posiciones actual del campeonato en curso.
 * 
 * DECISIONES DE DISEÑO / UX:
 * - Tabla Responsiva (Responsive Table Design): Las tablas HTML tradicionales
 *   rompen los diseños en pantallas móviles. Se solucionó envolviendo la 
 *   tabla en un `div` con `overflow-x-auto`, permitiendo deslizar la tabla
 *   horizontalmente en teléfonos sin descuadrar el resto del sitio.
 * - Resaltado Dinámico (Row Highlighting): Al renderizar el `.map()`, 
 *   se verifica con `isDPM` si la fila pertenece al equipo local. En caso 
 *   afirmativo, se aplican clases CSS exclusivas (`bg-green-50`, borde 
 *   izquierdo verde grueso) para que el hincha encuentre a su club
 *   instantáneamente sin esfuerzo visual.
 * ============================================================================
 */
import { useState, useEffect } from 'react';
import { Posicion } from '../types';
import api from '../api/axiosConfig';
import { Spinner } from '../components/ui/Spinner';
import { motion } from 'framer-motion';

export const Posiciones = () => {
  const [posiciones, setPosiciones] = useState<Posicion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosiciones = async () => {
      try {
        const response = await api.get('/posiciones?temporada=2025');
        setPosiciones(response.data);
      } catch (error) {
        setPosiciones([
          { equipo: 'Deportes Puerto Montt', escudoUrl: '/images/logo-deportes-puertomontt.png', pj: 12, pg: 7, pe: 3, pp: 2, gf: 22, gc: 12, dg: 10, pts: 24 },
          { equipo: 'San Marcos de Arica', escudoUrl: '/images/images.jpg', pj: 12, pg: 6, pe: 3, pp: 3, gf: 18, gc: 13, dg: 5, pts: 21 },
          { equipo: 'Deportes Valdivia', escudoUrl: '/images/download (3).png', pj: 12, pg: 5, pe: 4, pp: 3, gf: 20, gc: 16, dg: 4, pts: 19 },
          { equipo: 'Deportes Melipilla', escudoUrl: '/images/images.jpg', pj: 12, pg: 5, pe: 2, pp: 5, gf: 17, gc: 16, dg: 1, pts: 17 },
          { equipo: 'Provincial Osorno', escudoUrl: '/images/2IYaruYV_400x400.jpg', pj: 12, pg: 4, pe: 4, pp: 4, gf: 15, gc: 14, dg: 1, pts: 16 },
          { equipo: 'Deportes Concepción', escudoUrl: '/images/download.png', pj: 12, pg: 4, pe: 3, pp: 5, gf: 14, gc: 16, dg: -2, pts: 15 },
          { equipo: 'Deportes Temuco', escudoUrl: '/images/download (1).png', pj: 12, pg: 4, pe: 2, pp: 6, gf: 13, gc: 17, dg: -4, pts: 14 },
          { equipo: 'Magallanes', escudoUrl: '/images/download (2).png', pj: 12, pg: 3, pe: 3, pp: 6, gf: 12, gc: 17, dg: -5, pts: 12 },
          { equipo: 'Rangers de Talca', escudoUrl: '/images/images.png', pj: 12, pg: 3, pe: 1, pp: 8, gf: 10, gc: 21, dg: -11, pts: 10 },
          { equipo: 'Iberia Los Ángeles', escudoUrl: '/images/club-atletico-iberia.png', pj: 12, pg: 2, pe: 2, pp: 8, gf: 9, gc: 21, dg: -12, pts: 8 },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchPosiciones();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-azul-dpm mb-8 text-center">Tabla de Posiciones 2025</h1>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-md overflow-hidden overflow-x-auto"
      >
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-azul-dpm text-white">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Pos</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Equipo</th>
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
          <tbody className="bg-white divide-y divide-gray-200">
            {posiciones.map((pos, index) => {
              // Verifica dinámicamente si la fila corresponde al equipo local
              const isDPM = pos.equipo.includes('Puerto Montt');
              return (
                <tr 
                  key={pos.equipo} 
                  // Resaltado de la fila de DPM con Tailwind
                  className={`hover:bg-gray-50 transition-colors ${isDPM ? 'bg-green-50 border-l-4 border-verde-dpm' : ''}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                    <img src={pos.escudoUrl} alt={pos.equipo} className="w-6 h-6 object-contain" />
                    <span className={`text-sm font-medium ${isDPM ? 'text-verde-dpm font-bold' : 'text-gray-900'}`}>{pos.equipo}</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-gray-500">{pos.pj}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-gray-500">{pos.pg}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-gray-500">{pos.pe}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-gray-500">{pos.pp}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-gray-500">{pos.gf}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-gray-500">{pos.gc}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-gray-500">{pos.dg}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-base font-bold text-gray-900">{pos.pts}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
};
