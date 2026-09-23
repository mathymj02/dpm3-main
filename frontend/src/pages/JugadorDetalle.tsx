/**
 * ============================================================================
 * Archivo: JugadorDetalle.tsx
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Renderiza la ficha técnica y estadística detallada de un futbolista
 * oficial del club (masculino o femenino) o de futbolistas creados
 * dinámicamente por la directiva desde el panel de administración.
 * 
 * RESOLUCIÓN DE ERRORES / BUGS:
 * - Se corrigió el error donde jugadores recién creados o con IDs personalizados
 *   redirigían por defecto a Kevin Catalán.
 * - Ahora consulta primero el almacenamiento local sincronizado (localStorage),
 *   luego los planteles oficiales y la API REST del backend.
 * ============================================================================
 */
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Jugador } from '../types';
import api from '../api/axiosConfig';
import { motion } from 'framer-motion';
import { FaFutbol, FaArrowLeft, FaShieldAlt, FaChartLine } from 'react-icons/fa';

// Nómina oficial masculina con imágenes reales de dpmchile.cl
const plantelMasculinoData: Jugador[] = [
  { 
    id: '1', 
    nombre: 'Luis Ureta', 
    posicion: 'Portero', 
    edad: 26, 
    nacionalidad: 'Chile', 
    fotoUrl: '/images/luis-ureta.webp', 
    descripcion: '🧤 "Pelle": Arquero titular con reflejos felinos, seguridad en el juego aéreo y gran temple bajo los tres palos.',
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

// Nómina oficial femenina con imágenes reales de dpmchile.cl
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
    precisionPases: '88% Atajadas',
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
    precisionPases: '86% Duelos',
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
    recuperaciones: 41,
    goles: 1,
    precisionPases: '82% Marca',
    clubOrigen: 'Cantera DPM Chinquihue',
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
    dorsal: 5,
    partidosJugados: 15,
    recuperaciones: 40,
    asistencias: 3,
    precisionPases: '84% Recorrido',
    clubOrigen: 'Deportes Puerto Montt',
    pieHabil: 'Izquierdo'
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
    partidosJugados: 14,
    goles: 3,
    asistencias: 5,
    precisionPases: '89% Pases',
    clubOrigen: 'Cantera DPM Chinquihue',
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
    dorsal: 6,
    partidosJugados: 13,
    goles: 2,
    asistencias: 4,
    precisionPases: '85% Distribución',
    clubOrigen: 'Deportes Puerto Montt',
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
    dorsal: 10,
    partidosJugados: 15,
    goles: 4,
    asistencias: 6,
    precisionPases: '90% Regates',
    clubOrigen: 'Deportes Puerto Montt',
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
    dorsal: 14,
    partidosJugados: 14,
    recuperaciones: 34,
    asistencias: 2,
    precisionPases: '83% Recuperación',
    clubOrigen: 'Cantera DPM Chinquihue',
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
    precisionPases: '88% Puntería',
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
    precisionPases: '84% Remates',
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
    precisionPases: '81% Velocidad',
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
    precisionPases: '79% Centros',
    clubOrigen: 'Cantera DPM Chinquihue',
    pieHabil: 'Derecho'
  }
];

