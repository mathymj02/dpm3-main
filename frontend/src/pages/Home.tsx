/**
 * ============================================================================
 * Archivo: Home.tsx
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Es la página de inicio (Landing Page) de la aplicación. Muestra secciones 
 * clave como un Hero banner, las últimas novedades, una vista previa del 
 * plantel, artículos de la tienda y el clima actual en el estadio.
 * 
 * DECISIONES DE DISEÑO / UX:
 * - Fallback Data: Como las APIs pueden fallar (especialmente en desarrollo),
 *   se implementó un `.catch()` en las peticiones Axios que provee datos 
 *   por defecto (mock data). Esto asegura que la página nunca quede en blanco.
 * - Animaciones de Scroll (Framer Motion): `whileInView` permite que los 
 *   elementos aparezcan suavemente a medida que el usuario hace scroll hacia 
 *   abajo, mejorando enormemente el "look and feel" moderno del sitio.
 * - Open-Meteo API: Se incluyó un widget del clima real del Estadio Chinquihue
 *   para agregar valor informativo para los hinchas que asisten a los partidos.
 * ============================================================================
 */
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Novedad, Jugador, Producto } from '../types';
import api from '../api/axiosConfig';
import { 
  FaPlay, 
  FaCalendarAlt, 
  FaClock, 
  FaMapMarkerAlt, 
  FaTicketAlt, 
  FaYoutube, 
  FaTimes, 
  FaFutbol 
} from 'react-icons/fa';

export interface PartidosConfig {
  proximo: {
    rival: string;
    escudoRival: string;
    torneo: string;
    fecha: string;
    hora: string;
    estadio: string;
    esLocal: boolean;
    ticketLink: string;
  };
  ultimo: {
    rival: string;
    escudoRival: string;
    torneo: string;
    fecha: string;
    golesDpm: number;
    golesRival: number;
    youtubeId: string;
    youtubeTitulo: string;
  };
}

const defaultPartidos: PartidosConfig = {
  proximo: {
    rival: 'Ñublense',
    escudoRival: 'https://dpmchile.cl/wp-content/uploads/2024/08/nublense.webp',
    torneo: 'Copa Chile Coca-Cola Sin Azúcar 2026',
    fecha: 'Domingo 28 de Septiembre 2026',
    hora: '18:00 hrs',
    estadio: 'Estadio Bicentenario Chinquihue',
    esLocal: true,
    ticketLink: '/entradas'
  },
  ultimo: {
    rival: 'Magallanes',
    escudoRival: '/images/escudo-magallanes.png',
    torneo: 'Copa Chile Coca-Cola Sin Azúcar 2026',
    fecha: 'Sábado 21 de Septiembre 2026',
    golesDpm: 2,
    golesRival: 0,
    youtubeId: 'ScQrhZAB-lg',
    youtubeTitulo: 'Deportes Puerto Montt 2 - 0 Magallanes | Resumen Oficial TNT Sports'
  }
};

const dpmTvVideos = [
  {
    id: 'ScQrhZAB-lg',
    titulo: 'Deportes Puerto Montt 2 - 0 Magallanes | Resumen TNT Sports Chile',
    categoria: 'Compacto TNT Sports',
    duracion: '4:15'
  },
  {
    id: 'URwFjERjb2Q',
    titulo: 'Goles de Puerto Montt | Definiciones del Velero en Segunda División',
    categoria: 'Goles DPM',
    duracion: '3:40'
  },
  {
    id: '6E-ssHcd2HU',
    titulo: 'Conferencia de Prensa Oficial post partido en Chinquihue',
    categoria: 'Entrevistas',
    duracion: '8:22'
  },
  {
    id: 'TOPtPzHscm8',
    titulo: 'El Color y Aliento de la Hinchada Albiverde en el Chinquihue',
    categoria: 'DPM TV',
    duracion: '5:10'
  }
];

