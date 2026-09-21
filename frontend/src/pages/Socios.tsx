import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaShieldAlt, FaQrcode, FaStar, FaAward, FaUsers, FaChevronRight, FaDownload } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toastSuccess, toastInfo } from '../components/ui/Toast';

// Convenios reales extraídos de dpmchile.cl
const convenios = [
  {
    nombre: 'Subway',
    descuento: '15% Descuento',
    detalle: '15% todos los días a socios y 10% hinchas día de partido con entrada. Locales Guillermo Gallardo, Antonio Varas y Mall Costanera.',
    categoria: 'Gastronomía',
    logo: 'https://dpmchile.cl/wp-content/uploads/2026/05/Logo-Subway.png'
  },
  {
    nombre: 'Supermercados Cugat',
    descuento: '5% Descuento',
    detalle: '5% de descuento en la totalidad de compras en locales Cugat presentando credencial activa.',
    categoria: 'Supermercado',
    logo: 'https://dpmchile.cl/wp-content/uploads/2026/05/Logo-Cugat.webp'
  },
  {
    nombre: 'Pastelería Dolly',
    descuento: '5% Descuento',
    detalle: '5% de descuento en tiendas por compras en efectivo y tortas tradicionales.',
    categoria: 'Pastelería',
    logo: 'https://dpmchile.cl/wp-content/uploads/2026/05/Logo-Dolly.webp'
  },
  {
    nombre: 'Carnicería 3B',
    descuento: '10% Descuento',
    detalle: '10% de descuento en cortes seleccionados para el asado albiverde.',
    categoria: 'Carnicería',
    logo: 'https://dpmchile.cl/wp-content/uploads/2026/05/Logo-Carniceria-3B.webp'
  },
  {
    nombre: 'Óptica Hasse',
    descuento: '30% y 20% Descuento',
    detalle: 'Evaluación visual gratuita, 30% en marcos/lentes ópticos y 20% en lentes de sol.',
    categoria: 'Salud Visual',
    logo: 'https://dpmchile.cl/wp-content/uploads/2026/05/Logo-Optica-Hasse.webp'
  },
  {
    nombre: 'Automotriz Klein',
    descuento: '10% Descuento',
    detalle: '10% de descuento en repuestos y servicio técnico automotriz multimarcas.',
    categoria: 'Automotriz',
    logo: 'https://dpmchile.cl/wp-content/uploads/2026/05/Logo-Automotriz-Klein.webp'
  },
  {
    nombre: 'Café Plaza',
    descuento: '10% Descuento',
    detalle: '10% de descuento todos los días en cafetería de especialidad en el centro de Puerto Montt.',
    categoria: 'Cafetería',
    logo: 'https://dpmchile.cl/wp-content/uploads/2026/05/Logo-Cafe-Plaza.webp'
  },
  {
    nombre: 'Mundo Joven',
    descuento: '10% Descuento',
    detalle: '10% de descuento en vestuario juvenil y accesorios.',
    categoria: 'Vestuario',
    logo: 'https://dpmchile.cl/wp-content/uploads/2026/05/Logo-Mundo-Joven.webp'
  },
  {
    nombre: 'Centro de Eventos Los Robles',
    descuento: '20% Descuento',
    detalle: '20% de descuento de lunes a jueves y 10% viernes a domingo para eventos sociales.',
    categoria: 'Eventos',
    logo: 'https://dpmchile.cl/wp-content/uploads/2026/05/Logo-Centro-de-ventos-los-robles.webp'
  },
  {
    nombre: 'Cordonería Gato Félix',
    descuento: '10% Descuento',
    detalle: '10% de descuento en insumos de costura, lanas y mercería.',
    categoria: 'Comercio',
    logo: 'https://dpmchile.cl/wp-content/uploads/2026/05/Logo-Cordoneria-Gato-Felix.webp'
  }
];

