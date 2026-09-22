/**
 * ============================================================================
 * Archivo: Historia.tsx
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Presenta la epopeya histórica, fundación, momentos de gloria y mística del
 * Estadio Chinquihue con ambientación cinematográfica, video aéreo de fondo
 * y tarjetas oscuras en glassmorphism sin fondos blancos planos.
 * ============================================================================
 */
import { motion } from 'framer-motion';
import { FaLandmark, FaTrophy, FaCalendarAlt, FaStar, FaAnchor } from 'react-icons/fa';

export const Historia = () => {
  return (
    <div className="min-h-screen text-white pb-20">
      
      {/* SECCIÓN 1: Hero Cinematográfico con Video Aéreo del Chinquihue */}
      <section className="relative h-[65vh] min-h-[480px] w-full flex items-center justify-center overflow-hidden">
        {/* Video en movimiento de fondo vía Vimeo */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          <iframe
            src="https://player.vimeo.com/video/1181735914?muted=1&autoplay=1&loop=1&background=1&app_id=122963"
            className="w-full h-[140%] -top-[20%] relative object-cover scale-125"
            allow="autoplay; fullscreen"
            title="Video Aéreo Estadio Chinquihue DPM"
          />
        </div>

        {/* Degradado cinematográfico oscuro de alto contraste */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-azul-dpm/75 to-slate-950 backdrop-blur-[2px]" />

        {/* Contenido flotante sobre el video */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-4">
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs sm:text-sm font-black uppercase tracking-widest shadow-xl"
          >
            <FaAnchor /> Mística & Identidad Austral
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-6xl font-black tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]"
          >
            Nuestra Historia Albiverde
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-xl text-slate-200 font-medium max-w-2xl mx-auto drop-shadow"
          >
            Más de 40 años defendiendo con orgullo y coraje la camiseta del Velero en el corazón del sur de Chile.
          </motion.p>
        </div>
      </section>

      {/* SECCIÓN 2: Contenedor Principal de Hitos Históricos (Glassmorphism Oscuro) */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 space-y-12">
        
        {/* HITO 1: Fundación */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-slate-900/85 backdrop-blur-xl border border-white/15 p-8 md:p-12 rounded-3xl shadow-2xl flex flex-col md:flex-row gap-8 items-center"
        >
          <div className="md:w-3/5 space-y-4">
            <div className="flex items-center gap-2 text-amarillo-dpm font-bold text-xs uppercase tracking-wider">
              <FaCalendarAlt /> 6 de Mayo de 1983
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white border-b border-white/15 pb-3">
              Fundación del Club
            </h2>
            <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
              El <strong>Club de Deportes Puerto Montt</strong> nació de la profunda convicción de un grupo de dirigentes y apasionados hinchas puertomontinos que soñaban con ver a su ciudad compitiendo en el fútbol profesional chileno, representando con honra a la Región de Los Lagos.
            </p>
            <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
              Nuestros colores institucionales fueron elegidos como un homenaje vivo a nuestra tierra: el <strong>verde</strong> de los bosques milenarios, el <strong>azul</strong> del seno de Reloncaví y el canal de Tenglo, el <strong>amarillo</strong> del sol austral y el <strong>blanco</strong> de la pureza de los ideales deportivos.
            </p>
          </div>
          <div className="md:w-2/5 w-full">
            <div className="overflow-hidden rounded-2xl border border-white/20 shadow-2xl ring-4 ring-emerald-500/20">
              <img 
                src="/images/equipo-dpm.png" 
                alt="Plantel Histórico DPM" 
                className="w-full h-64 object-cover transform hover:scale-105 transition-transform duration-500" 
              />
            </div>
          </div>
        </motion.div>

        {/* HITO 2: El Templo de Chinquihue */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-slate-900/85 backdrop-blur-xl border border-white/15 p-8 md:p-12 rounded-3xl shadow-2xl flex flex-col md:flex-row-reverse gap-8 items-center"
        >
          <div className="md:w-1/2 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <FaLandmark /> El Estadio Más Lindo de Sudamérica
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white border-b border-white/15 pb-3">
              Estadio Bicentenario Chinquihue
            </h2>
            <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
              El Chinquihue es internacionalmente admirado por su postal única frente al Canal de Tenglo. Su diseño arquitectónico curvo rinde homenaje a las costillas de los astilleros y barcazas chilotas.
            </p>
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-black/40 border border-white/10 rounded-xl text-center">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Capacidad</p>
                <p className="text-lg font-black text-white">10.000</p>
              </div>
              <div className="p-3 bg-black/40 border border-white/10 rounded-xl text-center">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Inauguración</p>
                <p className="text-lg font-black text-white">1982</p>
              </div>
              <div className="p-3 bg-black/40 border border-white/10 rounded-xl text-center">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">FIFA Pro</p>
                <p className="text-lg font-black text-emerald-400">2013</p>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 w-full">
            <div className="overflow-hidden rounded-2xl border border-white/20 shadow-2xl ring-4 ring-sky-500/20">
              <img 
                src="/images/EstadioChinquihue.png" 
                alt="Estadio Bicentenario Chinquihue" 
                className="w-full h-72 object-cover transform hover:scale-105 transition-transform duration-500" 
              />
            </div>
          </div>
        </motion.div>

        {/* HITO 3: El Histórico Ascenso */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-slate-900/85 backdrop-blur-xl border border-white/15 p-8 md:p-12 rounded-3xl shadow-2xl flex flex-col md:flex-row gap-8 items-center"
        >
          <div className="md:w-1/2 w-full">
            <div className="overflow-hidden rounded-2xl border border-white/20 shadow-2xl ring-4 ring-amarillo-dpm/20">
              <img 
                src="/images/PRIMER-ASCENSO-DE-DEPORTES-PUERTO-MONTT.jpg" 
                alt="Primer Ascenso Deportes Puerto Montt" 
                className="w-full h-72 object-cover transform hover:scale-105 transition-transform duration-500" 
              />
            </div>
          </div>
          <div className="md:w-1/2 space-y-4">
            <div className="flex items-center gap-2 text-amarillo-dpm font-bold text-xs uppercase tracking-wider">
              <FaTrophy /> La Gloria del Sur
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white border-b border-white/15 pb-3">
              El Ascenso Inolvidable
            </h2>
            <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
              Uno de los hitos más emblemáticos de la institución fue el ascenso a la división de honor del fútbol chileno. Aquel campeonato desató un carnaval popular que colmó la costanera y las calles céntricas de Puerto Montt, demostrando que este club es el alma de toda una región.
            </p>
          </div>
        </motion.div>

        {/* HITO 4: Palmarés Oficial */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-slate-900/90 via-azul-dpm/80 to-slate-900/90 backdrop-blur-xl border border-amarillo-dpm/40 p-8 md:p-10 rounded-3xl shadow-2xl"
        >
          <div className="flex items-center gap-3 border-b border-white/15 pb-4 mb-6">
            <FaTrophy className="text-3xl text-amarillo-dpm" />
            <div>
              <h3 className="text-2xl font-black text-white">Palmarés y Títulos Oficiales</h3>
              <p className="text-xs text-slate-300">Logros deportivos del Club Deportes Puerto Montt</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-black/40 border border-white/10 rounded-2xl flex items-center gap-3">
              <FaStar className="text-amarillo-dpm text-2xl flex-shrink-0" />
              <div>
                <p className="font-bold text-white text-sm">Campeón Primera B</p>
                <p className="text-xs text-amarillo-dpm font-mono font-bold">Temporada 2002</p>
              </div>
            </div>

            <div className="p-4 bg-black/40 border border-white/10 rounded-2xl flex items-center gap-3">
              <FaStar className="text-amarillo-dpm text-2xl flex-shrink-0" />
              <div>
                <p className="font-bold text-white text-sm">Segunda División Profesional</p>
                <p className="text-xs text-emerald-400 font-mono font-bold">Campeón 2014-2015</p>
              </div>
            </div>

            <div className="p-4 bg-black/40 border border-white/10 rounded-2xl flex items-center gap-3">
              <FaAnchor className="text-sky-400 text-2xl flex-shrink-0" />
              <div>
                <p className="font-bold text-white text-sm">Primera División ANFP</p>
                <p className="text-xs text-sky-300 font-mono font-bold">Múltiples Temporadas</p>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};
