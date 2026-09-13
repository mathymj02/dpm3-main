# 📋 Informe Técnico y Ejecutivo para Jefe de Proyecto: Migración DPM Pro

**Proyecto:** Club Deportes Puerto Montt — Plataforma Digital Institucional y E-Commerce  
**Rol:** Arquitecto de Software & Tech Lead Senior  
**Estado:** Migración 100% Finalizada y Documentada  
**Ubicación de Código:**  
- Backend: `C:\Users\matim\.gemini\antigravity\scratch\dpm-pro\backend`  
- Frontend: `C:\Users\matim\.gemini\antigravity\scratch\dpm-pro\frontend`  

---

## 1. Resumen Ejecutivo de la Migración

El proyecto legacy consistía en un prototipo plano en **HTML estático, PHP nativo y MySQL (XAMPP)**, con estilos duplicados en 14 páginas, formularios vulnerables a SQL Injection, y lógica de autenticación y compras delegada indebidamente al navegador del cliente (`localStorage`).

La nueva solución, **DPM Pro**, transforma la plataforma en un ecosistema profesional desacoplado y listo para producción, compuesto por:
1. **API RESTful Enterprise:** Construida con **Spring Boot 3.3 (Java 17)**, seguridad basada en **Spring Security 6 + JWT**, persistencia con **Spring Data JPA/Hibernate**, validación de datos en servidor y base de datos relacional normalizada.
2. **Single Page Application (SPA) Moderna:** Desarrollada con **React 18 + TypeScript + Tailwind CSS**, con arquitectura por componentes reutilizables, control de rutas protegidas por roles y consumo asíncrono vía Axios con interceptores.

---

## 2. ¿Por qué se eligieron estas tecnologías? (Justificación Técnica)

### A. Backend: Spring Boot 3.3 (Java 17) vs. PHP Nativo Legacy
* **¿Por qué Java / Spring Boot?**  
  Java es el estándar corporativo y bancario por excelencia en Chile y una de las tecnologías centrales enseñadas en las universidades de ingeniería. Spring Boot ofrece una infraestructura robusta de nivel empresarial con soporte a largo plazo (LTS).
* **Solución de Seguridad Sistémica:**  
  En PHP nativo, concatenar strings en queries SQL provocaba vulnerabilidades críticas de SQL Injection. Con **Spring Data JPA**, todas las sentencias se parametrizan automáticamente mediante el motor Hibernate, erradicando este vector de ataque sin requerir escribir SQL manual.
* **Autenticación Robusta con JWT & BCrypt:**  
  Se implementó `BCryptPasswordEncoder` para encriptar contraseñas con salado criptográfico y tokens **JWT (JSON Web Tokens)** con firma HMAC-SHA y expiración de 24 horas. El servidor opera en modo *stateless* (sin sesiones en memoria), lo que permite escalar horizontalmente a múltiples instancias sin pérdida de sesión.

### B. Frontend: React 18 + TypeScript vs. HTML plano con JS suelto
* **¿Por qué React 18?**  
  Elimina el problema del código duplicado. La barra de navegación (`Navbar`) y el pie de página (`Footer`), que antes se copiaban y pegaban en 14 archivos HTML distintos, ahora son **componentes únicos y reutilizables**. Un cambio en el Navbar se propaga a toda la aplicación de manera instantánea.
* **¿Por qué TypeScript (Modo Estricto)?**  
  Proporciona tipado estático en tiempo de compilación. Elimina bugs frecuentes en tiempo de ejecución (como propiedades `undefined` o tipos incompatibles) y documenta automáticamente los contratos de datos recibidos del backend.
* **¿Por qué Tailwind CSS en lugar de CSS tradicional?**  
  El código anterior tenía más de 1200 líneas de CSS repetido con selectores dispersos y reglas duplicadas. Con Tailwind, se configuró un sistema de diseño centralizado con la paleta institucional oficial (`verde-dpm: #0f5d3d`, `azul-dpm: #003366`, `amarillo-dpm: #ffe600`), logrando una interfaz responsiva *mobile-first* sin hojas de estilo redundantes.

### C. Base de Datos y Persistencia: Spring Data JPA (H2 / PostgreSQL) vs. MySQL plano
* **Ambiente Dual:** En desarrollo se utiliza **H2 Database en memoria** con consola web interactiva (`/h2-console`) y precarga automática de datos (`data.sql`), permitiendo probar inmediatamente sin instalar bases de datos locales. En producción, mediante perfiles en `application.yml`, se conecta transparentemente a **PostgreSQL**.
* **Integridad Relacional:** Se modelaron relaciones formales `ManyToOne` y `OneToMany` entre Usuarios, Carritos, Productos y Novedades, garantizando trazabilidad de compras y stock.

---

## 3. Mapa Funcional y Explicación Detallada de Módulos

### 🛡️ Módulo 1: Seguridad y Control de Acceso (Auth & RBAC)
* **Funcionalidad:** Registro de usuarios, inicio de sesión seguro y control de acceso basado en roles (`USER` y `ADMIN`).
* **En el Backend:**  
  - `AuthController.java`: Expone `/api/auth/login` y `/api/auth/register`.
  - `JwtTokenProvider.java`: Genera y valida tokens con firma criptográfica.
  - `JwtAuthFilter.java`: Intercepta cada petición entrante, extrae la cabecera `Authorization: Bearer <token>` y autentica en el `SecurityContext` de Spring.
  - `SecurityConfig.java`: Configura rutas públicas (plantel, tienda, novedades, tabla) y protege operaciones críticas.
