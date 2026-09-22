/**
 * ============================================================================
 * Archivo: Login.tsx
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Proporciona el formulario de inicio de sesión para hinchas y administradores
 * con diseño minimalista verde institucional, ambientación del Chinquihue y
 * accesos rápidos debidamente espaciados para demostraciones.
 * ============================================================================
 */
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoginRequest } from '../types';
import { toastSuccess, toastError } from '../components/ui/Toast';
import { FaLock, FaEnvelope, FaUserShield, FaTicketAlt } from 'react-icons/fa';

export const Login = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<LoginRequest>();
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginRequest) => {
    try {
      await login(data);
      toastSuccess('¡Bienvenido a DPM Pro!');
      navigate('/');
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
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      
      {/* Tarjeta Principal de Login: Verde Institucional Minimalista */}
      <div className="max-w-md w-full bg-gradient-to-b from-slate-900/95 via-emerald-950/90 to-slate-950/95 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 text-white space-y-6">
        
        {/* Encabezado */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-emerald-400/30 p-2.5 shadow-xl mb-2">
            <img 
              src="/images/logo-deportes-puertomontt.png" 
              alt="Club Deportes Puerto Montt" 
              className="w-full h-full object-contain drop-shadow-md"
            />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            Iniciar Sesión
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200/80 font-medium">
            Ingresa a tu cuenta oficial de hincha o administración
          </p>
        </div>

        {/* Formulario */}
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            
            {/* Campo Email */}
            <div>
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <FaEnvelope className="text-emerald-400" /> Correo Electrónico
              </label>
              <input
                type="email"
                {...register('email', { required: 'El correo es requerido' })}
                className="w-full bg-slate-950/80 border border-emerald-500/30 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 transition shadow-inner"
                placeholder="ejemplo@dpm.cl"
              />
              {errors.email && <p className="text-rose-400 text-xs mt-1 font-semibold">{errors.email.message}</p>}
            </div>

            {/* Campo Contraseña */}
            <div>
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <FaLock className="text-emerald-400" /> Contraseña
              </label>
              <input
                type="password"
                {...register('password', { required: 'La contraseña es requerida' })}
                className="w-full bg-slate-950/80 border border-emerald-500/30 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 transition shadow-inner"
                placeholder="••••••••"
              />
              {errors.password && <p className="text-rose-400 text-xs mt-1 font-semibold">{errors.password.message}</p>}
            </div>

          </div>

          {/* Botón Principal */}
          <div>
            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm uppercase tracking-wider rounded-xl shadow-xl hover:shadow-emerald-500/25 transition-all border border-emerald-400/40 transform active:scale-[0.98]"
            >
              Entrar a la Plataforma
            </button>
          </div>

          <div className="text-center pt-2">
            <span className="text-xs text-slate-300">
              ¿Aún no tienes cuenta?{' '}
              <Link to="/registro" className="font-bold text-emerald-400 hover:text-emerald-300 hover:underline">
                Hazte socio o regístrate aquí
              </Link>
            </span>
          </div>
        </form>
      </div>

      {/* SECCIÓN INDEPENDIENTE: Modo Demostración y Pruebas Rápidas (Espaciado Elegante) */}
      <div className="mt-8 max-w-md w-full bg-slate-900/85 backdrop-blur-md border border-white/15 rounded-2xl p-5 shadow-2xl relative z-10 text-white space-y-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <span className="text-xs font-black uppercase tracking-wider text-amarillo-dpm flex items-center gap-1.5">
            <FaUserShield /> Accesos de Demostración (1 Clic)
          </span>
          <span className="text-[10px] font-mono text-slate-400">Examen / Jurado</span>
        </div>

        <p className="text-xs text-slate-300">
          Usa estos accesos directos para probar las funciones sin tener que escribir las credenciales a mano:
        </p>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={() => {
              setValue('email', 'admin@dpm.cl');
              setValue('password', 'admin123');
              onSubmit({ email: 'admin@dpm.cl', password: 'admin123' });
            }}
            className="bg-azul-dpm hover:bg-blue-800 text-white text-xs font-black py-2.5 px-3 rounded-xl transition text-center shadow-md border border-sky-400/40 flex items-center justify-center gap-1.5"
          >
            <FaUserShield /> Modo Admin
          </button>
          
          <button
            type="button"
            onClick={() => {
              setValue('email', 'hincha@dpm.cl');
              setValue('password', 'hincha123');
              onSubmit({ email: 'hincha@dpm.cl', password: 'hincha123' });
            }}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black py-2.5 px-3 rounded-xl transition text-center shadow-md border border-emerald-400/40 flex items-center justify-center gap-1.5"
          >
            <FaTicketAlt /> Modo Hincha
          </button>
        </div>

        <div className="text-[11px] text-slate-400 bg-black/40 p-2.5 rounded-xl border border-white/5 space-y-0.5">
          <div>• <strong>Admin:</strong> <code className="text-sky-300">admin@dpm.cl</code> / <code className="text-sky-300">admin123</code></div>
          <div>• <strong>Hincha:</strong> <code className="text-emerald-300">hincha@dpm.cl</code> / <code className="text-emerald-300">hincha123</code></div>
        </div>
      </div>

    </div>
  );
};
