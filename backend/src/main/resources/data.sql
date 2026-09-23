-- ============================================================================
-- Archivo: data.sql
-- Proyecto: DPM Pro - Club Deportes Puerto Montt
-- ============================================================================
-- 
-- ¿QUÉ HACE ESTE ARCHIVO?
-- Es el script de inicialización de datos (seed data). Inserta los registros
-- fundamentales con las imágenes reales locales (/images/...) para que la
-- aplicación tenga contenido visual real desde el primer segundo.
-- ============================================================================

-- ============================================================================
-- 1. USUARIOS DEL SISTEMA (Contraseñas: admin123 / hincha123)
-- ============================================================================
INSERT INTO usuario (email, nombre, password_hash, rol, created_at) VALUES
('admin@dpm.cl', 'Administrador DPM', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 1, CURRENT_TIMESTAMP),
('hincha@dpm.cl', 'Matías Hincha Albiverde', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 0, CURRENT_TIMESTAMP),
('socio@dpm.cl', 'Socio Puerto Montt', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 0, CURRENT_TIMESTAMP),
('guardia@dpm.cl', 'Guardia Estadio Seguro', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 2, CURRENT_TIMESTAMP);

-- ============================================================================
-- 2. JUGADORES (PLANTEL OFICIAL CON FOTOS REALES)
-- 0=Portero, 1=Defensa, 2=Volante, 3=Delantero
-- ============================================================================
INSERT INTO jugador (nombre, nacionalidad, posicion, edad, foto_url, descripcion, activo) VALUES
('Kevin Catalán', 'Chile', 0, 27, '/images/jugador-5.png', '🧱 Muro en el arco: imbatible bajo presión con reflejos felinos y gran juego aéreo.', true),
('Carlos Rodríguez', 'Chile', 2, 32, '/images/jugador-rodriguez.jpg', '🧠 Líder táctico: excelente distribución en el mediocampo y cobertura impecable.', true),
('Vicente Yáñez', 'Chile', 1, 29, '/images/jugadores-1.png', '⚡ Velocidad y compromiso defensivo por la banda diestra.', true),
('Maximiliano Riveros', 'Chile', 2, 29, '/images/jugador-riveros.jpg', '🦁 Líder silencioso, precisión en pases y gran dominio de balón.', true),
('Kevin Flores', 'Chile', 1, 30, '/images/jugador-flores.jpg', '🧱 Anticipación férrea y gran poderío físico en la zaga.', true),
('Yakob Yousef', 'Chile', 3, 26, '/images/jugador-yousef.jpg', '⚡ Desborde constante, presión alta y definición letal.', true),
('Sebastián Torres', 'Chile', 1, 27, '/images/jugador-3.png', '🚀 Velocidad, centros quirúrgicos y marca implacable.', true),
('Daniel Bahamonde', 'Chile', 1, 23, '/images/jugadores-6.png', '🏃‍♂️ Motor del carril izquierdo con proyección y repliegue continuo.', true),
('Giovanni Bustos', 'Chile', 2, 25, '/images/jugador-4.png', '🎩 Visión de juego privilegiada, control de tiempos y presión.', true),
('Sebastián González', 'Chile', 2, 30, '/images/jugadores-2.png', '📊 Inteligencia táctica y efectividad en la recuperación.', true),
('Kevin Mansilla', 'Chile', 3, 29, '/images/jugadores-8.png', '🧭 Olfato goleador de área y ubicación perfecta.', true),
('Fabián Rodríguez', 'Chile', 3, 23, '/images/jugadores-7.png', '❤️ Entrega total, letal al acecho del gol en el área rival.', true);

-- ============================================================================
-- 3. PRODUCTOS OFICIALES (CON FOTOS REALES)
-- ============================================================================
INSERT INTO producto (nombre, precio, imagen_url, stock, categoria, activo, created_at) VALUES
('Polera Oficial DPM', 15000, '/images/polera.jpg', 100, 'Indumentaria', true, CURRENT_TIMESTAMP),
('Short Oficial DPM', 10000, '/images/short.webp', 80, 'Indumentaria', true, CURRENT_TIMESTAMP),
('Calcetas Oficiales', 5000, '/images/calcetas.webp', 150, 'Indumentaria', true, CURRENT_TIMESTAMP),
('Gorro DPM Oficial', 8000, '/images/yoki.jpg', 50, 'Accesorios', true, CURRENT_TIMESTAMP),
('Entrada Estadio Chinquihue', 7000, '/images/entrada.png', 500, 'Tickets', true, CURRENT_TIMESTAMP);

