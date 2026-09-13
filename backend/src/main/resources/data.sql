-- ============================================================================
-- Archivo: data.sql
-- Proyecto: DPM Pro - Club Deportes Puerto Montt
-- ============================================================================
-- 
-- ¿QUÉ HACE ESTE ARCHIVO?
-- Es el script de inicialización de datos (seed data). Inserta los registros
-- fundamentales para que la aplicación (y el frontend) tengan contenido 
-- visualizable inmediatamente tras arrancar en modo desarrollo.
-- 
-- ¿POR QUÉ ESTA TECNOLOGÍA?
-- Spring Boot, a través de 'defer-datasource-initialization', ejecuta automáticamente 
-- data.sql luego de que Hibernate crea el esquema (DDL). 
-- Es ideal para poblar catálogos, administradores por defecto y tablas de dominio.
-- ============================================================================

-- ============================================================================
-- 1. USUARIOS DEL SISTEMA
-- Insertamos el administrador principal.
-- NOTA: La contraseña está hasheada con BCrypt ('password123' u otra por defecto).
-- ============================================================================
INSERT INTO usuario (email, nombre, password_hash, rol, created_at)
VALUES ('admin@dpm.cl', 'Administrador', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1, CURRENT_TIMESTAMP);

-- ============================================================================
-- 2. JUGADORES (PLANTEL OFICIAL)
-- La posición se guarda como un ordinal del enum (0=Portero, 1=Defensa, 2=Mediocampista, 3=Delantero)
-- ============================================================================
INSERT INTO jugador (nombre, nacionalidad, posicion, edad, foto_url, descripcion, activo) VALUES
('Kevin Catalán', 'Chile', 0, 22, 'https://example.com/kevin_catalan.jpg', 'Portero titular del equipo.', true),
('Carlos Rodríguez', 'Chile', 1, 25, 'https://example.com/carlos_rodriguez.jpg', 'Defensa central sólido.', true),
('Vicente Yañez', 'Chile', 1, 21, 'https://example.com/vicente_yanez.jpg', 'Lateral izquierdo rápido.', true),
('Maximiliano Riveros', 'Chile', 1, 28, 'https://example.com/maximiliano_riveros.jpg', 'Defensa experimentado.', true),
('Kevin Flores', 'Chile', 2, 24, 'https://example.com/kevin_flores.jpg', 'Mediocampista creador.', true),
('Yakob Yousef', 'Chile', 2, 20, 'https://example.com/yakob_yousef.jpg', 'Volante de contención.', true),
('Sebastián Torres', 'Chile', 2, 27, 'https://example.com/sebastian_torres.jpg', 'Mediocampista mixto.', true),
('Daniel Bahamonde', 'Chile', 3, 23, 'https://example.com/daniel_bahamonde.jpg', 'Delantero goleador.', true),
('Giovanni Bustos', 'Chile', 3, 26, 'https://example.com/giovanni_bustos.jpg', 'Extremo derecho veloz.', true),
('Sebastián González', 'Chile', 3, 29, 'https://example.com/sebastian_gonzalez.jpg', 'Delantero centro de área.', true),
('Kevin Mansilla', 'Chile', 0, 25, 'https://example.com/kevin_mansilla.jpg', 'Portero suplente.', true),
('Fabián Rodríguez', 'Chile', 1, 22, 'https://example.com/fabian_rodriguez.jpg', 'Defensa lateral derecho.', true);

-- ============================================================================
-- 3. PRODUCTOS (E-COMMERCE)
-- Stock inicial para el merchandising. Los precios en CLP.
-- ============================================================================
INSERT INTO producto (nombre, precio, imagen_url, stock, categoria, activo, created_at) VALUES
('Polera Oficial', 15000, 'https://example.com/polera.jpg', 100, 'Indumentaria', true, CURRENT_TIMESTAMP),
('Short Oficial', 10000, 'https://example.com/short.jpg', 80, 'Indumentaria', true, CURRENT_TIMESTAMP),
('Calcetas', 5000, 'https://example.com/calcetas.jpg', 150, 'Indumentaria', true, CURRENT_TIMESTAMP),
('Gorro DPM', 8000, 'https://example.com/gorro.jpg', 50, 'Accesorios', true, CURRENT_TIMESTAMP),
('Entrada Estadio', 7000, 'https://example.com/entrada.jpg', 1000, 'Tickets', true, CURRENT_TIMESTAMP);

-- ============================================================================
-- 4. TABLA DE POSICIONES
-- Datos de muestra del campeonato actual para mostrar en el widget principal.
-- ============================================================================
INSERT INTO posicion (equipo, escudo_url, pj, pg, pe, pp, gf, gc, dg, pts, temporada) VALUES
('Deportes Puerto Montt', 'https://example.com/dpm.png', 10, 8, 0, 2, 20, 10, 10, 24, 2025),
('Deportes Concepción', 'https://example.com/concepcion.png', 10, 7, 1, 2, 18, 9, 9, 22, 2025),
('San Antonio Unido', 'https://example.com/sau.png', 10, 6, 2, 2, 15, 8, 7, 20, 2025),
('Deportes Melipilla', 'https://example.com/melipilla.png', 10, 5, 3, 2, 14, 10, 4, 18, 2025),
('General Velásquez', 'https://example.com/velasquez.png', 10, 5, 2, 3, 16, 12, 4, 17, 2025),
('Provincial Osorno', 'https://example.com/osorno.png', 10, 4, 4, 2, 12, 10, 2, 16, 2025),
('Trasandino', 'https://example.com/trasandino.png', 10, 4, 2, 4, 11, 11, 0, 14, 2025),
('Real San Joaquín', 'https://example.com/sanjoaquin.png', 10, 3, 3, 4, 9, 12, -3, 12, 2025),
('Lautaro de Buin', 'https://example.com/lautaro.png', 10, 2, 4, 4, 8, 14, -6, 10, 2025),
('Concón National', 'https://example.com/concon.png', 10, 1, 2, 7, 5, 20, -15, 5, 2025);

-- ============================================================================
-- 5. NOVEDADES / NOTICIAS
-- Blog de la página principal. El autor_id (1) apunta al admin que creamos arriba.
-- ============================================================================
INSERT INTO novedad (titulo, contenido, imagen_url, fecha_publicacion, autor_id) VALUES
('Nueva Temporada 2025', 'El club se prepara para un nuevo desafío en el campeonato...', 'https://example.com/novedad1.jpg', CURRENT_TIMESTAMP, 1),
('Fichajes de Invierno', 'Tres nuevos jugadores se suman al plantel del Velero...', 'https://example.com/novedad2.jpg', CURRENT_TIMESTAMP, 1),
('Lanzamiento de Nueva Camiseta', 'Ya está disponible la nueva indumentaria oficial en la tienda...', 'https://example.com/novedad3.jpg', CURRENT_TIMESTAMP, 1);
