# Plan de Implementación PWA Anotador

Este plan describe los pasos para crear una Progressive Web App (PWA) de anotador para Generala y 10.000, utilizando React, Vite y Tailwind CSS.

## 1. Inicialización del Proyecto

- [ ] Crear proyecto Vite con template React.
- [ ] Instalar Tailwind CSS y configurar `tailwind.config.js`.
- [ ] Instalar dependencias adicionales: `react-router-dom`, `vite-plugin-pwa`, `clsx`, `tailwind-merge` (para utilidades de estilos).

## 2. Configuración PWA

- [ ] Configurar `vite.config.js` con `VitePWA`.
- [ ] Definir `manifest.webmanifest` (Nombre, iconos, colores).
- [ ] Configurar Service Worker para soporte offline (precache de assets).
- [ ] Agregar prompt de recarga si hay nueva versión (opcional pero recomendado por docs).

## 3. Estructura de la Aplicación y Ruteo

- [ ] Configurar React Router.
- [ ] Rutas:
    - `/`: Selección de juego (Referencia: `docs/stitch_game_selection/game_selection`).
    - `/generala`: Anotador de Generala.
    - `/10000`: Anotador de 10.000.
    - `/rules`: Visualización de reglas (Referencia: `docs/rules.md`).

## 4. Desarrollo de Componentes (Diseño Mobile First)

Guiarse por los assets en `docs/stitch_game_selection`.

### Componentes Comunes
- `Layout`: Estructura base con soporte para PWA (espacio para install prompt si aplica).
- `Button`: Estilizado con Tailwind.
- `Modal`: Para confirmaciones o mensajes (ej: ganaste).
- `NumberInput` / `ScoreCell`: Celdas para anotar puntajes.

### Vistas
- **Game Selection**: Botones grandes para elegir juego.
- **Generala Scorecard**:
    - Tabla con jugadores (columnas) y categorías (filas: 1-6, Escalera, Full, Poker, Generala, Doble G).
    - Lógica de suma automática a Subtotal y Total.
    - Input de nombres de jugadores.
    - Botón de reinicio.
- **10.000 Scorecard**:
    - Lista de jugadores y sus puntajes acumulados.
    - Input para sumar puntaje de la ronda.
    - Lógica de "Plantarse" o perder puntos.
    - Indicador de victoria (>10,000).

## 5. Lógica de Juego (Reglas)

- **Generala**:
    - 11 Rondas.
    - Cálculos de puntajes (suma de dados, valores fijos para jugadas mayores).
    - Bonificación por "Servida" (+5 excepto Generala).
    - Generala Servida gana automáticamente.
- **10.000**:
    - Suma acumulativa.
    - Validación de puntajes (si es necesario, o input libre confiando en el usuario).
    - Gana quien llega a 10.000 exactos o más.

## 6. Verificación

- [ ] Build de producción.
- [ ] Lighthouse audit (PWA check).
- [ ] Test manual de scoring con ejemplos del reglamento.
- [ ] Test de instalación PWA en dispositivo móvil o simulador.