-- ============================================================================
-- 4. TABLA DE POSICIONES (CON ESCUDOS REALES)
-- ============================================================================
INSERT INTO posicion (equipo, escudo_url, pj, pg, pe, pp, gf, gc, dg, pts, temporada) VALUES
('Deportes Puerto Montt', '/images/logo-deportes-puertomontt.png', 12, 7, 3, 2, 22, 12, 10, 24, 2025),
('San Marcos de Arica', '/images/escudo-sanmarcos.jpg', 12, 6, 3, 3, 18, 13, 5, 21, 2025),
('Deportes Valdivia', '/images/escudo-valdivia.png', 12, 5, 4, 3, 20, 16, 4, 19, 2025),
('Deportes Melipilla', '/images/escudo-sanmarcos.jpg', 12, 5, 2, 5, 17, 16, 1, 17, 2025),
('Provincial Osorno', '/images/escudo-osorno.jpg', 12, 4, 4, 4, 15, 14, 1, 16, 2025),
('Deportes Concepción', '/images/escudo-concepcion.png', 12, 4, 3, 5, 14, 16, -2, 15, 2025),
('Deportes Temuco', '/images/escudo-temuco.png', 12, 4, 2, 6, 13, 17, -4, 14, 2025),
('Magallanes', '/images/escudo-magallanes.png', 12, 3, 3, 6, 12, 17, -5, 12, 2025),
('Rangers de Talca', '/images/escudo-rangers.png', 12, 3, 1, 8, 10, 21, -11, 10, 2025),
('Iberia Los Ángeles', '/images/club-atletico-iberia.png', 12, 2, 2, 8, 9, 21, -12, 8, 2025);

-- ============================================================================
-- 5. NOVEDADES / NOTICIAS (CON FOTOS REALES)
-- ============================================================================
INSERT INTO novedad (titulo, contenido, imagen_url, fecha_publicacion, autor_id) VALUES
('Deportes Puerto Montt denuncia robo de balones', '¡35 balones profesionales de fútbol, propiedad del plantel de Deportes Puerto Montt, fueron sustraídos desde el Estadio Bicentenario de Chinquihue!', '/images/robo-balon.jpg', CURRENT_TIMESTAMP, 1),
('Nueva Sala de acondicionamiento físico en el Chinquihue', 'Este lunes, Deportes Puerto Montt llevó a cabo la inauguración de una moderna sala de musculación en el Estadio Regional de Chinquihue para todo el plantel.', '/images/novedades1.jpg', CURRENT_TIMESTAMP, 1),
('Partimos con un triunfo la temporada: 4 a cero a Brujas de Salamanca', 'Con un triunfo debutó Deportes Puerto Montt en el campeonato de la Segunda División Profesional del fútbol chileno frente a Salamanca.', '/images/novedad3.jpeg', CURRENT_TIMESTAMP, 1);

-- ============================================================================
-- 6. ENTRADAS OFICIALES Y CARNETS DE SOCIO (SISTEMA DE TORNIQUETES)
-- ============================================================================
INSERT INTO entrada (codigo, tipo, partido, sector, puerta_asignada, asiento, titular, rut, estado, precio, created_at) VALUES
('DPM-TKT-2026-8942-A8F1', 'TICKET_PARTIDO', 'Deportes Puerto Montt vs Deportes Temuco', 'Galería Sur - Los Hijos del Temporal', 'Puerta 2 - Acceso Principal', 'Sector B - Asiento 42', 'Matías Hincha Albiverde', '18.492.301-8', 'VALIDA', 7000, CURRENT_TIMESTAMP),
('DPM-TKT-2026-1102-B3C9', 'TICKET_PARTIDO', 'Deportes Puerto Montt vs Provincial Osorno', 'Tribuna Chinquihue Techada', 'Puerta 1 - Acceso Tribuna', 'Sector A - Asiento 15', 'Gonzalo Soto Morales', '15.821.402-3', 'VALIDA', 14000, CURRENT_TIMESTAMP),
('DPM-SOCIO-2026-0842', 'CARNET_SOCIO', 'Deportes Puerto Montt (Socio Al Día 2026)', 'Tribuna Chinquihue', 'Puerta 1 - Acceso Tribuna', 'Butaca Socio Libre', 'Matías Mena Socio', '18.492.301-8', 'VALIDA', 0, CURRENT_TIMESTAMP),
('DPM-TKT-2026-USADO-77', 'TICKET_PARTIDO', 'Deportes Puerto Montt vs Deportes Temuco', 'Galería Sur', 'Puerta 2', 'Asiento 12', 'Esteban Paredes', '13.491.200-1', 'VALIDA', 7000, CURRENT_TIMESTAMP),
('DPM-SOCIO-2026-MOROSO', 'CARNET_SOCIO', 'Deportes Puerto Montt (Socio 2026)', 'Galería Sur', 'Puerta 2', 'General', 'Juan Perez Moroso', '11.222.333-4', 'MOROSO', 0, CURRENT_TIMESTAMP);
