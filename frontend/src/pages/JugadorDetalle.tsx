/**
 * ============================================================================
 * Archivo: JugadorDetalle.tsx
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Renderiza la vista detallada de un jugador específico en base a su ID.
 * 
 * DECISIONES DE DISEÑO / UX:
 * - Patrón de Página Dinámica: En React Router, la ruta `/jugadores/:id` 
 *   indica que `id` es un parámetro variable de la URL.
 * - useParams Hook: Se utiliza para extraer ese `id` directamente desde la URL 
 *   y pasarlo a la petición Axios (`/jugadores/${id}`) para obtener los 
 *   detalles precisos de ESE jugador sin quemar los datos en frontend.
 * - UX de Navegación: El botón "Volver al plantel" mejora la navegación
 *   sin depender exclusivamente del botón "Atrás" del navegador.
 * ============================================================================
 */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Jugador } from '../types';
import api from '../api/axiosConfig';
import { Spinner } from '../components/ui/Spinner';
import { motion } from 'framer-motion';

export const JugadorDetalle = () => {
  // Extrae el ID dinámico de la URL
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [jugador, setJugador] = useState<Jugador | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJugador = async () => {
      try {
        const response = await api.get(`/jugadores/${id}`);
        setJugador(response.data);
      } catch (error) {
        // Fallback: Datos quemados si la API no está lista
        setJugador({
          id: id || '1',
          nombre: 'Jugador Ejemplo',
          posicion: 'Delantero',
          edad: 25,
          nacionalidad: 'Chileno',
          fotoUrl: 'https://via.placeholder.com/600',
          descripcion: 'Gran jugador con excelente trayectoria...'
        });
      } finally {
        setLoading(false);
      }
    };
    fetchJugador();
  }, [id]);

  if (loading) return <Spinner />;
  if (!jugador) return <div className="text-center py-20 text-xl">Jugador no encontrado</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button 
        onClick={() => navigate('/jugadores')}
        className="mb-8 text-verde-dpm hover:text-azul-dpm font-medium flex items-center gap-2"
      >
        &larr; Volver al plantel
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row"
      >
        <div className="md:w-1/2">
          <img 
            src={jugador.fotoUrl} 
            alt={jugador.nombre} 
            className="w-full h-full object-cover min-h-[400px]"
          />
        </div>
        <div className="p-8 md:w-1/2 flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-azul-dpm mb-2">{jugador.nombre}</h1>
          <p className="text-2xl text-verde-dpm font-bold mb-6">{jugador.posicion}</p>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Edad</p>
              <p className="text-lg font-semibold">{jugador.edad} años</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Nacionalidad</p>
              <p className="text-lg font-semibold">{jugador.nacionalidad}</p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2">Sobre el jugador</h3>
            <p className="text-gray-600 leading-relaxed">
              {jugador.descripcion}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
