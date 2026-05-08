# 📺 TV Shows Explorer

[![JS](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/es/docs/Web/JavaScript)
[![Axios](https://img.shields.io/badge/API-Axios-blueviolet.svg)](https://axios-http.com/)
[![CSS](https://img.shields.io/badge/Styles-SASS/CSS-pink.svg)](https://sass-lang.com/)
[![HTML](https://img.shields.io/badge/Structure-HTML5-orange.svg)](https://developer.mozilla.org/es/docs/Web/HTML)

**TV Shows Explorer** es una aplicación web moderna y dinámica que permite a los usuarios descubrir y explorar una vasta biblioteca de series de televisión. Utilizando la API de TVMaze, el proyecto ofrece información en tiempo real sobre programas populares, horarios de transmisión y detalles técnicos de cada producción.


https://tvshowapicr.netlify.app
---

## 🚀 Características Principales

- **Búsqueda en Tiempo Real**: Encuentra cualquier serie de televisión instantáneamente.
- **Programación Diaria**: Consulta qué se está emitiendo hoy (específicamente en la red de EE. UU.).
- **Detalles Expandidos**: Acceso a resúmenes, géneros, ratings, estado de la serie y enlaces oficiales mediante un modal interactivo.
- **Diseño Responsive**: Interfaz optimizada para dispositivos móviles, tablets y escritorio.
- **Experiencia de Usuario Fluida**: Implementación de loaders (spinners) y manejo de errores para una navegación sin interrupciones.

---

## 🛠️ Stack Tecnológico

- **Estructura**: HTML5 Semántico.
- **Estilos**: SASS (Compilado a CSS nativo) con arquitectura modular.
- **Lógica**: Vanilla JavaScript (ES6+).
- **Consumo de API**: Axios para peticiones asíncronas.
- **Fuente de Datos**: [TVMaze API](https://www.tvmaze.com/api).

---

## 🧠 Desafíos Resueltos

A lo largo del desarrollo, se implementaron soluciones técnicas para optimizar la funcionalidad y la experiencia:

### 1. Gestión de Asincronismo y API
**Problema**: Manejar múltiples flujos de datos (búsqueda, inicio, detalles y programación) sin bloquear el hilo principal.
**Solución**: Se utilizó un patrón `async/await` robusto con `axios`. Se implementó un manejo de errores centralizado (`renderError`) y un estado de carga (`showLoader`/`hideLoader`) para mantener al usuario informado durante las peticiones.

### 2. Componentización Dinámica del DOM
**Problema**: Renderizar cientos de elementos de forma eficiente y mantenible.
**Solución**: Creación de funciones de renderizado reutilizables como `renderShowCard`. Esta función abstrae la lógica de creación de elementos, permitiendo inyectar información dinámicamente tanto en la vista de búsqueda como en la de programación.

### 3. Sanitización de Datos y Fallbacks
**Problema**: La API a veces devuelve campos nulos (imágenes inexistentes o ratings sin calificar).
**Solución**: Implementación de lógica de verificación que asigna placeholders (imágenes por defecto) y strings alternativos ("N/A") para asegurar que la interfaz nunca se rompa visualmente.

### 4. Navegación tipo SPA (Single Page Application)
**Problema**: Cambiar entre secciones (Inicio vs. Programación) sin recargar la página.
**Solución**: Uso de un sistema de navegación basado en eventos que manipula el estado `currentView` y limpia el contenedor principal antes de renderizar la nueva sección, proporcionando una transición suave.

---

## 👨‍💻 Autor

**César Neftalí Rodríguez Sifuentes**
- Portfolio: [cesdev.netlify.app](https://cesdev.netlify.app)
- GitHub: [@CesRod404](https://github.com/CesRod404)

---

> [!TIP]
> Este proyecto fue desarrollado como parte del programa de **EBAC Desarrollo Web**, enfocándose en las mejores prácticas de manipulación del DOM y consumo de APIs REST.
