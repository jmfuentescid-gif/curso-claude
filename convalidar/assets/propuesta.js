/* =========================================================================
   PROPUESTA DE CONVALIDACIÓN — imprimir, PDF y formulario Excel
   ------------------------------------------------------------------------
   Lee lo que dejan los pasos previos en sessionStorage:
     postulante               (index.html)
     convalidacion_resultado  (convalidacion.html; incluye `detalle`)
     auth_sesion              (login.html, vía Auth)
   y genera la propuesta en tres formatos. Las librerías (jsPDF, ExcelJS)
   están en /vendor y se cargan solo al pulsar el botón correspondiente.

   Uso en una página:
     Propuesta.montarBarra(contenedor, { plan: () => MALLAS, variante: 'oscuro' });
   ========================================================================= */
(function(){
  'use strict';

  var VENDOR = (function(){
    var s = document.currentScript && document.currentScript.src;
    return s ? s.replace(/assets\/propuesta\.js(\?.*)?$/, 'vendor/') : 'vendor/';
  })();

  var COLOR = { brand:[10,42,67], brand2:[22,112,140], accent:[31,157,107], ink:[14,27,41], muted:[90,107,123], line:[224,230,237], soft:[243,246,249] };
  var AVISO = 'Este documento es una propuesta orientativa generada por el sistema de apoyo a la convalidación y no constituye una resolución oficial. La decisión final corresponde a la Dirección de Carrera / Coordinación Académica.';

  /* ---- utilidades -------------------------------------------------------- */
  function leer(k){ try{ return JSON.parse(sessionStorage.getItem(k) || 'null'); }catch(e){ return null; } }
  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  function dos(n){ return (n < 10 ? '0' : '') + n; }
  function fechaLarga(d){
    var m = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
    return d.getDate() + ' de ' + m[d.getMonth()] + ' de ' + d.getFullYear();
  }
  function ymd(d){ return d.getFullYear() + dos(d.getMonth() + 1) + dos(d.getDate()); }
  function slug(s){
    return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9]+/g, '_').replace(/^_|_$/g, '') || 'postulante';
  }
  function nota1(n){ return (typeof n === 'number' && isFinite(n)) ? n.toFixed(1).replace('.', ',') : ''; }
  function pctTxt(n){ return (typeof n === 'number' && isFinite(n)) ? n + '%' : ''; }

  var _scripts = {};
  function cargarScript(nombre){
    if (!_scripts[nombre]){
      _scripts[nombre] = new Promise(function(ok, ko){
        var s = document.createElement('script');
        s.src = VENDOR + nombre;
        s.onload = ok;
        s.onerror = function(){ delete _scripts[nombre]; ko(new Error('No se pudo cargar ' + nombre)); };
        document.head.appendChild(s);
      });
    }
    return _scripts[nombre];
  }
  function descargar(blob, nombre){
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = nombre; a.rel = 'noopener';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function(){ URL.revokeObjectURL(url); }, 4000);
  }
  function aviso(msg){
    var t = document.getElementById('pz-toast');
    if (!t){ t = document.createElement('div'); t.id = 'pz-toast'; t.className = 'pz-toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('on');
    clearTimeout(t._t); t._t = setTimeout(function(){ t.classList.remove('on'); }, 3600);
  }

  /* ---- modelo de la propuesta -------------------------------------------- */
  function modelo(plan){
    var res = leer('convalidacion_resultado');
    if (!res || !res.carrera) return null;
    var post = leer('postulante');
    var ses = (window.Auth && Auth.leerSesion()) || null;
    var asigs = (plan && plan[res.carrera]) || [];
    var porCod = {};
    asigs.forEach(function(a){ porCod[a.codigo] = a; });

    var filas;
    if (Array.isArray(res.detalle) && res.detalle.length){
      filas = res.detalle.map(function(d){
        var a = d.codigo ? porCod[d.codigo] : null;
        return {
          origen: d.origen || '', archivo: d.archivo || '',
          nota: d.nota, notaAsignatura: d.notaAsignatura || '', aprobado: d.aprobado,
          codigo: d.codigo || '', nombre: (a && a.nombre) || d.nombre || '',
          semestre: (a && a.semestre) || d.semestre || '', creditos: (a && a.creditos) || d.creditos || 0,
          coincidencia: d.coincidencia, ae: d.aeCubiertos, aeTexto: d.aeTexto || '',
          sugerencia: d.sugerencia || '', decision: d.decision || ''
        };
      });
    } else {
      // Sin detalle (p. ej. un resultado antiguo): solo se conocen los códigos.
      filas = (res.convalidadas || []).map(function(c){
        var a = porCod[c] || {};
        return { origen:'', archivo:'', nota:null, notaAsignatura:'', aprobado:null,
          codigo:c, nombre:a.nombre || '', semestre:a.semestre || '', creditos:a.creditos || 0,
          coincidencia:null, ae:null, aeTexto:'', sugerencia:'', decision:'Aceptada' };
      });
    }

    // Un mismo ramo UNAB aceptado dos veces cuenta una sola vez.
    var vistos = {}, crConv = 0;
    filas.forEach(function(f){
      if (f.decision !== 'Aceptada' || !f.codigo) return;
      if (vistos[f.codigo]){ f.decision = 'Aceptada (repetida)'; return; }
      vistos[f.codigo] = true; crConv += Number(f.creditos) || 0;
    });
    var crTot = asigs.reduce(function(s, a){ return s + (Number(a.creditos) || 0); }, 0);
    var aceptadas = filas.filter(function(f){ return f.decision.indexOf('Aceptada') === 0; });
    var otras = filas.filter(function(f){ return f.decision.indexOf('Aceptada') !== 0; });

    var fecha = res.generadoEn ? new Date(res.generadoEn) : new Date();
    if (isNaN(fecha)) fecha = new Date();
    var docDig = String((post && post.documento) || '').replace(/[^0-9kK]/g, '');
    var folio = 'PC-' + ymd(fecha) + '-' + (docDig ? docDig.slice(-5).toUpperCase() : dos(fecha.getHours()) + dos(fecha.getMinutes()));
    var cert = res.certificado || {};

    return {
      folio: folio, fecha: fecha, emitido: new Date(),
      carrera: res.carrera,
      postulante: post ? {
        nombre: ((post.nombres || '') + ' ' + (post.apellidos || '')).trim(),
        apellidos: post.apellidos || '',
        docTipo: post.tipoDoc === 'pasaporte' ? 'Pasaporte' : 'RUT',
        documento: post.documento || '', correo: post.correo || '', telefono: post.telefono || ''
      } : null,
      evaluador: ses ? (ses.nombre + (ses.rol ? ' · ' + ses.rol : '')) : '',
      certificado: {
        archivo: cert.archivo || '', institucion: cert.institucion || '',
        verificacion: cert.verificacion || '', notas: cert.notasDetectadas
      },
      filas: filas, aceptadas: aceptadas, otras: otras,
      plan: asigs, convCodigos: vistos,
      resumen: { nConv: aceptadas.filter(function(f){ return f.decision === 'Aceptada'; }).length,
        nEval: filas.length, crConv: crConv, crTot: crTot,
        pct: crTot ? Math.round(crConv / crTot * 100) : 0, nPlan: asigs.length }
    };
  }
  function exigirModelo(plan){
    var m = modelo(plan);
    if (!m) aviso('Primero completa la convalidación: no hay un resultado para generar la propuesta.');
    return m;
  }
  function filasInfo(m){
    var p = m.postulante;
    return {
      postulante: [
        ['Nombre', p ? p.nombre : 'Sin identificar (modo prueba)'],
        [p ? p.docTipo : 'Documento', p ? p.documento : ''],
        ['Correo', p ? p.correo : ''],
        ['Teléfono', p && p.telefono ? p.telefono : '']
      ],
      antecedentes: [
        ['Carrera de destino', m.carrera],
        ['Institución de origen', m.certificado.institucion || 'No detectada'],
        ['Certificado de notas', m.certificado.archivo || 'No adjuntado'],
        ['Verificación del certificado', m.certificado.verificacion || ''],
        ['Elaborado por', m.evaluador || ''],
        ['Fecha de evaluación', fechaLarga(m.fecha)]
      ]
    };
  }
  function motivo(f){
    if (f.decision === 'Rechazada') return 'Rechazada por el evaluador';
    if (f.aprobado === false) return 'No aprobada en origen';
    return f.sugerencia || 'Sin coincidencia suficiente';
  }

  /* ---- 1) Imprimir -------------------------------------------------------- */
  function htmlImpresion(m){
    var info = filasInfo(m);
    function kv(rows){
      return '<dl class="pz-kv">' + rows.map(function(r){ return '<div><dt>' + esc(r[0]) + '</dt><dd>' + (esc(r[1]) || '&nbsp;') + '</dd></div>'; }).join('') + '</dl>';
    }
    var conv = m.aceptadas.length ? '<table class="pz-t"><thead><tr><th>#</th><th>Asignatura de origen</th><th>Nota</th><th>Código</th><th>Asignatura UNAB</th><th>Sem.</th><th>Cr.</th><th>Coinc.</th></tr></thead><tbody>' +
      m.aceptadas.map(function(f, i){
        return '<tr><td>' + (i + 1) + '</td><td>' + esc(f.origen || '-') + '</td><td>' + esc(nota1(f.nota)) + '</td><td class="pz-cod">' + esc(f.codigo) +
          '</td><td>' + esc(f.nombre) + (f.decision !== 'Aceptada' ? ' <em>(ya contada)</em>' : '') + '</td><td>' + esc(f.semestre) + '</td><td>' + esc(f.creditos) + '</td><td>' + esc(pctTxt(f.coincidencia)) + '</td></tr>';
      }).join('') + '</tbody></table>' : '<p class="pz-vacio">No hay asignaturas propuestas para convalidar.</p>';
    var otras = m.otras.length ? '<table class="pz-t"><thead><tr><th>#</th><th>Asignatura de origen</th><th>Nota</th><th>Mejor coincidencia UNAB</th><th>Coinc.</th><th>Motivo</th></tr></thead><tbody>' +
      m.otras.map(function(f, i){
        return '<tr><td>' + (i + 1) + '</td><td>' + esc(f.origen) + '</td><td>' + esc(nota1(f.nota)) + '</td><td>' + esc(f.codigo ? f.codigo + ' · ' + f.nombre : '-') +
          '</td><td>' + esc(pctTxt(f.coincidencia)) + '</td><td>' + esc(motivo(f)) + '</td></tr>';
      }).join('') + '</tbody></table>' : '';
    var r = m.resumen;
    return '' +
      '<header class="pz-h"><div><div class="pz-inst">Universidad Andrés Bello · Facultad de Ingeniería</div><h1>Propuesta de convalidación de asignaturas</h1></div>' +
      '<div class="pz-folio"><div>Folio <b>' + esc(m.folio) + '</b></div><div>Emitido el ' + esc(fechaLarga(m.emitido)) + '</div></div></header>' +
      '<section><h2>1. Datos del postulante</h2>' + kv(info.postulante) + '</section>' +
      '<section><h2>2. Antecedentes</h2>' + kv(info.antecedentes) + '</section>' +
      '<section><h2>3. Asignaturas propuestas para convalidar</h2>' + conv + '</section>' +
      (otras ? '<section><h2>4. Asignaturas evaluadas sin convalidación</h2>' + otras + '</section>' : '') +
      '<section class="pz-res"><h2>' + (otras ? '5' : '4') + '. Resumen</h2><div class="pz-cifras">' +
        '<div><b>' + r.nConv + '</b><span>asignaturas convalidadas</span></div>' +
        '<div><b>' + r.crConv + ' / ' + r.crTot + '</b><span>créditos reconocidos · ' + r.pct + '%</span></div>' +
        '<div><b>' + r.nEval + '</b><span>asignaturas evaluadas</span></div></div>' +
        '<div class="pz-obs"><span>Observaciones</span></div></section>' +
      '<section class="pz-firmas"><div><span></span>Postulante</div><div><span></span>Evaluador/a' + (m.evaluador ? '<small>' + esc(m.evaluador) + '</small>' : '') + '</div><div><span></span>Dirección de Carrera</div></section>' +
      '<p class="pz-aviso">' + esc(AVISO) + '</p>';
  }
  function imprimir(plan){
    var m = exigirModelo(plan); if (!m) return;
    var box = document.getElementById('propuestaPrint');
    if (!box){ box = document.createElement('div'); box.id = 'propuestaPrint'; box.className = 'pz-print'; document.body.appendChild(box); }
    box.innerHTML = htmlImpresion(m);
    var tituloPrevio = document.title;
    document.title = 'Propuesta_convalidacion_' + slug(m.postulante && m.postulante.apellidos) + '_' + ymd(m.emitido);
    document.body.classList.add('pz-imprimiendo');
    var fin = function(){ document.body.classList.remove('pz-imprimiendo'); document.title = tituloPrevio; window.removeEventListener('afterprint', fin); };
    window.addEventListener('afterprint', fin);
    setTimeout(function(){ window.print(); setTimeout(fin, 500); }, 30);
  }

  /* ---- 2) PDF (jsPDF + AutoTable) --------------------------------------- */
  function pdf(plan){
    var m = exigirModelo(plan); if (!m) return Promise.resolve();
    return cargarScript('jspdf.umd.min.js')
      .then(function(){ return cargarScript('jspdf.plugin.autotable.min.js'); })
      .then(function(){
        var jsPDF = window.jspdf.jsPDF;
        var doc = new jsPDF({ unit:'mm', format:'a4' });
        var tabla = function(o){ return (typeof window.autoTable === 'function') ? window.autoTable(doc, o) : doc.autoTable(o); };
        var W = doc.internal.pageSize.getWidth(), H = doc.internal.pageSize.getHeight(), M = 15;
        var info = filasInfo(m);

        doc.setProperties({ title:'Propuesta de convalidación ' + m.folio, subject:m.carrera, creator:'Convalidación UNAB' });

        // Cabecera
        doc.setFillColor.apply(doc, COLOR.brand); doc.rect(0, 0, W, 30, 'F');
        doc.setFillColor.apply(doc, COLOR.brand2); doc.rect(0, 30, W, 1.2, 'F');
        doc.setTextColor(185, 210, 221); doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5);
        doc.text('UNIVERSIDAD ANDRÉS BELLO · FACULTAD DE INGENIERÍA', M, 11);
        doc.setTextColor(255, 255, 255); doc.setFontSize(16);
        doc.text('Propuesta de convalidación de asignaturas', M, 21);
        doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5);
        doc.text('Folio ' + m.folio, W - M, 11, { align:'right' });
        doc.text('Emitido el ' + fechaLarga(m.emitido), W - M, 16, { align:'right' });

        var y = 40;
        function titulo(t){
          if (y > H - 40){ doc.addPage(); y = 20; }
          doc.setFont('helvetica', 'bold'); doc.setFontSize(10.5); doc.setTextColor.apply(doc, COLOR.brand2);
          doc.text(t.toUpperCase(), M, y);
          doc.setDrawColor.apply(doc, COLOR.line); doc.setLineWidth(0.3); doc.line(M, y + 1.8, W - M, y + 1.8);
          y += 4;
        }
        function kv(rows){
          var body = [];
          for (var i = 0; i < rows.length; i += 2){
            var a = rows[i], b = rows[i + 1] || ['', ''];
            body.push([a[0], a[1] || '-', b[0], b[0] ? (b[1] || '-') : '']);
          }
          tabla({ startY:y, body:body, theme:'plain', margin:{ left:M, right:M },
            styles:{ font:'helvetica', fontSize:9, cellPadding:{ top:1.4, bottom:1.4, left:0, right:3 }, textColor:COLOR.ink },
            columnStyles:{ 0:{ cellWidth:38, fontStyle:'bold', textColor:COLOR.muted, fontSize:8 }, 1:{ cellWidth:52 },
                           2:{ cellWidth:38, fontStyle:'bold', textColor:COLOR.muted, fontSize:8 }, 3:{ cellWidth:'auto' } } });
          y = doc.lastAutoTable.finalY + 7;
        }
        var cab = { fillColor:COLOR.brand, textColor:255, fontStyle:'bold', fontSize:8.2 };
        var cuerpo = { font:'helvetica', fontSize:8.2, cellPadding:2, textColor:COLOR.ink, lineColor:COLOR.line, lineWidth:0.2, overflow:'linebreak' };

        titulo('1. Datos del postulante'); kv(info.postulante);
        titulo('2. Antecedentes'); kv(info.antecedentes);

        titulo('3. Asignaturas propuestas para convalidar');
        if (m.aceptadas.length){
          tabla({ startY:y, margin:{ left:M, right:M }, headStyles:cab, styles:cuerpo, alternateRowStyles:{ fillColor:COLOR.soft },
            head:[['#', 'Asignatura de origen', 'Nota', 'Código', 'Asignatura UNAB', 'Sem.', 'Cr.', 'Coinc.']],
            body:m.aceptadas.map(function(f, i){
              return [i + 1, f.origen || '-', nota1(f.nota), f.codigo, f.nombre + (f.decision !== 'Aceptada' ? ' (ya contada)' : ''), f.semestre, f.creditos, pctTxt(f.coincidencia)];
            }),
            columnStyles:{ 0:{ cellWidth:8, halign:'center' }, 2:{ cellWidth:12, halign:'center' }, 3:{ cellWidth:20 },
                           5:{ cellWidth:11, halign:'center' }, 6:{ cellWidth:10, halign:'center' }, 7:{ cellWidth:15, halign:'center' } } });
          y = doc.lastAutoTable.finalY + 8;
        } else {
          doc.setFont('helvetica', 'italic'); doc.setFontSize(9); doc.setTextColor.apply(doc, COLOR.muted);
          doc.text('No hay asignaturas propuestas para convalidar.', M, y + 3); y += 11;
        }

        var nSec = 4;
        if (m.otras.length){
          titulo('4. Asignaturas evaluadas sin convalidación'); nSec = 5;
          tabla({ startY:y, margin:{ left:M, right:M }, headStyles:Object.assign({}, cab, { fillColor:COLOR.muted }), styles:cuerpo,
            head:[['#', 'Asignatura de origen', 'Nota', 'Mejor coincidencia UNAB', 'Coinc.', 'Motivo']],
            body:m.otras.map(function(f, i){
              return [i + 1, f.origen, nota1(f.nota), f.codigo ? f.codigo + ' · ' + f.nombre : '-', pctTxt(f.coincidencia), motivo(f)];
            }),
            columnStyles:{ 0:{ cellWidth:8, halign:'center' }, 2:{ cellWidth:12, halign:'center' }, 4:{ cellWidth:15, halign:'center' }, 5:{ cellWidth:38 } } });
          y = doc.lastAutoTable.finalY + 8;
        }

        // Resumen + observaciones + firmas (bloque que no debe partirse)
        if (y > H - 95){ doc.addPage(); y = 20; }
        titulo(nSec + '. Resumen');
        var r = m.resumen, cw = (W - 2 * M - 8) / 3;
        [[String(r.nConv), 'asignaturas convalidadas'], [r.crConv + ' / ' + r.crTot, 'créditos reconocidos · ' + r.pct + '%'], [String(r.nEval), 'asignaturas evaluadas']]
          .forEach(function(c, i){
            var x = M + i * (cw + 4);
            doc.setFillColor.apply(doc, COLOR.soft); doc.setDrawColor.apply(doc, COLOR.line); doc.roundedRect(x, y, cw, 17, 2, 2, 'FD');
            doc.setFont('helvetica', 'bold'); doc.setFontSize(14); doc.setTextColor.apply(doc, COLOR.brand); doc.text(c[0], x + 4, y + 8);
            doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor.apply(doc, COLOR.muted); doc.text(c[1], x + 4, y + 13.5);
          });
        y += 24;
        doc.setDrawColor.apply(doc, COLOR.line); doc.rect(M, y, W - 2 * M, 24);
        doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor.apply(doc, COLOR.muted); doc.text('OBSERVACIONES', M + 3, y + 5);
        y += 44;
        var fw = (W - 2 * M - 16) / 3;
        [['Postulante', ''], ['Evaluador/a', m.evaluador], ['Dirección de Carrera', '']].forEach(function(f, i){
          var x = M + i * (fw + 8);
          doc.setDrawColor.apply(doc, COLOR.ink); doc.setLineWidth(0.3); doc.line(x, y, x + fw, y);
          doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5); doc.setTextColor.apply(doc, COLOR.ink); doc.text(f[0], x + fw / 2, y + 4.5, { align:'center' });
          if (f[1]){ doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor.apply(doc, COLOR.muted); doc.text(doc.splitTextToSize(f[1], fw), x + fw / 2, y + 8.5, { align:'center' }); }
        });

        // Pie en todas las páginas
        var n = doc.getNumberOfPages();
        for (var p = 1; p <= n; p++){
          doc.setPage(p);
          doc.setFont('helvetica', 'normal'); doc.setFontSize(7); doc.setTextColor.apply(doc, COLOR.muted);
          doc.text(doc.splitTextToSize(AVISO, W - 2 * M - 24), M, H - 11);
          doc.text('Página ' + p + ' de ' + n, W - M, H - 11, { align:'right' });
        }
        doc.save('Propuesta_convalidacion_' + slug(m.postulante && m.postulante.apellidos) + '_' + ymd(m.emitido) + '.pdf');
      });
  }

  /* ---- 3) Formulario Excel (ExcelJS) ------------------------------------- */
  function excel(plan){
    var m = exigirModelo(plan); if (!m) return Promise.resolve();
    return cargarScript('exceljs.min.js').then(function(){
      var hex = function(c){ return 'FF' + c.map(function(v){ return ('0' + v.toString(16)).slice(-2); }).join('').toUpperCase(); };
      var BR = hex(COLOR.brand), BR2 = hex(COLOR.brand2), SOFT = hex(COLOR.soft), LINE = hex(COLOR.line), MUT = hex(COLOR.muted);
      var fill = function(c){ return { type:'pattern', pattern:'solid', fgColor:{ argb:c } }; };
      var thin = { style:'thin', color:{ argb:LINE } };
      var borde = { top:thin, left:thin, bottom:thin, right:thin };

      var wb = new ExcelJS.Workbook();
      wb.creator = 'Convalidación UNAB'; wb.created = new Date();
      var ws = wb.addWorksheet('Formulario', {
        pageSetup:{ paperSize:9, orientation:'landscape', fitToPage:true, fitToWidth:1, fitToHeight:0,
          margins:{ left:0.4, right:0.4, top:0.5, bottom:0.5, header:0.2, footer:0.2 } },
        headerFooter:{ oddFooter:'&L&8' + m.folio + '&R&8Página &P de &N' },
        views:[{ showGridLines:false }]
      });
      var COLS = [
        ['N°', 5], ['Asignatura de origen', 30], ['Archivo del programa', 22], ['Nota origen', 9], ['Estado en origen', 12],
        ['Código UNAB', 11], ['Asignatura UNAB', 30], ['Semestre', 9], ['Créditos', 9], ['% coincidencia', 11],
        ['% AE cubiertos', 11], ['Sugerencia del sistema', 18], ['Decisión del evaluador', 16], ['Resolución Dirección', 16], ['Observaciones', 32]
      ];
      ws.columns = COLS.map(function(c){ return { width:c[1] }; });
      var U = 'O'; // última columna
      var fila = 1;
      function banda(texto, opts){
        ws.mergeCells('A' + fila + ':' + U + fila);
        var c = ws.getCell('A' + fila); c.value = texto;
        c.font = Object.assign({ name:'Calibri', size:11, bold:true, color:{ argb:'FFFFFFFF' } }, opts.font || {});
        c.fill = fill(opts.color || BR); c.alignment = { vertical:'middle', horizontal:'left', indent:1 };
        ws.getRow(fila).height = opts.alto || 20; fila++;
      }
      function seccion(texto){
        fila++;
        ws.mergeCells('A' + fila + ':' + U + fila);
        var c = ws.getCell('A' + fila); c.value = texto.toUpperCase();
        c.font = { bold:true, size:10, color:{ argb:BR2 } };
        c.border = { bottom:{ style:'medium', color:{ argb:BR2 } } };
        ws.getRow(fila).height = 18; fila++;
      }
      function pares(rows){
        // dos pares por fila: [A:C etiqueta][D:G valor] [H:J etiqueta][K:O valor]
        for (var i = 0; i < rows.length; i += 2){
          [[rows[i], 'A', 'C', 'D', 'G'], [rows[i + 1], 'H', 'J', 'K', 'O']].forEach(function(p){
            if (!p[0]) return;
            ws.mergeCells(p[1] + fila + ':' + p[2] + fila); ws.mergeCells(p[3] + fila + ':' + p[4] + fila);
            var k = ws.getCell(p[1] + fila), v = ws.getCell(p[3] + fila);
            k.value = p[0][0]; k.font = { bold:true, size:9, color:{ argb:MUT } }; k.fill = fill(SOFT); k.border = borde;
            k.alignment = { vertical:'middle', indent:1 };
            v.value = p[0][1] || ''; v.font = { size:10 }; v.border = borde; v.alignment = { vertical:'middle', indent:1, wrapText:true };
          });
          ws.getRow(fila).height = 18; fila++;
        }
      }

      banda('UNIVERSIDAD ANDRÉS BELLO · FACULTAD DE INGENIERÍA', { font:{ size:9, color:{ argb:'FFB9D2DD' } }, alto:18 });
      banda('FORMULARIO DE SOLICITUD DE CONVALIDACIÓN DE ASIGNATURAS', { font:{ size:15 }, alto:30 });
      banda('Folio ' + m.folio + '   ·   Emitido el ' + fechaLarga(m.emitido), { color:BR2, font:{ size:9, bold:false }, alto:18 });

      var info = filasInfo(m);
      seccion('1. Datos del postulante'); pares(info.postulante);
      seccion('2. Antecedentes académicos');
      pares(info.antecedentes.concat(m.certificado.notas != null ? [['Notas detectadas en certificado', String(m.certificado.notas)]] : []));

      seccion('3. Detalle de asignaturas evaluadas');
      var hRow = ws.getRow(fila);
      COLS.forEach(function(c, i){
        var cell = hRow.getCell(i + 1); cell.value = c[0];
        cell.font = { bold:true, size:9, color:{ argb:'FFFFFFFF' } }; cell.fill = fill(BR);
        cell.alignment = { vertical:'middle', horizontal:'center', wrapText:true }; cell.border = borde;
      });
      hRow.height = 30;
      var filaCab = fila; fila++;
      var ini = fila;
      var filasT = m.filas.length ? m.filas : [{}];
      filasT.forEach(function(f, i){
        var r = ws.getRow(fila);
        var estOrigen = f.aprobado === true ? 'Aprobada' : (f.aprobado === false ? 'Reprobada' : (f.origen ? 'No encontrada' : ''));
        r.values = [
          m.filas.length ? i + 1 : '', f.origen || '', f.archivo || '',
          typeof f.nota === 'number' ? f.nota : '', estOrigen,
          f.codigo || '', f.nombre || '', f.semestre || '', f.codigo ? (Number(f.creditos) || 0) : '',
          typeof f.coincidencia === 'number' ? f.coincidencia / 100 : '',
          typeof f.ae === 'number' ? f.ae / 100 : '',
          f.sugerencia || '', f.decision || '', '', ''
        ];
        COLS.forEach(function(_, k){
          var col = k + 1, c = r.getCell(col);
          c.border = borde; c.font = { size:9.5 };
          c.alignment = { vertical:'top', wrapText:true, horizontal:[1, 4, 5, 6, 8, 9, 10, 11, 13, 14].indexOf(col) >= 0 ? 'center' : 'left' };
          if (i % 2) c.fill = fill(SOFT);
        });
        r.getCell(4).numFmt = '0.0';
        r.getCell(10).numFmt = '0%'; r.getCell(11).numFmt = '0%';
        var dec = r.getCell(13);
        if (String(f.decision).indexOf('Aceptada') === 0){ dec.font = { size:9.5, bold:true, color:{ argb:hex(COLOR.accent) } }; }
        else if (f.decision === 'Rechazada'){ dec.font = { size:9.5, bold:true, color:{ argb:'FFC8453A' } }; }
        // Listas desplegables para que el evaluador y la Dirección completen el formulario
        dec.dataValidation = { type:'list', allowBlank:true, formulae:['"Aceptada,Rechazada,Sin candidato,Aceptada (repetida)"'] };
        r.getCell(14).dataValidation = { type:'list', allowBlank:true, formulae:['"Aprobada,Rechazada,Pendiente"'] };
        fila++;
      });
      var fin = fila - 1;
      ws.autoFilter = { from:{ row:filaCab, column:1 }, to:{ row:fin, column:COLS.length } };

      // Totales (el crédito se recalcula si se cambia la decisión en Excel)
      fila++;
      var tot = [
        ['Créditos convalidados (decisión "Aceptada")', { formula:'SUMIFS(I' + ini + ':I' + fin + ',M' + ini + ':M' + fin + ',"Aceptada")', result:m.resumen.crConv }, null],
        ['Créditos del plan de estudios', m.resumen.crTot, null],
        ['Porcentaje reconocido', { formula:'IF(I' + (fila + 1) + '>0,I' + fila + '/I' + (fila + 1) + ',0)', result:m.resumen.crTot ? m.resumen.crConv / m.resumen.crTot : 0 }, '0%']
      ];
      tot.forEach(function(t){
        ws.mergeCells('F' + fila + ':H' + fila);
        var k = ws.getCell('F' + fila), v = ws.getCell('I' + fila);
        k.value = t[0]; k.font = { bold:true, size:9.5 }; k.alignment = { horizontal:'right', vertical:'middle' }; k.fill = fill(SOFT); k.border = borde;
        v.value = t[1]; v.font = { bold:true, size:10.5, color:{ argb:BR } }; v.alignment = { horizontal:'center' }; v.border = borde;
        if (t[2]) v.numFmt = t[2];
        fila++;
      });

      seccion('4. Observaciones');
      ws.mergeCells('A' + fila + ':' + U + (fila + 3));
      var ob = ws.getCell('A' + fila); ob.border = borde; ob.alignment = { vertical:'top', wrapText:true };
      fila += 4;

      seccion('5. Firmas');
      fila += 2;
      [['A', 'D', 'Firma postulante', m.postulante ? m.postulante.nombre : ''], ['F', 'J', 'Firma evaluador/a', m.evaluador], ['L', 'O', 'Firma Dirección de Carrera', '']].forEach(function(f){
        ws.mergeCells(f[0] + fila + ':' + f[1] + fila);
        ws.mergeCells(f[0] + (fila + 1) + ':' + f[1] + (fila + 1));
        ws.mergeCells(f[0] + (fila + 2) + ':' + f[1] + (fila + 2));
        var a = ws.getCell(f[0] + fila); a.value = f[2]; a.font = { bold:true, size:9.5 };
        a.alignment = { horizontal:'center' }; a.border = { top:{ style:'thin', color:{ argb:'FF0E1B29' } } };
        var b = ws.getCell(f[0] + (fila + 1)); b.value = f[3] || ''; b.font = { size:9, color:{ argb:MUT } }; b.alignment = { horizontal:'center' };
        var c = ws.getCell(f[0] + (fila + 2)); c.value = 'Fecha: ____ / ____ / ________'; c.font = { size:9, color:{ argb:MUT } }; c.alignment = { horizontal:'center' };
      });
      fila += 4;
      ws.mergeCells('A' + fila + ':' + U + (fila + 1));
      var av = ws.getCell('A' + fila); av.value = AVISO; av.font = { italic:true, size:8, color:{ argb:MUT } }; av.alignment = { wrapText:true, vertical:'top' };
      ws.pageSetup.printTitlesRow = filaCab + ':' + filaCab;

      // Hoja 2: plan completo con el estado de cada ramo
      var wp = wb.addWorksheet('Plan de estudios', { views:[{ state:'frozen', ySplit:1 }], pageSetup:{ paperSize:9, orientation:'portrait', fitToPage:true, fitToWidth:1, fitToHeight:0 } });
      wp.columns = [
        { header:'Semestre', key:'s', width:10 }, { header:'Código', key:'c', width:12 }, { header:'Asignatura', key:'n', width:44 },
        { header:'Créditos', key:'cr', width:10 }, { header:'Estado', key:'e', width:14 }, { header:'Convalidada por (asignatura de origen)', key:'o', width:40 }
      ];
      var origenDe = {};
      m.filas.forEach(function(f){ if (f.decision === 'Aceptada' && f.codigo) origenDe[f.codigo] = f.origen; });
      m.plan.slice().sort(function(a, b){ return a.semestre - b.semestre; }).forEach(function(a){
        var cv = !!m.convCodigos[a.codigo];
        var r = wp.addRow({ s:a.semestre, c:a.codigo, n:a.nombre, cr:Number(a.creditos) || 0, e:cv ? 'Convalidada' : 'Por cursar', o:cv ? (origenDe[a.codigo] || '') : '' });
        if (cv){ r.eachCell(function(c){ c.fill = fill('FFE4F6EA'); }); r.getCell(5).font = { bold:true, color:{ argb:hex(COLOR.accent) } }; }
      });
      wp.getRow(1).eachCell(function(c){ c.font = { bold:true, color:{ argb:'FFFFFFFF' } }; c.fill = fill(BR); c.alignment = { vertical:'middle', horizontal:'center', wrapText:true }; });
      wp.getRow(1).height = 22;
      wp.autoFilter = { from:'A1', to:'F' + Math.max(1, m.plan.length + 1) };
      var rt = wp.addRow({ n:'Total créditos del plan', cr:{ formula:'SUM(D2:D' + (m.plan.length + 1) + ')', result:m.resumen.crTot } });
      rt.font = { bold:true };

      return wb.xlsx.writeBuffer().then(function(buf){
        descargar(new Blob([buf], { type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
          'Formulario_convalidacion_' + slug(m.postulante && m.postulante.apellidos) + '_' + ymd(m.emitido) + '.xlsx');
      });
    });
  }

  /* ---- barra de botones -------------------------------------------------- */
  var ICONOS = {
    print:'<path d="M7 9V3h10v6M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2M7 14h10v7H7z"/>',
    pdf:'<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M12 11v6M9 14l3 3 3-3"/>',
    xls:'<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M9 12l6 6M15 12l-6 6"/>'
  };
  function boton(icono, texto){
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'pz-btn';
    b.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONOS[icono] + '</svg><span>' + esc(texto) + '</span>';
    return b;
  }
  function conEspera(b, fn){
    b.addEventListener('click', function(){
      if (b.disabled) return;
      var txt = b.querySelector('span'), previo = txt.textContent;
      b.disabled = true; txt.textContent = 'Generando…';
      Promise.resolve().then(fn).catch(function(e){ console.error(e); aviso('No se pudo generar el archivo. Revisa que la carpeta vendor/ esté junto a la página.'); })
        .then(function(){ b.disabled = false; txt.textContent = previo; });
    });
  }
  function montarBarra(contenedor, opts){
    opts = opts || {};
    var plan = function(){ return typeof opts.plan === 'function' ? opts.plan() : opts.plan; };
    var bar = document.createElement('div');
    bar.className = 'pz-bar ' + (opts.variante === 'oscuro' ? 'pz-oscuro' : 'pz-claro');
    bar.setAttribute('role', 'group'); bar.setAttribute('aria-label', 'Exportar propuesta');
    var lbl = document.createElement('span'); lbl.className = 'pz-lbl'; lbl.textContent = opts.etiqueta || 'Propuesta';
    var bP = boton('print', 'Imprimir'), bD = boton('pdf', 'Descargar PDF'), bX = boton('xls', 'Formulario Excel');
    bP.addEventListener('click', function(){ imprimir(plan()); });
    conEspera(bD, function(){ return pdf(plan()); });
    conEspera(bX, function(){ return excel(plan()); });
    bar.appendChild(lbl); bar.appendChild(bP); bar.appendChild(bD); bar.appendChild(bX);
    contenedor.appendChild(bar);
    return bar;
  }

  window.Propuesta = { modelo:modelo, imprimir:imprimir, pdf:pdf, excel:excel, montarBarra:montarBarra };
})();
