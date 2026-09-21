/**
 * ============================================================================
 * Archivo: index.ts (types)
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Define y exporta todas las interfaces (tipos de datos) principales de 
 * TypeScript que representan las entidades del negocio (Usuario, Jugador, 
 * Producto, etc.) y los contratos con la API.
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * El tipado estricto (strong typing) es fundamental en aplicaciones robustas:
 * 1. Previene errores en tiempo de ejecución (ej. acceder a propiedades que no existen).
 * 2. Documenta automáticamente el código para otros desarrolladores.
 * 3. Mejora la experiencia en el IDE mediante el autocompletado y validación.
 * 
 * DECISIONES DE DISEÑO:
 * - Centralización: En lugar de definir las interfaces en cada archivo,
 *   se centralizan aquí para facilitar su reutilización e importación.
 * ============================================================================
 */

/** 
 * Representa a un usuario autenticado en la aplicación.
 * El rol determina si tiene acceso a la ruta de administración.
 */
export interface User {
  nombre: string;
  email: string;
  rol: 'ADMIN' | 'USER'; // Restringido solo a dos posibles valores.
}

/** 
 * Estructura de la respuesta enviada por el backend tras un inicio de sesión.
 */
export interface AuthResponse {
  token: string; // Token JWT para autorización
  nombre: string;
  email: string;
  rol: 'ADMIN' | 'USER';
}

/** Payload enviado a la API para iniciar sesión */
export interface LoginRequest {
  email: string;
  password?: string;
}

/** Payload enviado a la API para registrar una nueva cuenta */
export interface RegisterRequest {
  nombre: string;
  email: string;
  password?: string;
}

/** Información de un integrante del plantel profesional */
export interface Jugador {
  id: string;
  nombre: string;
  nacionalidad: string;
  posicion: string; // Ej: Delantero, Medio, Defensa, Arquero
  edad: number;
  fotoUrl: string;
  descripcion: string;
  // Estadísticas deportivas y ficha técnica para el hincha
  dorsal?: number;
  partidosJugados?: number;
  goles?: number;
  asistencias?: number;
  atajadas?: number;
  recuperaciones?: number;
  precisionPases?: string;
  clubOrigen?: string;
  pieHabil?: 'Derecho' | 'Izquierdo' | 'Ambidiestro';
}

/** Artículo en venta en la tienda oficial */
export interface Producto {
  id: string;
  nombre: string;
  precio: number;
  imagenUrl: string;
  stock: number;
  categoria: string;
}

/** Objeto individual de producto dentro del carrito de compras */
export interface CarritoItem {
  id: string;
  productoNombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

/** El estado total del carrito de compras de un usuario */
export interface CarritoResponse {
  id: string;
  items: CarritoItem[];
  total: number;
}

/** Artículo de noticia o información del club */
export interface Novedad {
  id: string;
  titulo: string;
  contenido: string;
  imagenUrl: string;
  fechaPublicacion: string;
  autorNombre: string;
}

/** Representa las estadísticas de un equipo en la tabla de posiciones */
export interface Posicion {
  equipo: string;
  escudoUrl: string;
  pj: number; // Partidos Jugados
  pg: number; // Partidos Ganados
  pe: number; // Partidos Empatados
  pp: number; // Partidos Perdidos
  gf: number; // Goles a Favor
  gc: number; // Goles en Contra
  dg: number; // Diferencia de Goles
  pts: number;// Puntos Totales
}