export const JugadorDetalle = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [jugador, setJugador] = useState<Jugador | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buscarJugador = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      // 1. Prioridad: Buscar en LocalStorage (futbolistas creados o editados por el admin)
      const saved = localStorage.getItem('dpm_jugadores_data');
      if (saved) {
        try {
          const list: Jugador[] = JSON.parse(saved);
          const found = list.find(j => String(j.id) === String(id));
          if (found) {
            setJugador(found);
            setLoading(false);
            return;
          }
        } catch {}
      }

      // 2. Buscar en la nómina oficial masculina
      const foundMasc = plantelMasculinoData.find(j => String(j.id) === String(id));
      if (foundMasc) {
        setJugador(foundMasc);
        setLoading(false);
        return;
      }

      // 3. Buscar en la nómina oficial femenina
      const foundFem = plantelFemeninoData.find(j => String(j.id) === String(id));
      if (foundFem) {
        setJugador(foundFem);
        setLoading(false);
        return;
      }

      // 4. Intentar API backend
      try {
        const response = await api.get(`/jugadores/${id}`);
        if (response.data) {
          setJugador(response.data);
          setLoading(false);
          return;
        }
      } catch {
        // No encontrado en backend
      }

      // 5. Si no se encuentra, dejar en null (NUNCA forzar a Catalan)
      setJugador(null);
      setLoading(false);
    };

    buscarJugador();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!jugador) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center text-white space-y-4">
        <div className="text-5xl">⚽</div>
        <h2 className="text-2xl font-black text-white">Futbolista No Encontrado</h2>
        <p className="text-sm text-slate-300">
          No pudimos localizar la ficha solicitada. Puede que haya sido desvinculado o el identificador sea incorrecto.
        </p>
        <button
          onClick={() => navigate('/jugadores')}
          className="mt-4 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-xl transition shadow"
        >
          <FaArrowLeft /> Volver a Planteles Oficiales
        </button>
      </div>
    );
  }

  const dorsalNumber = jugador.dorsal || (jugador.posicion === 'Portero' ? 1 : jugador.posicion === 'Defensa' ? 4 : jugador.posicion === 'Volante' ? 8 : 9);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      
      {/* Botón Volver */}
      <button 
        onClick={() => navigate('/jugadores')}
        className="text-emerald-400 hover:text-emerald-300 font-bold text-sm flex items-center gap-2 transition group"
      >
        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Volver al plantel completo
      </button>

      {/* Tarjeta Principal Dark Glassmorphic */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col md:flex-row text-white"
      >
        
        {/* Columna Izquierda: Fotografía Oficial con Marco y Dorsal */}
        <div className="md:w-5/12 bg-gradient-to-b from-azul-dpm/40 via-slate-950 to-slate-950 p-8 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-white/10 relative">
          
          {/* Badge Dorsal Flotante */}
          <div className="w-full flex items-center justify-between z-10">
            <span className="w-12 h-12 rounded-2xl bg-amarillo-dpm text-slate-950 font-black text-xl flex items-center justify-center shadow-lg">
              #{dorsalNumber}
            </span>
            <span className={`text-xs font-black uppercase px-3 py-1 rounded-full ${
              jugador.posicion === 'Portero' ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40' :
              jugador.posicion === 'Defensa' ? 'bg-blue-500/20 text-blue-300 border border-blue-400/40' :
              jugador.posicion === 'Volante' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40' :
              'bg-rose-500/20 text-rose-300 border border-rose-400/40'
            }`}>
              {jugador.posicion}
            </span>
          </div>

          {/* Foto Circular con Halo Institucional */}
          <div className="my-6 relative">
            <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-4 border-emerald-400/40 shadow-2xl ring-4 ring-white/10 bg-slate-900 flex items-center justify-center">
              <img 
                src={jugador.fotoUrl} 
                alt={jugador.nombre} 
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/jugador-5.png';
                }}
              />
            </div>
          </div>

          {/* Club Formador y Pie Hábil */}
          <div className="w-full text-center space-y-1 bg-white/5 p-3 rounded-2xl border border-white/10">
            <span className="text-[11px] text-gray-400 uppercase font-semibold block">Club de Origen</span>
            <span className="text-xs sm:text-sm font-bold text-emerald-300">{jugador.clubOrigen || 'Club Deportes Puerto Montt'}</span>
          </div>
        </div>

        {/* Columna Derecha: Información Deportiva y Estadísticas */}
        <div className="p-8 sm:p-10 md:w-7/12 flex flex-col justify-between space-y-6">
          
          {/* Título y Datos Rápidos */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
              <FaFutbol /> Ficha Oficial Temporada 2026
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white">{jugador.nombre}</h1>
            <p className="text-lg font-bold text-amarillo-dpm mt-1">{jugador.posicion} Oficial DPM</p>
          </div>

          {/* Grilla de Datos Biográficos */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/5 border border-white/10 p-3 rounded-xl text-center">
              <span className="text-[10px] text-gray-400 uppercase font-semibold block">Edad</span>
              <span className="text-base font-black text-white">{jugador.edad} años</span>
            </div>
            <div className="bg-white/5 border border-white/10 p-3 rounded-xl text-center">
              <span className="text-[10px] text-gray-400 uppercase font-semibold block">Nacionalidad</span>
              <span className="text-base font-black text-white truncate block">{jugador.nacionalidad}</span>
            </div>
            <div className="bg-white/5 border border-white/10 p-3 rounded-xl text-center">
              <span className="text-[10px] text-gray-400 uppercase font-semibold block">Pie Hábil</span>
              <span className="text-base font-black text-white">{jugador.pieHabil || 'Derecho'}</span>
            </div>
          </div>

          {/* Métricas Deportivas Reales */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FaChartLine className="text-emerald-400" /> Métricas Oficiales de Rendimiento
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-950/60 border border-white/10 p-3 rounded-xl text-center">
                <span className="text-[10px] text-gray-400 uppercase font-semibold block">Partidos</span>
                <span className="text-xl font-black text-white">{jugador.partidosJugados || 15}</span>
              </div>
              
              {jugador.posicion === 'Portero' ? (
                <div className="bg-slate-950/60 border border-emerald-500/30 p-3 rounded-xl text-center">
                  <span className="text-[10px] text-emerald-400 uppercase font-bold block">Atajadas</span>
                  <span className="text-xl font-black text-emerald-300">{jugador.atajadas || 48}</span>
                </div>
              ) : (
                <div className="bg-slate-950/60 border border-amarillo-dpm/30 p-3 rounded-xl text-center">
                  <span className="text-[10px] text-amarillo-dpm uppercase font-bold block">Goles</span>
                  <span className="text-xl font-black text-amarillo-dpm">{jugador.goles || (jugador.posicion === 'Delantero' ? 8 : 2)}</span>
                </div>
              )}

              <div className="bg-slate-950/60 border border-sky-500/30 p-3 rounded-xl text-center">
                <span className="text-[10px] text-sky-400 uppercase font-bold block">Efectividad</span>
                <span className="text-sm font-black text-sky-200 font-mono mt-1 block truncate">
                  {jugador.precisionPases || '88% Rendimiento'}
                </span>
              </div>
            </div>
          </div>

          {/* Perfil / Biografía del Jugador */}
          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <FaShieldAlt className="text-emerald-400" /> Perfil del Futbolista
            </h3>
            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed italic">
              "{jugador.descripcion || `${jugador.posicion} profesional de Deportes Puerto Montt en la temporada 2026.`}"
            </p>
          </div>

          {/* Enlace al Panel o al Validador */}
          <div className="flex gap-3 pt-2">
            <Link
              to="/jugadores"
              className="flex-1 py-3 text-center bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs transition border border-white/10"
            >
              Ver Todo el Plantel
            </Link>
            <Link
              to="/tienda"
              className="flex-1 py-3 text-center bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold rounded-xl text-xs transition shadow"
            >
              Comprar Camiseta Oficial &rarr;
            </Link>
          </div>

        </div>

      </motion.div>
    </div>
  );
};
