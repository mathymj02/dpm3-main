/**
 * ============================================================================
 * Archivo: Spinner.tsx
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Un indicador visual de carga (loading spinner) genérico.
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * Se anima usando `framer-motion` (`animate={{ rotate: 360 }}`) de manera 
 * infinita, lo cual es más performante que algunas animaciones CSS complejas
 * y se integra nativamente en el ecosistema de componentes.
 * 
 * DECISIONES DE DISEÑO / UX:
 * - Patrón UX de Estado de Carga: En las llamadas a la API, es vital informar
 *   al usuario que una acción está en proceso. Un spinner centrado (`flex justify-center`)
 *   evita la incertidumbre y previene múltiples clics.
 * - Colores de Marca: Usa `border-t-verde-dpm` para mantener la identidad visual.
 * ============================================================================
 */
import { motion } from 'framer-motion';

export const Spinner = () => {
  return (
    <div className="flex justify-center items-center py-10">
      <motion.div
        className="w-12 h-12 border-4 border-gray-200 border-t-verde-dpm rounded-full"
        // Animación de rotación constante
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};