const planes = [
  {
    id: 'galeria',
    nombre: 'Socio Galería Popular',
    precio: 6000,
    periodo: 'mensual',
    destacado: false,
    descripcion: 'Para el hincha fiel que canta los 90 minutos desde la Galería Sur del Chinquihue.',
    beneficios: [
      'Entrada liberada a Galería Sur en todos los partidos de local (Torneo y Copa Chile)',
      'Carnet Digital Oficial con código QR',
      'Acceso completo a la Red de Descuentos en comercios asociados',
      'Descuento del 10% en la Tienda Oficial DPM'
    ]
  },
  {
    id: 'tribuna',
    nombre: 'Socio Tribuna Chinquihue',
    precio: 14000,
    periodo: 'mensual',
    destacado: true,
    badge: 'MÁS ELEGIDO',
    descripcion: 'Disfruta la mejor vista de la bahía con la máxima comodidad y beneficios exclusivos.',
    beneficios: [
      'Entrada liberada a Tribuna Preferencial techada en todos los partidos',
      'Acceso rápido por puerta exclusiva para socios',
      'Carnet Digital con QR + Opción de credencial física',
      '15% de descuento en toda la Tienda Oficial',
      'Sorteos mensuales de camisetas autografiadas',
      'Derecho a voz en asambleas de socios'
    ]
  },
  {
    id: 'velero_vip',
    nombre: 'Socio Velero VIP',
    precio: 28000,
    periodo: 'mensual',
    destacado: false,
    descripcion: 'La experiencia premium para vivir la pasión del club con beneficios corporativos y honoríficos.',
    beneficios: [
      'Asiento numerado en Palco Oficial con catering en el entretiempo',
      'Camiseta Oficial Temporada 2026 incluida al completar 6 meses',
      'Estacionamiento asegurado dentro del Estadio Chinquihue',
      '20% de descuento en la Tienda Oficial',
      'Encuentro anual y cena con el plantel profesional',
      'Derecho a voz y voto en elecciones de directorio'
    ]
  }
];

