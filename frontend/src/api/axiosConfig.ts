/**
 * ============================================================================
 * Archivo: axiosConfig.ts
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Configura una instancia global de Axios (cliente HTTP) para realizar 
 * peticiones al servidor backend. Define interceptores (middlewares de peticiones)
 * para modificar la request antes de salir o la response al llegar.
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * Se prefiere Axios sobre el `fetch` nativo porque:
 * 1. Transforma JSON automáticamente.
 * 2. Facilita la creación de interceptores (cruciales para autenticación).
 * 3. Lanza errores (throw errors) en códigos de estado no 2xx, simplificando
 *    el bloque catch en las promesas.
 * 
 * DECISIONES DE SEGURIDAD Y DISEÑO (INTERCEPTOR PATTERN):
 * - Interceptor de Petición (Request): Antes de que cada llamada salga al server,
 *   busca si hay un token JWT en el localStorage. Si lo hay, lo adjunta en los 
 *   headers (Authorization: Bearer <token>). Así se automatiza la seguridad.
 * - Interceptor de Respuesta (Response): Monitorea cada respuesta del servidor.
 *   Si detecta un código 401 (Unauthorized), significa que el token expiró o es
 *   inválido. En ese caso, fuerza el cierre de sesión, borra los datos locales
 *   y redirige al usuario a la página de login automáticamente.
 * ============================================================================
 */
import axios from 'axios';
import type { AxiosInstance } from 'axios';

// Crea una instancia personalizada para configurar la URL base de la API
const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api', // Ruta al backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Se ejecuta ANTES de que la petición salga del navegador
api.interceptors.request.use(
  (config) => {
    // Buscar el JWT del usuario autenticado
    const token = localStorage.getItem('token');
    
    // Si existe, inyectarlo en el header 'Authorization'
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor: Se ejecuta CUANDO llega la respuesta del servidor (antes de pasar al componente)
api.interceptors.response.use(
  (response) => response, // Si todo sale bien, la devuelve normal
  (error) => {
    // Si la API responde con un 401 Unauthorized (No autorizado / Sesión expirada)
    if (error.response && error.response.status === 401) {
      // Limpiar datos corruptos o caducados
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirigir al inicio de sesión obligatoriamente
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
