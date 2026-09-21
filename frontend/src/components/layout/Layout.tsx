/**
 * ============================================================================
 * Archivo: Layout.tsx
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Es el esqueleto (wrapper) estructural base para la aplicación. Define la 
 * barra de navegación arriba, el contenido en el centro y el pie de página.
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * Patrón "Layout con Outlet" de React Router v6. Permite que el Navbar y 
 * el Footer persistan (no se desmonten ni vuelvan a montar) al navegar,
 * mejorando drásticamente el rendimiento y manteniendo la posición de scroll
 * o los estados de los componentes fijos.
 * 
 * DECISIONES DE DISEÑO / UX:
 * - min-h-screen & flex flex-col: Se aplica a un contenedor padre para 
 *   forzar a la aplicación a tomar el 100% del alto de la ventana como mínimo.
 * - flex-grow (en la etiqueta main): Obliga a la sección de contenido a 
 *   expandirse ocupando todo el espacio libre restante, lo que empuja 
 *   naturalmente al Footer hacia el fondo de la pantalla.
 * ============================================================================
 */
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { HimnoPlayer } from '../ui/HimnoPlayer';

export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col relative text-gray-900">
      {/* Fondo global panorámico del Estadio Chinquihue con overlay cinematográfico */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-fixed pointer-events-none"
        style={{
          backgroundImage: "url('/images/EstadioChinquihue.png')"
        }}
      >
        {/* Overlay con tinte azul institucional y desenfoque sutil para máxima legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-azul-dpm/80 to-slate-950/90 backdrop-blur-[2px]" />
      </div>

      {/* Contenedor interactivo sobre el fondo */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        
        {/* Contenedor principal que se expande */}
        <main className="flex-grow">
          {/* Aquí React Router inyectará los componentes de cada ruta hija */}
          <Outlet />
        </main>
        
        {/* Reproductor Flotante del Himno Oficial */}
        <HimnoPlayer />

        <Footer />
      </div>
    </div>
  );
};
