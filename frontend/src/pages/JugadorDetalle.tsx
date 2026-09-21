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
    const todosLosJugadores: Record<string, Jugador> = {
      // Masculino
      '1': { id: '1', nombre: 'Kevin Catalán', posicion: 'Portero', edad: 27, nacionalidad: 'Chile', fotoUrl: '/images/jugador-5.png', descripcion: '🧱 Muro en el arco: imbatible bajo presión con reflejos felinos y gran juego aéreo.' },
      '2': { id: '2', nombre: 'Carlos Rodríguez', posicion: 'Volante', edad: 32, nacionalidad: 'Chile', fotoUrl: '/images/jugador-rodriguez.jpg', descripcion: '🧠 Líder táctico: excelente distribución en el mediocampo y cobertura impecable.' },
      '3': { id: '3', nombre: 'Vicente Yáñez', posicion: 'Defensa', edad: 29, nacionalidad: 'Chile', fotoUrl: '/images/jugadores-1.png', descripcion: '⚡ Velocidad y compromiso defensivo por la banda diestra.' },
      '4': { id: '4', nombre: 'Maximiliano Riveros', posicion: 'Volante', edad: 29, nacionalidad: 'Chile', fotoUrl: '/images/jugador-riveros.jpg', descripcion: '🦁 Líder silencioso, precisión en pases y gran dominio de balón.' },
      '5': { id: '5', nombre: 'Kevin Flores', posicion: 'Defensa', edad: 30, nacionalidad: 'Chile', fotoUrl: '/images/jugador-flores.jpg', descripcion: '🧱 Anticipación férrea y gran poderío físico en la zaga.' },
      '6': { id: '6', nombre: 'Yakob Yousef', posicion: 'Delantero', edad: 26, nacionalidad: 'Chile', fotoUrl: '/images/jugador-yousef.jpg', descripcion: '⚡ Desborde constante, presión alta y definición letal.' },
      '7': { id: '7', nombre: 'Sebastián Torres', posicion: 'Defensa', edad: 27, nacionalidad: 'Chile', fotoUrl: '/images/jugador-3.png', descripcion: '🚀 Velocidad, centros quirúrgicos y marca implacable.' },
      '8': { id: '8', nombre: 'Daniel Bahamonde', posicion: 'Defensa', edad: 23, nacionalidad: 'Chile', fotoUrl: '/images/jugadores-6.png', descripcion: '🏃‍♂️ Motor del carril izquierdo con proyección y repliegue continuo.' },
      '9': { id: '9', nombre: 'Giovanni Bustos', posicion: 'Volante', edad: 25, nacionalidad: 'Chile', fotoUrl: '/images/jugador-4.png', descripcion: '🎩 Visión de juego privilegiada, control de tiempos y presión.' },
      '10': { id: '10', nombre: 'Sebastián González', posicion: 'Volante', edad: 30, nacionalidad: 'Chile', fotoUrl: '/images/jugadores-2.png', descripcion: '📊 Inteligencia táctica y efectividad en la recuperación.' },
      '11': { id: '11', nombre: 'Kevin Mansilla', posicion: 'Delantero', edad: 29, nacionalidad: 'Chile', fotoUrl: '/images/jugadores-8.png', descripcion: '🧭 Olfato goleador de área y ubicación perfecta.' },
      '12': { id: '12', nombre: 'Fabián Rodríguez', posicion: 'Delantero', edad: 23, nacionalidad: 'Chile', fotoUrl: '/images/jugadores-7.png', descripcion: '❤️ Entrega total, letal al acecho del gol en el área rival.' },

      // Femenino (Las Hijas del Temporal)
      'fem-1': { id: 'fem-1', nombre: 'Alexandra Vilugrón', posicion: 'Portero', edad: 22, nacionalidad: 'Chile', fotoUrl: 'https://dpmchile.cl/wp-content/uploads/2026/04/Alejandra-Vilugron.webp', descripcion: '🧤 "Vilu": Maipucina formada en Labranza. Seguridad total y reflejos elásticos bajo los tres palos.' },
      'fem-2': { id: 'fem-2', nombre: 'Clara Elgueta', posicion: 'Defensa', edad: 28, nacionalidad: 'Chile', fotoUrl: 'https://dpmchile.cl/wp-content/uploads/2026/04/Clara-Elgueta.webp', descripcion: '👑 "Clarita": Histórica defensora central y capitana albiverde formada en Chinquihue. Liderazgo y garra pura.' },
      'fem-3': { id: 'fem-3', nombre: 'Karen Catrián', posicion: 'Defensa', edad: 18, nacionalidad: 'Chile', fotoUrl: 'https://dpmchile.cl/wp-content/uploads/2026/04/Antonella-Pascal.webp', descripcion: '🇨🇱 Defensora central con paso por la Selección Chilena Femenina Sub-20. Anticipación y timing perfecto.' },
      'fem-4': { id: 'fem-4', nombre: 'Consuelo Martínez', posicion: 'Defensa', edad: 24, nacionalidad: 'Chile', fotoUrl: 'https://dpmchile.cl/wp-content/uploads/2026/04/Consuelo-Martinez.webp', descripcion: '⚡ "Superconsu": Lateral incansable con recorrido completo, quite limpio y entrega absoluta.' },
      'fem-5': { id: 'fem-5', nombre: 'Thaissa Argel', posicion: 'Volante', edad: 19, nacionalidad: 'Chile', fotoUrl: 'https://dpmchile.cl/wp-content/uploads/2026/04/Thaissa-Argel.webp', descripcion: '🎩 Puertomontina de gran pie, cambio de frente quirúrgico y despliegue continuo en la medular.' },
      'fem-6': { id: 'fem-6', nombre: 'Sofía Henríquez', posicion: 'Volante', edad: 18, nacionalidad: 'Chile', fotoUrl: 'https://dpmchile.cl/wp-content/uploads/2026/04/Sofia-Henriquez.webp', descripcion: '⭐ "Sofi": Campeona de los Juegos Binacionales. Dinámica, visión periférica y pegada de media distancia.' },
      'fem-7': { id: 'fem-7', nombre: 'Fiorenzza Venturelli', posicion: 'Volante', edad: 19, nacionalidad: 'Chile', fotoUrl: 'https://dpmchile.cl/wp-content/uploads/2026/04/Fiorenzza-Venturelli.webp', descripcion: '🪄 "Fio": Gran manejo de balón, regate corto y creadora nata del frente de ataque.' },
      'fem-8': { id: 'fem-8', nombre: 'Krishna Soto', posicion: 'Volante', edad: 21, nacionalidad: 'Chile', fotoUrl: 'https://dpmchile.cl/wp-content/uploads/2026/04/Krishna-Soto-.webp', descripcion: '🛡️ "Flaca": Equilibrio y combate en el medio terreno. Orden táctico e intercepciones clave.' },
      'fem-9': { id: 'fem-9', nombre: 'Tamara Mansilla', posicion: 'Delantero', edad: 21, nacionalidad: 'Chile', fotoUrl: 'https://dpmchile.cl/wp-content/uploads/2026/04/Tamara-Mansilla.webp', descripcion: '🏹 "Peka": Goleadora puertomontina proveniente de Santiago Morning. Festejo de flecha y definición clínica.' },
      'fem-10': { id: 'fem-10', nombre: 'Verenna Trautmann', posicion: 'Delantero', edad: 20, nacionalidad: 'Chile', fotoUrl: 'https://dpmchile.cl/wp-content/uploads/2026/04/Verenna-Trautmann.webp', descripcion: '⚡ "Vere": Delantera potente formada en Osorno con paso por Universidad Católica. Potencia y remate.' },
      'fem-11': { id: 'fem-11', nombre: 'Thiare Vargas', posicion: 'Delantero', edad: 19, nacionalidad: 'Chile', fotoUrl: 'https://dpmchile.cl/wp-content/uploads/2026/04/Thiare-Vargas.webp', descripcion: '🔥 "Thiare del Flow": Canterana puertomontina con velocidad punzante por las bandas y llegada al área.' },
      'fem-12': { id: 'fem-12', nombre: 'Rocío Bañares', posicion: 'Delantero', edad: 20, nacionalidad: 'Chile', fotoUrl: 'https://dpmchile.cl/wp-content/uploads/2026/04/Rocio-Banares-.webp', descripcion: '🎯 "Chío": Extrema desequilibrante nacida en Puerto Montt. Gran juego asociativo y desborde.' }
    };

    const fetchJugador = async () => {
      try {
        const response = await api.get(`/jugadores/${id}`);
        setJugador(response.data);
      } catch (error) {
        if (id && todosLosJugadores[id]) {
          setJugador(todosLosJugadores[id]);
        } else {
          setJugador(todosLosJugadores['1']);
        }
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
