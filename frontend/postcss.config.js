/**
 * ============================================================================
 * Archivo: postcss.config.js
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Configura PostCSS, una herramienta para transformar CSS con JavaScript.
 * Registra los plugins necesarios para procesar el CSS del proyecto.
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * PostCSS es el motor subyacente que Tailwind CSS utiliza para procesar
 * sus clases de utilidad y generar el CSS final. 
 * 
 * DECISIONES DE DISEÑO:
 * - tailwindcss: El plugin principal que genera las clases utility de Tailwind.
 * - autoprefixer: Analiza el CSS y añade prefijos específicos de navegadores
 *   (vendor prefixes como -webkit-) según sea necesario, asegurando
 *   compatibilidad en navegadores antiguos sin escribir prefijos manualmente.
 * ============================================================================
 */
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
