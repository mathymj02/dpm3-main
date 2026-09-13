/**
 * ============================================================================
 * Archivo: AdminDashboard.tsx
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Es el Panel de Control (Backoffice) exclusivo para empleados del club con 
 * rol de Administrador. Permite gestionar inventario y contenido de la web.
 * 
 * DECISIONES DE DISEÑO / UX:
 * - Arquitectura del Panel (Tabs & CRUD): Para evitar crear múltiples páginas 
 *   `/admin/jugadores`, `/admin/tienda`, etc., se diseñó como una Single 
 *   Page Application (SPA) interna usando Pestañas (Tabs) que cambian el estado 
 *   activo (`activeTab`) renderizando diferentes tablas CRUD 
 *   (Crear, Leer, Actualizar, Eliminar) en el mismo lugar.
 * - Role-Based Protection: Este componente NO es accesible por un usuario 
 *   normal. Como se explicó en `AdminRoute.tsx`, el Router impide renderizar
 *   este componente si el payload del JWT indica que el rol no es ADMIN.
 * ============================================================================
 */
import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { toastSuccess } from '../components/ui/Toast';

export const AdminDashboard = () => {
  // Manejo de estado para las pestañas de navegación interna
  const [activeTab, setActiveTab] = useState<'jugadores' | 'productos' | 'novedades'>('jugadores');

  const stats = [
    { name: 'Total Jugadores', value: '24' },
    { name: 'Total Productos', value: '15' },
    { name: 'Total Novedades', value: '8' },
  ];

  const handleAction = (action: string) => {
    // Placeholder para acciones reales con la API
    toastSuccess(`Acción simulada: ${action}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-azul-dpm mb-8">Panel de Administración</h1>

      {/* Tarjetas de Estadísticas Rápidas (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map(stat => (
          <Card key={stat.name} className="p-6 bg-white border-l-4 border-verde-dpm">
            <h3 className="text-sm font-medium text-gray-500">{stat.name}</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Contenedor Principal (Tabs + Tabla) */}
      <div className="bg-white rounded-lg shadow">
        {/* Navegación por Pestañas */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px px-6 gap-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('jugadores')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'jugadores'
                  ? 'border-verde-dpm text-verde-dpm'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Jugadores
            </button>
            <button
              onClick={() => setActiveTab('productos')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'productos'
                  ? 'border-verde-dpm text-verde-dpm'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Productos
            </button>
            <button
              onClick={() => setActiveTab('novedades')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'novedades'
                  ? 'border-verde-dpm text-verde-dpm'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Novedades
            </button>
          </nav>
        </div>

        {/* Contenido Dinámico de la Pestaña Seleccionada */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900 capitalize">{activeTab}</h2>
            <button 
              onClick={() => handleAction(`Crear ${activeTab}`)}
              className="bg-verde-dpm text-white px-4 py-2 rounded text-sm font-medium hover:bg-green-700 transition"
            >
              + Agregar
            </button>
          </div>

          <div className="border rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre/Título</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Ejemplo de {activeTab}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleAction('Editar')} className="text-blue-600 hover:text-blue-900 mr-4">Editar</button>
                    <button onClick={() => handleAction('Eliminar')} className="text-red-600 hover:text-red-900">Eliminar</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
