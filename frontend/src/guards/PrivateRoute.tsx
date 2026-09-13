/**
 * ============================================================================
 * Archivo: PrivateRoute.tsx
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Un componente envoltorio (wrapper) que actúa como "Guardia de Ruta".
 * Impide que un usuario no autenticado acceda a rutas privadas (ej. carrito).
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * React Router v6 permite usar <Outlet /> para renderizar rutas hijas. 
 * Combinado con este componente, se logra un control de acceso declarativo.
 * ¿Por qué proteger rutas en Frontend si el Backend ya las protege?
 * - UX (Experiencia de Usuario): Previene que el usuario cargue una vista
 *   que inevitablemente fallará por falta de token.
 * - Seguridad Profunda (Defense in Depth): Capas múltiples de seguridad.
 * 
 * DECISIONES DE DISEÑO:
 * - <Navigate replace />: Al redirigir al `/login`, se usa `replace` para
 *   no guardar el intento fallido en el historial del navegador.
 * ============================================================================
 */
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();
  
  // Si está autenticado, renderiza la ruta solicitada. Si no, redirige al login.
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
