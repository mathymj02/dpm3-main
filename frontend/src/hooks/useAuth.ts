/**
 * ============================================================================
 * Archivo: useAuth.ts
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Exporta un custom hook (gancho personalizado) llamado `useAuth` para consumir 
 * fácilmente el contexto de autenticación en cualquier componente.
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * El patrón Custom Hooks en React permite encapsular lógica y abstraer 
 * dependencias. En lugar de importar `useContext` y `AuthContext` en cada 
 * archivo, solo se importa `useAuth()`.
 * 
 * DECISIONES DE DISEÑO:
 * - Fail-fast Guard: Si un desarrollador intenta usar `useAuth()` fuera de
 *   un `<AuthProvider>`, el hook lanzará un error descriptivo de inmediato.
 *   Esto previene fallos silenciosos y errores crípticos de "undefined".
 * ============================================================================
 */
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  // Validación estricta del uso del contexto dentro de su proveedor
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
