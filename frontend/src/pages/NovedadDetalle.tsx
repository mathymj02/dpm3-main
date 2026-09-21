/**
 * ============================================================================
 * Archivo: NovedadDetalle.tsx
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Renderiza la vista completa (detalle) de una noticia o novedad específica.
 * Soporta tanto las noticias oficiales por defecto como las nuevas noticias
 * publicadas dinámicamente por el Administrador en el Dashboard.
 * ============================================================================
 */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Novedad } from '../types';
import api from '../api/axiosConfig';
import { Spinner } from '../components/ui/Spinner';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaCalendarAlt, FaUser, FaShareAlt } from 'react-icons/fa';
import { toastSuccess } from '../components/ui/Toast';

export const NovedadDetalle = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [novedad, setNovedad] = useState<Novedad | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNovedad = async () => {
      // 1. Prioridad: Buscar en las noticias guardadas por el administrador en localStorage
      const savedNews = localStorage.getItem('dpm_novedades_data');
      if (savedNews && id) {
        try {
          const parsed: Novedad[] = JSON.parse(savedNews);
          const found = parsed.find(n => String(n.id) === String(id));
          if (found) {
            setNovedad(found);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.error("Error al leer dpm_novedades_data:", e);
        }
      }

      // 2. Intentar consultar al backend
      try {
        const response = await api.get(`/novedades/${id}`);
        setNovedad(response.data);
      } catch (error) {
        // 3. Fallback de noticias base por defecto
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

        if (id && mockArticles[id]) {
          setNovedad(mockArticles[id]);
        } else {
          // Si no existe con ese ID, buscar por aproximación o mostrar null
          setNovedad(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNovedad();
  }, [id]);

  if (loading) return <Spinner />;

  if (!novedad) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-white">
        <h2 className="text-3xl font-extrabold text-azul-dpm mb-4">Artículo no encontrado</h2>
        <p className="text-gray-500 mb-6">La noticia que buscas no existe o fue retirada por el administrador.</p>
        <button
          onClick={() => navigate('/novedades')}
          className="bg-verde-dpm hover:bg-green-700 text-white font-bold py-2.5 px-6 rounded-full transition"
        >
          Volver a Novedades
        </button>
      </div>
    );
  }

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    toastSuccess('Enlace copiado al portapapeles.');
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Botón de retroceso */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={() => navigate('/novedades')}
          className="inline-flex items-center gap-2 text-sky-400 hover:text-sky-300 font-bold text-sm bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-700 transition"
        >
          <FaArrowLeft /> Volver al listado
        </button>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-2 text-xs text-gray-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg transition"
        >
          <FaShareAlt /> Compartir noticia
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
      >
        {/* Foto de portada de la noticia */}
        <div className="relative h-80 sm:h-96 w-full bg-slate-900 overflow-hidden">
          <img 
            src={novedad.imagenUrl} 
            alt={novedad.titulo} 
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/puerto-montt-gol.jpeg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className="flex items-center gap-4 text-xs text-gray-300 mb-2">
              <span className="flex items-center gap-1 bg-verde-dpm/90 px-2.5 py-0.5 rounded font-bold text-white">
                <FaCalendarAlt size={11} /> {novedad.fechaPublicacion}
              </span>
              <span className="flex items-center gap-1 text-sky-300">
                <FaUser size={11} /> {novedad.autorNombre}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight drop-shadow-md">
              {novedad.titulo}
            </h1>
          </div>
        </div>

        {/* Cuerpo del Artículo */}
        <div className="p-6 sm:p-10">
          <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed space-y-4 whitespace-pre-wrap font-sans text-base sm:text-lg">
            {novedad.contenido}
          </div>

          <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Publicado oficialmente por {novedad.autorNombre}</span>
            <span>Club Deportes Puerto Montt • Sitio Oficial</span>
          </div>
        </div>
      </motion.div>
    </article>
  );
};
