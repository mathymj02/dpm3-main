/**
 * ============================================================================
 * Archivo: AdminRoute.tsx
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Actúa como "Guardia de Ruta" basado en roles (Role-Based Access Control - RBAC).
 * Impide el acceso a vistas administrativas a usuarios que no tengan el rol 'ADMIN'.
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * Al igual que PrivateRoute, utiliza la arquitectura de React Router v6.
 * Esta protección en el Frontend mejora la UX escondiendo páginas no autorizadas.
 * (Recordatorio: La API Backend SIEMPRE es la autoridad final para permisos).
 * ============================================================================
 */
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const AdminRoute = () => {
  const { isAdmin } = useAuth();
  
  // Si es ADMIN, permite pasar. Si no lo es (o no hay sesión), redirige a Inicio.
  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};