export const Socios: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [planSeleccionado, setPlanSeleccionado] = useState<string>('tribuna');
  const [socioActivo, setSocioActivo] = useState<boolean>(false);

  const handleSuscribir = (planId: string) => {
    if (!isAuthenticated) {
      toastInfo('Debes iniciar sesión con tu cuenta de hincha para suscribirte como socio.');
      navigate('/login');
      return;
    }

    setPlanSeleccionado(planId);
    setSocioActivo(true);
    toastSuccess('¡Felicidades! Te has suscrito exitosamente. Tu Carnet Digital está activo.');
    // Scroll al carnet digital
    const element = document.getElementById('carnet-digital');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const planActualInfo = planes.find(p => p.id === planSeleccionado) || planes[1];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 text-white">
      
      {/* Hero Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden border border-white/15 bg-gradient-to-r from-azul-dpm via-slate-900 to-azul-dpm/90 p-8 sm:p-12 shadow-2xl"
      >
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amarillo-dpm/20 border border-amarillo-dpm/40 text-amarillo-dpm text-xs font-bold uppercase tracking-wider">
            <FaStar className="w-3.5 h-3.5" /> Sé Parte de la Pasión del Sur
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Hazte Socio de <span className="text-amarillo-dpm">Deportes Puerto Montt</span>
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            Entradas liberadas a todos los encuentros de local en el Estadio Chinquihue, descuentos exclusivos en más de 10 comercios de la Región de Los Lagos y tu credencial digital oficial instantánea.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <a 
              href="#planes" 
              className="bg-amarillo-dpm hover:bg-yellow-400 text-slate-950 font-bold px-6 py-3 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-2"
            >
              Ver Planes Disponibles <FaChevronRight className="w-3.5 h-3.5" />
            </a>
            <a 
              href="#convenios" 
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl border border-white/10 transition-all inline-flex items-center gap-2"
            >
              Red de Beneficios
            </a>
          </div>
        </div>

        {/* Decoración de fondo */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-azul-dpm-light/20 rounded-full blur-3xl pointer-events-none"></div>
      </motion.div>

      {/* Planes de Membresía */}
      <section id="planes" className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white">Elige Tu Modalidad de Socio</h2>
          <p className="text-gray-400 text-sm sm:text-base mt-2">
            Aporte 100% directo a las divisiones formativas y al plantel profesional del Velero.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {planes.map((plan) => (
            <motion.div
              key={plan.id}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.2 }}
              className={`relative rounded-3xl p-8 flex flex-col justify-between border transition-all ${
                plan.destacado
                  ? 'bg-gradient-to-b from-azul-dpm/90 to-slate-900 border-amarillo-dpm shadow-2xl shadow-amarillo-dpm/10'
                  : 'bg-slate-900/80 backdrop-blur-md border-white/10 hover:border-white/20'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-amarillo-dpm text-slate-950 font-black text-xs px-4 py-1 rounded-full uppercase tracking-wider shadow-md">
                  {plan.badge}
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold text-white">{plan.nombre}</h3>
                <p className="text-gray-400 text-xs mt-1.5">{plan.descripcion}</p>

                <div className="my-6">
                  <span className="text-4xl font-black text-white">
                    ${plan.precio.toLocaleString('es-CL')}
                  </span>
                  <span className="text-gray-400 text-sm ml-1.5 font-medium">CLP / {plan.periodo}</span>
                </div>

                <div className="space-y-3 pt-2 border-t border-white/10">
                  <p className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Beneficios incluidos:</p>
                  <ul className="space-y-2.5">
                    {plan.beneficios.map((b, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-300">
                        <FaCheckCircle className="w-3.5 h-3.5 text-amarillo-dpm shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-4">
                <button
                  onClick={() => handleSuscribir(plan.id)}
                  className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm transition-all shadow-lg ${
                    plan.destacado
                      ? 'bg-amarillo-dpm hover:bg-yellow-400 text-slate-950'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                  }`}
                >
                  {isAuthenticated ? 'Suscribirme a este Plan' : 'Iniciar Sesión para Suscribirme'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Carnet Digital Interactivo (Simulador de Credencial) */}
      <section id="carnet-digital" className="rounded-3xl border border-white/10 bg-slate-900/70 backdrop-blur-md p-8 sm:p-10 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1 text-amarillo-dpm text-xs font-bold uppercase tracking-wider">
            <FaQrcode className="w-4 h-4" /> Credencial Oficial Digital
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Tu Carnet de Socio Interactivo</h2>
          <p className="text-gray-400 text-xs sm:text-sm">
            Presenta este carnet digital directamente desde tu smartphone en las puertas del Estadio Chinquihue y en los comercios asociados.
          </p>
        </div>

        {/* Tarjeta Visual de Credencial */}
        <div className="max-w-md mx-auto">
          <div className="relative aspect-[1.586/1] rounded-2xl p-6 overflow-hidden border border-amber-400/40 bg-gradient-to-br from-azul-dpm via-slate-900 to-azul-dpm-light shadow-2xl flex flex-col justify-between text-white">
            {/* Holograma & Destellos */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-amarillo-dpm/15 rounded-full blur-2xl pointer-events-none"></div>

            {/* Cabecera del Carnet */}
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <img 
                  src="/images/logo-deportes-puertomontt.png" 
                  alt="Escudo Oficial DPM" 
                  className="w-12 h-12 object-contain filter drop-shadow-md"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div>
                  <h4 className="text-xs sm:text-sm font-black tracking-wider uppercase">Club Deportes Puerto Montt</h4>
                  <p className="text-[10px] text-amarillo-dpm font-bold uppercase tracking-widest">Carnet de Socio Oficial</p>
                </div>
              </div>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold uppercase">
                {socioActivo || isAuthenticated ? 'Activo 2026' : 'Vista Previa'}
              </span>
            </div>

            {/* Centro: Datos del Socio */}
            <div className="relative z-10 grid grid-cols-3 gap-2 items-center my-auto">
              <div className="col-span-2 space-y-1">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Nombre del Hincha</p>
                <p className="text-sm sm:text-base font-black truncate">
                  {isAuthenticated && user ? user.nombre : 'Matías Hincha Albiverde'}
                </p>
                <div className="flex gap-4 pt-1">
                  <div>
                    <p className="text-[9px] text-gray-400 uppercase">N° Socio</p>
                    <p className="text-xs font-mono font-bold text-amarillo-dpm">DPM-2026-0842</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-400 uppercase">Categoría</p>
                    <p className="text-xs font-bold text-white uppercase">{planActualInfo.nombre.replace('Socio ', '')}</p>
                  </div>
                </div>
              </div>

              {/* Código QR Simulado */}
              <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/95 text-slate-950 shadow-inner">
                <FaQrcode className="w-14 h-14 text-slate-900" />
                <span className="text-[8px] font-mono font-black mt-0.5">VALIDAR</span>
              </div>
            </div>

            {/* Pie del Carnet */}
            <div className="flex items-center justify-between border-t border-white/15 pt-2 relative z-10 text-[9px] text-gray-300">
              <span>Estadio Chinquihue · Puerto Montt</span>
              <span className="font-mono">Vence: 31/12/2026</span>
            </div>
          </div>

          <div className="flex justify-center gap-3 mt-4">
            <button 
              onClick={() => toastSuccess('Carnet Digital guardado en caché para acceso sin conexión.')}
              className="inline-flex items-center gap-1.5 text-xs text-amarillo-dpm hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg border border-white/10"
            >
              <FaDownload className="w-3.5 h-3.5" /> Descargar Credencial
            </button>
          </div>
        </div>
      </section>

      {/* Red de Convenios y Descuentos Oficiales */}
      <section id="convenios" className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1 text-amarillo-dpm text-xs font-bold uppercase tracking-wider mb-2">
            <FaAward className="w-4 h-4" /> Comercio Local Unido al Club
          </div>
          <h2 className="text-3xl font-extrabold text-white">Red de Descuentos en Puerto Montt</h2>
          <p className="text-gray-400 text-sm mt-2">
            Muestra tu Carnet de Socio Digital o físico en estos comercios asociados de la ciudad y accede a descuentos exclusivos.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {convenios.map((c, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              className="rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/10 p-6 flex flex-col justify-between hover:border-amarillo-dpm/40 transition-all shadow-lg"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-azul-dpm/40 border border-azul-dpm-light/40 text-blue-200 uppercase">
                    {c.categoria}
                  </span>
                  <span className="text-sm font-black text-amarillo-dpm bg-amber-400/10 border border-amber-400/30 px-3 py-1 rounded-lg">
                    {c.descuento}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 p-2 flex items-center justify-center shrink-0">
                    <img 
                      src={c.logo} 
                      alt={c.nombre} 
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">{c.nombre}</h4>
                    <p className="text-xs text-gray-400 leading-relaxed mt-1">{c.detalle}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
                <span>Válido con carnet de socio</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <FaShieldAlt className="w-3.5 h-3.5" /> Verificado
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Transparencia y Directorio Institucional */}
      <section className="rounded-3xl border border-white/10 bg-slate-950/60 p-8 sm:p-10 space-y-6">
        <div className="flex items-center gap-3">
          <FaUsers className="w-6 h-6 text-amarillo-dpm" />
          <h3 className="text-xl font-bold text-white">Directorio y Estatutos de la Corporación</h3>
        </div>
        <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
          De acuerdo con los estatutos vigentes de Club de Deportes Puerto Montt, los socios al día cuentan con derecho a participar en las asambleas generales, velar por la sustentabilidad financiera y elegir democráticamente a los representantes de la institución.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 text-xs">
          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <p className="text-gray-400 font-medium">Presidenta</p>
            <p className="text-white font-bold mt-0.5">Mariana Krauss</p>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <p className="text-gray-400 font-medium">Vicepresidente</p>
            <p className="text-white font-bold mt-0.5">Héctor Gaete</p>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <p className="text-gray-400 font-medium">Secretario</p>
            <p className="text-white font-bold mt-0.5">Marco Gallardo</p>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <p className="text-gray-400 font-medium">Tesorero</p>
            <p className="text-white font-bold mt-0.5">Claudio Bustamante</p>
          </div>
        </div>
      </section>

    </div>
  );
};
export default Socios;
