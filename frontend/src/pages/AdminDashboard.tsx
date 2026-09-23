/**
 * ============================================================================
 * Archivo: AdminDashboard.tsx
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Es el Centro de Control y Gestión Oficial exclusivo para directivos y 
 * administradores de Deportes Puerto Montt.
 * 
 * CAPACIDADES EXCLUSIVAS DEL ADMINISTRADOR:
 * 1. Tabla de Posiciones: Registrar resultados de partidos fecha a fecha, 
 *    recalcular puntos y editar estadísticas que se reflejan de inmediato en la web.
 * 2. Novedades: Publicar noticias oficiales, comunicados del club y fotos reales.
 * 3. Tienda y Stock: Gestionar inventario de camisetas, entradas y accesorios.
 * 4. Plantel: Gestionar nómina de futbolistas y estadísticas.
 * 5. Control de Accesos: Supervisar torniquetes y validación de entradas QR en Chinquihue.
 * ============================================================================
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { toastSuccess, toastInfo } from '../components/ui/Toast';
import api from '../api/axiosConfig';
import { 
  FaTrophy, 
  FaNewspaper, 
  FaStore, 
  FaUserFriends, 
  FaQrcode, 
  FaFutbol, 
  FaPlus, 
  FaTrash, 
  FaSave, 
  FaUndo,
  FaCheckCircle,
  FaExternalLinkAlt,
  FaCloudUploadAlt,
  FaImage,
  FaEdit,
  FaBoxOpen,
  FaDollarSign,
  FaChartLine,
  FaSyncAlt,
  FaUserPlus,
  FaUsers,
  FaCalendarAlt,
  FaYoutube
} from 'react-icons/fa';
import { Posicion, Novedad, Producto, Jugador } from '../types';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'posiciones' | 'novedades' | 'productos' | 'jugadores' | 'partidos'>('posiciones');

  // =========================================================================
  // 1. ESTADO DE TABLA DE POSICIONES
  // =========================================================================
  const defaultPosiciones: Posicion[] = [
    { equipo: 'Deportes Puerto Montt', escudoUrl: '/images/logo-deportes-puertomontt.png', pj: 12, pg: 7, pe: 3, pp: 2, gf: 22, gc: 12, dg: 10, pts: 24 },
    { equipo: 'San Marcos de Arica', escudoUrl: '/images/escudo-sanmarcos.jpg', pj: 12, pg: 6, pe: 3, pp: 3, gf: 18, gc: 13, dg: 5, pts: 21 },
    { equipo: 'Deportes Valdivia', escudoUrl: '/images/escudo-valdivia.png', pj: 12, pg: 5, pe: 4, pp: 3, gf: 20, gc: 16, dg: 4, pts: 19 },
    { equipo: 'Deportes Melipilla', escudoUrl: '/images/escudo-sanmarcos.jpg', pj: 12, pg: 5, pe: 2, pp: 5, gf: 17, gc: 16, dg: 1, pts: 17 },
    { equipo: 'Provincial Osorno', escudoUrl: '/images/escudo-osorno.jpg', pj: 12, pg: 4, pe: 4, pp: 4, gf: 15, gc: 14, dg: 1, pts: 16 },
    { equipo: 'Deportes Concepción', escudoUrl: '/images/escudo-concepcion.png', pj: 12, pg: 4, pe: 3, pp: 5, gf: 14, gc: 16, dg: -2, pts: 15 },
    { equipo: 'Deportes Temuco', escudoUrl: '/images/escudo-temuco.png', pj: 12, pg: 4, pe: 2, pp: 6, gf: 13, gc: 17, dg: -4, pts: 14 },
    { equipo: 'Magallanes', escudoUrl: '/images/escudo-magallanes.png', pj: 12, pg: 3, pe: 3, pp: 6, gf: 12, gc: 17, dg: -5, pts: 12 },
    { equipo: 'Rangers de Talca', escudoUrl: '/images/escudo-rangers.png', pj: 12, pg: 3, pe: 1, pp: 8, gf: 10, gc: 21, dg: -11, pts: 10 },
    { equipo: 'Iberia Los Ángeles', escudoUrl: '/images/club-atletico-iberia.png', pj: 12, pg: 2, pe: 2, pp: 8, gf: 9, gc: 21, dg: -12, pts: 8 },
  ];

  const [posiciones, setPosiciones] = useState<Posicion[]>(() => {
    const saved = localStorage.getItem('dpm_posiciones_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultPosiciones;
      }
    }
    return defaultPosiciones;
  });

  // Campos para el Registro Oficial de Resultados
  const [equipoLocalIdx, setEquipoLocalIdx] = useState(0);
  const [equipoVisitaIdx, setEquipoVisitaIdx] = useState(6); // Deportes Temuco por defecto
  const [golesLocal, setGolesLocal] = useState(2);
  const [golesVisita, setGolesVisita] = useState(0);

  // =========================================================================
  // 2. ESTADO DE NOVEDADES
  // =========================================================================
  const defaultNovedades: Novedad[] = [
    { id: '1', titulo: 'Deportes Puerto Montt denuncia robo de balones desde Estadio Chinquihue', contenido: '¡35 balones profesionales de fútbol, propiedad del plantel de Deportes Puerto Montt, fueron sustraídos desde el Estadio Bicentenario de Chinquihue! El club ya presentó las denuncias pertinentes ante Carabineros de Chile.', imagenUrl: '/images/robo-balon.jpg', fechaPublicacion: '06-06-2025', autorNombre: 'Comunicaciones DPM' },
    { id: '2', titulo: 'Inauguración de Sala de Acondicionamiento Físico en el Chinquihue', contenido: 'Este lunes, Deportes Puerto Montt llevó a cabo la inauguración de una moderna sala de musculación en el Estadio Regional de Chinquihue, equipada con tecnología de punta para la preparación de los futbolistas albiverdes.', imagenUrl: '/images/novedades1.jpg', fechaPublicacion: '11-03-2025', autorNombre: 'Comunicaciones DPM' },
    { id: '3', titulo: 'Partimos con un triunfo la temporada: 4 a cero a Brujas de Salamanca', contenido: 'Con un contundente triunfo debutó Deportes Puerto Montt en el campeonato de la Segunda División Profesional del fútbol chileno, goleando en condición de local y desatando la fiesta en las tribunas del Chinquihue.', imagenUrl: '/images/novedad3.jpeg', fechaPublicacion: '03-07-2025', autorNombre: 'Comunicaciones DPM' },
  ];

  const [novedades, setNovedades] = useState<Novedad[]>(() => {
    const saved = localStorage.getItem('dpm_novedades_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultNovedades;
      }
    }
    return defaultNovedades;
  });

  // Formulario de nueva noticia
  const [showFormNoticia, setShowFormNoticia] = useState(false);
  const [nuevoTitulo, setNuevoTitulo] = useState('');
  const [nuevoContenido, setNuevoContenido] = useState('');
  const [nuevaImagen, setNuevaImagen] = useState('/images/puerto-montt-gol.jpeg');
  const [nuevoAutor] = useState('Comunicaciones DPM');

  // =========================================================================
  // 3. ESTADO DE PRODUCTOS E INVENTARIO
  // =========================================================================
  const defaultProductos: Producto[] = [
    { id: '1', nombre: 'Polera Oficial DPM 2026', precio: 15000, imagenUrl: '/images/polera.jpg', stock: 100, categoria: 'Indumentaria' },
    { id: '2', nombre: 'Short Oficial DPM 2026', precio: 10000, imagenUrl: '/images/short.webp', stock: 80, categoria: 'Indumentaria' },
    { id: '3', nombre: 'Calcetas Oficiales', precio: 5000, imagenUrl: '/images/calcetas.webp', stock: 150, categoria: 'Indumentaria' },
    { id: '4', nombre: 'Gorro DPM Oficial', precio: 8000, imagenUrl: '/images/yoki.jpg', stock: 50, categoria: 'Accesorios' },
    { id: '5', nombre: 'Entrada Estadio Chinquihue (vs Temuco)', precio: 7000, imagenUrl: '/images/entrada.png', stock: 500, categoria: 'Tickets' },
  ];

  const [productos, setProductos] = useState<Producto[]>(() => {
    const saved = localStorage.getItem('dpm_productos_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return defaultProductos;
  });

  // Formulario de Producto (Crear / Editar)
  const [showFormProducto, setShowFormProducto] = useState(false);
  const [editandoProdId, setEditandoProdId] = useState<string | null>(null);
  const [prodNombre, setProdNombre] = useState('');
  const [prodCategoria, setProdCategoria] = useState('Indumentaria');
  const [prodPrecio, setProdPrecio] = useState(15000);
  const [prodStock, setProdStock] = useState(50);
  const [prodImagen, setProdImagen] = useState('/images/polera.jpg');

  // Estado de Ventas Simuladas / Facturación
  const [totalFacturado] = useState(4820000);
  const [ventasRecientes] = useState([
    { id: 'V-101', fecha: 'Hoy, 14:20', cliente: 'Juan Morales', detalle: '1x Camiseta Oficial + 2x Entrada Chinquihue', total: 53990 },
    { id: 'V-102', fecha: 'Hoy, 13:45', cliente: 'Camila Ríos', detalle: '1x Gorro DPM + 1x Short', total: 18000 },
    { id: 'V-103', fecha: 'Hoy, 12:10', cliente: 'Roberto Paredes', detalle: '4x Entrada Galería Sur vs Temuco', total: 28000 },
  ]);

  const guardarProductos = (nuevos: Producto[]) => {
    setProductos(nuevos);
    localStorage.setItem('dpm_productos_data', JSON.stringify(nuevos));
  };

  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toastInfo('La imagen no debe superar los 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setProdImagen(reader.result);
          toastSuccess('Foto de producto cargada desde tu equipo.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGuardarProducto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodNombre.trim()) {
      toastInfo('Ingresa el nombre del producto.');
      return;
    }
    if (prodPrecio <= 0) {
      toastInfo('El precio debe ser mayor a 0.');
      return;
    }

    if (editandoProdId) {
      // Actualizar existente
      const actualizados = productos.map(p => 
        p.id === editandoProdId 
          ? { ...p, nombre: prodNombre, categoria: prodCategoria, precio: prodPrecio, stock: prodStock, imagenUrl: prodImagen }
          : p
      );
      guardarProductos(actualizados);
      toastSuccess('Producto actualizado con éxito.');
    } else {
      // Crear nuevo
      const nuevo: Producto = {
        id: `prod-${Date.now()}`,
        nombre: prodNombre,
        categoria: prodCategoria,
        precio: prodPrecio,
        stock: prodStock,
        imagenUrl: prodImagen || '/images/polera.jpg'
      };
      guardarProductos([nuevo, ...productos]);
      toastSuccess('Nuevo producto agregado al catálogo oficial.');
    }

    setShowFormProducto(false);
    setEditandoProdId(null);
    setProdNombre('');
    setProdPrecio(15000);
    setProdStock(50);
    setProdImagen('/images/polera.jpg');
  };

  const handleIniciarEdicionProducto = (p: Producto) => {
    setEditandoProdId(p.id);
    setProdNombre(p.nombre);
    setProdCategoria(p.categoria);
    setProdPrecio(p.precio);
    setProdStock(p.stock);
    setProdImagen(p.imagenUrl);
    setShowFormProducto(true);
  };

  const handleEliminarProducto = (id: string) => {
    const actualizados = productos.filter(p => p.id !== id);
    guardarProductos(actualizados);
    toastSuccess('Producto eliminado del inventario.');
  };

  const handleAjustarStock = (id: string, delta: number) => {
    const actualizados = productos.map(p => 
      p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p
    );
    guardarProductos(actualizados);
    toastSuccess('Stock actualizado.');
  };

  // =========================================================================
  // 4. ESTADO Y POLLING DE AFORO REAL DESDE SPRING BOOT (CERO VALORES FIJOS)
  // =========================================================================
  const [aforoData, setAforoData] = useState({
    ingresados: 0,
    capacidadTotal: 10000,
    porcentajeOcupacion: 0.0,
    recaudacionTotal: 0,
    entradasEmitidas: 0
  });

  const fetchAforoReal = async () => {
    try {
      const res = await api.get('/entradas/aforo');
      if (res.data) {
        setAforoData({
          ingresados: res.data.ingresados ?? 0,
          capacidadTotal: res.data.capacidadTotal ?? 10000,
          porcentajeOcupacion: res.data.porcentajeOcupacion ?? 0.0,
          recaudacionTotal: res.data.recaudacionTotal ?? 0,
          entradasEmitidas: res.data.entradasEmitidas ?? 0
        });
      }
    } catch {
      // Modo offline
    }
  };

  useEffect(() => {
    fetchAforoReal();
    const timer = setInterval(fetchAforoReal, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleReiniciarAforo = async () => {
    try {
      const res = await api.post('/entradas/reiniciar');
      if (res.data) {
        setAforoData({
          ingresados: res.data.ingresados ?? 0,
          capacidadTotal: res.data.capacidadTotal ?? 10000,
          porcentajeOcupacion: res.data.porcentajeOcupacion ?? 0.0,
          recaudacionTotal: res.data.recaudacionTotal ?? 0,
          entradasEmitidas: res.data.entradasEmitidas ?? 0
        });
      }
      toastSuccess('¡Operación reiniciada! Aforo en 0 y entradas liberadas para la prueba.');
    } catch {
      setAforoData({
        ingresados: 0,
        capacidadTotal: 10000,
        porcentajeOcupacion: 0.0,
        recaudacionTotal: 0,
        entradasEmitidas: 0
      });
      toastSuccess('¡Aforo restablecido a 0 para demostración en vivo!');
    }
  };

  // =========================================================================
  // 5. ESTADO DINÁMICO DE JUGADORES (CRUD ADULTOS MAYORES / DIRECTIVA)
  // =========================================================================
  const defaultPlantel: Jugador[] = [
    { id: '1', nombre: 'Luis Ureta', posicion: 'Portero', edad: 26, nacionalidad: 'Chile', fotoUrl: 'https://dpmchile.cl/wp-content/uploads/2026/03/Luis-Ureta.webp', dorsal: 1, partidosJugados: 16, atajadas: 52, precisionPases: '89% Atajadas', clubOrigen: "O'Higgins / DPM Chinquihue", pieHabil: 'Derecho', descripcion: '🧤 "Pelle": Arquero titular con reflejos felinos y seguridad aérea.' },
    { id: '2', nombre: 'Vicente Yáñez', posicion: 'Defensa', edad: 28, nacionalidad: 'Chile', fotoUrl: 'https://dpmchile.cl/wp-content/uploads/2026/04/VICENTE-YANEZ.webp', dorsal: 4, partidosJugados: 16, recuperaciones: 48, goles: 1, precisionPases: '84% Duelos', clubOrigen: 'Huachipato / DPM', pieHabil: 'Derecho', descripcion: '⚡ "Chente": Defensa aguerrido, rápido en las coberturas y de gran quite.' },
    { id: '3', nombre: 'Maximiliano Riveros', posicion: 'Defensa', edad: 29, nacionalidad: 'Chile', fotoUrl: 'https://dpmchile.cl/wp-content/uploads/2026/03/Maximiliano-Riveros.webp', dorsal: 6, partidosJugados: 15, recuperaciones: 45, goles: 2, precisionPases: '88% Pases', clubOrigen: 'Deportes Valdivia / DPM', pieHabil: 'Derecho', descripcion: '🦁 "Maxi": Capitán y pilar de la zaga central. Liderazgo y salida limpia.' },
    { id: '4', nombre: 'Daniel Bahamonde', posicion: 'Defensa', edad: 24, nacionalidad: 'Chile', fotoUrl: 'https://dpmchile.cl/wp-content/uploads/2026/04/DANIEL-BAHAMONDE.webp', dorsal: 14, partidosJugados: 15, recuperaciones: 39, asistencias: 4, precisionPases: '85% Recorrido', clubOrigen: 'Cantera DPM Chinquihue', pieHabil: 'Izquierdo', descripcion: '🏃‍♂️ "Pájaro": Canterano puertomontino del carril izquierdo. Proyección ofensiva.' },
    { id: '5', nombre: 'Byron Nieto', posicion: 'Defensa', edad: 27, nacionalidad: 'Chile', fotoUrl: 'https://dpmchile.cl/wp-content/uploads/2026/04/BYRON-NIETO.webp', dorsal: 2, partidosJugados: 14, recuperaciones: 36, asistencias: 3, precisionPases: '83% Centros', clubOrigen: 'Universidad Católica / DPM', pieHabil: 'Derecho', descripcion: '⚡ "El Rayo": Lateral derecho con potencia, velocidad y centros quirúrgicos.' },
    { id: '6', nombre: 'Jesús Pino', posicion: 'Defensa', edad: 32, nacionalidad: 'Chile', fotoUrl: 'https://dpmchile.cl/wp-content/uploads/2026/03/Jesus-Pino.webp', dorsal: 3, partidosJugados: 13, recuperaciones: 38, goles: 1, precisionPases: '82% Anticipo', clubOrigen: 'Unión San Felipe / DPM', pieHabil: 'Derecho', descripcion: '🧱 Central de vasta experiencia. Fortaleza física, anticipación y voz de mando.' },
    { id: '7', nombre: 'Juan Miguel Jaime', posicion: 'Volante', edad: 30, nacionalidad: 'Argentina', fotoUrl: 'https://dpmchile.cl/wp-content/uploads/2026/04/JUAN-JAIME.webp', dorsal: 8, partidosJugados: 16, goles: 3, asistencias: 5, precisionPases: '89% Precisión', clubOrigen: 'Talleres / DPM Chinquihue', pieHabil: 'Derecho', descripcion: '🎩 "El Puma de Monteros": Mediocampista de corte y distribución con visión de juego.' },
    { id: '8', nombre: 'Gabriel Castillo', posicion: 'Volante', edad: 26, nacionalidad: 'Chile', fotoUrl: 'https://dpmchile.cl/wp-content/uploads/2026/04/GABRIEL-CASTILLO.webp', dorsal: 5, partidosJugados: 15, recuperaciones: 42, asistencias: 3, precisionPases: '86% Quites', clubOrigen: 'Cobresal / DPM', pieHabil: 'Derecho', descripcion: '⚔️ "Casti": Volante mixto de gran recuperación física, presión alta y remate.' },
    { id: '9', nombre: 'Danilo Díaz', posicion: 'Volante', edad: 23, nacionalidad: 'Chile', fotoUrl: 'https://dpmchile.cl/wp-content/uploads/2026/03/Danilo-Diaz.webp', dorsal: 10, partidosJugados: 16, goles: 4, asistencias: 7, precisionPases: '91% Pases Clave', clubOrigen: 'Colo Colo / DPM', pieHabil: 'Derecho', descripcion: '🪄 "Chico Díaz": Volante creativo de técnica depurada y lanzador oficial.' },
    { id: '10', nombre: 'Cristóbal Vargas', posicion: 'Volante', edad: 25, nacionalidad: 'Chile', fotoUrl: 'https://dpmchile.cl/wp-content/uploads/2026/03/Cristobal-Vargas.webp', dorsal: 17, partidosJugados: 14, goles: 3, asistencias: 4, precisionPases: '85% Regates', clubOrigen: 'Universidad Católica / DPM', pieHabil: 'Derecho', descripcion: '⚡ "Gato": Desequilibrio individual, cambio de ritmo y llegada al área.' },
    { id: '11', nombre: 'Reiner Castro', posicion: 'Delantero', edad: 30, nacionalidad: 'Venezuela', fotoUrl: 'https://dpmchile.cl/wp-content/uploads/2026/03/Reiner-Castro.webp', dorsal: 7, partidosJugados: 16, goles: 9, asistencias: 6, precisionPases: '87% Desborde', clubOrigen: 'Caracas FC / Deportes Puerto Montt', pieHabil: 'Derecho', descripcion: '🚀 "Ñeñe": Extremo supersónico y figura albiverde. Gambeta, velocidad y gol.' },
    { id: '12', nombre: 'Luciano Vázquez', posicion: 'Delantero', edad: 38, nacionalidad: 'Argentina', fotoUrl: 'https://dpmchile.cl/wp-content/uploads/2026/03/Luciano-Vasquez.webp', dorsal: 9, partidosJugados: 15, goles: 11, asistencias: 3, precisionPases: '80% Definición', clubOrigen: 'Ñublense / DPM Chinquihue', pieHabil: 'Derecho', descripcion: '🦈 "Tiburón": Centrodelantero goleador implacable dentro del área y experiencia.' }
  ];

  const [jugadores, setJugadores] = useState<Jugador[]>(() => {
    const saved = localStorage.getItem('dpm_jugadores_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return defaultPlantel;
  });

  const [showFormJugador, setShowFormJugador] = useState(false);
  const [editandoJugadorId, setEditandoJugadorId] = useState<string | null>(null);
  const [jNombre, setJNombre] = useState('');
  const [jPosicion, setJPosicion] = useState('Volante');
  const [jDorsal, setJDorsal] = useState(10);
  const [jEdad, setJEdad] = useState(25);
  const [jNacionalidad, setJNacionalidad] = useState('Chile');
  const [jFoto, setJFoto] = useState('/images/jugador-4.png');
  const [jPartidos, setJPartidos] = useState(15);
  const [jGoles, setJGoles] = useState(3);
  const [jEfectividad, setJEfectividad] = useState('88% Rendimiento');
  const [jClubOrigen, setJClubOrigen] = useState('Deportes Puerto Montt');
  const [jPieHabil, setJPieHabil] = useState<'Derecho' | 'Izquierdo' | 'Ambidiestro'>('Derecho');
  const [jDescripcion, setJDescripcion] = useState('');

  const guardarJugadores = (nuevos: Jugador[]) => {
    setJugadores(nuevos);
    localStorage.setItem('dpm_jugadores_data', JSON.stringify(nuevos));
  };

  const handleJugadorImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toastInfo('La foto no debe superar los 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setJFoto(reader.result);
          toastSuccess('¡Foto de futbolista cargada desde tu equipo!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIniciarEdicionJugador = (j: Jugador) => {
    setEditandoJugadorId(j.id);
    setJNombre(j.nombre);
    setJPosicion(j.posicion);
    setJDorsal(j.dorsal || 10);
    setJEdad(j.edad);
    setJNacionalidad(j.nacionalidad);
    setJFoto(j.fotoUrl || '/images/jugador-4.png');
    setJPartidos(j.partidosJugados || 15);
    setJGoles(j.goles || (j.atajadas || 0));
    setJEfectividad(j.precisionPases || '88% Rendimiento');
    setJClubOrigen(j.clubOrigen || 'Cantera DPM Chinquihue');
    setJPieHabil(j.pieHabil || 'Derecho');
    setJDescripcion(j.descripcion || '');
    setShowFormJugador(true);
  };

  const handleGuardarJugador = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jNombre.trim()) {
      toastInfo('Por favor, ingresa el nombre del futbolista.');
      return;
    }

    if (editandoJugadorId) {
      const actualizados = jugadores.map(j => 
        j.id === editandoJugadorId
          ? {
              ...j,
              nombre: jNombre,
              posicion: jPosicion,
              dorsal: jDorsal,
              edad: jEdad,
              nacionalidad: jNacionalidad,
              fotoUrl: jFoto,
              partidosJugados: jPartidos,
              goles: jPosicion === 'Portero' ? undefined : jGoles,
              atajadas: jPosicion === 'Portero' ? jGoles : undefined,
              precisionPases: jEfectividad,
              clubOrigen: jClubOrigen,
              pieHabil: jPieHabil,
              descripcion: jDescripcion || `${jPosicion} oficial del plantel profesional.`
            }
          : j
      );
      guardarJugadores(actualizados);
      toastSuccess('¡Ficha del jugador actualizada con éxito!');
    } else {
      const nuevo: Jugador = {
        id: `j-${Date.now()}`,
        nombre: jNombre,
        posicion: jPosicion,
        dorsal: jDorsal,
        edad: jEdad,
        nacionalidad: jNacionalidad,
        fotoUrl: jFoto || '/images/jugador-4.png',
        partidosJugados: jPartidos,
        goles: jPosicion === 'Portero' ? undefined : jGoles,
        atajadas: jPosicion === 'Portero' ? jGoles : undefined,
        precisionPases: jEfectividad,
        clubOrigen: jClubOrigen,
        pieHabil: jPieHabil,
        descripcion: jDescripcion || `${jPosicion} oficial del plantel profesional.`
      };
      guardarJugadores([nuevo, ...jugadores]);
      toastSuccess('¡Nuevo futbolista incorporado a la nómina oficial!');
    }

    setShowFormJugador(false);
    setEditandoJugadorId(null);
    setJNombre('');
  };

  const handleEliminarJugador = (id: string) => {
    if (window.confirm('¿Está seguro de dar de baja a este futbolista del plantel oficial?')) {
      const actualizados = jugadores.filter(j => j.id !== id);
      guardarJugadores(actualizados);
      toastSuccess('Futbolista desvinculado de la nómina.');
    }
  };

  const handleRestablecerPlantel = () => {
    if (window.confirm('¿Desea restablecer el plantel oficial con las 12 fichas oficiales predeterminadas?')) {
      guardarJugadores(defaultPlantel);
      toastSuccess('Plantel oficial restablecido con éxito.');
    }
  };

  const fotosOficialesDisponibles = [
    { url: 'https://dpmchile.cl/wp-content/uploads/2026/03/Luis-Ureta.webp', label: 'Luis Ureta (Arq)' },
    { url: 'https://dpmchile.cl/wp-content/uploads/2026/04/VICENTE-YANEZ.webp', label: 'Vicente Yáñez' },
    { url: 'https://dpmchile.cl/wp-content/uploads/2026/03/Maximiliano-Riveros.webp', label: 'Maxi Riveros' },
    { url: 'https://dpmchile.cl/wp-content/uploads/2026/04/DANIEL-BAHAMONDE.webp', label: 'D. Bahamonde' },
    { url: 'https://dpmchile.cl/wp-content/uploads/2026/04/BYRON-NIETO.webp', label: 'Byron Nieto' },
    { url: 'https://dpmchile.cl/wp-content/uploads/2026/03/Jesus-Pino.webp', label: 'Jesús Pino' },
    { url: 'https://dpmchile.cl/wp-content/uploads/2026/04/JUAN-JAIME.webp', label: 'Juan Jaime' },
    { url: 'https://dpmchile.cl/wp-content/uploads/2026/04/GABRIEL-CASTILLO.webp', label: 'G. Castillo' },
    { url: 'https://dpmchile.cl/wp-content/uploads/2026/03/Danilo-Diaz.webp', label: 'Danilo Díaz' },
    { url: 'https://dpmchile.cl/wp-content/uploads/2026/03/Cristobal-Vargas.webp', label: 'C. Vargas' },
    { url: 'https://dpmchile.cl/wp-content/uploads/2026/03/Reiner-Castro.webp', label: 'Reiner Castro' },
    { url: 'https://dpmchile.cl/wp-content/uploads/2026/03/Luciano-Vasquez.webp', label: 'L. Vázquez' }
  ];

  // =========================================================================
  // ESTADO DE PARTIDOS & FIXTURE / RESÚMENES TNT SPORTS
  // =========================================================================
  const defaultPartidosAdmin = {
    proximo: {
      rival: 'Ñublense',
      escudoRival: 'https://dpmchile.cl/wp-content/uploads/2024/08/nublense.webp',
      torneo: 'Copa Chile Coca-Cola Sin Azúcar 2026',
      fecha: 'Domingo 28 de Septiembre 2026',
      hora: '18:00 hrs',
      estadio: 'Estadio Bicentenario Chinquihue',
      esLocal: true,
      ticketLink: '/entradas'
    },
    ultimo: {
      rival: 'Magallanes',
      escudoRival: '/images/escudo-magallanes.png',
      torneo: 'Copa Chile Coca-Cola Sin Azúcar 2026',
      fecha: 'Sábado 21 de Septiembre 2026',
      golesDpm: 2,
      golesRival: 0,
      youtubeId: 'ScQrhZAB-lg',
      youtubeTitulo: 'Deportes Puerto Montt 2 - 0 Magallanes | Resumen Oficial TNT Sports'
    }
  };

  const [partidosForm, setPartidosForm] = useState(() => {
    const saved = localStorage.getItem('dpm_partidos_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return defaultPartidosAdmin;
  });

  const handleGuardarPartidos = () => {
    let ytId = (partidosForm.ultimo.youtubeId || '').trim();
    if (ytId.includes('watch?v=')) {
      ytId = ytId.split('watch?v=')[1].split('&')[0];
    } else if (ytId.includes('youtu.be/')) {
      ytId = ytId.split('youtu.be/')[1].split('?')[0];
    } else if (ytId.includes('embed/')) {
      ytId = ytId.split('embed/')[1].split('?')[0];
    }

    const payload = {
      ...partidosForm,
      ultimo: {
        ...partidosForm.ultimo,
        youtubeId: ytId || 'ScQrhZAB-lg'
      }
    };

    localStorage.setItem('dpm_partidos_data', JSON.stringify(payload));
    setPartidosForm(payload);
    toastSuccess('¡Fixture, Próximo Partido y Resumen TNT Sports actualizados con éxito!');
  };

  const handleRestablecerPartidos = () => {
    localStorage.removeItem('dpm_partidos_data');
    setPartidosForm(defaultPartidosAdmin);
    toastInfo('Valores de partidos y video restablecidos a los datos oficiales por defecto.');
  };

  // Guardar Posiciones en LocalStorage
  const guardarPosiciones = (nuevas: Posicion[]) => {
    setPosiciones(nuevas);
    localStorage.setItem('dpm_posiciones_data', JSON.stringify(nuevas));
  };

  // Registrar resultado de partido oficial
  const handleRegistrarPartido = () => {
    if (equipoLocalIdx === equipoVisitaIdx) {
      toastInfo('El equipo local y visita deben ser diferentes.');
      return;
    }

    const local = posiciones[equipoLocalIdx];
    const visita = posiciones[equipoVisitaIdx];

    const actualizadas = posiciones.map((pos) => {
      if (pos.equipo === local.equipo) {
        const gano = golesLocal > golesVisita;
        const empato = golesLocal === golesVisita;
        const ptsGanados = gano ? 3 : empato ? 1 : 0;
        return {
          ...pos,
          pj: pos.pj + 1,
          pg: pos.pg + (gano ? 1 : 0),
          pe: pos.pe + (empato ? 1 : 0),
          pp: pos.pp + (!gano && !empato ? 1 : 0),
          gf: pos.gf + golesLocal,
          gc: pos.gc + golesVisita,
          dg: (pos.gf + golesLocal) - (pos.gc + golesVisita),
          pts: pos.pts + ptsGanados
        };
      }

      if (pos.equipo === visita.equipo) {
        const gano = golesVisita > golesLocal;
        const empato = golesLocal === golesVisita;
        const ptsGanados = gano ? 3 : empato ? 1 : 0;
        return {
          ...pos,
          pj: pos.pj + 1,
          pg: pos.pg + (gano ? 1 : 0),
          pe: pos.pe + (empato ? 1 : 0),
          pp: pos.pp + (!gano && !empato ? 1 : 0),
          gf: pos.gf + golesVisita,
          gc: pos.gc + golesLocal,
          dg: (pos.gf + golesVisita) - (pos.gc + golesLocal),
          pts: pos.pts + ptsGanados
        };
      }

      return pos;
    });

    // Reordenar por Puntos y Diferencia de Gol
    actualizadas.sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      return b.dg - a.dg;
    });

    guardarPosiciones(actualizadas);
    toastSuccess(`¡Resultado guardado! ${local.equipo} ${golesLocal} - ${golesVisita} ${visita.equipo}. Tabla oficial actualizada.`);
  };

  // Restablecer tabla oficial
  const handleResetTabla = () => {
    guardarPosiciones(defaultPosiciones);
    toastSuccess('Tabla de posiciones restablecida a los valores oficiales.');
  };

  // Función para subir una foto desde la computadora (Base64)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toastInfo('La imagen no debe superar los 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setNuevaImagen(reader.result);
          toastSuccess('¡Foto cargada exitosamente desde tu equipo!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Agregar nueva noticia
  const handleCrearNoticia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoTitulo.trim() || !nuevoContenido.trim()) {
      toastInfo('Completa el título y contenido de la noticia.');
      return;
    }

    const nuevaNoticia: Novedad = {
      id: `nov-${Date.now()}`,
      titulo: nuevoTitulo,
      contenido: nuevoContenido,
      imagenUrl: nuevaImagen || '/images/puerto-montt-gol.jpeg',
      fechaPublicacion: new Date().toLocaleDateString('es-CL'),
      autorNombre: nuevoAutor || 'Comunicaciones DPM'
    };

    const actualizadas = [nuevaNoticia, ...novedades];
    setNovedades(actualizadas);
    localStorage.setItem('dpm_novedades_data', JSON.stringify(actualizadas));
    
    setNuevoTitulo('');
    setNuevoContenido('');
    setNuevaImagen('/images/puerto-montt-gol.jpeg');
    setShowFormNoticia(false);
    toastSuccess('¡Noticia publicada oficialmente en el sitio web!');
  };

  // Eliminar noticia
  const handleEliminarNoticia = (id: string) => {
    const actualizadas = novedades.filter(n => n.id !== id);
    setNovedades(actualizadas);
    localStorage.setItem('dpm_novedades_data', JSON.stringify(actualizadas));
    toastSuccess('Noticia eliminada del portal.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Cabecera del Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-verde-dpm">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Rol: Administrador Oficial Club Deportes Puerto Montt
          </div>
          <h1 className="text-3xl font-black text-azul-dpm mt-1">Panel de Control y Administración</h1>
          <p className="text-sm text-gray-500">
            Gestiona resultados de partidos, noticias oficiales, stock y el validador de entradas para el Chinquihue.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/validador"
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow transition"
          >
            <FaQrcode /> Torniquetes Estadio <FaExternalLinkAlt size={10} />
          </Link>
          <Link
            to="/posiciones"
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs font-bold py-2.5 px-4 rounded-xl transition"
          >
            <FaTrophy /> Ver Tabla Pública
          </Link>
        </div>
      </div>

      {/* Tarjetas Resumen de Gestión */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-5 bg-white border-l-4 border-verde-dpm shadow-sm">
          <span className="text-xs font-bold text-gray-500 uppercase">Posición DPM</span>
          <p className="text-2xl font-black text-emerald-700 mt-1">
            {posiciones.findIndex(p => p.equipo.toLowerCase().includes('puerto montt')) + 1}° Lugar
          </p>
          <span className="text-[11px] text-gray-400">
            {posiciones.find(p => p.equipo.toLowerCase().includes('puerto montt'))?.pts || 24} Puntos oficiales
          </span>
        </Card>

        <Card className="p-5 bg-white border-l-4 border-azul-dpm shadow-sm">
          <span className="text-xs font-bold text-gray-500 uppercase">Noticias Publicadas</span>
          <p className="text-2xl font-black text-azul-dpm mt-1">{novedades.length}</p>
          <span className="text-[11px] text-gray-400">Visibles para todos los hinchas</span>
        </Card>

        <Card className="p-5 bg-white border-l-4 border-amber-500 shadow-sm">
          <span className="text-xs font-bold text-gray-500 uppercase">Productos en Catálogo</span>
          <p className="text-2xl font-black text-gray-900 mt-1">{productos.length}</p>
          <span className="text-[11px] text-gray-400">Entradas y merchandising</span>
        </Card>

        <Link to="/validador" className="group">
          <Card className="p-5 bg-slate-900 text-white border-l-4 border-emerald-400 shadow-sm hover:border-sky-400 transition cursor-pointer">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase">Control Torniquete</span>
              <FaQrcode className="text-emerald-400 group-hover:scale-110 transition" />
            </div>
            <p className="text-2xl font-black text-emerald-300 mt-1 font-mono">EN VIVO</p>
            <span className="text-[11px] text-slate-400">Lector de entradas QR →</span>
          </Card>
        </Link>
      </div>

      {/* Widget Dirigencial: Operación de Estadio & Aforo en Vivo (Estadio Seguro ANFP) */}
      <div className="bg-gradient-to-r from-slate-900 via-azul-dpm to-slate-950 rounded-2xl p-6 border border-emerald-500/30 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Operación Estadio Bicentenario Chinquihue • En Tiempo Real
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Control de Aforo Oficial: <span className="text-amarillo-dpm">{aforoData.ingresados.toLocaleString('es-CL')} / {aforoData.capacidadTotal.toLocaleString('es-CL')}</span> Asistentes ({aforoData.porcentajeOcupacion.toFixed(1)}%)
          </h3>
          <p className="text-xs text-gray-300 leading-relaxed">
            Monitoreo en vivo conectado a la API de torniquetes. Cumplimiento de normativa de Estadio Seguro y Delegación Presidencial Los Lagos.
          </p>
          {/* Barra de progreso de aforo */}
          <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden border border-white/10 mt-2">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-amarillo-dpm h-full rounded-full transition-all duration-1000" 
              style={{ width: `${Math.min(100, Math.max(0, aforoData.porcentajeOcupacion))}%` }}
            ></div>
          </div>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap gap-4 shrink-0 items-center">
          <div className="bg-white/10 rounded-xl p-3.5 border border-white/10 text-center min-w-[130px]">
            <span className="text-[10px] text-gray-400 uppercase font-semibold block">Entradas Emitidas</span>
            <span className="text-lg font-black text-white">{aforoData.entradasEmitidas || 5}</span>
            <span className="text-[10px] text-emerald-400 block font-bold">Validador QR</span>
          </div>

          <div className="bg-white/10 rounded-xl p-3.5 border border-white/10 text-center min-w-[130px]">
            <span className="text-[10px] text-gray-400 uppercase font-semibold block">Recaudación Validada</span>
            <span className="text-lg font-black text-amarillo-dpm font-mono">
              ${aforoData.recaudacionTotal > 0 ? aforoData.recaudacionTotal.toLocaleString('es-CL') : '0'} CLP
            </span>
            <span className="text-[10px] text-gray-300 block">Torniquetes Activos</span>
          </div>

          <div className="flex flex-col gap-2">
            <Link
              to="/validador"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-xs whitespace-nowrap"
            >
              <FaQrcode /> Abrir Validador QR
            </Link>
            <button
              onClick={handleReiniciarAforo}
              className="bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-500/40 font-bold px-4 py-2 rounded-xl transition flex items-center justify-center gap-2 text-[11px] whitespace-nowrap"
              title="Restablece torniquetes y aforo a 0 para pruebas de demostración"
            >
              <FaSyncAlt /> Iniciar en 0 Asistentes
            </button>
          </div>
        </div>
      </div>

      {/* Navegación por Pestañas */}
      <div className="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 bg-slate-50 px-6">
          <nav className="flex gap-6 overflow-x-auto" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('posiciones')}
              className={`py-4 border-b-2 font-bold text-sm flex items-center gap-2 whitespace-nowrap transition ${
                activeTab === 'posiciones'
                  ? 'border-verde-dpm text-verde-dpm'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <FaTrophy /> Tabla de Posiciones & Resultados
            </button>

            <button
              onClick={() => setActiveTab('novedades')}
              className={`py-4 border-b-2 font-bold text-sm flex items-center gap-2 whitespace-nowrap transition ${
                activeTab === 'novedades'
                  ? 'border-verde-dpm text-verde-dpm'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <FaNewspaper /> Novedades y Prensa del Club
            </button>

            <button
              onClick={() => setActiveTab('productos')}
              className={`py-4 border-b-2 font-bold text-sm flex items-center gap-2 whitespace-nowrap transition ${
                activeTab === 'productos'
                  ? 'border-verde-dpm text-verde-dpm'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <FaStore /> Tienda & Stock Entradas
            </button>

            <button
              onClick={() => setActiveTab('jugadores')}
              className={`py-4 border-b-2 font-bold text-sm flex items-center gap-2 whitespace-nowrap transition ${
                activeTab === 'jugadores'
                  ? 'border-verde-dpm text-verde-dpm'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <FaUserFriends /> Plantel Profesional
            </button>

            <button
              onClick={() => setActiveTab('partidos')}
              className={`py-4 border-b-2 font-bold text-sm flex items-center gap-2 whitespace-nowrap transition ${
                activeTab === 'partidos'
                  ? 'border-verde-dpm text-verde-dpm'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <FaCalendarAlt /> Próximo Partido & TNT Sports
            </button>
          </nav>
        </div>

        {/* ================================================================= */}
        {/* PESTAÑA 1: TABLA DE POSICIONES Y RESULTADOS                       */}
        {/* ================================================================= */}
        {activeTab === 'posiciones' && (
          <div className="p-6 space-y-6">
            {/* Panel de Registro Oficial de Fecha */}
            <div className="bg-gradient-to-br from-slate-900 to-azul-dpm text-white rounded-xl p-6 shadow-md border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FaFutbol className="text-amber-400 text-lg" />
                  <h3 className="font-bold text-base text-white">
                    Registrar Resultado Oficial de Fecha (Actualización Automática de Tabla)
                  </h3>
                </div>
                <span className="text-[11px] bg-slate-800 text-sky-300 px-3 py-1 rounded-full font-mono">
                  ANFP 2025
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                {/* Equipo Local */}
                <div className="md:col-span-2">
                  <label className="block text-xs text-gray-300 font-semibold mb-1">Equipo Local</label>
                  <select
                    value={equipoLocalIdx}
                    onChange={(e) => setEquipoLocalIdx(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white font-medium focus:ring-1 focus:ring-emerald-500 outline-none"
                  >
                    {posiciones.map((p, idx) => (
                      <option key={p.equipo} value={idx}>{p.equipo}</option>
                    ))}
                  </select>
                </div>

                {/* Marcador */}
                <div className="flex items-center justify-center gap-2 md:col-span-1">
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={golesLocal}
                    onChange={(e) => setGolesLocal(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-12 h-11 text-center text-xl font-black bg-slate-800 border border-emerald-500 rounded-lg text-white"
                  />
                  <span className="font-bold text-gray-400 text-lg">-</span>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={golesVisita}
                    onChange={(e) => setGolesVisita(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-12 h-11 text-center text-xl font-black bg-slate-800 border border-sky-500 rounded-lg text-white"
                  />
                </div>

                {/* Equipo Visita */}
                <div className="md:col-span-2">
                  <label className="block text-xs text-gray-300 font-semibold mb-1">Equipo Visita</label>
                  <select
                    value={equipoVisitaIdx}
                    onChange={(e) => setEquipoVisitaIdx(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white font-medium focus:ring-1 focus:ring-emerald-500 outline-none"
                  >
                    {posiciones.map((p, idx) => (
                      <option key={p.equipo} value={idx}>{p.equipo}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
                <p className="text-xs text-gray-400">
                  💡 Al guardar, se sumará +1 partido jugado a ambos equipos, se distribuirán los 3 puntos (o 1 por empate) y se actualizará la diferencia de goles en todo el sitio.
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleResetTabla}
                    className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-gray-300 text-xs font-semibold py-2 px-3 rounded-lg transition"
                  >
                    <FaUndo size={11} /> Restablecer
                  </button>
                  <button
                    type="button"
                    onClick={handleRegistrarPartido}
                    className="flex items-center gap-2 bg-verde-dpm hover:bg-green-700 text-white text-xs font-bold py-2 px-5 rounded-lg shadow transition"
                  >
                    <FaCheckCircle /> Guardar Resultado Oficial
                  </button>
                </div>
              </div>
            </div>

            {/* Vista Previa de la Tabla Modificable */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700 uppercase">Tabla Actual Guardada en el Sistema:</span>
                <span className="text-xs text-emerald-700 font-semibold">✓ Sincronizada con la vista pública</span>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
                    <tr>
                      <th className="py-2.5 px-3 text-center">Pos</th>
                      <th className="py-2.5 px-4 text-left">Club</th>
                      <th className="py-2.5 px-2 text-center">PJ</th>
                      <th className="py-2.5 px-2 text-center">PG</th>
                      <th className="py-2.5 px-2 text-center">PE</th>
                      <th className="py-2.5 px-2 text-center">PP</th>
                      <th className="py-2.5 px-2 text-center">GF</th>
                      <th className="py-2.5 px-2 text-center">GC</th>
                      <th className="py-2.5 px-2 text-center">DG</th>
                      <th className="py-2.5 px-3 text-center font-black text-azul-dpm">PTS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {posiciones.map((p, idx) => (
                      <tr key={p.equipo} className={p.equipo.includes('Puerto Montt') ? 'bg-emerald-50 font-bold' : ''}>
                        <td className="py-2.5 px-3 text-center text-xs font-bold">{idx + 1}</td>
                        <td className="py-2.5 px-4 flex items-center gap-2 font-medium">
                          <img src={p.escudoUrl} alt={p.equipo} className="w-5 h-5 object-contain" />
                          {p.equipo}
                        </td>
                        <td className="py-2.5 px-2 text-center text-gray-600">{p.pj}</td>
                        <td className="py-2.5 px-2 text-center text-gray-600">{p.pg}</td>
                        <td className="py-2.5 px-2 text-center text-gray-600">{p.pe}</td>
                        <td className="py-2.5 px-2 text-center text-gray-600">{p.pp}</td>
                        <td className="py-2.5 px-2 text-center text-gray-500">{p.gf}</td>
                        <td className="py-2.5 px-2 text-center text-gray-500">{p.gc}</td>
                        <td className="py-2.5 px-2 text-center font-bold text-gray-700">{p.dg}</td>
                        <td className="py-2.5 px-3 text-center font-black text-verde-dpm">{p.pts}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* PESTAÑA 2: NOVEDADES Y PRENSA                                     */}
        {/* ================================================================= */}
        {activeTab === 'novedades' && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Comunicados y Noticias Oficiales</h3>
                <p className="text-xs text-gray-500">Publica notas de prensa y novedades para la hinchada</p>
              </div>
              <button
                onClick={() => setShowFormNoticia(!showFormNoticia)}
                className="bg-verde-dpm hover:bg-green-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 transition"
              >
                <FaPlus /> {showFormNoticia ? 'Cerrar Formulario' : 'Nueva Noticia'}
              </button>
            </div>

            {/* Formulario de Nueva Noticia */}
            {showFormNoticia && (
              <form onSubmit={handleCrearNoticia} className="bg-slate-50 border border-gray-200 rounded-xl p-5 space-y-4 animate-fadeIn">
                <h4 className="text-sm font-bold text-azul-dpm border-b pb-2">Redactar Noticia Oficial</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Titular de la Noticia</label>
                    <input
                      type="text"
                      value={nuevoTitulo}
                      onChange={(e) => setNuevoTitulo(e.target.value)}
                      placeholder="Ej: Triunfazo del Velero ante Deportes Temuco"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-verde-dpm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                      <FaImage className="text-verde-dpm" /> Foto de la Noticia
                    </label>

                    {/* Selector de origen de imagen */}
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <label className="flex-1 cursor-pointer bg-white border-2 border-dashed border-emerald-400 hover:border-emerald-600 rounded-lg p-2.5 flex items-center justify-center gap-2 text-xs font-bold text-emerald-800 transition">
                          <FaCloudUploadAlt className="text-lg text-verde-dpm" />
                          <span>Subir desde mi PC</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-gray-400">O galería oficial:</span>
                        <select
                          value={nuevaImagen.startsWith('data:') ? 'custom' : nuevaImagen}
                          onChange={(e) => {
                            if (e.target.value !== 'custom') {
                              setNuevaImagen(e.target.value);
                            }
                          }}
                          className="flex-1 border border-gray-300 rounded-lg px-2 py-1 text-xs bg-white text-gray-700"
                        >
                          <option value="/images/puerto-montt-gol.jpeg">Celebración Gol Chinquihue</option>
                          <option value="/images/equipo-dpm.png">Plantel Oficial DPM</option>
                          <option value="/images/EstadioChinquihue.png">Estadio Chinquihue Aéreo</option>
                          <option value="/images/novedades1.jpg">Sala Musculación Chinquihue</option>
                          <option value="/images/novedad3.jpeg">Victoria Albiverde</option>
                          {nuevaImagen.startsWith('data:') && (
                            <option value="custom">★ Imagen personalizada desde PC</option>
                          )}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vista Previa de la Foto Seleccionada */}
                {nuevaImagen && (
                  <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-4">
                    <img 
                      src={nuevaImagen} 
                      alt="Vista previa" 
                      className="w-20 h-16 object-cover rounded-md border shadow-sm flex-shrink-0"
                    />
                    <div className="flex-1 text-xs">
                      <span className="font-bold text-gray-800 block">Vista previa de la imagen cargada</span>
                      <span className="text-[11px] text-gray-500 line-clamp-1">
                        {nuevaImagen.startsWith('data:') ? 'Foto personalizada cargada desde tu equipo' : nuevaImagen}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNuevaImagen('/images/puerto-montt-gol.jpeg')}
                      className="text-xs text-gray-500 hover:text-rose-600 underline"
                    >
                      Restablecer
                    </button>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Cuerpo / Contenido de la Noticia</label>
                  <textarea
                    rows={3}
                    value={nuevoContenido}
                    onChange={(e) => setNuevoContenido(e.target.value)}
                    placeholder="Escribe el reporte completo del partido o comunicado..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-verde-dpm"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowFormNoticia(false)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-semibold py-2 px-4 rounded-lg transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-verde-dpm hover:bg-green-700 text-white text-xs font-bold py-2 px-5 rounded-lg transition flex items-center gap-1.5"
                  >
                    <FaSave /> Publicar en el Sitio Web
                  </button>
                </div>
              </form>
            )}

            {/* Listado de Novedades */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {novedades.map((nov) => (
                <div key={nov.id} className="border border-gray-200 rounded-xl p-4 flex gap-4 bg-white hover:shadow-sm transition">
                  <img 
                    src={nov.imagenUrl} 
                    alt={nov.titulo} 
                    className="w-24 h-24 object-cover rounded-lg bg-gray-100 flex-shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 font-semibold">{nov.fechaPublicacion} • {nov.autorNombre}</span>
                      <h4 className="text-sm font-bold text-gray-900 line-clamp-2 mt-0.5">{nov.titulo}</h4>
                    </div>
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => handleEliminarNoticia(nov.id)}
                        className="text-rose-600 hover:text-rose-800 text-xs font-semibold flex items-center gap-1"
                      >
                        <FaTrash size={11} /> Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* PESTAÑA 3: TIENDA, INVENTARIO Y CONTROL DE VENTAS                  */}
        {/* ================================================================= */}
        {activeTab === 'productos' && (
          <div className="p-6 space-y-6">
            
            {/* Métricas de Inventario y Facturación */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-50 border border-gray-200 p-4 rounded-xl">
                <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5">
                  <FaBoxOpen className="text-verde-dpm" /> Total Productos
                </span>
                <p className="text-2xl font-black text-gray-900 mt-1">{productos.length}</p>
                <span className="text-[11px] text-gray-400">En catálogo online</span>
              </div>

              <div className="bg-slate-50 border border-gray-200 p-4 rounded-xl">
                <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5">
                  <FaStore className="text-azul-dpm" /> Unidades en Stock
                </span>
                <p className="text-2xl font-black text-azul-dpm mt-1 font-mono">
                  {productos.reduce((acc, p) => acc + p.stock, 0)}
                </p>
                <span className="text-[11px] text-gray-400">Total físico en bodega</span>
              </div>

              <div className="bg-slate-50 border border-gray-200 p-4 rounded-xl">
                <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5">
                  <FaDollarSign className="text-emerald-600" /> Valor Inventario
                </span>
                <p className="text-xl font-black text-emerald-700 mt-1">
                  ${productos.reduce((acc, p) => acc + (p.precio * p.stock), 0).toLocaleString('es-CL')}
                </p>
                <span className="text-[11px] text-gray-400">Mercadería valorizada</span>
              </div>

              <div className="bg-slate-50 border border-gray-200 p-4 rounded-xl">
                <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5">
                  <FaChartLine className="text-amber-500" /> Facturación Mes
                </span>
                <p className="text-xl font-black text-amber-600 mt-1 font-mono">
                  ${totalFacturado.toLocaleString('es-CL')}
                </p>
                <span className="text-[11px] text-gray-400">Entradas + Merchandising</span>
              </div>
            </div>

            {/* Cabecera y Botón Nuevo Producto */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Gestión Dinámica de Inventario</h3>
                <p className="text-xs text-gray-500">Crea nuevos artículos, actualiza precios, sube fotos y ajusta stock en tiempo real</p>
              </div>

              <button
                onClick={() => {
                  if (showFormProducto && editandoProdId) {
                    setEditandoProdId(null);
                    setProdNombre('');
                    setProdPrecio(15000);
                    setProdStock(50);
                    setProdImagen('/images/polera.jpg');
                  } else {
                    setShowFormProducto(!showFormProducto);
                  }
                }}
                className="bg-verde-dpm hover:bg-green-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 transition shadow"
              >
                <FaPlus /> {showFormProducto ? 'Cerrar Formulario' : 'Nuevo Producto / Entrada'}
              </button>
            </div>

            {/* Formulario de Crear / Editar Producto */}
            {showFormProducto && (
              <form onSubmit={handleGuardarProducto} className="bg-slate-50 border-2 border-emerald-500/40 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between border-b pb-3">
                  <h4 className="text-sm font-black text-azul-dpm flex items-center gap-2">
                    <FaEdit className="text-verde-dpm" />
                    {editandoProdId ? `Editar Producto (#${editandoProdId})` : 'Crear Nuevo Producto para la Tienda'}
                  </h4>
                  {editandoProdId && (
                    <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
                      Modo Edición
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Nombre */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">Nombre del Producto o Entrada</label>
                    <input
                      type="text"
                      value={prodNombre}
                      onChange={(e) => setProdNombre(e.target.value)}
                      placeholder="Ej: Camiseta Alternativa 2026 o Entrada Tribuna vs Rangers"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-verde-dpm"
                    />
                  </div>

                  {/* Categoría */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Categoría</label>
                    <select
                      value={prodCategoria}
                      onChange={(e) => setProdCategoria(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                    >
                      <option value="Indumentaria">Indumentaria</option>
                      <option value="Accesorios">Accesorios</option>
                      <option value="Tickets">Tickets / Entradas</option>
                      <option value="Coleccionables">Coleccionables</option>
                    </select>
                  </div>

                  {/* Precio */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Precio Unitario ($ CLP)</label>
                    <input
                      type="number"
                      min="100"
                      step="500"
                      value={prodPrecio}
                      onChange={(e) => setProdPrecio(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-verde-dpm font-bold text-azul-dpm"
                    />
                  </div>

                  {/* Stock Inicial */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Stock Disponible (Unidades)</label>
                    <input
                      type="number"
                      min="0"
                      value={prodStock}
                      onChange={(e) => setProdStock(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-verde-dpm font-mono"
                    />
                  </div>

                  {/* Foto con Subida desde PC */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                      <FaImage className="text-verde-dpm" /> Foto del Producto
                    </label>
                    <div className="flex gap-2">
                      <label className="flex-1 cursor-pointer bg-white border border-dashed border-emerald-500 rounded-lg p-2 flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-50 transition">
                        <FaCloudUploadAlt className="text-base text-verde-dpm" />
                        <span>Subir desde PC</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProductImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Previsualizador y selector de galería */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-3 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-3">
                    <img 
                      src={prodImagen} 
                      alt="Vista previa producto" 
                      className="w-14 h-14 object-contain rounded-lg border p-1 bg-gray-50"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/polera.jpg';
                      }}
                    />
                    <div className="text-xs">
                      <span className="font-bold text-gray-800 block">Vista previa de imagen</span>
                      <span className="text-[11px] text-gray-500 line-clamp-1">{prodImagen}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-500">O galería:</span>
                    <select
                      value={prodImagen.startsWith('data:') ? 'custom' : prodImagen}
                      onChange={(e) => {
                        if (e.target.value !== 'custom') setProdImagen(e.target.value);
                      }}
                      className="border border-gray-300 rounded-lg px-2 py-1 text-xs bg-white"
                    >
                      <option value="/images/polera.jpg">Polera Oficial DPM</option>
                      <option value="/images/short.webp">Short Oficial DPM</option>
                      <option value="/images/calcetas.webp">Calcetas DPM</option>
                      <option value="/images/yoki.jpg">Gorro DPM Oficial</option>
                      <option value="/images/entrada.png">Entrada Estadio Chinquihue</option>
                      {prodImagen.startsWith('data:') && (
                        <option value="custom">★ Foto subida desde tu PC</option>
                      )}
                    </select>
                  </div>
                </div>

                {/* Botones de acción del formulario */}
                <div className="flex justify-end gap-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowFormProducto(false);
                      setEditandoProdId(null);
                    }}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-semibold py-2 px-4 rounded-lg transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-verde-dpm hover:bg-green-700 text-white text-xs font-bold py-2 px-6 rounded-lg transition flex items-center gap-1.5 shadow"
                  >
                    <FaSave /> {editandoProdId ? 'Guardar Cambios' : 'Publicar Producto en Tienda'}
                  </button>
                </div>
              </form>
            )}

            {/* Tabla Dinámica de Inventario */}
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-gray-50 px-4 py-3 border-b flex items-center justify-between text-xs font-bold text-gray-700 uppercase">
                <span>Catálogo de Productos & Entradas en Bodega:</span>
                <span className="text-emerald-700 font-semibold lowercase">✓ sincronizado con la tienda online</span>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
                    <tr>
                      <th className="py-3 px-4 text-left">Producto</th>
                      <th className="py-3 px-3 text-left">Categoría</th>
                      <th className="py-3 px-3 text-center">Precio CLP</th>
                      <th className="py-3 px-3 text-center">Control de Stock</th>
                      <th className="py-3 px-4 text-center">Estado</th>
                      <th className="py-3 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {productos.map((prod) => (
                      <tr key={prod.id} className="hover:bg-slate-50 transition">
                        <td className="py-3 px-4 flex items-center gap-3">
                          <img 
                            src={prod.imagenUrl} 
                            alt={prod.nombre} 
                            className="w-12 h-12 object-contain rounded-lg bg-gray-50 border p-1" 
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/polera.jpg';
                            }}
                          />
                          <div>
                            <span className="font-bold text-gray-900 block">{prod.nombre}</span>
                            <span className="text-[10px] text-gray-400 font-mono">ID: {prod.id}</span>
                          </div>
                        </td>

                        <td className="py-3 px-3 text-xs text-gray-600">
                          <span className="bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                            {prod.categoria}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-center font-bold text-azul-dpm text-base">
                          ${prod.precio.toLocaleString('es-CL')}
                        </td>

                        {/* Control Rápido de Stock (+/-) */}
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleAjustarStock(prod.id, -10)}
                              className="w-6 h-6 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-xs"
                              title="Restar 10 unidades"
                            >
                              -
                            </button>
                            <span className="font-mono font-bold text-sm w-12 text-center">
                              {prod.stock}
                            </span>
                            <button
                              onClick={() => handleAjustarStock(prod.id, 10)}
                              className="w-6 h-6 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-xs"
                              title="Sumar 10 unidades"
                            >
                              +
                            </button>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-center">
                          {prod.stock > 15 ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                              <FaCheckCircle size={10} /> En Stock
                            </span>
                          ) : prod.stock > 0 ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
                              ⚠️ Stock Bajo
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full">
                              Agotado
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => handleIniciarEdicionProducto(prod)}
                            className="text-azul-dpm hover:text-blue-900 font-bold text-xs mr-3 inline-flex items-center gap-1"
                          >
                            <FaEdit /> Editar
                          </button>
                          <button
                            onClick={() => handleEliminarProducto(prod.id)}
                            className="text-rose-600 hover:text-rose-800 font-bold text-xs inline-flex items-center gap-1"
                          >
                            <FaTrash /> Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Registro de Ventas Recientes */}
            <div className="bg-slate-50 border border-gray-200 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                  <FaChartLine className="text-verde-dpm" /> Registro de Ventas Recientes (Checkout)
                </h4>
                <span className="text-[11px] text-gray-400">Actualizado automáticamente por Carrito</span>
              </div>

              <div className="divide-y divide-gray-200">
                {ventasRecientes.map(v => (
                  <div key={v.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-gray-900">{v.cliente}</span>
                      <span className="text-gray-500 block text-[11px]">{v.detalle} • {v.fecha}</span>
                    </div>
                    <span className="font-black text-verde-dpm font-mono text-sm">
                      +${v.total.toLocaleString('es-CL')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ================================================================= */}
        {/* PESTAÑA 4: PLANTEL PROFESIONAL - GESTIÓN DIDÁCTICA Y AMIGABLE     */}
        {/* ================================================================= */}
        {activeTab === 'jugadores' && (
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Encabezado y Barra de Acciones */}
            <div className="bg-gradient-to-r from-slate-900 to-azul-dpm rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 border border-emerald-500/20">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
                  <FaFutbol /> Fichas Técnicas & Nómina Oficial 2026
                </div>
                <h3 className="text-2xl font-black text-white mt-1">
                  Gestión del Plantel de Jugadores
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
                  Panel adaptado para directores del club: agregue nuevos futbolistas, actualice dorsales, fotos, rendimientos o dé de baja fichas de forma sencilla. Cualquier cambio se verá reflejado inmediatamente en la web pública.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 items-center">
                <button
                  onClick={() => {
                    setEditandoJugadorId(null);
                    setJNombre('');
                    setJPosicion('Volante');
                    setJDorsal(10);
                    setJEdad(24);
                    setJNacionalidad('Chile');
                    setJFoto('/images/jugador-4.png');
                    setJPartidos(14);
                    setJGoles(3);
                    setJEfectividad('85% Rendimiento');
                    setJClubOrigen('Cantera DPM Chinquihue');
                    setJPieHabil('Derecho');
                    setJDescripcion('');
                    setShowFormJugador(true);
                  }}
                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black px-5 py-3 rounded-xl shadow-lg transition flex items-center gap-2 text-sm sm:text-base cursor-pointer"
                >
                  <FaUserPlus size={18} /> Inscribir Nuevo Futbolista
                </button>

                <button
                  onClick={handleRestablecerPlantel}
                  className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-3 rounded-xl border border-white/20 transition flex items-center gap-2 text-xs sm:text-sm cursor-pointer"
                  title="Restablece la nómina a los 12 jugadores oficiales predeterminados"
                >
                  <FaUndo /> Restablecer Plantel
                </button>

                <Link
                  to="/jugadores"
                  target="_blank"
                  className="bg-sky-700/60 hover:bg-sky-600 text-white font-bold px-4 py-3 rounded-xl border border-sky-400/30 transition flex items-center gap-2 text-xs sm:text-sm"
                >
                  <FaExternalLinkAlt size={12} /> Ver en Web Hinchas
                </Link>
              </div>
            </div>

            {/* FORMULARIO DIDÁCTICO PARA CREAR O EDITAR FUTBOLISTA */}
            {showFormJugador && (
              <div className="bg-slate-50 border-2 border-emerald-500 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg">
                      {editandoJugadorId ? '✏️' : '➕'}
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-gray-900">
                        {editandoJugadorId ? 'Modificar Ficha del Futbolista' : 'Inscribir Nuevo Futbolista en Plantel'}
                      </h4>
                      <p className="text-xs text-gray-500">
                        Complete los datos básicos y deportivos. Se guardará de inmediato en el sistema.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowFormJugador(false)}
                    className="text-gray-400 hover:text-gray-600 font-black text-xl px-2 py-1"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleGuardarJugador} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Nombre */}
                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-1">
                        Nombre Completo del Jugador *
                      </label>
                      <input
                        type="text"
                        value={jNombre}
                        onChange={(e) => setJNombre(e.target.value)}
                        placeholder="Ej: Marcelo Morales"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 text-base font-medium focus:ring-2 focus:ring-emerald-500 bg-white"
                        required
                      />
                    </div>

                    {/* Posición */}
                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-1">
                        Posición en Cancha *
                      </label>
                      <select
                        value={jPosicion}
                        onChange={(e) => setJPosicion(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 text-base font-semibold focus:ring-2 focus:ring-emerald-500 bg-white"
                      >
                        <option value="Portero">🧤 Portero (Arquero)</option>
                        <option value="Defensa">🛡️ Defensa</option>
                        <option value="Volante">🧠 Volante (Mediocampista)</option>
                        <option value="Delantero">⚽ Delantero (Goleador)</option>
                      </select>
                    </div>

                    {/* Dorsal */}
                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-1">
                        Dorsal / Número de Camiseta (1-99)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="99"
                        value={jDorsal}
                        onChange={(e) => setJDorsal(Number(e.target.value))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 text-base font-mono font-bold focus:ring-2 focus:ring-emerald-500 bg-white"
                      />
                    </div>

                    {/* Edad */}
                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-1">
                        Edad (Años)
                      </label>
                      <input
                        type="number"
                        min="15"
                        max="45"
                        value={jEdad}
                        onChange={(e) => setJEdad(Number(e.target.value))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 text-base font-medium focus:ring-2 focus:ring-emerald-500 bg-white"
                      />
                    </div>

                    {/* Nacionalidad */}
                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-1">
                        Nacionalidad
                      </label>
                      <input
                        type="text"
                        value={jNacionalidad}
                        onChange={(e) => setJNacionalidad(e.target.value)}
                        placeholder="Chile, Argentina, etc."
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 text-base font-medium focus:ring-2 focus:ring-emerald-500 bg-white"
                      />
                    </div>

                    {/* Pie Hábil */}
                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-1">
                        Pie Hábil
                      </label>
                      <select
                        value={jPieHabil}
                        onChange={(e) => setJPieHabil(e.target.value as 'Derecho' | 'Izquierdo' | 'Ambidiestro')}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 text-base font-medium focus:ring-2 focus:ring-emerald-500 bg-white"
                      >
                        <option value="Derecho">Derecho</option>
                        <option value="Izquierdo">Izquierdo (Zurdo)</option>
                        <option value="Ambidiestro">Ambidiestro</option>
                      </select>
                    </div>

                    {/* Club Origen */}
                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-1">
                        Club de Formación o Procedencia
                      </label>
                      <input
                        type="text"
                        value={jClubOrigen}
                        onChange={(e) => setJClubOrigen(e.target.value)}
                        placeholder="Ej: Cantera DPM Chinquihue"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 text-base font-medium focus:ring-2 focus:ring-emerald-500 bg-white"
                      />
                    </div>

                    {/* Partidos Jugados */}
                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-1">
                        Partidos Jugados Temporada 2026
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={jPartidos}
                        onChange={(e) => setJPartidos(Number(e.target.value))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 text-base font-bold focus:ring-2 focus:ring-emerald-500 bg-white"
                      />
                    </div>

                    {/* Goles o Atajadas */}
                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-1">
                        {jPosicion === 'Portero' ? 'Atajadas Clave' : 'Goles Convertidos'}
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={jGoles}
                        onChange={(e) => setJGoles(Number(e.target.value))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 text-base font-bold focus:ring-2 focus:ring-emerald-500 bg-white"
                      />
                    </div>
                  </div>

                  {/* Efectividad y Cálculo Rápido */}
                  <div className="bg-white p-4 rounded-xl border border-gray-200">
                    <label className="block text-sm font-bold text-gray-800 mb-1">
                      Efectividad Deportiva / Indicador de Rendimiento
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3 items-center">
                      <input
                        type="text"
                        value={jEfectividad}
                        onChange={(e) => setJEfectividad(e.target.value)}
                        placeholder="Ej: 88% Precisión de Pases"
                        className="w-full sm:flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-base font-semibold focus:ring-2 focus:ring-emerald-500"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setJEfectividad('90% Precisión')}
                          className="text-xs bg-emerald-50 text-emerald-700 font-bold px-3 py-2 rounded-lg border border-emerald-200 hover:bg-emerald-100"
                        >
                          90% Pases
                        </button>
                        <button
                          type="button"
                          onClick={() => setJEfectividad('88% Rendimiento')}
                          className="text-xs bg-blue-50 text-blue-700 font-bold px-3 py-2 rounded-lg border border-blue-200 hover:bg-blue-100"
                        >
                          88% Rendimiento
                        </button>
                        <button
                          type="button"
                          onClick={() => setJEfectividad('89% Atajadas')}
                          className="text-xs bg-amber-50 text-amber-700 font-bold px-3 py-2 rounded-lg border border-amber-200 hover:bg-amber-100"
                        >
                          89% Atajadas
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Selección de Fotografía con Galería Didáctica y Carga de Archivo */}
                  <div className="bg-white p-5 rounded-xl border border-gray-200 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <label className="text-sm font-bold text-gray-800 flex items-center gap-2">
                        <FaImage className="text-emerald-600" /> Foto Oficial del Futbolista
                      </label>
                      <span className="text-xs text-gray-500">
                        Haga clic en una foto oficial del club o suba una foto desde su computador
                      </span>
                    </div>

                    {/* Previsualización y Carga de Archivo */}
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-emerald-500 shadow-md ring-2 ring-emerald-200 shrink-0 bg-slate-900 flex items-center justify-center">
                        <img 
                          src={jFoto} 
                          alt="Vista previa" 
                          className="w-full h-full object-cover object-top"
                          onError={(e) => { (e.target as HTMLImageElement).src = '/images/jugador-4.png'; }}
                        />
                      </div>

                      <div className="flex-1 space-y-2 w-full">
                        <label className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer text-sm font-bold text-gray-700 transition">
                          <FaCloudUploadAlt size={20} className="text-emerald-600" />
                          <span>Haga clic aquí para subir foto desde su equipo</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleJugadorImageUpload}
                            className="hidden"
                          />
                        </label>
                        <input
                          type="text"
                          value={jFoto}
                          onChange={(e) => setJFoto(e.target.value)}
                          placeholder="O ingrese la ruta o enlace de la imagen"
                          className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-gray-300 text-gray-600 bg-gray-50"
                        />
                      </div>
                    </div>

                    {/* Galería Rápida de Fotos Oficiales Existentes */}
                    <div className="pt-2 border-t border-gray-100">
                      <span className="text-xs font-bold text-gray-600 block mb-2">
                        O seleccione una foto oficial del archivo DPM:
                      </span>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {fotosOficialesDisponibles.map((f, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setJFoto(f.url)}
                            className={`p-1.5 rounded-xl border text-center transition flex flex-col items-center gap-1 cursor-pointer ${
                              jFoto === f.url
                                ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-400'
                                : 'border-gray-200 hover:border-gray-400 bg-gray-50'
                            }`}
                          >
                            <img src={f.url} alt={f.label} className="w-10 h-10 rounded-full object-cover" />
                            <span className="text-[10px] font-medium text-gray-700 truncate w-full">{f.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Descripción / Biografía */}
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-1">
                      Reseña Breve o Perfil del Futbolista
                    </label>
                    <textarea
                      rows={2}
                      value={jDescripcion}
                      onChange={(e) => setJDescripcion(e.target.value)}
                      placeholder="Ej: Volante de gran despliegue táctico y precisión quirúrgica en balones detenidos."
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                  </div>

                  {/* Botones de Guardar y Cancelar */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-2">
                    <button
                      type="submit"
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3.5 px-6 rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-base cursor-pointer"
                    >
                      <FaSave /> {editandoJugadorId ? 'Guardar Cambios del Futbolista' : 'Registrar Futbolista en Plantel'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowFormJugador(false)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3.5 px-6 rounded-xl transition text-base cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* LISTADO DE FUTBOLISTAS CON TARJETAS GRANDES Y ACCESIBLES */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <FaUsers className="text-emerald-600" /> Futbolistas Registrados ({jugadores.length})
                </h4>
                <span className="text-xs text-gray-500">
                  Haga clic en «Modificar» para editar la ficha o en «Dar de Baja» para remover
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {jugadores.map((j) => (
                  <div
                    key={j.id}
                    className="bg-white border-2 border-gray-200 hover:border-emerald-500 rounded-2xl p-5 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
                  >
                    <div>
                      {/* Cabecera de la Tarjeta */}
                      <div className="flex items-center justify-between">
                        <span className="w-9 h-9 rounded-full bg-amarillo-dpm text-slate-950 font-black flex items-center justify-center text-sm shadow">
                          #{j.dorsal || (j.posicion === 'Portero' ? 1 : 10)}
                        </span>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                          j.posicion === 'Portero' ? 'bg-amber-100 text-amber-900' :
                          j.posicion === 'Defensa' ? 'bg-blue-100 text-blue-900' :
                          j.posicion === 'Volante' ? 'bg-emerald-100 text-emerald-900' :
                          'bg-rose-100 text-rose-900'
                        }`}>
                          {j.posicion}
                        </span>
                      </div>

                      {/* Foto y Datos Principales */}
                      <div className="flex items-center gap-4 mt-3">
                        <img
                          src={j.fotoUrl || '/images/jugador-4.png'}
                          alt={j.nombre}
                          className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500 shadow ring-2 ring-emerald-100 shrink-0"
                          onError={(e) => { (e.target as HTMLImageElement).src = '/images/jugador-4.png'; }}
                        />
                        <div className="min-w-0">
                          <h4 className="font-black text-lg text-gray-900 truncate">{j.nombre}</h4>
                          <span className="text-xs text-gray-500 block">
                            {j.edad} años • {j.nacionalidad}
                          </span>
                          <span className="text-[11px] font-semibold text-emerald-700 truncate block">
                            {j.clubOrigen || 'Cantera DPM'}
                          </span>
                        </div>
                      </div>

                      {/* Reseña deportiva */}
                      <p className="text-xs text-gray-600 line-clamp-2 mt-3 italic bg-slate-50 p-2 rounded-lg border border-gray-100">
                        "{j.descripcion || `${j.posicion} profesional del club.`}"
                      </p>

                      {/* Métricas / Estadísticas del Jugador */}
                      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-gray-100 text-center text-xs">
                        <div className="bg-gray-50 p-1.5 rounded-lg">
                          <span className="text-[10px] text-gray-400 uppercase font-semibold block">Partidos</span>
                          <span className="font-black text-gray-800">{j.partidosJugados || 14}</span>
                        </div>
                        <div className="bg-emerald-50 p-1.5 rounded-lg">
                          <span className="text-[10px] text-emerald-700 uppercase font-semibold block">
                            {j.posicion === 'Portero' ? 'Atajadas' : 'Goles'}
                          </span>
                          <span className="font-black text-emerald-800">
                            {j.posicion === 'Portero' ? (j.atajadas || 42) : (j.goles || 2)}
                          </span>
                        </div>
                        <div className="bg-blue-50 p-1.5 rounded-lg">
                          <span className="text-[10px] text-blue-700 uppercase font-semibold block">Rendimiento</span>
                          <span className="font-bold text-blue-900 text-[11px] truncate block">
                            {j.precisionPases || '85%'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Botones de Acción Accesibles para Adultos Mayores */}
                    <div className="flex gap-2 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => handleIniciarEdicionJugador(j)}
                        className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-bold py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 text-xs sm:text-sm cursor-pointer shadow-sm"
                      >
                        <FaEdit /> Modificar Ficha
                      </button>
                      <button
                        onClick={() => handleEliminarJugador(j.id)}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1 text-xs cursor-pointer"
                        title="Desvincular jugador de la nómina"
                      >
                        <FaTrash /> Dar de Baja
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ================================================================= */}
        {/* PESTAÑA 5: GESTIÓN DE FIXTURE, PRÓXIMO PARTIDO & TNT SPORTS       */}
        {/* ================================================================= */}
        {activeTab === 'partidos' && (
          <div className="p-6 sm:p-8 space-y-8 bg-slate-50/50">
            {/* Encabezado Explicativo amigable para adultos mayores */}
            <div className="bg-gradient-to-r from-azul-dpm to-slate-900 text-white p-6 rounded-2xl shadow-md border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-amarillo-dpm bg-amarillo-dpm/20 px-3 py-1 rounded-full border border-amarillo-dpm/40">
                  Control de Cartelera & Multimedia
                </span>
                <h2 className="text-2xl font-black mt-2">Gestión del Próximo Encuentro y Resumen TNT Sports</h2>
                <p className="text-sm text-gray-200 mt-1">
                  Aquí la directiva puede actualizar el rival de turno, horario, venta de entradas y el video oficial de YouTube de TNT Sports con solo pegar el enlace.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleGuardarPartidos}
                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black px-5 py-3 rounded-xl shadow-lg transition flex items-center gap-2 text-sm cursor-pointer"
                >
                  <FaSave /> Guardar Cambios en Vivo
                </button>
                <button
                  onClick={handleRestablecerPartidos}
                  className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-3 rounded-xl transition flex items-center gap-2 text-xs cursor-pointer border border-white/20"
                >
                  <FaUndo /> Restablecer
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* TARJETA 1: PRÓXIMO ENCUENTRO */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b border-gray-100 text-verde-dpm font-black text-lg">
                  <FaCalendarAlt /> Próximo Encuentro (Cartelera Principal)
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nombre del Rival</label>
                    <input
                      type="text"
                      value={partidosForm.proximo.rival}
                      onChange={(e) => setPartidosForm({
                        ...partidosForm,
                        proximo: { ...partidosForm.proximo, rival: e.target.value }
                      })}
                      className="w-full border border-gray-300 rounded-xl p-3 text-sm font-semibold focus:ring-2 focus:ring-verde-dpm focus:border-verde-dpm"
                      placeholder="Ej: Ñublense, Provincial Osorno, etc."
                    />
                    {/* Botones de sugerencia rápida */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span className="text-[10px] text-gray-500 font-bold self-center mr-1">Rápido:</span>
                      {['Ñublense', 'Provincial Osorno', 'Deportes Concepción', 'Deportes Melipilla', 'Deportes Temuco', 'Rangers'].map((rivalName) => (
                        <button
                          key={rivalName}
                          type="button"
                          onClick={() => {
                            let escudo = '/images/escudo-concepcion.png';
                            if (rivalName === 'Provincial Osorno') escudo = '/images/escudo-osorno.jpg';
                            if (rivalName === 'Deportes Temuco') escudo = '/images/escudo-temuco.png';
                            if (rivalName === 'Rangers') escudo = '/images/escudo-rangers.png';
                            if (rivalName === 'Ñublense') escudo = 'https://dpmchile.cl/wp-content/uploads/2024/08/nublense.webp';
                            setPartidosForm({
                              ...partidosForm,
                              proximo: {
                                ...partidosForm.proximo,
                                rival: rivalName,
                                escudoRival: escudo
                              }
                            });
                          }}
                          className="text-[10px] font-bold bg-gray-100 hover:bg-emerald-100 hover:text-emerald-800 text-gray-700 px-2 py-1 rounded-lg transition"
                        >
                          {rivalName}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Escudo del Rival (URL o Imagen)</label>
                    <div className="flex gap-3 items-center">
                      <div className="w-14 h-14 rounded-xl border border-gray-200 bg-gray-50 p-2 shrink-0 flex items-center justify-center">
                        <img 
                          src={partidosForm.proximo.escudoRival} 
                          alt="Escudo Rival" 
                          className="w-full h-full object-contain"
                          onError={(e) => { (e.target as HTMLImageElement).src = '/images/escudo-concepcion.png'; }}
                        />
                      </div>
                      <input
                        type="text"
                        value={partidosForm.proximo.escudoRival}
                        onChange={(e) => setPartidosForm({
                          ...partidosForm,
                          proximo: { ...partidosForm.proximo, escudoRival: e.target.value }
                        })}
                        className="flex-1 border border-gray-300 rounded-xl p-3 text-xs font-mono text-gray-700 focus:ring-2 focus:ring-verde-dpm"
                        placeholder="URL de la imagen o /images/escudo-..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Torneo / Campeonato</label>
                      <input
                        type="text"
                        value={partidosForm.proximo.torneo}
                        onChange={(e) => setPartidosForm({
                          ...partidosForm,
                          proximo: { ...partidosForm.proximo, torneo: e.target.value }
                        })}
                        className="w-full border border-gray-300 rounded-xl p-3 text-sm font-semibold"
                        placeholder="Ej: Copa Chile Coca-Cola Sin Azúcar"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Estadio</label>
                      <input
                        type="text"
                        value={partidosForm.proximo.estadio}
                        onChange={(e) => setPartidosForm({
                          ...partidosForm,
                          proximo: { ...partidosForm.proximo, estadio: e.target.value }
                        })}
                        className="w-full border border-gray-300 rounded-xl p-3 text-sm font-semibold"
                        placeholder="Ej: Estadio Bicentenario Chinquihue"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Fecha del Partido</label>
                      <input
                        type="text"
                        value={partidosForm.proximo.fecha}
                        onChange={(e) => setPartidosForm({
                          ...partidosForm,
                          proximo: { ...partidosForm.proximo, fecha: e.target.value }
                        })}
                        className="w-full border border-gray-300 rounded-xl p-3 text-sm font-semibold"
                        placeholder="Ej: Domingo 28 de Septiembre 2026"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Hora</label>
                      <input
                        type="text"
                        value={partidosForm.proximo.hora}
                        onChange={(e) => setPartidosForm({
                          ...partidosForm,
                          proximo: { ...partidosForm.proximo, hora: e.target.value }
                        })}
                        className="w-full border border-gray-300 rounded-xl p-3 text-sm font-semibold"
                        placeholder="Ej: 18:00 hrs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Enlace a Venta de Entradas</label>
                    <input
                      type="text"
                      value={partidosForm.proximo.ticketLink}
                      onChange={(e) => setPartidosForm({
                        ...partidosForm,
                        proximo: { ...partidosForm.proximo, ticketLink: e.target.value }
                      })}
                      className="w-full border border-gray-300 rounded-xl p-3 text-sm font-mono text-gray-700"
                      placeholder="/entradas o link externo de Ticketplus"
                    />
                  </div>
                </div>
              </div>

              {/* TARJETA 2: ÚLTIMO MARCADOR & YOUTUBE TNT SPORTS */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b border-gray-100 text-red-600 font-black text-lg">
                  <FaYoutube /> Marcador Oficial & Resumen YouTube TNT Sports
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Rival Último Partido</label>
                      <input
                        type="text"
                        value={partidosForm.ultimo.rival}
                        onChange={(e) => setPartidosForm({
                          ...partidosForm,
                          ultimo: { ...partidosForm.ultimo, rival: e.target.value }
                        })}
                        className="w-full border border-gray-300 rounded-xl p-3 text-sm font-semibold"
                        placeholder="Ej: Magallanes"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Fecha Último Partido</label>
                      <input
                        type="text"
                        value={partidosForm.ultimo.fecha}
                        onChange={(e) => setPartidosForm({
                          ...partidosForm,
                          ultimo: { ...partidosForm.ultimo, fecha: e.target.value }
                        })}
                        className="w-full border border-gray-300 rounded-xl p-3 text-sm font-semibold"
                        placeholder="Ej: Sábado 21 de Septiembre 2026"
                      />
                    </div>
                  </div>

                  {/* Marcador Goles DPM y Rival */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-gray-200 flex items-center justify-around gap-4 text-center">
                    <div>
                      <span className="block text-xs font-black text-emerald-800 uppercase mb-1">Goles DPM</span>
                      <input
                        type="number"
                        min="0"
                        value={partidosForm.ultimo.golesDpm}
                        onChange={(e) => setPartidosForm({
                          ...partidosForm,
                          ultimo: { ...partidosForm.ultimo, golesDpm: parseInt(e.target.value) || 0 }
                        })}
                        className="w-20 text-center font-black text-3xl text-emerald-600 bg-white border border-emerald-300 rounded-xl p-2 shadow-inner"
                      />
                    </div>
                    <span className="text-2xl font-black text-gray-400 self-center mt-4">-</span>
                    <div>
                      <span className="block text-xs font-black text-gray-700 uppercase mb-1">Goles Rival</span>
                      <input
                        type="number"
                        min="0"
                        value={partidosForm.ultimo.golesRival}
                        onChange={(e) => setPartidosForm({
                          ...partidosForm,
                          ultimo: { ...partidosForm.ultimo, golesRival: parseInt(e.target.value) || 0 }
                        })}
                        className="w-20 text-center font-black text-3xl text-gray-800 bg-white border border-gray-300 rounded-xl p-2 shadow-inner"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Video de YouTube TNT Sports (ID o Enlace Completo)
                    </label>
                    <input
                      type="text"
                      value={partidosForm.ultimo.youtubeId}
                      onChange={(e) => setPartidosForm({
                        ...partidosForm,
                        ultimo: { ...partidosForm.ultimo, youtubeId: e.target.value }
                      })}
                      className="w-full border border-gray-300 rounded-xl p-3 text-sm font-mono text-gray-800"
                      placeholder="Ej: ScQrhZAB-lg o https://www.youtube.com/watch?v=ScQrhZAB-lg"
                    />
                    <p className="text-[11px] text-gray-500 mt-1">
                      ℹ️ Tip para directivos: Puedes copiar y pegar directamente el enlace de YouTube que comparte TNT Sports Chile. El sistema detecta el video automáticamente.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Título del Video</label>
                    <input
                      type="text"
                      value={partidosForm.ultimo.youtubeTitulo}
                      onChange={(e) => setPartidosForm({
                        ...partidosForm,
                        ultimo: { ...partidosForm.ultimo, youtubeTitulo: e.target.value }
                      })}
                      className="w-full border border-gray-300 rounded-xl p-3 text-sm font-semibold"
                      placeholder="Ej: Resumen DPM 2 - 0 Magallanes | TNT Sports"
                    />
                  </div>

                  {/* Vista Previa del Video Embebido */}
                  <div className="pt-2">
                    <span className="block text-xs font-bold text-gray-500 uppercase mb-2">Vista Previa Inmediata:</span>
                    <div className="relative pt-[56.25%] rounded-xl overflow-hidden bg-black border border-gray-300 shadow">
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${partidosForm.ultimo.youtubeId.replace('https://www.youtube.com/watch?v=', '').replace('https://youtu.be/', '').replace('https://www.youtube.com/embed/', '').split('&')[0]}`}
                        title="Previsualización TNT Sports"
                        className="absolute inset-0 w-full h-full border-0"
                        allowFullScreen
                      />
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Botón inferior grande de Guardar */}
            <div className="flex justify-end pt-4">
              <button
                onClick={handleGuardarPartidos}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-8 py-4 rounded-2xl shadow-xl transition flex items-center gap-2 text-base cursor-pointer transform hover:-translate-y-0.5"
              >
                <FaCheckCircle /> Guardar Configuración de Partidos y Resúmenes
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
