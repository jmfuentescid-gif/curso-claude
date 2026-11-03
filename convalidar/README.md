# Convalidar · UNAB (malla curricular)

Código fuente de https://jorgesabattin.github.io/Convalidar/malla.html.
Proviene del repositorio público [jorgesabattin/Convalidar](https://github.com/jorgesabattin/convalidar)
(commit `d90a4ec`, 5 jul 2026), que es el origen publicado en GitHub Pages.

## Stack
- HTML + CSS + JavaScript vanilla, sin framework ni bundler ni `package.json`.
- Cada página es un archivo **autocontenido**: el CSS va en un `<style>` y el JS en `<script>` dentro del mismo HTML.
- Única librería externa: **pdf.js** (Mozilla), incrustada y minificada dentro de `convalidacion.html` para leer certificados en PDF.
- **Sin backend.** No se hacen peticiones de red al cargar ni al interactuar. Todo funciona sin internet.

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

## Acceso con usuario y contraseña (nuevo)
- `login.html` es la puerta de entrada: `index.html`, `convalidacion.html` y `malla.html` redirigen ahí si no hay sesión.
- Los usuarios están en `assets/usuarios.js`, con sal + hash SHA-256 (sin contraseñas en texto plano).
  Para crear o cambiar uno, abre `herramientas/generar-usuario.html` y pega el bloque que genera.
- **Usuario inicial: `admin` / `Unab2026!`. Cámbialo antes de publicar.**
- La sesión dura 8 h o hasta cerrar la pestaña. Tras 5 intentos fallidos hay que esperar 30 s.
  "Cerrar sesión" también borra los datos del postulante y del resultado.
- ⚠️ El sitio no tiene servidor, así que la verificación ocurre en el navegador. Disuade el acceso casual,
  pero quien lea el código puede saltársela. Para proteger de verdad datos personales, hay que poner el control en el hosting:
  por ejemplo, la protección por contraseña de Netlify o Cloudflare Access delante del sitio, o un backend con login.
  En un repo público de GitHub Pages los hashes quedan a la vista, así que conviene usar contraseñas largas.

## Propuesta: imprimir, PDF y Excel (nuevo)
Al final de `convalidacion.html` (junto a "Ver mi malla") y en la cabecera de `malla.html` hay tres botones:
- **Imprimir**: abre el diálogo de impresión con una versión A4 de la propuesta (también sirve para "Guardar como PDF").
- **Descargar PDF**: genera `Propuesta_convalidacion_<apellidos>_<fecha>.pdf` con jsPDF.
- **Formulario Excel**: genera `Formulario_convalidacion_<apellidos>_<fecha>.xlsx` con ExcelJS. Tiene dos hojas:
  - *Formulario*: datos del postulante, antecedentes, detalle por asignatura (nota, % de coincidencia, % de aprendizajes
    esperados, sugerencia, decisión), columnas en blanco para "Resolución Dirección" y "Observaciones" con listas desplegables,
    totales con fórmulas que se recalculan si se cambia una decisión, y espacio para firmas.
  - *Plan de estudios*: todos los ramos de la carrera con su estado.

Para esto, `convalidacion.html` ahora guarda en `sessionStorage["convalidacion_resultado"]` también `detalle`
(una fila por asignatura de origen, con su decisión Aceptada / Rechazada / Sin candidato) y `certificado`.

Archivos nuevos:

    login.html                       pantalla de acceso
    assets/auth.js                   sesión, guardia de páginas, SHA-256
    assets/usuarios.js               lista de usuarios autorizados
    assets/propuesta.js / .css       modelo de la propuesta, impresión, PDF y Excel
    herramientas/generar-usuario.html
    vendor/                          jsPDF 4.2.1, jspdf-autotable 5.0.9, ExcelJS 4.4.0 (MIT, se cargan al pulsar el botón)

## Ejecutar
Abre `login.html` (o `index.html`, que redirige) en el navegador, o sírvelo localmente:

    python3 -m http.server 8000   # luego http://localhost:8000/index.html
