/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                "primary": "#2bee6c",
                "background-light": "#f6f8f6",
                "background-dark": "#102216",
                // Superficies derivadas del fondo oscuro (paño de mesa)
                "ink": "#0a170e",
                "surface": "#162c1e",
                "surface-2": "#1d3727",
                "line": "rgb(255 255 255 / 0.08)",
                "match": "#FDBA74",
                "match-head": "#dc2626",
                "gold": "#facc15",
                "danger": "#f87171",
            },
            fontFamily: {
                "display": ["'Plus Jakarta Sans Variable'", "Plus Jakarta Sans", "system-ui", "sans-serif"]
            },
            boxShadow: {
                "glow": "0 8px 24px -6px rgb(43 238 108 / 0.45)",
                "card": "0 1px 0 0 rgb(255 255 255 / 0.04) inset, 0 10px 30px -12px rgb(0 0 0 / 0.6)",
                "sheet": "0 -20px 50px -10px rgb(0 0 0 / 0.7)",
            },
        },
    },
    plugins: [],
}