* **En el Frontend:**  
  - `AuthContext.tsx` y `useAuth.ts`: Proveen el estado de sesión global.
  - `PrivateRoute.tsx`: Bloquea el carrito a visitantes no identificados.
  - `AdminRoute.tsx`: Restringe el panel de administración a usuarios con rol `ADMIN`, evitando la vulnerabilidad anterior donde cualquier usuario modificaba el `localStorage` para ingresar.

---

### ⚽ Módulo 2: Plantel Deportivo (Jugadores)
* **Funcionalidad:** Catálogo del plantel oficial con fichas técnicas, estadísticas y filtros por demarcación en cancha (Portero, Defensa, Volante, Delantero).
* **En el Backend:**  
  - `JugadorController.java` y `JugadorService.java`: CRUD completo. Búsquedas optimizadas vía `JugadorRepository.findByPosicion()`.
* **En el Frontend:**  
  - `Jugadores.tsx`: Grilla interactiva animada con **Framer Motion**, botones de filtro dinámico y fallback de datos offline.
  - `JugadorDetalle.tsx`: Ruta dinámica (`/jugadores/:id`) que carga la información completa del futbolista consultado.

---

### 🛒 Módulo 3: Tienda Oficial y Carrito Transaccional (E-Commerce)
* **Funcionalidad:** Catálogo de indumentaria, accesorios y tickets del club con carrito persistente y liquidación de pedidos.
* **En el Backend:**  
  - `ProductoController.java`: Gestión de inventario con precios en pesos chilenos (CLP).
  - `CarritoService.java`: Lógica transaccional real. **El total y los subtotales se calculan en el servidor**, y el precio unitario se congela al agregar el producto (`CarritoItem.precioUnitario`), impidiendo que usuarios maliciosos alteren precios desde el navegador (problema crítico del proyecto original).
* **En el Frontend:**  
  - `Tienda.tsx`: Catálogo visual con formato monetario oficial chileno (`Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' })`).
  - `Carrito.tsx`: Vista de resumen con cálculo en vivo, eliminación de líneas y botón de Checkout.
  - `Toast.tsx`: Notificaciones modernas no invasivas mediante **React Toastify**, eliminando los molestos `alert()` nativos del navegador.

---

### 📰 Módulo 4: Novedades Institucionales y Widget Meteorológico
* **Funcionalidad:** Publicación de noticias del club y pronóstico del tiempo en tiempo real para la ciudad de Puerto Montt.
* **En el Backend:**  
  - `NovedadController.java` y `NovedadService.java`: Artículos con fecha de publicación y relación al usuario autor.
* **En el Frontend:**  
  - `Novedades.tsx` y `NovedadDetalle.tsx`: Tarjetas de noticias con resumen truncado y vista extendida.
  - `Home.tsx`: Consumo directo y asíncrono de la API abierta **Open-Meteo** con coordenadas de Puerto Montt (-41.4693, -72.9424) para informar a la hinchada el clima en el Estadio Chinquihue.

---

### 📊 Módulo 5: Tabla de Posiciones Oficial
* **Funcionalidad:** Clasificación de la Segunda División Profesional con estadísticas de partidos jugados, victorias, empates, derrotas, diferencia de gol y puntajes.
* **En el Backend:**  
  - `PosicionRepository.findByTemporadaOrderByPtsDesc()`: Ordena automáticamente en base de datos.
* **En el Frontend:**  
  - `Posiciones.tsx`: Tabla responsiva con *scroll* horizontal optimizado para móviles y fila de Deportes Puerto Montt destacada con el gradiente institucional albiverde.

---

### ⚙️ Módulo 6: Backoffice / Panel de Administración
* **Funcionalidad:** Panel de control centralizado exclusivo para administradores con métricas del club y gestión de productos, jugadores y noticias.
* **En el Frontend:**  
  - `AdminDashboard.tsx`: Organizado en pestañas funcionales (Pestaña Jugadores, Pestaña Productos, Pestaña Novedades) con formularios modales validados para altas, bajas y modificaciones en tiempo real.

---

## 4. Matriz de Vulnerabilidades: Antes vs. Después

| Aspecto | Implementación Legacy (PHP/HTML) | Implementación DPM Pro (Spring/React) |
|---|---|---|
| **SQL Injection** | ❌ Vulnerable (Variables interpoladas en queries) | ✅ **Erradicado** (ORM JPA con Prepared Statements) |
| **Autenticación** | ❌ Falsa (Cualquier usuario entraba) | ✅ **JWT con BCrypt y verificación en DB** |
| **Bypass de Admin** | ❌ Modificable en `localStorage` en 5 segundos | ✅ **Protección RBAC en Backend (`@PreAuthorize`)** |
| **Precios en Tienda** | ❌ Calculados en frontend (vulnerables a alteración) | ✅ **Cálculo forzado y verificado en Servidor** |
| **Código Duplicado** | ❌ 14 Navbars idénticos y 1200 líneas de CSS | ✅ **1 Navbar único y sistema Tailwind centralizado** |
| **Experiencia de Usuario** | ❌ `alert()` bloqueantes del navegador | ✅ **Toasts animados, modales y spinners fluidos** |

---

## 5. Guía de Ejecución Rápida

### Ejecución del Frontend (React + Vite)
```powershell
cd C:\Users\matim\.gemini\antigravity\scratch\dpm-pro\frontend
npm run dev
# Disponible inmediatamente en: http://localhost:5173
```

### Ejecución del Backend (Spring Boot)
```powershell
cd C:\Users\matim\.gemini\antigravity\scratch\dpm-pro\backend
mvn spring-boot:run
# API disponible en: http://localhost:8080/api
# Consola H2: http://localhost:8080/h2-console (Usuario: sa, Password: password)
```

### Credenciales Administrativas Precargadas
* **Usuario:** `admin@dpm.cl`
* **Contraseña:** `admin123`
