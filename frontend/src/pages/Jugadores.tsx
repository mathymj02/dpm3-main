/**
 * ============================================================================
 * Archivo: Jugadores.tsx
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Lista a todos los jugadores del plantel con opciones de filtrado.
 * 
 * DECISIONES DE DISEÑO / UX:
 * - Dynamic Routing (Ruteo Dinámico): Cada tarjeta tiene un evento `onClick`
 *   que redirige a `/jugadores/:id`, permitiendo ver el detalle individual.
 * - Stagger Animation (Animación en cascada): Se utiliza `staggerChildren` de 
 *   Framer Motion en el contenedor. Esto hace que cada jugador aparezca uno 
 *   por uno con un ligero retraso, creando un efecto fluido de carga.
 * - Filtros rápidos (Posición): Una barra de botones (Tabs) para filtrar en
 *   memoria por "Portero", "Defensa", etc., brindando feedback inmediato.
 * ============================================================================
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Jugador } from '../types';
import api from '../api/axiosConfig';
import { Card } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';

export const Jugadores = () => {
  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('Todos');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJugadores = async () => {
      try {
        const response = await api.get('/jugadores');
        setJugadores(response.data);
      } catch (error) {
        // Datos oficiales de DPM con imágenes locales en caso de desconexión
        setJugadores([
          { id: '1', nombre: 'Kevin Catalán', posicion: 'Portero', edad: 27, nacionalidad: 'Chile', fotoUrl: '/images/jugador-5.png', descripcion: '🧱 Muro en el arco: imbatible bajo presión con reflejos felinos y gran juego aéreo.' },
          { id: '2', nombre: 'Carlos Rodríguez', posicion: 'Volante', edad: 32, nacionalidad: 'Chile', fotoUrl: '/images/arnaldo-castillo-850x400.jpg', descripcion: '🧠 Líder táctico: excelente distribución en el mediocampo y cobertura impecable.' },
          { id: '3', nombre: 'Vicente Yáñez', posicion: 'Defensa', edad: 29, nacionalidad: 'Chile', fotoUrl: '/images/jugadores-1.png', descripcion: '⚡ Velocidad y compromiso defensivo por la banda diestra.' },
          { id: '4', nombre: 'Maximiliano Riveros', posicion: 'Volante', edad: 29, nacionalidad: 'Chile', fotoUrl: '/images/download (1).jpg', descripcion: '🦁 Líder silencioso, precisión en pases y gran dominio de balón.' },
          { id: '5', nombre: 'Kevin Flores', posicion: 'Defensa', edad: 30, nacionalidad: 'Chile', fotoUrl: '/images/download.jpg', descripcion: '🧱 Anticipación férrea y gran poderío físico en la zaga.' },
          { id: '6', nombre: 'Yakob Yousef', posicion: 'Delantero', edad: 26, nacionalidad: 'Chile', fotoUrl: '/images/images (1).jpg', descripcion: '⚡ Desborde constante, presión alta y definición letal.' },
          { id: '7', nombre: 'Sebastián Torres', posicion: 'Defensa', edad: 27, nacionalidad: 'Chile', fotoUrl: '/images/jugador-3.png', descripcion: '🚀 Velocidad, centros quirúrgicos y marca implacable.' },
          { id: '8', nombre: 'Daniel Bahamonde', posicion: 'Defensa', edad: 23, nacionalidad: 'Chile', fotoUrl: '/images/jugadores-6.png', descripcion: '🏃‍♂️ Motor del carril izquierdo con proyección y repliegue continuo.' },
          { id: '9', nombre: 'Giovanni Bustos', posicion: 'Volante', edad: 25, nacionalidad: 'Chile', fotoUrl: '/images/jugador-4.png', descripcion: '🎩 Visión de juego privilegiada, control de tiempos y presión.' },
          { id: '10', nombre: 'Sebastián González', posicion: 'Volante', edad: 30, nacionalidad: 'Chile', fotoUrl: '/images/jugadores-2.png', descripcion: '📊 Inteligencia táctica y efectividad en la recuperación.' },
          { id: '11', nombre: 'Kevin Mansilla', posicion: 'Delantero', edad: 29, nacionalidad: 'Chile', fotoUrl: '/images/jugadores-8.png', descripcion: '🧭 Olfato goleador de área y ubicación perfecta.' },
          { id: '12', nombre: 'Fabián Rodríguez', posicion: 'Delantero', edad: 23, nacionalidad: 'Chile', fotoUrl: '/images/jugadores-7.png', descripcion: '❤️ Entrega total, letal al acecho del gol en el área rival.' }
        ]);
      } finally {
        setLoading(false); // Retira el spinner de carga al finalizar
      }
    };
    fetchJugadores();
  }, []);

  const posiciones = ['Todos', 'Portero', 'Defensa', 'Volante', 'Delantero'];
  
  // Lógica de filtrado en memoria (no requiere llamadas extra a la API)
  const filtrados = filtro === 'Todos' 
    ? jugadores 
    : jugadores.filter(j => j.posicion.toLowerCase() === filtro.toLowerCase());

  if (loading) return <Spinner />;

  // Configuraciones de Animación Framer Motion
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 } // Efecto cascada
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-azul-dpm mb-8 text-center">Nuestro Plantel</h1>
      
      {/* Botones de Filtro */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {posiciones.map(pos => (
          <button
            key={pos}
            onClick={() => setFiltro(pos)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filtro === pos 
                ? 'bg-verde-dpm text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {pos}
          </button>
        ))}
      </div>

      {/* Grilla animada */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
      >
        {filtrados.map(jugador => (
          <motion.div key={jugador.id} variants={item}>
            <Card onClick={() => navigate(`/jugadores/${jugador.id}`)}>
              <div className="aspect-w-3 aspect-h-4 bg-gray-100">
                <img 
                  src={jugador.fotoUrl || 'https://via.placeholder.com/300x400?text=No+Photo'} 
                  alt={jugador.nombre} 
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-xl font-bold text-gray-900">{jugador.nombre}</h3>
                <p className="text-verde-dpm font-semibold mb-2">{jugador.posicion}</p>
                <div className="flex justify-center gap-4 text-sm text-gray-500">
                  <span>{jugador.edad} años</span>
                  <span>{jugador.nacionalidad}</span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      
      {/* Empty State: si un filtro no arroja resultados */}
      {filtrados.length === 0 && (
        <div className="text-center text-gray-500 py-10">
          No hay jugadores para esta posición.
        </div>
      )}
    </div>
  );
};
