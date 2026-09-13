/**
 * ============================================================================
 * Archivo: App.tsx
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Define la arquitectura de rutas (routing) de toda la aplicación. Asocia las
 * URLs del navegador con los componentes (Páginas) que deben renderizarse.
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * Utilizamos `react-router-dom` v6, que proporciona una sintaxis declarativa
 * y basada en componentes para definir las rutas. Permite renderización
 * anidada y protección de rutas.
 * 
 * DECISIONES DE DISEÑO:
 * - Layout Wrapper: La ruta raíz ("/") carga el componente `<Layout />`. 
 *   Todas las demás rutas son "hijas" de este Layout, lo que permite que el
 *   Navbar y Footer se mantengan constantes, y solo cambie el contenido 
 *   central (gracias a `<Outlet />` en Layout.tsx).
 * - Rutas Protegidas (Guards): 
 *   - `<PrivateRoute />` envuelve a "carrito", impidiendo el acceso a 
 *     usuarios no autenticados.
 *   - `<AdminRoute />` envuelve a "admin", permitiendo el acceso SOLO
 *     a usuarios con rol "ADMIN".
 * ============================================================================
 */
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { PrivateRoute } from './guards/PrivateRoute';
import { AdminRoute } from './guards/AdminRoute';

import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Registro } from './pages/Registro';
import { Jugadores } from './pages/Jugadores';
import { JugadorDetalle } from './pages/JugadorDetalle';
import { Tienda } from './pages/Tienda';
import { Carrito } from './pages/Carrito';
import { Novedades } from './pages/Novedades';
import { NovedadDetalle } from './pages/NovedadDetalle';
import { Historia } from './pages/Historia';
import { Posiciones } from './pages/Posiciones';
import { Socios } from './pages/Socios';
import { AdminDashboard } from './pages/AdminDashboard';

function App() {
  return (
    <Routes>
      {/* El componente Layout se renderiza siempre. Su <Outlet /> muestra las rutas hijas */}
      <Route path="/" element={<Layout />}>
        {/* Rutas Públicas (Navegación libre para todos los hinchas y visitantes) */}
        <Route index element={<Home />} />
        <Route path="socios" element={<Socios />} />
        <Route path="login" element={<Login />} />
        <Route path="registro" element={<Registro />} />
        <Route path="jugadores" element={<Jugadores />} />
        <Route path="jugadores/:id" element={<JugadorDetalle />} />
        <Route path="tienda" element={<Tienda />} />
        <Route path="novedades" element={<Novedades />} />
        <Route path="novedades/:id" element={<NovedadDetalle />} />
        <Route path="historia" element={<Historia />} />
        <Route path="posiciones" element={<Posiciones />} />
        
        {/* Rutas Protegidas (Exige inicio de sesión obligatorio para transaccionar) */}
        <Route element={<PrivateRoute />}>
          <Route path="carrito" element={<Carrito />} />
        </Route>

        {/* Rutas de Administrador (Solo usuarios autenticados Y con rol ADMIN) */}
        <Route element={<AdminRoute />}>
          <Route path="admin" element={<AdminDashboard />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
