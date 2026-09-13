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
import { Card } from '../components/ui/Card';
import { Novedad, Jugador, Producto } from '../types';
import api from '../api/axiosConfig';

export const Home = () => {
  const [novedades, setNovedades] = useState<Novedad[]>([]);
  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    // Petición paralela para optimizar tiempos de carga
    const fetchHomeData = async () => {
      try {
        const [novRes, jugRes, prodRes] = await Promise.all([
          // Si falla la API, inyectamos Fallback Data con imágenes reales locales del club
          api.get('/novedades').catch(() => ({ data: [
            { id: '1', titulo: 'Deportes Puerto Montt denuncia robo de balones', contenido: '35 balones profesionales de fútbol fueron sustraídos desde el Estadio Bicentenario de Chinquihue...', imagenUrl: '/images/robo-balon.jpg', fechaPublicacion: '06-06-2025', autorNombre: 'Comunicaciones DPM' },
            { id: '2', titulo: 'Nueva Sala de acondicionamiento físico en el Chinquihue', contenido: 'Se trata de una moderna sala de musculación para el plantel profesional...', imagenUrl: '/images/novedades1.jpg', fechaPublicacion: '11-03-2025', autorNombre: 'Comunicaciones DPM' },
            { id: '3', titulo: 'Gran debut 2025: 4 a cero a Brujas de Salamanca', contenido: 'Con un contundente triunfo debutó Deportes Puerto Montt en la Segunda División...', imagenUrl: '/images/novedad3.jpeg', fechaPublicacion: '03-07-2025', autorNombre: 'Comunicaciones DPM' },
          ]})),
          api.get('/jugadores').catch(() => ({ data: [
            { id: '1', nombre: 'Kevin Catalán', posicion: 'Portero', edad: 27, nacionalidad: 'Chileno', fotoUrl: '/images/jugador-5.png', descripcion: 'Muro en el arco con reflejos felinos.' },
            { id: '2', nombre: 'Carlos Rodríguez', posicion: 'Volante', edad: 32, nacionalidad: 'Chileno', fotoUrl: '/images/arnaldo-castillo-850x400.jpg', descripcion: 'Líder en el mediocampo y orden táctico.' },
            { id: '3', nombre: 'Vicente Yáñez', posicion: 'Defensa', edad: 29, nacionalidad: 'Chileno', fotoUrl: '/images/jugadores-1.png', descripcion: 'Velocidad y compromiso defensivo.' },
            { id: '4', nombre: 'Maximiliano Riveros', posicion: 'Volante', edad: 29, nacionalidad: 'Chileno', fotoUrl: '/images/download (1).jpg', descripcion: 'Líder silencioso y gran juego de pies.' }
          ]})),
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

      {/* SECCIÓN 2: Últimas Novedades / Noticias */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-azul-dpm mb-8 text-center border-b-2 border-verde-dpm inline-block pb-2">Últimas Novedades</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {novedades.map((nov, i) => (
              <motion.div
                key={nov.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }} // Anima cuando entra al viewport
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
              >
                <Card className="h-full flex flex-col">
                  <img src={nov.imagenUrl} alt={nov.titulo} className="w-full h-48 object-cover" />
                  <div className="p-4 flex flex-col flex-grow">
                    <p className="text-xs text-gray-500 mb-2">{nov.fechaPublicacion}</p>
                    <h3 className="text-xl font-bold mb-2">{nov.titulo}</h3>
                    <p className="text-gray-600 flex-grow">{nov.contenido.substring(0, 100)}...</p>
                    <Link to={`/novedades/${nov.id}`} className="text-verde-dpm font-bold mt-4 hover:underline">
                      Leer más &rarr;
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN 3: Vista Previa del Plantel */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-azul-dpm border-b-2 border-verde-dpm inline-block pb-2">Nuestro Plantel</h2>
            <Link to="/jugadores" className="text-verde-dpm font-bold hover:underline">Ver todos</Link>
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
                <Card className="text-center p-4">
                  <img src={jug.fotoUrl} alt={jug.nombre} className="w-32 h-32 mx-auto rounded-full object-cover mb-4 border-4 border-gray-100" />
                  <h3 className="text-lg font-bold">{jug.nombre}</h3>
                  <p className="text-verde-dpm font-medium">{jug.posicion}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN 4: Tienda Oficial y Clima */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="flex-grow">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-azul-dpm border-b-2 border-verde-dpm inline-block pb-2">Tienda Oficial</h2>
                <Link to="/tienda" className="text-verde-dpm font-bold hover:underline">Ver tienda</Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {productos.map((prod, i) => (
                  <motion.div key={prod.id} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: i * 0.1 }}>
                    <Card className="p-4 text-center">
                      <img src={prod.imagenUrl} alt={prod.nombre} className="w-full h-40 object-contain mb-4" />
                      <h3 className="font-bold text-gray-800">{prod.nombre}</h3>
                      <p className="text-xl font-bold text-verde-dpm my-2">
                        {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(prod.precio)}
                      </p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Widget del Clima */}
            <div className="md:w-80 flex-shrink-0">
              <h2 className="text-xl font-bold text-azul-dpm mb-4">Clima en Puerto Montt</h2>
              <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-700 text-white text-center h-full flex flex-col justify-center">
                {weather ? (
                  <div>
                    <div className="text-5xl font-bold mb-2">{weather.temperature}°C</div>
                    <p className="text-lg">Viento: {weather.windspeed} km/h</p>
                    <p className="mt-4 text-sm opacity-80">Estadio Chinquihue</p>
                  </div>
                ) : (
                  <p>Cargando clima...</p>
                )}
              </Card>
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
      <section className="py-16 bg-white/90 backdrop-blur-sm">
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

            {/* DPM TV / Contenido Audiovisual */}
            <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-10 shadow-xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-widest text-red-500 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20">
                  Canal Oficial
                </span>
                <span className="text-xs text-gray-400">DPM Chile TV</span>
              </div>
              <h3 className="text-2xl font-black">DPM Chile TV & Resúmenes</h3>
              <p className="text-xs sm:text-sm text-gray-300">
                Revive los goles, entrevistas exclusivas al cuerpo técnico y la cobertura de cada fecha de la Liga de Ascenso.
              </p>
              <div className="pt-2">
                <a 
                  href="https://www.youtube.com/@deportespuertomonttoficial" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors inline-flex items-center gap-2"
                >
                  Ver Videos en YouTube &rarr;
                </a>
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
    </div>
  );
};
