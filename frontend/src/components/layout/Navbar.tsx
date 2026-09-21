/**
 * ============================================================================
 * Archivo: Navbar.tsx
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Componente principal de navegación transversal a toda la aplicación.
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * Utiliza `react-router-dom` (Link y NavLink) para la navegación sin recargas.
 * `react-icons` para íconos ligeros y estándar.
 * 
 * DECISIONES DE DISEÑO / UX:
 * - Sticky Top (en vez de Fixed): Se usó `sticky top-0`. A diferencia de `fixed`,
 *   un elemento `sticky` no saca el navbar del flujo del documento inicial,
 *   evitando que el contenido de las páginas quede "oculto" bajo él al cargar.
 * - Menú Hamburguesa Responsivo: En pantallas móviles (`md:hidden`), los enlaces
 *   se ocultan y aparece un icono de barras. Al clicarlo, el menú despliega 
 *   las opciones apiladas verticalmente, crucial para la navegación táctil.
 * - NavLink "isActive": Permite detectar la ruta actual y dar feedback visual 
 *   (estado activo / color amarillo) indicando al usuario en qué sección está.
 * - Cart Badge (Insignia de Carrito): Proporciona feedback visual instantáneo
 *   si hay ítems en el carrito usando un círculo numérico flotante absoluto.
 * ============================================================================
 */
import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaShoppingCart, FaUser } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api/axiosConfig';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // Estado del menú móvil
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const [cartCount, setCartCount] = useState(0); // Cantidad de ítems en carrito
  const navigate = useNavigate();

  // Obtener la cantidad de productos en el carrito inicial
  useEffect(() => {
    if (isAuthenticated) {
      api.get('/carrito').then(res => {
        setCartCount(res.data.items?.length || 0);
      }).catch(() => setCartCount(0));
    }
  }, [isAuthenticated]);

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Hazte Socio', path: '/socios', destacado: true },
    { name: 'Jugadores', path: '/jugadores' },
    { name: 'Tabla', path: '/posiciones' },
    { name: 'Novedades', path: '/novedades' },
    { name: 'Historia', path: '/historia' },
    { name: 'Tienda', path: '/tienda' },
  ];

  // Si es administrador, añadir dinámicamente la ruta al panel Admin
  if (isAdmin) {
    navLinks.push({ name: 'Admin', path: '/admin' });
  }

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false); // Cierra menú móvil al salir
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-verde-dpm to-azul-dpm shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Brand con escudo oficial */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-white font-bold text-xl flex items-center gap-2">
              <img 
                src="/images/logo-deportes-puertomontt.png" 
                alt="Escudo DPM" 
                className="w-10 h-10 object-contain bg-white rounded-full p-0.5 shadow"
              />
              <span className="hidden sm:block font-extrabold tracking-wide">Deportes Puerto Montt</span>
            </Link>
          </div>
          
          {/* Enlaces de Desktop (Navegación libre para todos los hinchas) */}
          <div className="hidden md:flex space-x-4 items-center">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    link.destacado
                      ? isActive
                        ? 'bg-amarillo-dpm text-slate-950 font-bold'
                        : 'bg-amarillo-dpm/20 border border-amarillo-dpm/50 text-amarillo-dpm hover:bg-amarillo-dpm hover:text-slate-950 font-bold'
                      : isActive
                      ? 'text-amarillo-dpm bg-white/10'
                      : 'text-gray-100 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Opciones de usuario / carrito (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {/* Icono de Carrito con Insignia (Badge) Absoluta */}
                <Link to="/carrito" className="text-white relative hover:text-amarillo-dpm transition">
                  <FaShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-amarillo-dpm text-azul-dpm text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <div className="flex items-center gap-2 text-white">
                  <FaUser />
                  <span className="text-sm">{user?.nombre}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-500/80 hover:bg-red-500 text-white px-3 py-1 rounded text-sm transition"
                >
                  Salir
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login" className="text-white hover:text-amarillo-dpm text-sm font-medium">Ingresar</Link>
                <span className="text-gray-400">|</span>
                <Link to="/registro" className="text-amarillo-dpm hover:text-white text-sm font-medium">Registro</Link>
              </div>
            )}
          </div>

          {/* Botón de Menú Hamburguesa (Móvil) */}
          <div className="md:hidden flex items-center gap-4">
             {isAuthenticated && (
                <Link to="/carrito" className="text-white relative">
                  <FaShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-amarillo-dpm text-azul-dpm text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white p-2 focus:outline-none"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú Desplegable (Móvil) */}
      {isOpen && (
        <div className="md:hidden bg-azul-dpm/95 border-t border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${
                    link.destacado
                      ? isActive
                        ? 'bg-amarillo-dpm text-slate-950 font-bold'
                        : 'bg-amarillo-dpm/20 border border-amarillo-dpm/40 text-amarillo-dpm font-bold'
                      : isActive
                      ? 'text-amarillo-dpm bg-white/10'
                      : 'text-gray-200 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            {!isAuthenticated ? (
              <div className="mt-4 flex flex-col space-y-2 px-3">
                <Link to="/login" onClick={() => setIsOpen(false)} className="text-center bg-white/10 text-white py-2 rounded">Ingresar</Link>
                <Link to="/registro" onClick={() => setIsOpen(false)} className="text-center bg-amarillo-dpm text-azul-dpm font-bold py-2 rounded">Registro</Link>
              </div>
            ) : (
              <div className="mt-4 px-3 border-t border-white/10 pt-4 flex flex-col space-y-3">
                <div className="flex items-center gap-2 text-white">
                  <FaUser />
                  <span>Hola, {user?.nombre}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-red-400 font-medium py-2"
                >
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
