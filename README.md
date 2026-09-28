# ⚽ Club Deportes Puerto Montt (DPM Pro) — Plataforma Oficial Fullstack

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.5-brightgreen?logo=springboot)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-17%2B-orange?logo=openjdk)](https://www.oracle.com/java/)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT%20Firmado%20%2B%20Spring%20Security-red)](https://jwt.io/)

Plataforma web institucional, tienda virtual e-commerce y sistema oficial de torniquetes / aforo para el **Club Deportivo Deportes Puerto Montt**, migrada desde una arquitectura legacy en PHP a una solución enterprise desacoplada con **Spring Boot 3.3 (API REST)** y **React 18 + TypeScript (SPA)**.

---

## 🏛️ Arquitectura del Sistema

```
dpm-pro/
├── backend/                  # API RESTful con Spring Boot 3.3 (Java 17)
│   ├── src/main/java/com/dpm/
│   │   ├── config/           # Seguridad (Spring Security 6, JWT firmado, CORS)
│   │   ├── controller/       # Endpoints REST (Auth, Jugadores, Tienda, Carrito, Entradas, etc.)
│   │   ├── dto/              # Contratos de transferencia fuertemente tipados
│   │   ├── model/            # Entidades JPA (Usuario, Jugador, Producto, Orden, Entrada, etc.)
│   │   ├── repository/       # Interfaces Spring Data JPA con consultas parametrizadas
│   │   ├── security/         # Filtros JWT y UserDetailsService
│   │   └── service/          # Capa de lógica de negocio transaccional (@Transactional)
│   └── src/main/resources/   # Perfiles application-dev.yml (H2) y application-prod.yml (PostgreSQL)
│
├── frontend/                 # Single Page Application con React 18 + TypeScript + Vite
│   ├── src/
│   │   ├── api/              # Cliente Axios con interceptor automático de Bearer Token
│   │   ├── components/       # Componentes UI (Navbar responsivo, Cards, Toasts, Modales)
│   │   ├── context/          # AuthContext (Estado global con control estricto de credenciales)
│   │   ├── guards/           # Rutas protegidas (PrivateRoute, AdminRoute)
│   │   ├── pages/            # 13 Vistas (Home, Plantel, Tienda, Carrito, Torniquetes, Admin, etc.)
│   │   └── types/            # Definiciones de tipos TypeScript estrictos
│   └── tailwind.config.ts    # Paleta oficial DPM (Verde, Azul y Blanco institucional)
│
└── INFORME_JEFE_DE_PROYECTO.md # Documento técnico de justificación arquitectónica
```

---

## 🚀 Funcionalidades Principales

1. **🔐 Autenticación y Autorización Basada en Roles (RBAC):**
   - Registro de hinchas y socios con validaciones exhaustivas en cliente y servidor.
   - Login con tokens **JWT firmados criptográficamente (HMAC-SHA256)** con expiración a 24 horas y almacenamiento seguro.
   - Tres roles jerárquicos: `USER` (hinchas/clientes), `GUARDIA` (operadores de torniquetes/escáner de entradas) y `ADMIN` (directiva del club).
2. **🎫 Sistema de Entradas, Torniquetes y Estadio Seguro:**
   - Emisión de E-Tickets con código QR único generados y persistidos en base de datos.
   - Módulo validador para guardias de torniquete con soporte para **pistolas lectoras láser, escaneo por cámara web y teclado rápido**.
   - Control antifraude estricto: detección de tickets ya utilizados con registro de hora exacta y puerta de ingreso, detección de socios morosos y cómputo de aforo oficial en vivo para el Estadio Chinquihue.
3. **🛒 Tienda Oficial y Checkout Transaccional:**
   - Catálogo de indumentaria, accesorios y entradas.
   - Carrito persistente en base de datos.
   - Proceso de checkout atómico con `@Transactional(rollbackFor = Exception.class)`: genera la entidad `Orden`, deduce stock en tiempo real y emite los registros de `Entrada` en base de datos.
4. **⚽ Plantel de Jugadores 2026:**
   - Visualización de futbolistas con fotos reales oficiales locales, estadísticas y filtros por posición táctica.
   - Fichas individuales dinámicas (`/jugadores/:id`).
5. **📰 Novedades y Clima en Vivo:**
   - Feed de noticias oficiales del club y sala de prensa.
   - Integración directa con la API meteorológica de **Open-Meteo** para conocer las condiciones del tiempo en Chinquihue (-41.4693, -72.9424).
6. **📊 Tabla de Posiciones:**
   - Clasificación oficial de Segunda División Profesional con fila destacada de Deportes Puerto Montt.
7. **⚙️ Panel de Administración (Backoffice):**
   - Gestión integral (CRUD) de jugadores, productos y noticias con modales de confirmación, métricas de recaudación y auditoría de asistencia.

---

## 💻 Requisitos Previos

- **Node.js**: v18.0.0 o superior ([Descargar Node.js](https://nodejs.org/))
- **Java JDK**: 17 o superior ([Descargar Eclipse Temurin o Oracle JDK](https://adoptium.net/))
- **Maven**: 3.8+ (o utilizar Maven integrado en el entorno)

---

## 🛠️ Puesta en Marcha en Local

### 1. Clonar el repositorio y posicionarse en la rama `dpm-pro`
```bash
git clone -b dpm-pro https://github.com/mathymj02/dpm3-main.git
cd dpm3-main
```

### 2. Iniciar el Backend (Spring Boot)
```bash
cd backend
mvn spring-boot:run
```
- **API REST disponible en:** `http://localhost:8080/api`
- **Consola de Base de Datos H2 (Perfil DEV):** `http://localhost:8080/h2-console`
  - *JDBC URL:* `jdbc:h2:mem:dpmdb`
  - *Usuario:* `sa`
  - *Contraseña:* `password`

> **Credenciales del Sistema:**
> - **Administrador:** `admin@dpm.cl` / `admin123`
> - **Guardia Torniquetes:** `guardia@dpm.cl` / `hincha123`
> - **Hincha / Socio:** `hincha@dpm.cl` / `hincha123`

### 3. Iniciar el Frontend (React + TypeScript + Vite)
En una nueva terminal:
```bash
cd frontend
npm install
npm run dev
```
- **Aplicación web disponible en:** `http://localhost:5173`

---

## 🔒 Comparativa de Seguridad y Calidad de Software

| Vector de Riesgo | Versión Legacy (PHP/HTML) | Versión DPM Pro (Spring Boot / React) |
|---|---|---|
| **Inyección SQL** | Vulnerable (concatenación manual de strings en consultas) | **Inmune** (Consultas parametrizadas mediante Spring Data JPA / Hibernate) |
| **Integridad Transaccional** | Inexistente (si fallaba el stock se cobraba igual) | **Garantizada** (Anotación `@Transactional` con rollback automático) |
| **Bypass de Permisos** | Vulnerable por simple manipulación en cliente | **Inmune** (Validado en backend con Spring Security y `@PreAuthorize`) |
| **Falsificación de Tokens** | No utilizaba autenticación moderna | **Tokens JWT firmados con clave simétrica HMAC-SHA256** |
| **Almacenamiento de Claves** | Texto plano o hashing obsoleto | **Cifrado BCrypt** con factor de coste y sal aleatoria |
| **Torniquetes y Aforo** | Sin control de acceso ni trazabilidad | **Control de duplicidad en servidor, socios morosos y conteo en tiempo real** |
| **Entornos y Despliegue** | Archivos dispersos sin separación | **Perfiles desacoplados `dev` (H2) y `prod` (PostgreSQL / Docker)** |

---

## 📄 Documentación para Jefe de Proyecto
Para consultar la justificación completa de arquitectura, diagramas ER de base de datos y matriz de decisiones técnicas, revise el archivo [`INFORME_JEFE_DE_PROYECTO.md`](./INFORME_JEFE_DE_PROYECTO.md).
