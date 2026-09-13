# ⚽ Club Deportes Puerto Montt (DPM Pro) — Plataforma Oficial Fullstack

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.5-brightgreen?logo=springboot)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-17%2B-orange?logo=openjdk)](https://www.oracle.com/java/)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT%20%2B%20Spring%20Security-red)](https://jwt.io/)

Plataforma web institucional y tienda virtual para el **Club Deportivo Deportes Puerto Montt**, migrada desde una arquitectura legacy en PHP a una solución enterprise desacoplada con **Spring Boot (API REST)** y **React + TypeScript (SPA)**.

---

## 🏛️ Arquitectura del Sistema

```
dpm-pro/
├── backend/                  # API RESTful con Spring Boot 3.3 (Java 17)
│   ├── src/main/java/com/dpm/
│   │   ├── config/           # Seguridad (Spring Security 6, JWT, CORS)
│   │   ├── controller/       # Endpoints REST (Auth, Jugadores, Tienda, Carrito, etc.)
│   │   ├── dto/              # Contratos de transferencia tipados
│   │   ├── model/            # Entidades JPA (Usuario, Jugador, Producto, etc.)
│   │   ├── repository/       # Interfaces Spring Data JPA (sin SQL manual)
│   │   ├── security/         # Filtros JWT y UserDetailsService
│   │   └── service/          # Capa de lógica de negocio transaccional
│   └── src/main/resources/   # application.yml (H2/Postgres) + data.sql (Seed data)
│
├── frontend/                 # Single Page Application con React 18 + Vite
│   ├── src/
│   │   ├── api/              # Cliente Axios con interceptor automático de JWT
│   │   ├── components/       # Componentes UI (Navbar responsivo, Cards, Toasts, etc.)
│   │   ├── context/          # AuthContext (Estado global de autenticación)
│   │   ├── guards/           # Rutas protegidas (PrivateRoute, AdminRoute)
│   │   ├── pages/            # 12 Vistas (Home, Plantel, Tienda, Carrito, Admin, etc.)
│   │   └── types/            # Definiciones de tipos TypeScript estrictos
│   └── tailwind.config.ts    # Paleta oficial DPM (Verde, Azul y Amarillo institucional)
│
└── INFORME_JEFE_DE_PROYECTO.md # Documento técnico de justificación arquitectónica
```

---

## 🚀 Funcionalidades Principales

1. **🔐 Autenticación Segura (JWT + BCrypt):**
   - Registro de usuarios con validaciones de campos en cliente y servidor.
   - Login con tokens JWT cifrados (duración 24h) y control de roles (`USER` y `ADMIN`).
2. **⚽ Plantel de Jugadores:**
   - Visualización de futbolistas con fotos, estadísticas y filtros por posición (Portero, Defensa, Volante, Delantero).
   - Fichas individuales dinámicas (`/jugadores/:id`).
3. **🛒 Tienda Oficial y Carrito:**
   - Catálogo de camisetas, indumentaria, accesorios y entradas para el Estadio Chinquihue.
   - Carrito persistente en base de datos; los precios totales se calculan en el servidor para evitar manipulaciones indebidas.
4. **📰 Novedades y Widget Meteorológico:**
   - Feed de noticias oficiales del club.
   - Integración directa con la API de **Open-Meteo** para conocer en vivo el clima en Puerto Montt (-41.4693, -72.9424).
5. **📊 Tabla de Posiciones 2025:**
   - Clasificación de Segunda División Profesional con Deportes Puerto Montt destacado.
6. **⚙️ Panel de Administración (Backoffice):**
   - Gestión integral (CRUD) de jugadores, productos y noticias con modales y confirmaciones.

---

## 💻 Requisitos Previos

- **Node.js**: v18.0.0 o superior ([Descargar Node.js](https://nodejs.org/))
- **Java JDK**: 17 o superior ([Descargar Eclipse Temurin o Oracle JDK](https://adoptium.net/))
- **Maven**: 3.8+ (o utilizar el wrapper en IDE como IntelliJ / VS Code)

---

## 🛠️ Puesta en Marcha en Local

### 1. Clonar el repositorio y cambiar a la rama `dpm-pro`
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
- **Consola de Base de Datos H2:** `http://localhost:8080/h2-console`
  - *JDBC URL:* `jdbc:h2:mem:dpmdb`
  - *Usuario:* `sa`
  - *Contraseña:* `password`

> **Credenciales Administrador iniciales:**
> - Email: `admin@dpm.cl`
> - Contraseña: `admin123`

### 3. Iniciar el Frontend (React + Vite)
En una nueva terminal:
```bash
cd frontend
npm install
npm run dev
```
- **Aplicación web disponible en:** `http://localhost:5173`

---

## 🔒 Mejoras de Seguridad Frente a la Versión Anterior

| Vector de Riesgo | Versión Legacy (PHP/MySQL) | Versión DPM Pro (Spring/React) |
|---|---|---|
| **Inyección SQL** | Vulnerable (concatenación directa en queries) | **Inmune** (ORM Spring Data JPA parametrizado) |
| **Bypass de Admin** | Vulnerable por simple edición en `localStorage` | **Inmune** (Validado en servidor con `@PreAuthorize`) |
| **Contraseñas** | Encriptación básica o texto plano | **Cifrado BCrypt** con sal aleatoria |
| **Precios alterables** | Carrito calculado en el navegador | **Cálculo y congelamiento de precios en Backend** |
| **Mantenibilidad** | Código y CSS copiado en 14 páginas HTML | **Arquitectura modular** por componentes en React |

---

## 📄 Documentación para Jefe de Proyecto
Para consultar la justificación completa de arquitectura, diagramas ER de base de datos y matriz de decisiones técnicas, revise el archivo [`INFORME_JEFE_DE_PROYECTO.md`](./INFORME_JEFE_DE_PROYECTO.md).
