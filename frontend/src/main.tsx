/**
 * ============================================================================
 * Archivo: main.tsx
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Es el punto de entrada de React en la aplicación. Se encarga de inicializar
 * el DOM virtual de React e inyectarlo en el elemento `#root` del index.html.
 * Además, envuelve (wraps) toda la aplicación con los Providers (proveedores
 * de contexto) necesarios para su funcionamiento.
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * React.StrictMode se utiliza durante el desarrollo para detectar problemas 
 * potenciales (ej. métodos del ciclo de vida obsoletos, efectos secundarios).
 * 
 * DECISIONES DE DISEÑO:
 * - Providers: 
 *   - BrowserRouter: Para manejar las rutas mediante URL.
 *   - AuthProvider: Para exponer el estado de autenticación (sesión) a 
 *     cualquier componente hijo en toda la aplicación.
 *   - ToastContainer: Para renderizar las notificaciones de react-toastify 
 *     en el nivel superior del árbol y asegurar que se sobrepongan a la UI.
 * ============================================================================
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import App from './App';
import './styles/globals.css';
import { AuthProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Habilita el enrutamiento y la navegación por URL */}
    <BrowserRouter>
      {/* Proveedor de autenticación global */}
      <AuthProvider>
        {/* Componente raíz de la app */}
        <App />
        {/* Contenedor global para mostrar notificaciones Toast. 
            Se configura para que aparezcan arriba a la derecha y duren 3 segundos */}
        <ToastContainer position="top-right" autoClose={3000} />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
