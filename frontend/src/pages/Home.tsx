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
          // Si falla la API, inyectamos Fallback Data temporal
          api.get('/novedades').catch(() => ({ data: [
            { id: '1', titulo: '¡Gran victoria en casa!', contenido: 'El equipo demostró su jerarquía...', imagenUrl: 'https://via.placeholder.com/400x250', fechaPublicacion: '2025-01-10', autorNombre: 'Admin' },
            { id: '2', titulo: 'Nuevos abonos disponibles', contenido: 'Asegura tu lugar en el Chinquihue...', imagenUrl: 'https://via.placeholder.com/400x250', fechaPublicacion: '2025-01-08', autorNombre: 'Admin' },
            { id: '3', titulo: 'Amistoso confirmado', contenido: 'Nos preparamos para la temporada...', imagenUrl: 'https://via.placeholder.com/400x250', fechaPublicacion: '2025-01-05', autorNombre: 'Admin' },
          ]})),
          api.get('/jugadores').catch(() => ({ data: [
            { id: '1', nombre: 'Juan Pérez', posicion: 'Delantero', edad: 25, nacionalidad: 'Chileno', fotoUrl: 'https://via.placeholder.com/300', descripcion: 'Goleador' },
            { id: '2', nombre: 'Carlos Soto', posicion: 'Portero', edad: 28, nacionalidad: 'Chileno', fotoUrl: 'https://via.placeholder.com/300', descripcion: 'Seguro' },
            { id: '3', nombre: 'Luis Martínez', posicion: 'Defensa', edad: 30, nacionalidad: 'Argentino', fotoUrl: 'https://via.placeholder.com/300', descripcion: 'Muralla' },
            { id: '4', nombre: 'Pedro Gómez', posicion: 'Volante', edad: 22, nacionalidad: 'Chileno', fotoUrl: 'https://via.placeholder.com/300', descripcion: 'Creativo' }
          ]})),
          api.get('/productos').catch(() => ({ data: [
            { id: '1', nombre: 'Camiseta Oficial 2025', precio: 35000, imagenUrl: 'https://via.placeholder.com/200', stock: 10, categoria: 'Indumentaria' },
            { id: '2', nombre: 'Gorro DPM', precio: 12000, imagenUrl: 'https://via.placeholder.com/200', stock: 20, categoria: 'Accesorios' },
            { id: '3', nombre: 'Bufanda Albiverde', precio: 8000, imagenUrl: 'https://via.placeholder.com/200', stock: 15, categoria: 'Accesorios' },
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
      {/* SECCIÓN 1: Hero Header con imagen de fondo (Estadio) */}
      <section className="relative bg-gradient-to-br from-verde-dpm to-azul-dpm text-white py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/4/4b/Estadio_Chinquihue_2.jpg')] bg-cover bg-center"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-extrabold mb-4"
          >
            Club Deportes Puerto Montt
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xl md:text-3xl text-amarillo-dpm font-bold mb-8"
          >
            ¡Vamos Puerto Montt!
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex justify-center gap-4"
          >
            <Link to="/jugadores" className="bg-amarillo-dpm text-azul-dpm font-bold py-3 px-8 rounded-full hover:bg-white transition shadow-lg">
              Ver Plantel
            </Link>
            <Link to="/tienda" className="bg-white text-verde-dpm font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition shadow-lg">
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
    </div>
  );
};
