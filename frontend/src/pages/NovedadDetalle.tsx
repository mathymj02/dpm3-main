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
        // Fallback enriquecido según el ID solicitado
        const mockArticles: Record<string, Novedad> = {
          '1': {
            id: '1',
            titulo: 'Deportes Puerto Montt denuncia robo de balones desde Estadio Chinquihue',
            contenido: '¡35 balones profesionales de fútbol, propiedad del plantel de Deportes Puerto Montt, fueron sustraídos desde el Estadio Bicentenario de Chinquihue!\n\nEl club ya presentó las denuncias pertinentes ante Carabineros de Chile para dar con los responsables de este lamentable hecho que afecta directamente los entrenamientos del primer equipo.\n\nDesde la directiva hicieron un llamado a la comunidad a no adquirir estos balones en el comercio informal y a denunciar cualquier antecedente a las autoridades policiales.',
            imagenUrl: '/images/robo-balon.jpg',
            fechaPublicacion: '06-06-2025',
            autorNombre: 'Comunicaciones DPM'
          },
          '2': {
            id: '2',
            titulo: 'Inauguración de Sala de Acondicionamiento Físico en el Chinquihue',
            contenido: 'Este lunes, Deportes Puerto Montt llevó a cabo la inauguración de una moderna sala de musculación en el Estadio Regional de Chinquihue.\n\nEl nuevo recinto cuenta con equipamiento de alta tecnología para el trabajo de fuerza, prevención de lesiones y acondicionamiento cardiovascular de nuestros deportistas.\n\n"Esta inversión marca un antes y un después en la preparación de nuestros futbolistas", destacó el cuerpo técnico.',
            imagenUrl: '/images/novedades1.jpg',
            fechaPublicacion: '11-03-2025',
            autorNombre: 'Comunicaciones DPM'
          },
          '3': {
            id: '3',
            titulo: 'Partimos con un triunfo la temporada: 4 a cero a Brujas de Salamanca',
            contenido: 'Con un contundente triunfo debutó Deportes Puerto Montt en el campeonato de la Segunda División Profesional del fútbol chileno.\n\nEl Velero dominó de principio a fin las acciones en el Estadio Regional de Chinquihue, deleitando a los miles de hinchas albiverdes que llegaron a alentar en una tarde inolvidable.\n\nLos goles fueron convertidos tras sólidas jugadas asociadas que confirman el gran momento y preparación del plantel.',
            imagenUrl: '/images/novedad3.jpeg',
            fechaPublicacion: '03-07-2025',
            autorNombre: 'Comunicaciones DPM'
          }
        };
        setNovedad(mockArticles[id || '1'] || mockArticles['1']);
      } finally {
        setLoading(false);
      }
    };
    fetchNovedad();
  }, [id]);

  if (loading) return <Spinner />;
  if (!novedad) return <div className="text-center py-20 text-xl text-white">Noticia no encontrada</div>;

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button 
        onClick={() => navigate('/novedades')}
        className="mb-6 bg-white/90 hover:bg-white text-verde-dpm px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow transition"
      >
        &larr; Volver a Novedades
      </button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-8 md:p-12">
        <h1 className="text-3xl md:text-5xl font-extrabold text-azul-dpm mb-6 leading-tight">
          {novedad.titulo}
        </h1>
        
        <div className="flex items-center gap-4 text-gray-500 mb-8 border-b pb-4 text-sm font-medium">
          <span>Por <span className="font-bold text-verde-dpm">{novedad.autorNombre}</span></span>
          <span>&bull;</span>
          <span>{novedad.fechaPublicacion}</span>
        </div>

        <img 
          src={novedad.imagenUrl} 
          alt={novedad.titulo} 
          className="w-full rounded-xl shadow-lg mb-10 object-cover max-h-[500px] bg-gray-100"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/robo-balon.jpg';
          }}
        />

        <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed text-lg">
          {novedad.contenido}
        </div>
      </motion.div>
    </article>
  );
};
