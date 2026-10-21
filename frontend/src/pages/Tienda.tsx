/**
 * ============================================================================
 * Archivo: Tienda.tsx
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Es el catálogo de productos estilo e-commerce para comprar indumentaria y 
 * accesorios del club.
 * 
 * DECISIONES DE DISEÑO / UX:
 * - E-commerce UX: Las tarjetas mantienen un alto constante. Las imágenes usan
 *   `object-contain` para no recortar productos irregulares. El botón de 
 *   "Agregar" se empuja al fondo (`mt-auto`) para que todos estén alineados.
 * - Formateo de Precios: Se utiliza la API nativa de JavaScript 
 *   `Intl.NumberFormat('es-CL')` para asegurar que el dinero siempre se 
 *   muestre en Pesos Chilenos (CLP) con separadores de miles ($ 39.990).
 * - Integración de Carrito: Antes de añadir a la API, el código verifica si
 *   el usuario está autenticado (`isAuthenticated`), de lo contrario bloquea 
 *   la acción con un Toast.
 * ============================================================================
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Producto } from '../types';
import api from '../api/axiosConfig';
import { Card } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';
import { useAuth } from '../hooks/useAuth';
import { toastSuccess, toastInfo } from '../components/ui/Toast';
import { FaShoppingCart } from 'react-icons/fa';
import { motion } from 'framer-motion';

export const Tienda = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoria, setCategoria] = useState('Todas');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductos = async () => {
      // 1. Revisar si el administrador tiene productos guardados en localStorage
      const savedProds = localStorage.getItem('dpm_productos_data');
      if (savedProds) {
        try {
          const parsed = JSON.parse(savedProds);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setProductos(parsed);
            setLoading(false);
            return;
          }
        } catch {}
      }

      try {
        const response = await api.get('/productos');
        setProductos(response.data);
      } catch (error) {
        setProductos([
          { id: '1', nombre: 'Polera Oficial DPM', precio: 15000, imagenUrl: '/images/polera.jpg', stock: 100, categoria: 'Indumentaria' },
          { id: '2', nombre: 'Short Oficial DPM', precio: 10000, imagenUrl: '/images/short.webp', stock: 80, categoria: 'Indumentaria' },
          { id: '3', nombre: 'Calcetas Oficiales', precio: 5000, imagenUrl: '/images/calcetas.webp', stock: 150, categoria: 'Indumentaria' },
          { id: '4', nombre: 'Gorro DPM Oficial', precio: 8000, imagenUrl: '/images/yoki.jpg', stock: 50, categoria: 'Accesorios' },
          { id: '5', nombre: 'Entrada Estadio Chinquihue', precio: 7000, imagenUrl: '/images/entrada.png', stock: 500, categoria: 'Tickets' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  const categorias = ['Todas', ...Array.from(new Set(productos.map(p => p.categoria)))];
  
  const filtrados = categoria === 'Todas' 
    ? productos 
    : productos.filter(p => p.categoria === categoria);

  const agregarAlCarrito = async (productoId: string) => {
    // Patrón Guardia de UX: Redirigir al login si el hincha no ha iniciado sesión
    if (!isAuthenticated) {
      toastInfo('Debes iniciar sesión con tu cuenta de hincha para agregar productos y comprar.');
      navigate('/login');
      return;
    }
    
    try {
      await api.post('/carrito/agregar', { productoId, cantidad: 1 });
      toastSuccess('Producto agregado al carrito.');
    } catch (error) {
      toastSuccess('Producto agregado al carrito (Simulado).');
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-black text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">Tienda Oficial DPM</h1>
      </div>

      <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
        {categorias.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoria(cat)}
            className={`px-5 py-2.5 rounded-full whitespace-nowrap font-bold text-xs sm:text-sm transition-all ${
              categoria === cat 
                ? 'bg-verde-dpm text-white shadow-lg border border-emerald-400/40' 
                : 'bg-slate-900/80 backdrop-blur text-slate-200 border border-white/15 hover:bg-white/20 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtrados.map((producto, i) => (
          <motion.div key={producto.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="flex flex-col h-full">
              <div className="p-4 bg-white flex justify-center h-48 items-center border-b border-gray-100">
                <img 
                  src={producto.imagenUrl} 
                  alt={producto.nombre} 
                  className="max-h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/polera.jpg';
                  }}
                />
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <span className="text-xs text-gray-500 mb-1">{producto.categoria}</span>
                <h3 className="font-bold text-lg mb-2 leading-tight">{producto.nombre}</h3>
                
                {/* Formateador de Moneda Nativo */}
                <p className="text-2xl font-bold text-verde-dpm mb-4 mt-auto">
                  {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(producto.precio)}
                </p>
                
                <button
                  onClick={() => agregarAlCarrito(producto.id)}
                  disabled={producto.stock === 0}
                  className="w-full flex justify-center items-center gap-2 bg-azul-dpm hover:bg-blue-900 text-white py-2 rounded-lg transition disabled:bg-gray-400"
                >
                  <FaShoppingCart />
                  {producto.stock > 0 ? 'Agregar al carrito' : 'Sin stock'}
                </button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
