/**
 * ============================================================================
 * Archivo: Footer.tsx
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Define el pie de página de la aplicación, el cual se renderiza 
 * consistentemente en la parte inferior de todas las páginas.
 * 
 * DECISIONES DE DISEÑO / UX:
 * - mt-auto (Margin Top Auto): Usado en conjunto con el contenedor Flexbox
 *   del Layout, asegura que si el contenido principal es corto, el Footer 
 *   quede "pegado" al fondo de la pantalla (sticky footer visual), en lugar 
 *   de flotar a media página.
 * - Contenido Estructurado: Dividido en 3 columnas en desktop usando CSS Grid
 *   (Información, Enlaces, Redes Sociales) para mejorar la lectura y el
 *   peso visual de la información complementaria.
 * ============================================================================
 */
export const Footer = () => {
  const currentYear = new Date().getFullYear(); // Año dinámico para el copyright
  
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid de 1 columna en móvil y 3 en desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Club Deportes Puerto Montt</h3>
            <p className="text-sm">
              Fundado el 6 de mayo de 1983.<br/>
              Estadio Regional de Chinquihue.<br/>
              Puerto Montt, Región de Los Lagos, Chile.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Enlaces</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/historia" className="hover:text-amarillo-dpm transition">Historia del Club</a></li>
              <li><a href="/novedades" className="hover:text-amarillo-dpm transition">Noticias</a></li>
              <li><a href="/tienda" className="hover:text-amarillo-dpm transition">Tienda Oficial</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Síguenos</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition">Facebook</a>
              <a href="#" className="text-gray-400 hover:text-white transition">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-white transition">Instagram</a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
          <p>&copy; {currentYear} Club Deportes Puerto Montt. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
