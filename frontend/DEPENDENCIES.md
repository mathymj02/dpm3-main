# DEPENDENCIES.md

## Dependencias de Producción (`dependencies`)

- **`axios`**: Cliente HTTP basado en promesas para el navegador y node.js. Se utiliza en lugar de `fetch` porque proporciona características útiles por defecto como interceptores (ideales para adjuntar tokens JWT), transformación automática de JSON y mejor manejo de errores (como los de código 401).
- **`framer-motion`**: Biblioteca de animaciones para React. Permite crear animaciones fluidas, complejas y de desplazamiento (scroll) con una API declarativa. Fue elegida para mejorar significativamente la experiencia del usuario (UX) mediante interacciones visuales atractivas.
- **`react` y `react-dom`**: La biblioteca base de interfaz de usuario. React facilita el desarrollo basado en componentes, y `react-dom` se encarga de renderizar esos componentes en el navegador.
- **`react-hook-form`**: Biblioteca para manejar formularios en React. Se seleccionó por su alto rendimiento (minimiza los re-renderizados), validación sencilla de inputs, y porque reduce el código repetitivo al crear formularios de registro y login.
- **`react-icons`**: Proporciona iconos vectoriales de múltiples bibliotecas (como FontAwesome, Material Design, etc.) como componentes de React. Facilita la adición de iconos sin dependencias externas pesadas.
- **`react-router-dom`**: Biblioteca estándar para enrutamiento en aplicaciones React. Permite la navegación entre páginas (Home, Login, Perfil) sin recargar la página (SPA), además de soportar rutas protegidas.
- **`react-toastify`**: Utilizada para mostrar notificaciones flotantes (toasts). Se prefirió sobre `alert()` porque mejora la UX, no bloquea la interfaz y permite personalizaciones de diseño y duración de las alertas.
- **`zustand`**: Solución pequeña, rápida y escalable para la gestión de estado global. Se incluyó en el `package.json`, aunque para la autenticación se esté utilizando Context API según la estructura del proyecto.

## Dependencias de Desarrollo (`devDependencies`)

- **`@types/node`, `@types/react`, `@types/react-dom`**: Proporcionan definiciones de tipos de TypeScript para Node.js y React, esenciales para tener un tipado estricto, autocompletado en el editor de código y detección de errores en tiempo de compilación.
- **`@vitejs/plugin-react`**: Plugin que proporciona soporte de Fast Refresh para React dentro del entorno Vite.
- **`autoprefixer`**: Plugin de PostCSS que añade automáticamente prefijos de proveedores (vendor prefixes) a las reglas CSS (como `-webkit-`, `-moz-`) asegurando compatibilidad cruzada entre navegadores.
- **`postcss`**: Herramienta para transformar el CSS con plugins de JavaScript. Es el motor detrás de Tailwind CSS y Autoprefixer.
- **`tailwindcss`**: Framework CSS de utilidad (utility-first). Se prefirió sobre CSS tradicional porque permite crear diseños personalizados rápidamente directamente en el JSX, promoviendo una arquitectura predecible y eliminando el código CSS no utilizado en producción.
- **`typescript`**: Añade tipado estático opcional a JavaScript. Fue elegido para aumentar la mantenibilidad del código, documentar estructuras de datos mediante interfaces y prevenir errores comunes durante el desarrollo.
- **`vite`**: Herramienta de construcción (bundler) de próxima generación. Se prefiere sobre Webpack o Create React App (CRA) porque ofrece un servidor de desarrollo extremadamente rápido gracias al uso de módulos ES nativos (ESM), compilación ultrarrápida y recarga en caliente instantánea (HMR).
