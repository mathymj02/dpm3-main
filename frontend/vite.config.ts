/**
 * ============================================================================
 * Archivo: vite.config.ts
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Configura el empaquetador Vite. Habilita el plugin de React y establece
 * alias de rutas (paths) para facilitar las importaciones.
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * Se utiliza Vite en lugar de Webpack o Create React App (CRA) porque
 * Vite utiliza módulos ES nativos, lo que resulta en tiempos de inicio
 * del servidor de desarrollo casi instantáneos y Hot Module Replacement (HMR)
 * extremadamente rápido, mejorando la experiencia del desarrollador (DX).
 * 
 * DECISIONES DE DISEÑO:
 * - Alias '@': Se configura '@' para apuntar a './src'. Esto evita 
 *   rutas relativas largas y confusas (ej. '../../components/...') y
 *   las reemplaza por rutas limpias (ej. '@/components/...').
 * ============================================================================
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  // Plugin oficial para integrar Vite con React
  plugins: [react()],
  resolve: {
    alias: {
      // Configuración de alias absoluto para la carpeta src
      '@': path.resolve(__dirname, './src'),
    },
  },
});
