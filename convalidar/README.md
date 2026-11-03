# Convalidar · UNAB (malla curricular)

Código fuente de https://jorgesabattin.github.io/Convalidar/malla.html.
Proviene del repositorio público [jorgesabattin/Convalidar](https://github.com/jorgesabattin/convalidar)
(commit `d90a4ec`, 5 jul 2026), que es el origen publicado en GitHub Pages.

## Stack
- HTML + CSS + JavaScript vanilla, sin framework ni bundler ni `package.json`.
- Cada página es un archivo **autocontenido**: el CSS va en un `<style>` y el JS en `<script>` dentro del mismo HTML.
- Única librería externa: **pdf.js** (Mozilla), incrustada y minificada dentro de `convalidacion.html` para leer certificados en PDF.
- **Sin backend.** No se hacen peticiones de red al cargar ni al interactuar.

## Flujo (3 páginas)
1. `index.html`: acceso del postulante. Guarda sus datos en `sessionStorage["postulante"]`.
2. `convalidacion.html`: sube el certificado de notas (PDF), lo lee con pdf.js y lo compara con `BASE_UNAB`.
   Guarda el resultado en `sessionStorage["convalidacion_resultado"]` (`{carrera, convalidadas[], revision[]}`).
3. `malla.html`: dibuja la malla de la carrera y destaca los ramos convalidados o en revisión.
   Si no hay datos en `sessionStorage`, muestra la primera carrera sin destacados.

## Datos (embebidos en el código)
- `malla.html` → `const MALLAS` (7 carreras; cada ramo tiene `codigo`, `nombre`, `semestre`, `creditos`, `area`, `contenidos`, `aprendizajes`…)
  y `const REQUISITOS` (prerrequisitos por carrera: `{codigo: [codigos previos]}`).
- `convalidacion.html` → `const BASE_UNAB` (catálogo de asignaturas para comparar).
- `convalidacion.html` tiene `URL_BACKEND_VERIFICACION = ''`: es un gancho opcional para verificar la firma del certificado en un servidor.
  Está vacío, así que no se usa.

## Qué cambia respecto del original
- `index.html`: idéntico.
- `malla.html` y `convalidacion.html`: solo se dio formato (JSON indentado) a los objetos de datos `MALLAS`, `REQUISITOS` y `BASE_UNAB`,
  que venían en una sola línea de hasta 1 MB. La lógica y el CSS no se tocaron (ya eran legibles).
  pdf.js se dejó minificado porque es una librería de terceros.
- `original/`: copia byte a byte del repo de origen, como referencia.

Verificado con Chromium: mismos datos, mismo DOM renderizado, sin errores de consola y sin peticiones externas en las 3 páginas.

## Ejecutar
Abre `index.html` en el navegador, o sírvelo localmente:

    python3 -m http.server 8000   # luego http://localhost:8000/index.html
