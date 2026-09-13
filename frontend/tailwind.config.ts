/**
 * ============================================================================
 * Archivo: tailwind.config.ts
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Configura Tailwind CSS para el proyecto. Define qué archivos debe escanear
 * para purgar el CSS no utilizado (content), y extiende el tema por defecto
 * para incluir colores corporativos y tipografías específicas del club.
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * Tailwind CSS permite un desarrollo "utility-first", es decir, estilar
 * directamente en los archivos JSX/TSX usando clases predefinidas. 
 * Esto evita el cambio constante entre archivos CSS y JS, reduce el tamaño
 * del CSS final y asegura un diseño consistente.
 * 
 * DECISIONES DE DISEÑO:
 * - Colores personalizados: Se añadieron 'verde-dpm', 'azul-dpm', 'amarillo-dpm'
 *   para mantener la identidad visual del Club Deportes Puerto Montt en toda la app.
 * - Fuente: 'Inter' para garantizar una lectura limpia y moderna.
 * ============================================================================
 */
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Escanea todos los archivos React
  ],
  theme: {
    extend: {
      colors: {
        'verde-dpm': '#0f5d3d',   // Verde característico del club
        'azul-dpm': '#003366',    // Azul secundario
        'amarillo-dpm': '#ffe600',// Amarillo para acentos y botones
        'blanco': '#ffffff'       // Blanco puro para fondos y textos
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Tipografía principal de la aplicación
      }
    },
  },
  plugins: [],
}
