/**
 * ============================================================================
 * Archivo: Novedades.tsx
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Muestra el feed tipo blog (lista de noticias) relacionadas al club.
 * 
 * DECISIONES DE DISEÑO / UX:
 * - Content Truncation (Truncamiento): Para evitar que la altura de las 
 *   tarjetas se descontrole si una noticia es muy larga, se utiliza 
 *   `.substring(0, 150) + "..."`. Esto asegura tarjetas uniformes en altura.
 * - Image Handling: Las imágenes usan la clase `object-cover` acoplada con
 *   una altura fija (`h-56`). Esto asegura que la foto llene el espacio sin 
 *   deformarse (sin estirarse ni achatarse).
 * ============================================================================
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Novedad } from '../types';
import api from '../api/axiosConfig';
import { Card } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';
import { motion } from 'framer-motion';

export const Novedades = () => {
  const [novedades, setNovedades] = useState<Novedad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNovedades = async () => {
      try {
        const response = await api.get('/novedades');
        setNovedades(response.data);
      } catch (error) {
        setNovedades([
          { id: '1', titulo: 'Deportes Puerto Montt denuncia robo de balones desde Estadio Chinquihue', contenido: '¡35 balones profesionales de fútbol, propiedad del plantel de Deportes Puerto Montt, fueron sustraídos desde el Estadio Bicentenario de Chinquihue! El club ya presentó las denuncias pertinentes ante Carabineros de Chile.', imagenUrl: '/images/robo-balon.jpg', fechaPublicacion: '06-06-2025', autorNombre: 'Comunicaciones DPM' },
          { id: '2', titulo: 'Inauguración de Sala de Acondicionamiento Físico en el Chinquihue', contenido: 'Este lunes, Deportes Puerto Montt llevó a cabo la inauguración de una moderna sala de musculación en el Estadio Regional de Chinquihue, equipada con tecnología de punta para la preparación de los futbolistas albiverdes.', imagenUrl: '/images/novedades1.jpg', fechaPublicacion: '11-03-2025', autorNombre: 'Comunicaciones DPM' },
          { id: '3', titulo: 'Partimos con un triunfo la temporada: 4 a cero a Brujas de Salamanca', contenido: 'Con un contundente triunfo debutó Deportes Puerto Montt en el campeonato de la Segunda División Profesional del fútbol chileno, goleando en condición de local y desatando la fiesta en las tribunas del Chinquihue.', imagenUrl: '/images/novedad3.jpeg', fechaPublicacion: '03-07-2025', autorNombre: 'Comunicaciones DPM' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchNovedades();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-extrabold text-white drop-shadow-md mb-10 text-center">Novedades Institucionales</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {novedades.map((nov, i) => (
          <motion.div key={nov.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="h-full flex flex-col overflow-hidden bg-white/95 backdrop-blur shadow-xl hover:shadow-2xl transition">
              {/* object-cover asegura un corte perfecto sin distorsionar */}
              <img 
                src={nov.imagenUrl} 
                alt={nov.titulo} 
                className="w-full h-56 object-cover bg-gray-200" 
                onError={(e) => {
                  // Fallback automático si la URL remota fallara
                  (e.target as HTMLImageElement).src = '/images/robo-balon.jpg';
                }}
              />
              
              <div className="p-6 flex flex-col flex-grow">
                <span className="text-sm text-verde-dpm font-bold mb-2">{nov.fechaPublicacion}</span>
                <h2 className="text-xl font-bold mb-3">{nov.titulo}</h2>
                
                {/* Truncamiento por código. Muestra solo los primeros 150 caracteres */}
                <p className="text-gray-600 mb-4 flex-grow">{nov.contenido.substring(0, 150)}...</p>
                
                <Link to={`/novedades/${nov.id}`} className="text-azul-dpm font-bold hover:underline mt-auto">
                  Leer artículo completo &rarr;
                </Link>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
