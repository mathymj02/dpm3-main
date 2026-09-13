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

export const Layout = () => {
  return (
    // Configuración Flexbox para el truco del "Sticky Footer"
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Contenedor principal que se expande */}
      <main className="flex-grow">
        {/* Aquí React Router inyectará los componentes de cada ruta hija */}
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};
