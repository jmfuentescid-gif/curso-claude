/* =========================================================================
   AUTENTICACIÓN — Convalidación UNAB
   ------------------------------------------------------------------------
   Control de acceso 100% en el navegador (el sitio no tiene backend).
   - Las contraseñas NO se guardan en texto plano: cada usuario tiene una
     sal y el hash SHA-256 de  sal|usuario|contraseña  (ver usuarios.js).
   - La sesión vive en sessionStorage: se pierde al cerrar la pestaña y
     caduca tras SESION_HORAS.
   IMPORTANTE: al ser solo cliente, alguien con conocimientos técnicos
   puede saltarse este control leyendo el código. Para datos sensibles hay
   que proteger el sitio en el servidor (ver README).
   ========================================================================= */
(function(){
  'use strict';

  var CLAVE_SESION = 'auth_sesion';
  var SESION_HORAS = 8;
  var PAGINA_LOGIN = 'login.html';
  /* Datos que se borran al cerrar sesión (para equipos compartidos). */
  var CLAVES_FLUJO = ['postulante', 'convalidacion_resultado'];

  /* ---- SHA-256 (implementación JS; funciona también abriendo file://) --- */
  function sha256Hex(texto){
    var bytes = utf8(texto);
    var K = [
      0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
      0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
      0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
      0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
      0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
      0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
      0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
      0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
    var H = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
    var l = bytes.length, bitLen = l * 8;
    var conRelleno = new Uint8Array(((l + 9 + 63) >> 6) << 6);
    conRelleno.set(bytes); conRelleno[l] = 0x80;
    var dv = new DataView(conRelleno.buffer);
    dv.setUint32(conRelleno.length - 8, Math.floor(bitLen / 0x100000000));
    dv.setUint32(conRelleno.length - 4, bitLen >>> 0);
    var W = new Array(64);
    function rotr(x, n){ return (x >>> n) | (x << (32 - n)); }
    for (var off = 0; off < conRelleno.length; off += 64){
      for (var i = 0; i < 16; i++) W[i] = dv.getUint32(off + i * 4);
      for (i = 16; i < 64; i++){
        var s0 = rotr(W[i-15],7) ^ rotr(W[i-15],18) ^ (W[i-15] >>> 3);
        var s1 = rotr(W[i-2],17) ^ rotr(W[i-2],19) ^ (W[i-2] >>> 10);
        W[i] = (W[i-16] + s0 + W[i-7] + s1) | 0;
      }
      var a=H[0], b=H[1], c=H[2], d=H[3], e=H[4], f=H[5], g=H[6], h=H[7];
      for (i = 0; i < 64; i++){
        var S1 = rotr(e,6) ^ rotr(e,11) ^ rotr(e,25);
        var ch = (e & f) ^ (~e & g);
        var t1 = (h + S1 + ch + K[i] + W[i]) | 0;
        var S0 = rotr(a,2) ^ rotr(a,13) ^ rotr(a,22);
        var maj = (a & b) ^ (a & c) ^ (b & c);
        var t2 = (S0 + maj) | 0;
        h=g; g=f; f=e; e=(d + t1) | 0; d=c; c=b; b=a; a=(t1 + t2) | 0;
      }
      H[0]=(H[0]+a)|0; H[1]=(H[1]+b)|0; H[2]=(H[2]+c)|0; H[3]=(H[3]+d)|0;
      H[4]=(H[4]+e)|0; H[5]=(H[5]+f)|0; H[6]=(H[6]+g)|0; H[7]=(H[7]+h)|0;
    }
    return H.map(function(x){ return ('00000000' + (x >>> 0).toString(16)).slice(-8); }).join('');
  }
  function utf8(s){
    if (typeof TextEncoder !== 'undefined') return new TextEncoder().encode(String(s));
    var esc = unescape(encodeURIComponent(String(s))), out = new Uint8Array(esc.length);
    for (var i = 0; i < esc.length; i++) out[i] = esc.charCodeAt(i);
    return out;
  }

  /* ---- Usuarios y verificación ----------------------------------------- */
  function normUsuario(u){ return String(u || '').trim().toLowerCase(); }
  function hashCredencial(salt, usuario, clave){
    return sha256Hex(String(salt) + '|' + normUsuario(usuario) + '|' + String(clave));
  }
  function listaUsuarios(){
    var cfg = window.USUARIOS_CONVALIDAR;
    return (cfg && Array.isArray(cfg.usuarios)) ? cfg.usuarios : [];
  }
  /* Devuelve el usuario si las credenciales son válidas; si no, null. */
  function verificar(usuario, clave){
    var u = normUsuario(usuario);
    var reg = listaUsuarios().filter(function(x){ return normUsuario(x.usuario) === u && x.activo !== false; })[0];
    if (!reg || !clave) return null;
    return hashCredencial(reg.salt, u, clave) === String(reg.hash).toLowerCase() ? reg : null;
  }

  /* ---- Sesión ------------------------------------------------------------ */
  function leerSesion(){
    try{
      var s = JSON.parse(sessionStorage.getItem(CLAVE_SESION) || 'null');
      if (!s || !s.usuario || !s.expira || Date.now() > s.expira) return null;
      // el usuario debe seguir existiendo y activo en la configuración
      var vigente = listaUsuarios().some(function(x){ return normUsuario(x.usuario) === s.usuario && x.activo !== false; });
      return vigente ? s : null;
    }catch(e){ return null; }
  }
  function iniciarSesion(reg){
    var s = {
      usuario: normUsuario(reg.usuario),
      nombre: reg.nombre || reg.usuario,
      rol: reg.rol || '',
      inicio: Date.now(),
      expira: Date.now() + SESION_HORAS * 3600 * 1000
    };
    sessionStorage.setItem(CLAVE_SESION, JSON.stringify(s));
    return s;
  }
  function cerrarSesion(){
    try{
      sessionStorage.removeItem(CLAVE_SESION);
      CLAVES_FLUJO.forEach(function(k){ sessionStorage.removeItem(k); });
    }catch(e){}
    window.location.replace(PAGINA_LOGIN);
  }

  /* Solo se permite volver a páginas propias (evita redirecciones abiertas). */
  var PAGINAS_PERMITIDAS = ['index.html', 'convalidacion.html', 'malla.html'];
  function destinoSeguro(next){
    var n = String(next || '').split(/[?#]/)[0].replace(/^.*\//, '');
    return PAGINAS_PERMITIDAS.indexOf(n) >= 0 ? n : 'index.html';
  }
  function paginaActual(){
    var p = window.location.pathname.replace(/^.*\//, '');
    return p || 'index.html';
  }

  /* ---- Guardia de página -------------------------------------------------
     Las páginas protegidas incluyen este archivo en <head> con
     data-proteger. Si no hay sesión, se redirige antes de pintar nada. */
  function proteger(){
    var s = leerSesion();
    if (s) return s;
    document.documentElement.style.display = 'none';
    window.location.replace(PAGINA_LOGIN + '?next=' + encodeURIComponent(paginaActual()));
    return null;
  }

  /* Barra superior con el usuario y el botón de cierre de sesión. */
  function pintarBarra(s){
    var css = document.createElement('style');
    css.textContent =
      '.auth-bar{display:flex;align-items:center;justify-content:flex-end;gap:12px;padding:6px 18px;' +
      'background:#061c2e;color:#cfe0ec;font:500 12.5px/1.4 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}' +
      '.auth-bar .au-who{display:flex;align-items:center;gap:8px;min-width:0}' +
      '.auth-bar .au-dot{width:7px;height:7px;border-radius:50%;background:#1f9d6b;flex:none}' +
      '.auth-bar .au-nm{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
      '.auth-bar .au-rol{color:#8fb0c6}' +
      '.auth-bar button{appearance:none;border:1px solid rgba(255,255,255,.22);background:transparent;color:#fff;' +
      'font:inherit;font-weight:600;padding:4px 11px;border-radius:8px;cursor:pointer}' +
      '.auth-bar button:hover{background:rgba(255,255,255,.1)}' +
      '@media print{.auth-bar{display:none!important}}';
    document.head.appendChild(css);
    var bar = document.createElement('div');
    bar.className = 'auth-bar';
    bar.setAttribute('role', 'navigation');
    bar.setAttribute('aria-label', 'Sesión');
    var who = document.createElement('span'); who.className = 'au-who';
    var dot = document.createElement('span'); dot.className = 'au-dot';
    var nm = document.createElement('span'); nm.className = 'au-nm';
    nm.textContent = s.nombre;
    if (s.rol){ var rol = document.createElement('span'); rol.className = 'au-rol'; rol.textContent = ' · ' + s.rol; nm.appendChild(rol); }
    who.appendChild(dot); who.appendChild(nm);
    var btn = document.createElement('button'); btn.type = 'button'; btn.textContent = 'Cerrar sesión';
    btn.addEventListener('click', cerrarSesion);
    bar.appendChild(who); bar.appendChild(btn);
    document.body.insertBefore(bar, document.body.firstChild);
  }

  window.Auth = {
    sha256Hex: sha256Hex,
    hashCredencial: hashCredencial,
    verificar: verificar,
    leerSesion: leerSesion,
    iniciarSesion: iniciarSesion,
    cerrarSesion: cerrarSesion,
    destinoSeguro: destinoSeguro
  };

  var este = document.currentScript;
  if (este && este.hasAttribute('data-proteger')){
    var sesion = proteger();
    if (sesion){
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function(){ pintarBarra(sesion); });
      else pintarBarra(sesion);
    }
  }
})();
