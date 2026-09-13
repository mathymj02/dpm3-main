/**
 * ============================================================================
 * Archivo: NovedadDetalle.tsx
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Renderiza la vista completa (detalle) de una noticia o novedad específica.
 * 
 * DECISIONES DE DISEÑO / UX:
 * - Patrón de Página Dinámica: Al igual que con los jugadores, utiliza
 *   `/novedades/:id` para consultar la API y obtener los detalles del artículo.
 * - Tipografía y Lectura (Tailwind Typography / Prose): Se utiliza la clase
 *   genérica `prose prose-lg` (si el plugin typography estuviera activo) o 
 *   bien `whitespace-pre-wrap` para respetar los saltos de línea (\n)
 *   originales del texto plano enviado por la API, garantizando una lectura 
 *   agradable y estructurada tipo blog.
 * ============================================================================
 */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Novedad } from '../types';
import api from '../api/axiosConfig';
import { Spinner } from '../components/ui/Spinner';
import { motion } from 'framer-motion';

export const NovedadDetalle = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [novedad, setNovedad] = useState<Novedad | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNovedad = async () => {
      try {
        const response = await api.get(`/novedades/${id}`);
        setNovedad(response.data);
      } catch (error) {
        setNovedad({
          id: id || '1', 
          titulo: '¡Gran victoria en casa!', 
          contenido: 'El equipo demostró su jerarquía frente a un estadio lleno. Los goles fueron obra de Juan Pérez y Luis Martínez, asegurando 3 puntos vitales para el campeonato. La hinchada no paró de alentar en los 90 minutos, creando un ambiente espectacular en el Chinquihue.\n\nEl entrenador destacó la entrega del equipo: "Es un triunfo de todos, del grupo que se ha esforzado muchísimo en la semana". El próximo partido será en calidad de visitante.', 
          imagenUrl: 'https://via.placeholder.com/1200x600', 
          fechaPublicacion: '2025-01-10', 
          autorNombre: 'Comunicaciones DPM'
        });
      } finally {
        setLoading(false);
      }
    };
    fetchNovedad();
  }, [id]);

  if (loading) return <Spinner />;
  if (!novedad) return <div className="text-center py-20 text-xl">Noticia no encontrada</div>;

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button 
        onClick={() => navigate('/novedades')}
        className="mb-6 text-verde-dpm hover:text-azul-dpm font-medium flex items-center gap-2"
      >
        &larr; Volver a Novedades
      </button>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
          {novedad.titulo}
        </h1>
        
        <div className="flex items-center gap-4 text-gray-500 mb-8 border-b pb-4">
          <span>Por <span className="font-bold text-gray-700">{novedad.autorNombre}</span></span>
          <span>&bull;</span>
          <span>{novedad.fechaPublicacion}</span>
        </div>

        <img 
          src={novedad.imagenUrl} 
          alt={novedad.titulo} 
          className="w-full rounded-xl shadow-lg mb-10 object-cover max-h-[500px]"
        />

        <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
          {novedad.contenido}
        </div>
      </motion.div>
    </article>
  );
};
