/**
 * ============================================================================
 * Archivo: Historia.tsx
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Presenta contenido estático sobre la historia, fundación y logros del 
 * Club Deportes Puerto Montt.
 * 
 * DECISIONES DE DISEÑO / UX:
 * - Timeline Design (Estilo Línea de Tiempo): Se estructuran los hitos 
 *   (Fundación, Estadio, Logros) en bloques separados como "tarjetas",
 *   mejorando la digestión visual de largos párrafos de texto.
 * - Scroll Animations: `whileInView` anima la aparición de cada hito 
 *   histórico independientemente a medida que el usuario hace scroll hacia 
 *   abajo, haciendo que la historia se sienta "contada" dinámicamente.
 * ============================================================================
 */
import { motion } from 'framer-motion';

export const Historia = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="relative bg-azul-dpm text-white py-24 text-center">
        <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/4/4b/Estadio_Chinquihue_2.jpg')] bg-cover bg-center"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-extrabold mb-4">Nuestra Historia</h1>
          <p className="text-xl text-amarillo-dpm font-medium">Desde 1983 defendiendo los colores de nuestra ciudad</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white p-8 rounded-2xl shadow-md mb-12"
        >
          <h2 className="text-3xl font-bold text-verde-dpm mb-6 border-b pb-2">Fundación</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            El Club de Deportes Puerto Montt fue fundado el <strong>6 de mayo de 1983</strong>. Nació de la inquietud de un grupo de dirigentes y aficionados al fútbol de la ciudad que soñaban con tener un equipo en el profesionalismo.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Los colores representativos elegidos fueron el verde, azul, amarillo y blanco. El verde representa la naturaleza de la zona, el azul el mar, el amarillo el sol y el blanco la pureza de los ideales deportivos.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white p-8 rounded-2xl shadow-md mb-12 flex flex-col md:flex-row gap-8 items-center"
        >
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-azul-dpm mb-6 border-b pb-2">Estadio Chinquihue</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              El club hace de local en el Estadio Regional de Chinquihue, conocido por ser el estadio más austral del mundo con estándar FIFA y famoso por su hermosa vista al Canal de Tenglo y a la Isla Tenglo.
            </p>
            <ul className="text-gray-700 space-y-2">
              <li><strong>Capacidad:</strong> 10.000 espectadores</li>
              <li><strong>Inauguración:</strong> 1982</li>
              <li><strong>Remodelación:</strong> 2013</li>
            </ul>
          </div>
          <div className="md:w-1/2 w-full">
             <img src="https://upload.wikimedia.org/wikipedia/commons/4/4b/Estadio_Chinquihue_2.jpg" alt="Estadio Chinquihue" className="rounded-xl shadow-lg w-full" />
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white p-8 rounded-2xl shadow-md"
        >
          <h2 className="text-3xl font-bold text-verde-dpm mb-6 border-b pb-2">Logros</h2>
          <ul className="list-disc list-inside text-lg text-gray-700 space-y-4">
            <li>Campeón Primera B: 2002</li>
            <li>Campeón Segunda División Profesional: 2014-15</li>
            <li>Múltiples participaciones en la Primera División del Fútbol Chileno.</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};
