/**
 * ============================================================================
 * Archivo: Toast.tsx
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Exporta funciones de utilidad (helpers) para disparar notificaciones
 * de éxito, error e información utilizando `react-toastify`.
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * ¿Por qué Toastify sobre alert() nativo?
 * 1. `alert()` bloquea la ejecución de JavaScript y la interacción en la página
 *    hasta que el usuario lo cierra, creando una pésima experiencia de usuario.
 * 2. Los Toasts de React son asíncronos, estilizados y desaparecen solos.
 * 
 * DECISIONES DE DISEÑO / UX:
 * - Estilos consistentes: Se sobrescriben las clases por defecto del plugin
 *   para inyectar clases de Tailwind (`bg-white`, `border-l-4`, `shadow-md`),
 *   lo que garantiza que las notificaciones sigan el sistema de diseño
 *   del Club Deportes Puerto Montt (usando verde-dpm, azul-dpm, etc).
 * ============================================================================
 */
import { toast } from 'react-toastify';

export const toastSuccess = (message: string) => {
  toast.success(message, {
    className: 'bg-white text-gray-900 border-l-4 border-verde-dpm shadow-md rounded-md',
  });
};

export const toastError = (message: string) => {
  toast.error(message, {
    className: 'bg-white text-gray-900 border-l-4 border-red-500 shadow-md rounded-md',
  });
};

export const toastInfo = (message: string) => {
  toast.info(message, {
    className: 'bg-white text-gray-900 border-l-4 border-azul-dpm shadow-md rounded-md',
  });
};
