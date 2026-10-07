# Anotador: Generala, Truco, 10.000 y Carioca

Una aplicación web progresiva (PWA) moderna para llevar el puntaje de "La Generala", "El 10.000", el Truco y el Carioca. Diseñada para ser simple, rápida y funcionar sin conexión.

## Características

- **Generala**: Planilla compacta pensada para el celular (iniciales, dados como íconos, nombres y totales siempre visibles). Selector de puntaje con armada/servida, tachar, borrar y deshacer. Anuncia al ganador.
- **10.000**: Jugadores editables, botones rápidos de puntos (+50 a +1.000), plantarse/perdió con deshacer y ranking final.
- **Truco**: Fósforos animados, malas y buenas a la vista, sumar tocando la columna del equipo, botones +2/+3/+4 y deshacer (a 15 o 30).
- **Carioca**: Las 7 manos con su contrato, quién reparte y cuántas cartas van. Orden de repartida que se puede acomodar en cualquier momento, teclado propio para anotar cada mano, corrección de manos anotadas y gana el que suma menos.
- **Partidas guardadas**: Cada juego se guarda en el dispositivo; desde el inicio se puede continuar la partida en curso.
- **Pantalla siempre activa** durante la partida, vibración (Android) y sonidos opcionales.
- **Offline First**: Fuente, íconos e ilustraciones van incluidos en la app; funciona sin conexión una vez instalada.
- **Instalable**: Atajos al mantener presionado el ícono y guía de instalación para iPhone.
- **Diseño Móvil**: Tema oscuro "paño de mesa", hojas inferiores, transiciones y áreas seguras del notch.

## Tecnologías

- **React**: Biblioteca de UI.
- **Vite**: Build tool rápida.
- **Tailwind CSS**: Estilizado utility-first.
- **Vite PWA Plugin**: Manejo de Service Workers y manifiesto.
- **Motion**: Animaciones, transiciones y gestos.
- **Lucide**: Íconos SVG.

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
Si el navegador es compatible, verás la tarjeta **"Instalá la app"** en la pantalla de inicio. Haz clic para agregar la app a tu dispositivo.

### iOS (iPhone/iPad)
Safari no permite que la app muestre su propio botón de instalación; la tarjeta **"Instalá la app"** abre una guía paso a paso. Para instalar:
1.  Toca el botón **Compartir** (cuadrado con flecha hacia arriba) en la barra del navegador.
2.  Busca y selecciona la opción **"Agregar a inicio"** (Add to Home Screen).
