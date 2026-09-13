/**
 * ============================================================================
 * Archivo: Login.tsx
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Proporciona el formulario de inicio de sesión para los usuarios.
 * 
 * DECISIONES DE DISEÑO / UX:
 * - react-hook-form: Se utiliza para el manejo del formulario. Evita 
 *   re-renderizados innecesarios en cada pulsación de tecla y simplifica 
 *   las validaciones (ej. `required`, formatos).
 * - Toast Feedback: Provee respuesta visual inmediata (éxito o error) para que
 *   el usuario sepa exactamente si sus credenciales fueron aceptadas o no.
 * ============================================================================
 */
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoginRequest } from '../types';
import { toastSuccess, toastError } from '../components/ui/Toast';
import { Card } from '../components/ui/Card';

export const Login = () => {
  // Inicialización de react-hook-form
  const { register, handleSubmit, formState: { errors } } = useForm<LoginRequest>();
  const { login } = useAuth();
  const navigate = useNavigate();

  // Función ejecutada si el formulario es válido
  const onSubmit = async (data: LoginRequest) => {
    try {
      await login(data); // Llama al contexto de auth que hace la petición
      toastSuccess('¡Bienvenido a DPM!');
      navigate('/'); // Redirige al inicio
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 400) {
        toastError('Credenciales incorrectas. Verifica tu correo y contraseña.');
      } else if (error.message === 'Network Error' || !error.response) {
        toastError('No se pudo conectar con el servidor backend (puerto 8080). Asegúrate de que esté iniciado.');
      } else {
        toastError('Error al iniciar sesión. Intenta nuevamente.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 z-0 opacity-40 bg-[url('/images/EstadioChinquihue.png')] bg-cover bg-center"></div>
      
      {/* Contenedor difuminado (backdrop-blur) sobre el fondo */}
      <Card className="max-w-md w-full p-8 relative z-10 bg-white/95 backdrop-blur">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-azul-dpm">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <Link to="/registro" className="font-medium text-verde-dpm hover:text-green-700">
              Regístrate aquí
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
              <input
                type="email"
                {...register('email', { required: 'El correo es requerido' })}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-verde-dpm focus:border-verde-dpm sm:text-sm"
                placeholder="correo@ejemplo.com"
              />
              {/* Mensaje de error condicional */}
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contraseña</label>
              <input
                type="password"
                {...register('password', { required: 'La contraseña es requerida' })}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-verde-dpm focus:border-verde-dpm sm:text-sm"
                placeholder="********"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-verde-dpm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-verde-dpm transition"
            >
              Entrar
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};
