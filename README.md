# Generala & 10.000 Scorekeeper

Una aplicación web progresiva (PWA) moderna para llevar el puntaje de los juegos de dados "La Generala" y "El 10.000". Diseñada para ser simple, rápida y funcionar sin conexión.

## Características

- **Generala**: Anotador completo para hasta 20 jugadores. Incluye lógica para tachar categorías y bonos por jugada servida.
- **10.000**: Modo carrera para sumar puntos hasta llegar a la meta.
- **Truco**: Anotador de puntos para Truco (a 15 o 30 buenas/malas).
- **Offline First**: Funciona sin conexión a internet una vez instalada.
- **Instalable**: Se puede instalar como una app nativa en dispositivos móviles y de escritorio.
- **Diseño Móvil**: Optimizada para teléfonos con prevención de gestos accidentales (pull-to-refresh).
- **Modo Oscuro**: Soporte automático según la preferencia del sistema.

## Tecnologías

- **React**: Biblioteca de UI.
- **Vite**: Build tool rápida.
- **Tailwind CSS**: Estilizado utility-first.
- **Vite PWA Plugin**: Manejo de Service Workers y manifiesto.

## Cómo ejecutar localmente

1.  Clonar el repositorio.
2.  Instalar dependencias:
    ```bash
    npm install
    ```
3.  Correr el servidor de desarrollo:
    ```bash
    npm run dev
    ```
4.  Abrir `http://localhost:5173` en tu navegador.

## Instalación

### Android / Chrome (Escritorio)
Si el navegador es compatible, verás un botón **"Instalar para usar Offline"** en la pantalla de inicio. Haz clic para agregar la app a tu dispositivo.

### iOS (iPhone/iPad)
Safari no permite que la app muestre su propio botón de instalación. Para instalar:
1.  Toca el botón **Compartir** (cuadrado con flecha hacia arriba) en la barra del navegador.
2.  Busca y selecciona la opción **"Agregar a inicio"** (Add to Home Screen).
