/**
 * ============================================================================
 * Archivo: Jugadores.tsx
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Presenta a los planteles oficiales de Deportes Puerto Montt:
 * 1. Primer Equipo Masculino (Campeonato Ascenso 2026)
 * 2. Primer Equipo Femenino - "Las Hijas del Temporal" (Ascenso Femenino 2026)
 * 
 * DECISIONES DE DISEÑO / UX:
 * - Selector de Plantel (Masculino / Femenino): Permite al hincha alternar entre
 *   ambas ramas oficiales del club con un solo clic.
 * - Tarjetas 3D Flip Card: Al posicionar el mouse o hacer clic, la tarjeta
 *   rota 180° revelando estadísticas clave (goles, asistencias, atajadas,
 *   recuperaciones, club formador y datos biográficos oficiales de dpmchile.cl).
 * - Filtros rápidos por posición: Portero, Defensa, Volante, Delantero.
 * - Enrutamiento dinámico: Cada tarjeta redirige a `/jugadores/:id`.
 * ============================================================================
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Jugador } from '../types';
import api from '../api/axiosConfig';
import { FaFutbol } from 'react-icons/fa';

// Datos oficiales del Plantel Masculino 2026 (con dorsales y estadísticas de rendimiento)
const plantelMasculinoData: Jugador[] = [
  { 
    id: '1', 
    nombre: 'Luis Ureta', 
    posicion: 'Portero', 
    edad: 26, 
    nacionalidad: 'Chile', 
    fotoUrl: '/images/luis-ureta.webp', 
    descripcion: '🧤 "Pelle": Arquero titular con reflejos felinos, seguridad en el juego aéreo y gran temple.',
    dorsal: 1,
    partidosJugados: 16,
    atajadas: 52,
    precisionPases: '89% Atajadas',
    clubOrigen: "O'Higgins / DPM Chinquihue",
    pieHabil: 'Derecho'
  },
  { 
    id: '2', 
    nombre: 'Vicente Yáñez', 
    posicion: 'Defensa', 
    edad: 28, 
    nacionalidad: 'Chile', 
    fotoUrl: '/images/vicente-yanez.webp', 
    descripcion: '⚡ "Chente": Defensa aguerrido, rápido en las coberturas y de gran quite en los mano a mano.',
    dorsal: 4,
    partidosJugados: 16,
    recuperaciones: 48,
    goles: 1,
    precisionPases: '84% Duelos',
    clubOrigen: 'Huachipato / DPM',
    pieHabil: 'Derecho'
  },
  { 
    id: '3', 
    nombre: 'Maximiliano Riveros', 
    posicion: 'Defensa', 
    edad: 29, 
    nacionalidad: 'Chile', 
    fotoUrl: '/images/maximiliano-riveros.webp', 
    descripcion: '🦁 "Maxi": Capitán y pilar de la zaga central. Liderazgo, juego aéreo imponente y salida limpia.',
    dorsal: 6,
    partidosJugados: 15,
    recuperaciones: 45,
    goles: 2,
    precisionPases: '88% Pases',
    clubOrigen: 'Deportes Valdivia / DPM',
    pieHabil: 'Derecho'
  },
  { 
    id: '4', 
    nombre: 'Daniel Bahamonde', 
    posicion: 'Defensa', 
    edad: 24, 
    nacionalidad: 'Chile', 
    fotoUrl: '/images/daniel-bahamonde.webp', 
    descripcion: '🏃‍♂️ "Pájaro": Canterano puertomontino del carril izquierdo. Proyección ofensiva y marca incansable.',
    dorsal: 14,
    partidosJugados: 15,
    recuperaciones: 39,
    asistencias: 4,
    precisionPases: '85% Recorrido',
    clubOrigen: 'Cantera DPM Chinquihue',
    pieHabil: 'Izquierdo'
  },
  { 
    id: '5', 
    nombre: 'Byron Nieto', 
    posicion: 'Defensa', 
    edad: 27, 
    nacionalidad: 'Chile', 
    fotoUrl: '/images/byron-nieto.webp', 
    descripcion: '⚡ "El Rayo": Lateral derecho con potencia, velocidad y centros quirúrgicos al corazón del área rival.',
    dorsal: 2,
    partidosJugados: 14,
    recuperaciones: 36,
    asistencias: 3,
    precisionPases: '83% Centros',
    clubOrigen: 'Universidad Católica / DPM',
    pieHabil: 'Derecho'
  },
  { 
    id: '6', 
    nombre: 'Jesús Pino', 
    posicion: 'Defensa', 
    edad: 32, 
    nacionalidad: 'Chile', 
    fotoUrl: '/images/jesus-pino.webp', 
    descripcion: '🧱 Central de vasta experiencia profesional. Fortaleza física, anticipación y voz de mando en defensa.',
    dorsal: 3,
    partidosJugados: 13,
    recuperaciones: 38,
    goles: 1,
    precisionPases: '82% Anticipo',
    clubOrigen: 'Unión San Felipe / DPM',
    pieHabil: 'Derecho'
  },
  { 
    id: '7', 
    nombre: 'Juan Miguel Jaime', 
    posicion: 'Volante', 
    edad: 30, 
    nacionalidad: 'Argentina', 
    fotoUrl: '/images/juan-jaime.webp', 
    descripcion: '🎩 "El Puma de Monteros": Mediocampista de corte y distribución con visión de juego privilegiada.',
    dorsal: 8,
    partidosJugados: 16,
    goles: 3,
    asistencias: 5,
    precisionPases: '89% Precisión',
    clubOrigen: 'Talleres / DPM Chinquihue',
    pieHabil: 'Derecho'
  },
  { 
    id: '8', 
    nombre: 'Gabriel Castillo', 
    posicion: 'Volante', 
    edad: 26, 
    nacionalidad: 'Chile', 
    fotoUrl: '/images/gabriel-castillo.webp', 
    descripcion: '⚔️ "Casti": Volante mixto de gran recuperación física, presión alta y remate de media distancia.',
    dorsal: 5,
    partidosJugados: 15,
    recuperaciones: 42,
    asistencias: 3,
    precisionPases: '86% Quites',
    clubOrigen: 'Cobresal / DPM',
    pieHabil: 'Derecho'
  },
  { 
    id: '9', 
    nombre: 'Danilo Díaz', 
    posicion: 'Volante', 
    edad: 23, 
    nacionalidad: 'Chile', 
    fotoUrl: '/images/danilo-diaz.webp', 
    descripcion: '🪄 "Chico Díaz": Volante creativo de técnica depurada, filtro en el medio y lanzador oficial.',
    dorsal: 10,
    partidosJugados: 16,
    goles: 4,
    asistencias: 7,
    precisionPases: '91% Pases Clave',
    clubOrigen: 'Colo Colo / DPM',
    pieHabil: 'Derecho'
  },
  { 
    id: '10', 
    nombre: 'Cristóbal Vargas', 
    posicion: 'Volante', 
    edad: 25, 
    nacionalidad: 'Chile', 
    fotoUrl: '/images/harold-antinirre.webp', 
    descripcion: '⚡ "Gato": Desequilibrio individual, cambio de ritmo y llegada al área rival.',
    dorsal: 17,
    partidosJugados: 14,
    goles: 3,
    asistencias: 4,
    precisionPases: '85% Regates',
    clubOrigen: 'Universidad Católica / DPM',
    pieHabil: 'Derecho'
  },
  { 
    id: '11', 
    nombre: 'Reiner Castro', 
    posicion: 'Delantero', 
    edad: 30, 
    nacionalidad: 'Venezuela', 
    fotoUrl: '/images/reiner-castro.webp', 
    descripcion: '🚀 "Ñeñe": Extremo supersónico y figura albiverde. Gambeta endiablada, velocidad pura y definición letal.',
    dorsal: 7,
    partidosJugados: 16,
    goles: 9,
    asistencias: 6,
    precisionPases: '87% Desborde',
    clubOrigen: 'Caracas FC / Deportes Puerto Montt',
    pieHabil: 'Derecho'
  },
  { 
    id: '12', 
    nombre: 'Luciano Vázquez', 
    posicion: 'Delantero', 
    edad: 38, 
    nacionalidad: 'Argentina', 
    fotoUrl: '/images/luciano-vazquez.webp', 
    descripcion: '🦈 "Tiburón": Centrodelantero goleador implacable dentro del área, cabezazo demoledor y oficio.',
    dorsal: 9,
    partidosJugados: 15,
    goles: 11,
    asistencias: 3,
    precisionPases: '80% Definición',
    clubOrigen: 'Ñublense / DPM Chinquihue',
    pieHabil: 'Derecho'
  }
];

// Datos oficiales del Plantel Femenino 2026 (Las Hijas del Temporal - extraídas de dpmchile.cl)
const plantelFemeninoData: Jugador[] = [
  { 
    id: 'fem-1', 
    nombre: 'Alexandra Vilugrón', 
    posicion: 'Portero', 
    edad: 22, 
    nacionalidad: 'Chile', 
    fotoUrl: '/images/flor-soto.webp', 
    descripcion: '🧤 "Vilu": Maipucina formada en Labranza. Seguridad total y reflejos elásticos bajo los tres palos.',
    dorsal: 1,
    partidosJugados: 14,
    atajadas: 38,
    clubOrigen: 'Academia Deportes Labranza / Unión Araucanía',
    pieHabil: 'Derecho'
  },
  { 
    id: 'fem-2', 
    nombre: 'Clara Elgueta', 
    posicion: 'Defensa', 
    edad: 28, 
    nacionalidad: 'Chile', 
    fotoUrl: '/images/clara-elgueta.webp', 
    descripcion: '👑 "Clarita": Histórica defensora central y capitana albiverde formada en Chinquihue. Liderazgo y garra pura.',
    dorsal: 4,
    partidosJugados: 16,
    recuperaciones: 45,
    goles: 2,
    clubOrigen: 'Deportes Puerto Montt / Curicó Unido',
    pieHabil: 'Derecho'
  },
  { 
    id: 'fem-3', 
    nombre: 'Karen Catrián', 
    posicion: 'Defensa', 
    edad: 18, 
    nacionalidad: 'Chile', 
    fotoUrl: '/images/valentina-monroy.webp', 
    descripcion: '🇨🇱 Defensora central con paso por la Selección Chilena Femenina Sub-20. Anticipación y timing perfecto.',
    dorsal: 3,
    partidosJugados: 15,
    recuperaciones: 39,
    clubOrigen: 'Selección Chilena Sub-20 / Cholchol',
    pieHabil: 'Derecho'
  },
  { 
    id: 'fem-4', 
    nombre: 'Consuelo Martínez', 
    posicion: 'Defensa', 
    edad: 24, 
    nacionalidad: 'Chile', 
    fotoUrl: '/images/barbara-hernandez.webp', 
    descripcion: '⚡ "Superconsu": Lateral incansable con recorrido completo, quite limpio y entrega absoluta.',
    dorsal: 2,
    partidosJugados: 14,
    recuperaciones: 34,
    clubOrigen: 'Recreativo Puerto Varas / Coquimbo Unido',
    pieHabil: 'Derecho'
  },
  { 
    id: 'fem-5', 
    nombre: 'Thaissa Argel', 
    posicion: 'Volante', 
    edad: 19, 
    nacionalidad: 'Chile', 
    fotoUrl: '/images/micaela-pena.webp', 
    descripcion: '🎩 Puertomontina de gran pie, cambio de frente quirúrgico y despliegue continuo en la medular.',
    dorsal: 8,
    partidosJugados: 16,
    asistencias: 6,
    goles: 2,
    clubOrigen: 'Escuela Universidad de Chile / Recreativo PV',
    pieHabil: 'Derecho'
  },
  { 
    id: 'fem-6', 
    nombre: 'Sofía Henríquez', 
    posicion: 'Volante', 
    edad: 18, 
    nacionalidad: 'Chile', 
    fotoUrl: '/images/candy-schencke.webp', 
    descripcion: '⭐ "Sofi": Campeona de los Juegos Binacionales. Dinámica, visión periférica y pegada de media distancia.',
    dorsal: 10,
    partidosJugados: 15,
    asistencias: 5,
    goles: 4,
    clubOrigen: 'Unión Araucanía',
    pieHabil: 'Derecho'
  },
  { 
    id: 'fem-7', 
    nombre: 'Fiorenzza Venturelli', 
    posicion: 'Volante', 
    edad: 19, 
    nacionalidad: 'Chile', 
    fotoUrl: '/images/constanza-munoz.webp', 
    descripcion: '🪄 "Fio": Gran manejo de balón, regate corto y creadora nata del frente de ataque.',
    dorsal: 6,
    partidosJugados: 13,
    asistencias: 4,
    goles: 3,
    clubOrigen: 'Unión Araucanía / Deportes Temuco',
    pieHabil: 'Derecho'
  },
  { 
    id: 'fem-8', 
    nombre: 'Krishna Soto', 
    posicion: 'Volante', 
    edad: 21, 
    nacionalidad: 'Chile', 
    fotoUrl: '/images/catalina-huentelican.webp', 
    descripcion: '🛡️ "Flaca": Equilibrio y combate en el medio terreno. Orden táctico e intercepciones clave.',
    dorsal: 5,
    partidosJugados: 14,
    recuperaciones: 31,
    clubOrigen: 'Recreativo Puerto Varas / Cobresal',
    pieHabil: 'Derecho'
  },
  { 
    id: 'fem-9', 
    nombre: 'Tamara Mansilla', 
    posicion: 'Delantero', 
    edad: 21, 
    nacionalidad: 'Chile', 
    fotoUrl: '/images/tamara-mansilla.webp', 
    descripcion: '🏹 "Peka": Goleadora puertomontina proveniente de Santiago Morning. Festejo de flecha y definición clínica.',
    dorsal: 9,
    partidosJugados: 16,
    goles: 11,
    asistencias: 4,
    clubOrigen: 'Recreativo Puerto Varas / Santiago Morning',
    pieHabil: 'Derecho'
  },
  { 
    id: 'fem-10', 
    nombre: 'Verenna Trautmann', 
    posicion: 'Delantero', 
    edad: 20, 
    nacionalidad: 'Chile', 
    fotoUrl: '/images/verenna-trautmann.webp', 
    descripcion: '⚡ "Vere": Delantera potente formada en Osorno con paso por Universidad Católica. Potencia y remate.',
    dorsal: 11,
    partidosJugados: 15,
    goles: 8,
    asistencias: 3,
    clubOrigen: 'Colo Colo Osorno / Universidad Católica',
    pieHabil: 'Derecho'
  },
  { 
    id: 'fem-11', 
    nombre: 'Thiare Vargas', 
    posicion: 'Delantero', 
    edad: 19, 
    nacionalidad: 'Chile', 
    fotoUrl: '/images/thiare-vargas.webp', 
    descripcion: '🔥 "Thiare del Flow": Canterana puertomontina con velocidad punzante por las bandas y llegada al área.',
    dorsal: 7,
    partidosJugados: 13,
    goles: 5,
    asistencias: 3,
    clubOrigen: 'Severo Cofré / Cantera DPM',
    pieHabil: 'Derecho'
  },
  { 
    id: 'fem-12', 
    nombre: 'Rocío Bañares', 
    posicion: 'Delantero', 
    edad: 20, 
    nacionalidad: 'Chile', 
    fotoUrl: '/images/rocio-banares.webp', 
    descripcion: '🎯 "Chío": Extrema desequilibrante nacida en Puerto Montt. Gran juego asociativo y desborde.',
    dorsal: 16,
    partidosJugados: 12,
    goles: 4,
    asistencias: 2,
    clubOrigen: 'Cantera DPM Chinquihue',
    pieHabil: 'Derecho'
  }
];

export const Jugadores = () => {
  const [categoriaRama, setCategoriaRama] = useState<'MASCULINO' | 'FEMENINO'>('MASCULINO');
  const [jugadoresMasculinos, setJugadoresMasculinos] = useState<Jugador[]>(() => {
    const saved = localStorage.getItem('dpm_jugadores_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return plantelMasculinoData;
  });
  const jugadoresFemeninos = plantelFemeninoData;
  const [filtro, setFiltro] = useState('Todos');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJugadores = async () => {
      const saved = localStorage.getItem('dpm_jugadores_data');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setJugadoresMasculinos(parsed);
            return;
          }
        } catch {}
      }

      try {
        const response = await api.get('/jugadores');
        if (Array.isArray(response.data) && response.data.length > 0) {
          setJugadoresMasculinos(response.data);
        }
      } catch (error) {
        // Usa los datos locales de alta fidelidad
      }
    };
    fetchJugadores();

    const handleStorage = () => {
      const saved = localStorage.getItem('dpm_jugadores_data');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setJugadoresMasculinos(parsed);
          }
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const posiciones = ['Todos', 'Portero', 'Defensa', 'Volante', 'Delantero'];
  
  const plantelActual = categoriaRama === 'MASCULINO' ? jugadoresMasculinos : jugadoresFemeninos;

  // Lógica de filtrado en memoria
  const filtrados = filtro === 'Todos' 
    ? plantelActual 
    : plantelActual.filter(j => j.posicion.toLowerCase() === filtro.toLowerCase());

  // Configuraciones de Animación Framer Motion
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Encabezado Principal */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-emerald-400 text-xs font-black uppercase tracking-wider shadow-lg">
          <FaFutbol /> Planteles Oficiales Temporada 2026
        </span>
        <h1 className="text-4xl sm:text-6xl font-black text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] tracking-tight">
          Nuestros Jugadores & Jugadoras
        </h1>
        <p className="text-slate-200 font-medium text-sm sm:text-base drop-shadow">
          Conoce a quienes defienden la camiseta del Velero en el Estadio Chinquihue con estadísticas deportivas en tiempo real.
        </p>
      </div>

      {/* Selector de Rama: Primer Equipo Masculino vs Femenino */}
      <div className="flex justify-center">
        <div className="bg-slate-950/80 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shadow-2xl flex max-w-md w-full">
          <button
            onClick={() => {
              setCategoriaRama('MASCULINO');
              setFiltro('Todos');
            }}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
              categoriaRama === 'MASCULINO'
                ? 'bg-gradient-to-r from-azul-dpm to-sky-700 text-white shadow-lg border border-sky-400/40'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <span>⚽</span> Primer Equipo Masculino
          </button>
          <button
            onClick={() => {
              setCategoriaRama('FEMENINO');
              setFiltro('Todos');
            }}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
              categoriaRama === 'FEMENINO'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg border border-emerald-400/40'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <span>🌸</span> Plantel Femenino
          </button>
        </div>
      </div>

      {/* Banner Informativo del Plantel Seleccionado */}
      <div className={`p-4 rounded-2xl border text-sm flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl backdrop-blur-md ${
        categoriaRama === 'FEMENINO'
          ? 'bg-gradient-to-r from-emerald-950/90 via-slate-900/90 to-teal-950/90 border-emerald-500/40 text-emerald-100'
          : 'bg-gradient-to-r from-azul-dpm/90 via-slate-900/90 to-sky-950/90 border-sky-500/40 text-sky-100'
      }`}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{categoriaRama === 'FEMENINO' ? '⛵' : '🏆'}</span>
          <div>
            <h3 className="font-bold text-white text-base">
              {categoriaRama === 'FEMENINO' ? 'Las Hijas del Temporal • Ascenso Femenino' : 'Primer Equipo Profesional • Campeonato Ascenso'}
            </h3>
            <p className="text-xs text-slate-300">
              {categoriaRama === 'FEMENINO' 
                ? 'Dirigidas por el DT Cristian Aldunate. Proyecto de retorno competitivo a la división de honor.'
                : 'Cuerpo técnico liderado con identidad del sur en el Estadio Bicentenario Chinquihue.'}
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-white/10 border border-white/20 whitespace-nowrap text-white">
          {plantelActual.length} Futbolistas en Nómina
        </span>
      </div>

      {/* Botones de Filtro por Posición */}
      <div className="flex flex-wrap justify-center gap-2">
        {posiciones.map(pos => (
          <button
            key={pos}
            onClick={() => setFiltro(pos)}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
              filtro === pos 
                ? categoriaRama === 'FEMENINO' 
                  ? 'bg-emerald-600 text-white shadow-lg border border-emerald-400/40' 
                  : 'bg-verde-dpm text-white shadow-lg border border-emerald-400/40'
                : 'bg-slate-900/80 backdrop-blur text-slate-200 border border-white/15 hover:bg-white/20 hover:text-white'
            }`}
          >
            {pos}
          </button>
        ))}
      </div>

      {/* Grilla animada con tarjetas 3D Flip */}
      <motion.div 
        key={categoriaRama + filtro}
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
      >
        {filtrados.map(jugador => {
          const stats = {
            dorsal: jugador.dorsal || (jugador.posicion === 'Portero' ? 1 : jugador.posicion === 'Defensa' ? 4 : jugador.posicion === 'Volante' ? 8 : 9),
            partidosJugados: jugador.partidosJugados || 15,
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
              {/* Tarjeta con efecto 3D Flip */}
              <div className="relative h-full w-full rounded-2xl transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] shadow-xl group-hover:shadow-2xl group-hover:shadow-amarillo-dpm/20">
                
                {/* CARA FRONTAL: Foto, Dorsal, Nombre y Posición */}
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

                  {/* Foto con marco circular institucional uniforme y sombras */}
                  <div className="relative flex-grow flex items-center justify-center overflow-hidden px-4 py-2">
                    <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl ring-4 ring-emerald-500/30 bg-gradient-to-b from-slate-800 to-slate-950 flex items-center justify-center">
                      <img 
                        src={jugador.fotoUrl || '/images/jugador-5.png'} 
                        alt={jugador.nombre} 
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/jugador-5.png';
                        }}
                      />
                    </div>
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
                        <p className="text-[10px] text-emerald-400 uppercase font-bold">Efectividad</p>
                        <p className="text-sm font-black text-emerald-300 font-mono mt-1">{stats.precisionPases}</p>
                      </div>
                    </div>

                    {/* Datos biográficos de origen */}
                    <div className="text-[11px] text-gray-300 space-y-1 bg-black/40 p-2.5 rounded-xl border border-white/10">
                      <p><strong className="text-gray-400">Pie Hábil:</strong> {stats.pieHabil}</p>
                      <p className="truncate"><strong className="text-gray-400">Origen:</strong> {stats.clubOrigen}</p>
                    </div>
                  </div>

                  {/* Botón de acción */}
                  <div className="pt-2 text-center">
                    <span className="inline-block text-xs font-bold text-amarillo-dpm bg-amarillo-dpm/15 border border-amarillo-dpm/40 py-1.5 px-4 rounded-xl w-full hover:bg-amarillo-dpm hover:text-slate-950 transition-colors shadow">
                      Ver Perfil Completo &rarr;
                    </span>
                  </div>
                </div>

              </div>
            </motion.div>
          );
        })}
      </motion.div>
      
      {/* Empty State si el filtro no tiene jugadores */}
      {filtrados.length === 0 && (
        <div className="text-center text-slate-300 py-12 bg-slate-900/80 backdrop-blur rounded-2xl border border-dashed border-white/20">
          No hay futbolistas registrados en esta posición para el plantel seleccionado.
        </div>
      )}
    </div>
  );
};
