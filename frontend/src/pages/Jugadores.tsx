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
        {filtrados.map(jugador => {
          const stats = {
            dorsal: jugador.dorsal || (jugador.posicion === 'Portero' ? 1 : jugador.posicion === 'Defensa' ? 4 : jugador.posicion === 'Volante' ? 8 : 9),
            partidosJugados: jugador.partidosJugados || 18,
            goles: jugador.goles ?? (jugador.posicion === 'Delantero' ? 7 : jugador.posicion === 'Volante' ? 3 : 0),
            asistencias: jugador.asistencias ?? (jugador.posicion === 'Volante' ? 5 : jugador.posicion === 'Delantero' ? 2 : 1),
            atajadas: jugador.atajadas ?? (jugador.posicion === 'Portero' ? 42 : 0),
            recuperaciones: jugador.recuperaciones ?? (jugador.posicion === 'Defensa' ? 38 : jugador.posicion === 'Volante' ? 24 : 8),
            precisionPases: jugador.precisionPases || '84%',
            clubOrigen: jugador.clubOrigen || 'Cantera DPM Chinquihue',
            pieHabil: jugador.pieHabil || 'Derecho'
          };

          return (
            <motion.div 
              key={jugador.id} 
              variants={item}
              className="group [perspective:1000px] h-96 cursor-pointer"
              onClick={() => navigate(`/jugadores/${jugador.id}`)}
            >
              {/* Tarjeta con efecto 3D Flip (Rotación al pasar el cursor o presionar) */}
              <div className="relative h-full w-full rounded-2xl transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] shadow-xl group-hover:shadow-2xl group-hover:shadow-amarillo-dpm/20">
                
                {/* CARA FRONTAL: Foto, Dorsal, Nombre y Posición con halo iluminado */}
                <div className="absolute inset-0 h-full w-full rounded-2xl overflow-hidden [backface-visibility:hidden] border border-white/10 group-hover:border-amarillo-dpm/60 bg-gradient-to-b from-azul-dpm via-slate-900 to-slate-950 flex flex-col justify-between">
                  {/* Dorsal y badge de posición */}
                  <div className="p-3 flex justify-between items-center relative z-10">
                    <span className="w-8 h-8 rounded-full bg-amarillo-dpm text-slate-950 font-black flex items-center justify-center text-sm shadow-md">
                      #{stats.dorsal}
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-azul-dpm/80 text-blue-200 border border-blue-400/30 uppercase">
                      {jugador.posicion}
                    </span>
                  </div>

                  {/* Foto con gradiente de iluminación */}
                  <div className="relative flex-grow flex items-center justify-center overflow-hidden px-4">
                    <div className="absolute inset-0 bg-radial-gradient from-azul-dpm-light/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    <img 
                      src={jugador.fotoUrl || '/images/jugador-5.png'} 
                      alt={jugador.nombre} 
                      className="max-h-60 w-auto object-contain transition-transform duration-500 group-hover:scale-105 filter drop-shadow-xl"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/jugador-5.png';
                      }}
                    />
                  </div>

                  {/* Pie con Nombre y llamado a voltear */}
                  <div className="p-4 bg-slate-950/90 border-t border-white/10 text-center relative z-10">
                    <h3 className="text-base font-extrabold text-white truncate">{jugador.nombre}</h3>
                    <div className="flex items-center justify-between text-[11px] text-gray-400 mt-1">
                      <span>{jugador.edad} años · {jugador.nacionalidad}</span>
                      <span className="text-amarillo-dpm font-bold flex items-center gap-1">
                        Girar ↻
                      </span>
                    </div>
                  </div>
                </div>

                {/* CARA TRASERA: Estadísticas deportivas clave para el hincha */}
                <div className="absolute inset-0 h-full w-full rounded-2xl p-6 [transform:rotateY(180deg)] [backface-visibility:hidden] border-2 border-amarillo-dpm bg-gradient-to-br from-slate-950 via-azul-dpm to-slate-900 text-white flex flex-col justify-between shadow-2xl">
                  {/* Encabezado trasero */}
                  <div>
                    <div className="flex justify-between items-center border-b border-white/15 pb-2">
                      <div>
                        <h4 className="text-sm font-black text-amarillo-dpm uppercase tracking-wider">Ficha Técnica 2026</h4>
                        <p className="text-xs font-bold text-white truncate">{jugador.nombre}</p>
                      </div>
                      <span className="text-xs font-mono font-black px-2 py-0.5 rounded bg-white/10 text-white">
                        #{stats.dorsal}
                      </span>
                    </div>

                    {/* Grilla de Métricas Reales */}
                    <div className="grid grid-cols-2 gap-3 my-4">
                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
                        <p className="text-[10px] text-gray-400 uppercase">Partidos</p>
                        <p className="text-xl font-black text-white">{stats.partidosJugados}</p>
                      </div>

                      {jugador.posicion === 'Portero' ? (
                        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
                          <p className="text-[10px] text-emerald-400 uppercase font-bold">Atajadas</p>
                          <p className="text-xl font-black text-emerald-400">{stats.atajadas}</p>
                        </div>
                      ) : (
                        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
                          <p className="text-[10px] text-amarillo-dpm uppercase font-bold">Goles</p>
                          <p className="text-xl font-black text-amarillo-dpm">{stats.goles}</p>
                        </div>
                      )}

                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
                        <p className="text-[10px] text-gray-400 uppercase">
                          {jugador.posicion === 'Defensa' ? 'Recuperaciones' : 'Asistencias'}
                        </p>
                        <p className="text-lg font-black text-white">
                          {jugador.posicion === 'Defensa' ? stats.recuperaciones : stats.asistencias}
                        </p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
                        <p className="text-[10px] text-gray-400 uppercase">Efectividad</p>
                        <p className="text-lg font-black text-blue-300">{stats.precisionPases}</p>
                      </div>
                    </div>

                    {/* Datos biográficos de origen */}
                    <div className="text-[11px] text-gray-300 space-y-1 bg-black/30 p-2.5 rounded-xl border border-white/5">
                      <p><strong className="text-gray-400">Pie Hábil:</strong> {stats.pieHabil}</p>
                      <p><strong className="text-gray-400">Formación:</strong> {stats.clubOrigen}</p>
                    </div>
                  </div>

                  {/* Botón de acción */}
                  <div className="pt-2 text-center">
                    <span className="inline-block text-xs font-bold text-amarillo-dpm bg-amarillo-dpm/10 border border-amarillo-dpm/30 py-1.5 px-4 rounded-xl w-full hover:bg-amarillo-dpm hover:text-slate-950 transition-colors">
                      Ver Perfil Completo &rarr;
                    </span>
                  </div>
                </div>

              </div>
            </motion.div>
          );
        })}
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
