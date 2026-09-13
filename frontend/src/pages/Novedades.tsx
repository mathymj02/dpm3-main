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
          { id: '1', titulo: '¡Gran victoria en casa!', contenido: 'El equipo demostró su jerarquía frente a un estadio lleno. Los goles fueron obra de Juan Pérez y Luis Martínez, asegurando 3 puntos vitales para el campeonato.', imagenUrl: 'https://via.placeholder.com/600x400', fechaPublicacion: '2025-01-10', autorNombre: 'Comunicaciones DPM' },
          { id: '2', titulo: 'Nuevos abonos disponibles', contenido: 'Asegura tu lugar en el Chinquihue para toda la temporada 2025. Los abonos ya están a la venta con descuentos especiales para antiguos socios.', imagenUrl: 'https://via.placeholder.com/600x400', fechaPublicacion: '2025-01-08', autorNombre: 'Comunicaciones DPM' },
          { id: '3', titulo: 'Amistoso confirmado', contenido: 'Nos preparamos para la temporada con un partido internacional. El equipo viajará a Argentina para medirse contra un rival de primera división.', imagenUrl: 'https://via.placeholder.com/600x400', fechaPublicacion: '2025-01-05', autorNombre: 'Comunicaciones DPM' },
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
      <h1 className="text-4xl font-bold text-azul-dpm mb-10 text-center">Novedades</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {novedades.map((nov, i) => (
          <motion.div key={nov.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="h-full flex flex-col">
              {/* object-cover asegura un corte perfecto sin distorsionar */}
              <img src={nov.imagenUrl} alt={nov.titulo} className="w-full h-56 object-cover" />
              
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
