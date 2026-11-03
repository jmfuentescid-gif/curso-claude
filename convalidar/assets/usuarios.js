/* =========================================================================
   USUARIOS AUTORIZADOS — Convalidación UNAB
   ------------------------------------------------------------------------
   Para agregar o cambiar un usuario, abre  herramientas/generar-usuario.html
   en el navegador, escribe usuario y contraseña, y pega aquí la línea que
   genera. No escribas contraseñas en texto plano en este archivo.

   Campos:
     usuario  nombre de acceso (no distingue mayúsculas)
     nombre   nombre visible en la barra de sesión y en la propuesta
     rol      cargo visible (opcional)
     salt     sal aleatoria del usuario
     hash     SHA-256 de  salt|usuario|contraseña
     activo   false para deshabilitar sin borrar (opcional)

   Usuario inicial:  admin / Unab2026!   ← CÁMBIALO antes de publicar.
   ========================================================================= */
window.USUARIOS_CONVALIDAR = {
  usuarios: [
    {
      usuario: 'admin',
      nombre: 'Administrador',
      rol: 'Dirección de Carrera',
      salt: '83dda3feabc35f431bf5da68788d1895',
      hash: 'af0bcb6b3c78df51ac1c16a311882f72508a3ce0e8e1d9cc4b070375bf4d8fe8'
    }
  ]
};
