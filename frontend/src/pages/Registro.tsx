/**
 * ============================================================================
 * Archivo: Registro.tsx
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Permite a los nuevos usuarios crear una cuenta en la aplicación.
 * 
 * DECISIONES DE DISEÑO / UX:
 * - Validación exhaustiva en frontend: Previene peticiones inútiles al servidor.
 *   Usa reglas de React Hook Form para expresiones regulares (email válido),
 *   longitud mínima (6 caracteres para contraseña) y confirmación de clave.
 * - `watch('password')`: Hook interno para leer en vivo lo que el usuario 
 *   escribe en el campo de contraseña y compararlo en tiempo real con 
 *   el campo "Confirmar Contraseña".
 * ============================================================================
 */
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { RegisterRequest } from '../types';
import { toastSuccess, toastError } from '../components/ui/Toast';
import { Card } from '../components/ui/Card';

export const Registro = () => {
  const { register: registerForm, handleSubmit, watch, formState: { errors } } = useForm<RegisterRequest & { confirmPassword?: string }>();
  const { register } = useAuth();
  const navigate = useNavigate();

  // Observa el campo de contraseña para validar la confirmación
  const password = watch('password');

  const onSubmit = async (data: RegisterRequest) => {
    try {
      await register({
        nombre: data.nombre,
        email: data.email,
        password: data.password
      });
      toastSuccess('¡Registro exitoso! Bienvenido a DPM.');
      navigate('/');
    } catch (error: any) {
      if (error.response?.data?.message) {
        toastError(error.response.data.message);
      } else if (error.response?.data?.error) {
        toastError(error.response.data.error);
      } else if (error.message === 'Network Error' || !error.response) {
        toastError('No se pudo conectar con el servidor backend (puerto 8080). Asegúrate de que esté iniciado.');
      } else {
        toastError('No se pudo completar el registro. Verifica los datos ingresados.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 z-0 opacity-40 bg-[url('/images/EstadioChinquihue.png')] bg-cover bg-center"></div>
      
      <Card className="max-w-md w-full p-8 relative z-10 bg-white/95 backdrop-blur">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-azul-dpm">
            Crear Cuenta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="font-medium text-verde-dpm hover:text-green-700">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
            <input
              type="text"
              {...registerForm('nombre', { required: 'El nombre es requerido' })}
              className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-verde-dpm focus:border-verde-dpm sm:text-sm"
            />
            {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
            <input
              type="email"
              {...registerForm('email', { 
                required: 'El correo es requerido',
                pattern: { value: /^\S+@\S+$/i, message: 'Formato de correo inválido' } // Validación de Email
              })}
              className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-verde-dpm focus:border-verde-dpm sm:text-sm"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              {...registerForm('password', { 
                required: 'La contraseña es requerida',
                minLength: { value: 6, message: 'Mínimo 6 caracteres' } // Longitud mínima de seguridad
              })}
              className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-verde-dpm focus:border-verde-dpm sm:text-sm"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirmar Contraseña</label>
            <input
              type="password"
              {...registerForm('confirmPassword', { 
                required: 'Confirma tu contraseña',
                validate: value => value === password || 'Las contraseñas no coinciden' // Custom rule
              })}
              className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-verde-dpm focus:border-verde-dpm sm:text-sm"
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-verde-dpm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-verde-dpm transition"
            >
              Registrarse
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};