export const Home = () => {
  const [novedades, setNovedades] = useState<Novedad[]>([]);
  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [weather, setWeather] = useState<any>(null);
  const [activeVideoModal, setActiveVideoModal] = useState<{ id: string; titulo: string } | null>(null);

  const [partidos, setPartidos] = useState<PartidosConfig>(() => {
    const saved = localStorage.getItem('dpm_partidos_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return defaultPartidos;
  });

  useEffect(() => {
    // Petición paralela para optimizar tiempos de carga
    const fetchHomeData = async () => {
      try {
        const [novRes, jugRes, prodRes] = await Promise.all([
          // Si falla la API, inyectamos noticias administradas o Fallback Data
          api.get('/novedades').catch(() => {
            const savedNews = localStorage.getItem('dpm_novedades_data');
            if (savedNews) {
              try {
                const parsed = JSON.parse(savedNews);
                if (Array.isArray(parsed) && parsed.length > 0) return { data: parsed };
              } catch {}
            }
            return { data: [
              { id: '1', titulo: 'Deportes Puerto Montt denuncia robo de balones', contenido: '35 balones profesionales de fútbol fueron sustraídos desde el Estadio Bicentenario de Chinquihue...', imagenUrl: '/images/robo-balon.jpg', fechaPublicacion: '06-06-2025', autorNombre: 'Comunicaciones DPM' },
              { id: '2', titulo: 'Nueva Sala de acondicionamiento físico en el Chinquihue', contenido: 'Se trata de una moderna sala de musculación para el plantel profesional...', imagenUrl: '/images/novedades1.jpg', fechaPublicacion: '11-03-2025', autorNombre: 'Comunicaciones DPM' },
              { id: '3', titulo: 'Gran debut 2025: 4 a cero a Brujas de Salamanca', contenido: 'Con un contundente triunfo debutó Deportes Puerto Montt en la Segunda División...', imagenUrl: '/images/novedad3.jpeg', fechaPublicacion: '03-07-2025', autorNombre: 'Comunicaciones DPM' },
            ]};
          }),
          api.get('/jugadores').catch(() => {
            const savedPlayers = localStorage.getItem('dpm_jugadores_data');
            if (savedPlayers) {
              try {
                const parsed = JSON.parse(savedPlayers);
                if (Array.isArray(parsed) && parsed.length > 0) return { data: parsed };
              } catch {}
            }
            return { data: [
              { id: '1', nombre: 'Luis Ureta', posicion: 'Portero', edad: 26, nacionalidad: 'Chile', fotoUrl: 'https://dpmchile.cl/wp-content/uploads/2026/03/Luis-Ureta.webp', descripcion: 'Muro en el arco con reflejos felinos.' },
              { id: '2', nombre: 'Vicente Yáñez', posicion: 'Defensa', edad: 28, nacionalidad: 'Chile', fotoUrl: 'https://dpmchile.cl/wp-content/uploads/2026/04/VICENTE-YANEZ.webp', descripcion: 'Velocidad y compromiso defensivo.' },
              { id: '3', nombre: 'Maximiliano Riveros', posicion: 'Defensa', edad: 29, nacionalidad: 'Chile', fotoUrl: 'https://dpmchile.cl/wp-content/uploads/2026/03/Maximiliano-Riveros.webp', descripcion: 'Líder silencioso y gran juego aéreo.' },
              { id: '11', nombre: 'Reiner Castro', posicion: 'Delantero', edad: 30, nacionalidad: 'Venezuela', fotoUrl: 'https://dpmchile.cl/wp-content/uploads/2026/03/Reiner-Castro.webp', descripcion: 'Extremo supersónico y figura albiverde.' }
            ]};
          }),
          api.get('/productos').catch(() => ({ data: [
            { id: '1', nombre: 'Polera Oficial DPM', precio: 15000, imagenUrl: '/images/polera.jpg', stock: 50, categoria: 'Indumentaria' },
            { id: '2', nombre: 'Short Oficial DPM', precio: 10000, imagenUrl: '/images/short.webp', stock: 40, categoria: 'Indumentaria' },
            { id: '3', nombre: 'Gorro DPM', precio: 8000, imagenUrl: '/images/yoki.jpg', stock: 30, categoria: 'Accesorios' },
          ]}))
        ]);

        // Limita a un máximo de elementos para la preview en el Home
        setNovedades(novRes.data.slice(0, 3));
        setJugadores(jugRes.data.slice(0, 4));
        setProductos(prodRes.data.slice(0, 3));
      } catch (error) {
        console.error("Error fetching home data", error);
      }
    };

    // Obtiene el clima de Puerto Montt
    const fetchWeather = async () => {
      try {
        const res = await axios.get('https://api.open-meteo.com/v1/forecast?latitude=-41.4693&longitude=-72.9424&current_weather=true');
        setWeather(res.data.current_weather);
      } catch (e) {
        console.error("Weather error", e);
      }
    };

    fetchHomeData();
    fetchWeather();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'dpm_partidos_data' && e.newValue) {
        try {
          setPartidos(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <div className="w-full">
      {/* SECCIÓN 1: Hero Cinematográfico con Video Aéreo del Estadio Chinquihue */}
      <section className="relative h-[85vh] min-h-[580px] w-full flex items-center justify-center overflow-hidden">
        {/* Video en movimiento de fondo vía Vimeo (sin consumo de ancho de banda propio) */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          <iframe
            src="https://player.vimeo.com/video/1181735914?muted=1&autoplay=1&loop=1&background=1&app_id=122963"
            className="w-full h-[140%] -top-[20%] relative object-cover scale-125"
            allow="autoplay; fullscreen"
            title="Video Aéreo Estadio Chinquihue DPM"
          />
        </div>

        {/* Degradado institucional cinematográfico de alto contraste */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-azul-dpm/60 to-slate-950/80 backdrop-blur-[1px]" />

        {/* Contenido interactivo flotante sobre el video */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-azul-dpm/80 border border-amarillo-dpm/40 text-amarillo-dpm text-xs sm:text-sm font-black uppercase tracking-widest shadow-xl"
          >
            ⚓ La Pasión del Sur que Nunca Se Detiene
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white drop-shadow-2xl"
          >
            Club Deportes <span className="text-amarillo-dpm">Puerto Montt</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base sm:text-xl text-gray-200 font-medium max-w-2xl mx-auto drop-shadow"
          >
            El orgullo de la Región de Los Lagos. Vive cada fecha en el Estadio Chinquihue con la hinchada albiverde.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4 pt-2"
          >
            <Link 
              to="/socios" 
              className="bg-amarillo-dpm hover:bg-yellow-400 text-slate-950 font-black py-3.5 px-8 rounded-2xl transition-all transform hover:-translate-y-0.5 shadow-2xl shadow-amarillo-dpm/30"
            >
              Hazte Socio Oficial
            </Link>
            <Link 
              to="/jugadores" 
              className="bg-azul-dpm/90 hover:bg-azul-dpm text-white font-bold py-3.5 px-8 rounded-2xl transition border border-white/20 hover:border-white/40 shadow-xl"
            >
              Conocer Plantel
            </Link>
            <Link 
              to="/tienda" 
              className="bg-white/10 hover:bg-white/20 text-white font-bold py-3.5 px-6 rounded-2xl transition border border-white/10 shadow-lg"
            >
              Tienda Oficial
            </Link>
          </motion.div>
        </div>
      </section>

      {/* SECCIÓN 1.5: FIXTURE & PARTIDOS - Banner Dual Oficial (Próximo Encuentro & Último Marcador) */}
      <section className="relative z-20 -mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* TARJETA 1: PRÓXIMO ENCUENTRO */}
          <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-white/15 p-6 sm:p-7 shadow-2xl relative overflow-hidden flex flex-col justify-between group hover:border-emerald-500/40 transition-all duration-300">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div>
              <div className="flex items-center justify-between gap-2 mb-4 border-b border-white/10 pb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-wider border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Próximo Encuentro
                </span>
                <span className="text-xs font-semibold text-slate-300 line-clamp-1">{partidos.proximo.torneo}</span>
              </div>

              {/* Escudos y Duelo */}
              <div className="flex items-center justify-between gap-4 my-4">
                {/* Local: Puerto Montt */}
                <div className="flex flex-col items-center text-center flex-1">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/5 p-2 border border-white/10 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                    <img 
                      src="/images/logo-deportes-puertomontt.png" 
                      alt="Deportes Puerto Montt" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="mt-2 text-sm sm:text-base font-black text-white">D. Puerto Montt</span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Local</span>
                </div>

                {/* VS Badge */}
                <div className="flex flex-col items-center">
                  <span className="text-2xl sm:text-3xl font-black text-amarillo-dpm italic drop-shadow">VS</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-1">Fecha Oficial</span>
                </div>

                {/* Visita: Rival */}
                <div className="flex flex-col items-center text-center flex-1">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/5 p-2 border border-white/10 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                    <img 
                      src={partidos.proximo.escudoRival} 
                      alt={partidos.proximo.rival} 
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/escudo-concepcion.png';
                      }}
                    />
                  </div>
                  <span className="mt-2 text-sm sm:text-base font-black text-white truncate max-w-[130px]">{partidos.proximo.rival}</span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Visita</span>
                </div>
              </div>

              {/* Detalles Fecha / Hora / Estadio */}
              <div className="bg-slate-950/60 rounded-2xl p-3 border border-white/5 text-xs sm:text-sm text-slate-300 space-y-1.5 mt-4">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-emerald-400 shrink-0" />
                  <span className="font-semibold text-white">{partidos.proximo.fecha}</span>
                  <span className="text-slate-500">•</span>
                  <FaClock className="text-amarillo-dpm shrink-0" />
                  <span className="font-semibold text-white">{partidos.proximo.hora}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-red-400 shrink-0" />
                  <span>{partidos.proximo.estadio}</span>
                </div>
              </div>
            </div>

            {/* Botón Comprar Entradas */}
            <div className="pt-5">
              <Link 
                to={partidos.proximo.ticketLink || '/entradas'}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5"
              >
                <FaTicketAlt />
                Comprar Entradas Online
              </Link>
            </div>
          </div>

          {/* TARJETA 2: ÚLTIMO MARCADOR */}
          <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-white/15 p-6 sm:p-7 shadow-2xl relative overflow-hidden flex flex-col justify-between group hover:border-red-500/40 transition-all duration-300">
            <div className="absolute top-0 right-0 w-48 h-48 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between gap-2 mb-4 border-b border-white/10 pb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/20 text-red-400 text-xs font-black uppercase tracking-wider border border-red-600/30">
                  <FaFutbol /> Marcador Oficial
                </span>
                <span className="text-xs font-semibold text-slate-300 line-clamp-1">{partidos.ultimo.torneo}</span>
              </div>

              {/* Duelo de Escudos y Resultado */}
              <div className="flex items-center justify-between gap-4 my-4">
                {/* DPM */}
                <div className="flex flex-col items-center text-center flex-1">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/5 p-2 border border-white/10 flex items-center justify-center shadow-lg">
                    <img 
                      src="/images/logo-deportes-puertomontt.png" 
                      alt="Deportes Puerto Montt" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="mt-2 text-sm sm:text-base font-black text-white">D. Puerto Montt</span>
                </div>

                {/* Score */}
                <div className="flex items-center gap-2 sm:gap-3 bg-slate-950/80 px-4 py-2 rounded-2xl border border-white/10 shadow-inner">
                  <span className="text-3xl sm:text-4xl font-black text-emerald-400">{partidos.ultimo.golesDpm}</span>
                  <span className="text-xl font-bold text-slate-500">-</span>
                  <span className="text-3xl sm:text-4xl font-black text-white">{partidos.ultimo.golesRival}</span>
                </div>

                {/* Rival */}
                <div className="flex flex-col items-center text-center flex-1">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/5 p-2 border border-white/10 flex items-center justify-center shadow-lg">
                    <img 
                      src={partidos.ultimo.escudoRival} 
                      alt={partidos.ultimo.rival} 
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/escudo-magallanes.png';
                      }}
                    />
                  </div>
                  <span className="mt-2 text-sm sm:text-base font-black text-white truncate max-w-[130px]">{partidos.ultimo.rival}</span>
                </div>
              </div>

              {/* Detalles Último Encuentro */}
              <div className="bg-slate-950/60 rounded-2xl p-3 border border-white/5 text-xs sm:text-sm text-slate-300 flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-red-400 shrink-0" />
                  <span className="font-semibold text-white">{partidos.ultimo.fecha}</span>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Victoria Albiverde</span>
              </div>
            </div>

            {/* Botón Ver Resumen TNT Sports */}
            <div className="pt-5">
              <button 
                onClick={() => setActiveVideoModal({
                  id: partidos.ultimo.youtubeId || 'ScQrhZAB-lg',
                  titulo: partidos.ultimo.youtubeTitulo || `Resumen DPM vs ${partidos.ultimo.rival} - TNT Sports`
                })}
                className="w-full py-3.5 px-6 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <FaYoutube className="text-lg text-white" />
                ▶ Ver Resumen TNT Sports
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* SECCIÓN 2: Últimas Novedades / Noticias */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-white border-b-2 border-emerald-400 inline-block pb-2 drop-shadow">
              Últimas Novedades
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {novedades.map((nov, i) => (
              <motion.div
                key={nov.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }} // Anima cuando entra al viewport
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="h-full"
              >
                <div className="bg-slate-900/85 backdrop-blur-md rounded-2xl border border-white/10 hover:border-emerald-500/50 transition-all duration-300 shadow-xl overflow-hidden flex flex-col h-full text-white group">
                  <div className="w-full h-48 overflow-hidden bg-slate-950">
                    <img 
                      src={nov.imagenUrl} 
                      alt={nov.titulo} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <span className="text-xs text-emerald-400 font-bold mb-2 block">{nov.fechaPublicacion}</span>
                    <h3 className="text-xl font-bold mb-2 text-white group-hover:text-emerald-300 transition-colors line-clamp-2">
                      {nov.titulo}
                    </h3>
                    <p className="text-slate-300 text-xs sm:text-sm flex-grow line-clamp-3">
                      {nov.contenido.substring(0, 120)}...
                    </p>
                    <Link to={`/novedades/${nov.id}`} className="text-emerald-400 font-bold mt-4 hover:text-emerald-300 transition-colors inline-flex items-center gap-1 text-sm">
                      Leer más &rarr;
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN 3: Vista Previa del Plantel */}
      <section className="py-16 bg-slate-950/50 backdrop-blur-sm border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-black text-white border-b-2 border-emerald-400 inline-block pb-2 drop-shadow">
              Nuestro Plantel
            </h2>
            <Link to="/jugadores" className="text-emerald-400 hover:text-emerald-300 font-bold text-sm flex items-center gap-1">
              Ver todos &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {jugadores.map((jug, i) => (
              <motion.div
                key={jug.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={`/jugadores/${jug.id}`} className="block">
                  <div className="bg-slate-900/85 backdrop-blur-md rounded-2xl border border-white/10 hover:border-amarillo-dpm/60 transition-all duration-300 p-5 text-center shadow-xl text-white group cursor-pointer">
                    <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4 border-4 border-emerald-500/40 shadow-xl ring-4 ring-white/10 group-hover:ring-amarillo-dpm/40 transition-all">
                      <img 
                        src={jug.fotoUrl} 
                        alt={jug.nombre} 
                        className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500" 
                        onError={(e) => { (e.target as HTMLImageElement).src = '/images/jugador-5.png'; }}
                      />
                    </div>
                    <h3 className="text-lg font-black text-white group-hover:text-amarillo-dpm transition-colors truncate">{jug.nombre}</h3>
                    <p className="text-emerald-400 font-bold text-xs uppercase tracking-wider mt-1">{jug.posicion}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN 4: Tienda Oficial y Clima */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="flex-grow">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black text-white border-b-2 border-emerald-400 inline-block pb-2 drop-shadow">
                  Tienda Oficial
                </h2>
                <Link to="/tienda" className="text-emerald-400 hover:text-emerald-300 font-bold text-sm">
                  Ver tienda &rarr;
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {productos.map((prod, i) => (
                  <motion.div key={prod.id} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: i * 0.1 }}>
                    <div className="bg-slate-900/85 backdrop-blur-md rounded-2xl border border-white/10 hover:border-emerald-500/50 transition-all p-5 text-center shadow-xl flex flex-col justify-between h-full group">
                      <div className="w-full h-40 flex items-center justify-center p-2 mb-4 bg-slate-950/50 rounded-xl">
                        <img 
                          src={prod.imagenUrl} 
                          alt={prod.nombre} 
                          className="max-h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform" 
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-base truncate">{prod.nombre}</h3>
                        <p className="text-xl font-black text-amarillo-dpm font-mono my-2">
                          {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(prod.precio)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Widget del Clima */}
            <div className="md:w-80 flex-shrink-0">
              <h2 className="text-xl font-black text-white mb-4">Clima en Puerto Montt</h2>
              <div className="p-6 bg-gradient-to-br from-azul-dpm via-slate-900 to-slate-950 rounded-2xl border border-sky-400/30 text-white text-center shadow-2xl h-full flex flex-col justify-center">
                {weather ? (
                  <div>
                    <div className="text-5xl font-black mb-2 text-sky-300 drop-shadow">{weather.temperature}°C</div>
                    <p className="text-base text-slate-200 font-medium">Viento: {weather.windspeed} km/h</p>
                    <p className="mt-4 text-xs font-bold text-emerald-400 uppercase tracking-widest">Estadio Chinquihue</p>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">Cargando clima...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 5: Hazte Socio y Vive la Pasión */}
      <section className="py-16 bg-gradient-to-r from-azul-dpm via-slate-900 to-azul-dpm text-white relative overflow-hidden border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl space-y-4">
            <span className="text-xs font-black uppercase tracking-widest text-amarillo-dpm bg-amarillo-dpm/20 px-3 py-1 rounded-full border border-amarillo-dpm/40">
              Comunidad Oficial
            </span>
            <h2 className="text-3xl sm:text-4xl font-black">Hazte Socio y Obtén Tu Carnet Digital</h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Entradas liberadas a los partidos en Chinquihue, descuentos en Subway, Pastelería Dolly, Cugat y más de 10 comercios de la ciudad.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Link 
              to="/socios" 
              className="bg-amarillo-dpm hover:bg-yellow-400 text-slate-950 font-black px-8 py-4 rounded-2xl shadow-xl shadow-amarillo-dpm/20 transition-transform transform hover:-translate-y-1 inline-block"
            >
              Conocer Planes y Beneficios &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* SECCIÓN 6: Mascota Oficial "Chinquihuin" y DPM TV */}
      <section className="py-16 bg-slate-950/60 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            
            {/* Tarjeta Mascota Chinquihuin */}
            <div className="rounded-3xl bg-gradient-to-br from-azul-dpm to-slate-900 text-white p-8 sm:p-10 shadow-xl border border-white/10 flex flex-col sm:flex-row gap-6 items-center">
              <div className="w-32 h-32 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center p-3 shrink-0 overflow-hidden shadow-inner">
                <img 
                  src="https://dpmchile.cl/wp-content/uploads/2026/05/WhatsApp-Image-2026-05-28-at-22.30.44-2.webp" 
                  alt="Chinquihuin Mascota DPM" 
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="space-y-3 text-center sm:text-left">
                <span className="text-[11px] font-bold uppercase tracking-widest text-amarillo-dpm">Símbolo del Club</span>
                <h3 className="text-2xl font-black">Conoce a Chinquihuin</h3>
                <p className="text-xs sm:text-sm text-gray-300">
                  El simpático lobo marino que alienta sin descanso en el Estadio Chinquihue y alegra a toda la familia albiverde.
                </p>
                <a 
                  href="https://www.instagram.com/chinquihuin/" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-block text-xs font-bold text-amarillo-dpm hover:underline pt-1"
                >
                  Seguir en Instagram @chinquihuin &rarr;
                </a>
              </div>
            </div>

            {/* DPM TV / Contenido Audiovisual y Highlights TNT Sports */}
            <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-8 shadow-xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-widest text-red-500 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20 flex items-center gap-1.5">
                  <FaYoutube className="text-red-500" />
                  DPM TV & TNT Sports
                </span>
                <a 
                  href="https://www.youtube.com/@deportespuertomonttoficial" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-xs font-bold text-red-400 hover:underline inline-flex items-center gap-1"
                >
                  Canal Oficial &rarr;
                </a>
              </div>
              <div>
                <h3 className="text-2xl font-black">Resúmenes y Goles en Video</h3>
                <p className="text-xs sm:text-sm text-gray-300 mt-1">
                  Revive las mejores jugadas de TNT Sports Chile, entrevistas exclusivas y la fiesta en Chinquihue sin salir del sitio.
                </p>
              </div>

              {/* Lista interactiva de videos oficiales con reproducción modal */}
              <div className="space-y-2.5 pt-1">
                {dpmTvVideos.map((vid) => (
                  <div 
                    key={vid.id}
                    onClick={() => setActiveVideoModal({ id: vid.id, titulo: vid.titulo })}
                    className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-950/70 hover:bg-slate-950 border border-white/5 hover:border-red-500/40 cursor-pointer transition-all group"
                  >
                    <div className="relative w-24 h-14 rounded-xl overflow-hidden shrink-0 bg-slate-800 border border-white/10">
                      <img 
                        src={`https://img.youtube.com/vi/${vid.id}/hqdefault.jpg`} 
                        alt={vid.titulo}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                        <div className="w-6 h-6 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                          <FaPlay className="text-[9px] ml-0.5" />
                        </div>
                      </div>
                      <span className="absolute bottom-1 right-1 text-[8px] font-bold bg-black/80 px-1 rounded text-white">{vid.duracion}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 block">{vid.categoria}</span>
                      <h4 className="text-xs font-bold text-white group-hover:text-red-300 transition-colors line-clamp-2 leading-snug">
                        {vid.titulo}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECCIÓN 7: Patrocinadores Oficiales del Velero */}
      <section className="py-12 bg-slate-950/80 border-t border-white/10 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <p className="text-xs uppercase font-extrabold tracking-widest text-gray-400">
            Patrocinadores Oficiales
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-85">
            <span className="text-sm font-black text-white tracking-wider">CECINAS LLANQUIHUE</span>
            <span className="text-sm font-black text-white tracking-wider">OXXEAN</span>
            <span className="text-sm font-black text-white tracking-wider">NACHIPA</span>
            <span className="text-sm font-black text-white tracking-wider">ANDES SALUD</span>
            <span className="text-sm font-black text-white tracking-wider">SALMOVAC</span>
            <span className="text-sm font-black text-white tracking-wider">TICKETPLUS</span>
          </div>
        </div>
      </section>

      {/* MODAL REPRODUCTOR DE YOUTUBE INTERACTIVO */}
      {activeVideoModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setActiveVideoModal(null)}
        >
          <div 
            className="bg-slate-900 border border-white/20 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-slate-950">
              <div className="flex items-center gap-2.5 min-w-0 pr-4">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse shrink-0" />
                <h3 className="font-bold text-white text-sm sm:text-base truncate">{activeVideoModal.titulo}</h3>
              </div>
              <button 
                onClick={() => setActiveVideoModal(null)} 
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition text-lg cursor-pointer"
                title="Cerrar reproductor"
              >
                <FaTimes />
              </button>
            </div>
            <div className="relative pt-[56.25%] w-full bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideoModal.id}?autoplay=1&rel=0`}
                title={activeVideoModal.titulo}
                className="absolute inset-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-4 bg-slate-950/90 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Transmisión Oficial en Video HD (1080p)
              </span>
              <a 
                href={`https://www.youtube.com/watch?v=${activeVideoModal.id}`} 
                target="_blank" 
                rel="noreferrer" 
                className="text-red-400 hover:underline flex items-center gap-1 font-semibold"
              >
                Abrir en YouTube &rarr;
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
