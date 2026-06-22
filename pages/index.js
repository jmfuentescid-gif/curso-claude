import { useState, useEffect } from 'react'
import Head from 'next/head'

const MODULES = [
  { num:"01",level:"basico",levelLabel:"Básico",title:"Fundamentos y Orientación",desc:"Entiende qué es Claude, su arquitectura conceptual, cómo acceder a él y qué lo diferencia de otros modelos de lenguaje.",lessons:[{title:"¿Qué es Claude y cómo piensa?",meta:"Concepto · 15 min"},{title:"Versiones: Haiku, Sonnet, Opus — cuándo usar cada una",meta:"Concepto · 20 min"},{title:"Interfaces: Claude.ai, API, Claude Code, Cowork",meta:"Práctica · 25 min"},{title:"Configuración inicial y primeros pasos",meta:"Práctica · 20 min"},{title:"Cómo Claude procesa el contexto y la memoria",meta:"Concepto · 20 min"}],tags:["LLM","Transformers","contexto","ventana de contexto","tokens"]},
  { num:"02",level:"basico",levelLabel:"Básico",title:"Prompt Engineering Esencial",desc:"El arte y la ciencia de comunicarse con Claude de forma efectiva. Los patrones fundamentales que multiplican la calidad.",lessons:[{title:"Anatomía de un prompt perfecto",meta:"Concepto · 20 min"},{title:"Instrucciones positivas vs negativas",meta:"Práctica · 20 min"},{title:"Uso de XML tags para estructurar prompts",meta:"Práctica · 25 min"},{title:"Few-shot y zero-shot prompting",meta:"Práctica · 30 min"},{title:"Chain-of-thought y razonamiento paso a paso",meta:"Avanzado · 30 min"}],tags:["zero-shot","few-shot","CoT","XML tags","instrucciones"]},
  { num:"03",level:"intermedio",levelLabel:"Intermedio",title:"Prompting Avanzado y Técnicas Pro",desc:"Técnicas de nivel senior para extraer el máximo rendimiento: roles, personas, meta-prompting e iteración.",lessons:[{title:"Role-playing y asignación de personas",meta:"Práctica · 25 min"},{title:"Prompting iterativo y auto-refinamiento",meta:"Práctica · 30 min"},{title:"Plantillas reutilizables y variables",meta:"Práctica · 25 min"},{title:"Meta-prompting: Claude genera prompts",meta:"Avanzado · 35 min"},{title:"Control de longitud, tono y formato",meta:"Práctica · 20 min"},{title:"Evaluación y benchmarking de prompts",meta:"Avanzado · 30 min"}],tags:["personas","meta-prompting","temperatura","system prompt","iteración"]},
  { num:"04",level:"intermedio",levelLabel:"Intermedio",title:"System Prompts y Comportamiento",desc:"Domina el system prompt para definir comportamiento, personalidad y límites de Claude en cualquier aplicación.",lessons:[{title:"Anatomía del system prompt",meta:"Concepto · 20 min"},{title:"Configurar restricciones y permisos",meta:"Práctica · 25 min"},{title:"Gestión de guardarraíles y seguridad",meta:"Práctica · 30 min"},{title:"Crear asistentes con identidad propia",meta:"Práctica · 25 min"},{title:"Testing y debugging de system prompts",meta:"Avanzado · 35 min"}],tags:["system prompt","guardrails","identidad","Constitutional AI"]},
  { num:"05",level:"avanzado",levelLabel:"Avanzado",title:"Claude API e Integración",desc:"Integra Claude en cualquier aplicación. Streaming, tool use, multimodal y todos los parámetros de la API.",lessons:[{title:"Endpoints, autenticación y primeras llamadas",meta:"Práctica · 30 min"},{title:"Streaming de respuestas en tiempo real",meta:"Práctica · 25 min"},{title:"Gestión de conversaciones multi-turn",meta:"Práctica · 30 min"},{title:"Tool Use / Function Calling",meta:"Avanzado · 45 min"},{title:"Manejo de documentos, imágenes y PDFs",meta:"Práctica · 30 min"},{title:"Batch API y procesamiento masivo",meta:"Avanzado · 35 min"}],tags:["REST API","streaming","tool use","multimodal","tokens"]},
  { num:"06",level:"avanzado",levelLabel:"Avanzado",title:"Claude Code y Agentes",desc:"Usa Claude como agente autónomo. Flujos agentic, MCP, automatización compleja y pipelines multi-paso.",lessons:[{title:"Claude Code: instalación y flujo básico",meta:"Práctica · 30 min"},{title:"Integración con repositorios y flujo git",meta:"Práctica · 35 min"},{title:"Model Context Protocol (MCP) desde cero",meta:"Avanzado · 45 min"},{title:"Agentes autónomos y flujos multi-paso",meta:"Avanzado · 50 min"},{title:"Orquestación de agentes Claude + Claude",meta:"Experto · 50 min"}],tags:["Claude Code","MCP","agentes","agentic AI","subagents"]},
  { num:"07",level:"experto",levelLabel:"Experto",title:"Extensiones y Ecosistema Completo",desc:"Domina todas las extensiones: Cowork, Claude in Chrome, Claude in Excel, Claude in PowerPoint y flujos combinados.",lessons:[{title:"Claude in Chrome: agente de navegación",meta:"Práctica · 30 min"},{title:"Claude in Excel: análisis y automatización",meta:"Práctica · 35 min"},{title:"Claude in PowerPoint: generación de slides",meta:"Práctica · 30 min"},{title:"Claude Cowork: automatización de archivos",meta:"Práctica · 35 min"},{title:"Flujos combinados: Cowork + extensiones",meta:"Experto · 50 min"}],tags:["Chrome","Excel","PowerPoint","Cowork","automatización"]},
  { num:"08",level:"experto",levelLabel:"Experto",title:"Casos de Uso Pro y Proyectos Reales",desc:"Aplica todo en escenarios reales: investigación profunda, productos, análisis de datos y escritura a escala.",lessons:[{title:"Deep Research: investigación autónoma avanzada",meta:"Práctica · 40 min"},{title:"Analista de datos con Claude + Code + APIs",meta:"Proyecto · 60 min"},{title:"Construir un producto completo con Claude",meta:"Proyecto · 90 min"},{title:"Pipeline de contenido a escala con Claude",meta:"Proyecto · 60 min"},{title:"Proyecto final: tu asistente personalizado senior",meta:"Proyecto · 90 min"}],tags:["deep research","RAG","producto","pipeline","LLMOps"]}
]

const LESSON_CONTENT = {
  "0-0": { body: `<h2>¿Qué es Claude, exactamente?</h2><p>Claude es un <strong>modelo de lenguaje grande (LLM)</strong> creado por Anthropic. Técnicamente, es una red neuronal transformer entrenada sobre enormes volúmenes de texto humano, y luego alineada con valores mediante <strong>Constitutional AI</strong>.</p><blockquote><p>Claude es una máquina de predicción de texto tan sofisticada que ha desarrollado capacidades emergentes de razonamiento, escritura, análisis y resolución de problemas.</p></blockquote><h2>El mecanismo central</h2><p>Cuando escribes algo, Claude no "busca la respuesta" — predice cuál sería la continuación más útil dado todo el contexto disponible. El proceso tiene 5 etapas:</p><ol><li><strong>Entrada:</strong> recibe system prompt, historial y tu mensaje concatenados.</li><li><strong>Tokenización:</strong> el texto se divide en tokens (~4 caracteres).</li><li><strong>Embeddings:</strong> cada token se convierte en un vector de miles de dimensiones.</li><li><strong>Transformer:</strong> ~96 capas de atención donde cada token pondera a todos los demás.</li><li><strong>Respuesta:</strong> genera la salida token a token — por eso el streaming funciona.</li></ol><div class="callout callout-info"><div><strong>Clave pro:</strong> la temperatura controla qué tan determinista es la elección de cada token. Temperatura 0 = siempre el más probable. Temperatura 1 = máxima variedad.</div></div><h2>Constitutional AI</h2><p>A diferencia de un LLM base, Claude fue entrenado con una capa de alineación adicional. El modelo aprende a evaluar sus propias respuestas contra principios explícitos — honestidad, utilidad, no causar daño.</p><div class="callout callout-tip"><div><strong>Consecuencia práctica:</strong> Claude no cambia de opinión solo porque lo presiones. Necesita argumentos reales.</div></div><h2>Los 3 malentendidos más comunes</h2><ul><li><strong>"Es un buscador"</strong> — no recupera información en tiempo real. Tiene fecha de corte de conocimiento.</li><li><strong>"Tiene memoria entre chats"</strong> — cada conversación empieza desde cero.</li><li><strong>"Entiende = sabe"</strong> — puede razonar sobre conceptos sin haberlos experimentado.</li></ul>`, exercises: [{num:"01",title:"Siente los tokens",time:"5 min",desc:"Prueba esta tarea para entender por qué Claude procesa tokens, no letras individuales:",prompt:'Cuenta exactamente cuántas letras "r" hay en la palabra "strawberry".\nLuego explícame por qué este tipo de tarea es difícil para ti.'},{num:"02",title:"Testea la ventana de contexto",time:"10 min",desc:"Dile un dato inventado, haz 10 intercambios, luego pregúntale ese dato.",prompt:'Mi perro se llama Neptuno y tiene 3 patas.\n[... 10 intercambios ...\n¿Cómo se llama mi perro y cuántas patas tiene?'},{num:"03",title:"Recuperación vs razonamiento",time:"10 min",desc:"Compara el estilo de respuesta entre estos dos tipos:",prompt:'Pregunta 1: "¿Cuál es la capital de Francia?"\n\nPregunta 2: "Si todos los países europeos se fusionaran, ¿qué ciudad sería probablemente la capital y por qué?"'}]},
  "0-1": { body: `<h2>La familia Claude</h2><p>Anthropic ofrece modelos de distintos tamaños. Cada uno representa un punto diferente en el tradeoff <strong>velocidad / capacidad / costo</strong>.</p><h2>Claude Haiku — velocidad ante todo</h2><p>El modelo más rápido y económico. Ideal para tareas de alto volumen, respuestas cortas, clasificación y extracción de datos estructurados.</p><div class="callout callout-tip"><div><strong>Cuándo usarlo:</strong> chatbots de atención al cliente, autocompletado, etiquetado masivo de datos, pipelines de procesamiento a gran escala.</div></div><h2>Claude Sonnet — el equilibrio perfecto</h2><p>El modelo recomendado para la mayoría de los casos cotidianos. Lo suficientemente potente para tareas complejas, lo suficientemente rápido para uso interactivo.</p><div class="callout callout-info"><div><strong>Cuándo usarlo:</strong> desarrollo de software, redacción, análisis de documentos, asistentes conversacionales. El modelo más versátil.</div></div><h2>Claude Opus — máxima capacidad</h2><p>El modelo más capaz. Sobresale en razonamiento complejo, análisis profundo y problemas que los modelos menores no resuelven bien.</p><div class="callout callout-warn"><div><strong>Cuándo usarlo:</strong> research avanzado, análisis financiero complejo, código crítico, cuando la calidad importa más que el costo.</div></div><h2>Regla de decisión pro</h2><p>Empieza siempre con Sonnet. Si los resultados no son suficientes, sube a Opus. Si el costo o volumen es problema, baja a Haiku.</p>`, exercises: [{num:"01",title:"Compara los modelos",time:"15 min",desc:"Envía el mismo prompt complejo a Haiku, Sonnet y Opus. Compara profundidad y precisión.",prompt:"Analiza las implicaciones éticas, económicas y sociales de reemplazar el 50% de los trabajos de atención al cliente con IA conversacional en los próximos 5 años."},{num:"02",title:"Encuentra el límite de Haiku",time:"10 min",desc:"Diseña una tarea que Haiku no resuelva bien pero Sonnet sí.",prompt:"Dado que: A > B, B > C, D > A, C > E, E > F.\nOrdena todas las letras de mayor a menor explicando cada paso."}]},
  "1-0": { body: `<h2>¿Qué hace a un prompt "perfecto"?</h2><p>Un prompt perfecto reduce al máximo la ambigüedad, le da a Claude exactamente la información que necesita y anticipa los malentendidos más probables.</p><h2>Los 5 componentes</h2><ol><li><strong>Rol / Persona:</strong> ¿Quién debe ser Claude? "Actúa como un senior developer de Python..."</li><li><strong>Contexto:</strong> ¿Cuál es la situación? ¿Qué antecedentes necesita Claude?</li><li><strong>Tarea:</strong> ¿Qué debe hacer exactamente? Verbos específicos: analiza, resume, genera, clasifica.</li><li><strong>Formato:</strong> ¿Cómo debe estructurarse la respuesta? Bullet points, tabla, JSON, longitud máxima.</li><li><strong>Restricciones:</strong> ¿Qué no debe hacer? ¿Qué límites aplican?</li></ol><div class="callout callout-info"><div><strong>No todos los prompts necesitan los 5 componentes.</strong> Para tareas simples, 2–3 son suficientes. Incluye lo que reduzca ambigüedad significativa, omite lo obvio.</div></div><h2>Prompt débil vs prompt fuerte</h2><p><strong>Débil:</strong></p><pre>Escribe sobre inteligencia artificial.</pre><p><strong>Fuerte:</strong></p><pre>Actúa como periodista tecnológico para ejecutivos no técnicos.\nEscribe una introducción de 150 palabras sobre el impacto de la IA\ngenerativa en el sector financiero en 2025.\nTono: directo y sin jerga técnica.\nNo incluyas predicciones sin datos que las respalden.</pre><h2>El principio de especificidad progresiva</h2><p>Empieza con un prompt razonablemente completo, evalúa la respuesta, identifica qué componente faltó, y añade solo esa especificidad en la siguiente iteración.</p>`, exercises: [{num:"01",title:"Autopsia de un prompt fallido",time:"10 min",desc:"Escribe el prompt más vago posible, observa la respuesta, identifica qué faltó y reescríbelo.",prompt:"Versión vaga: 'Ayúdame con mi presentación'\n\nVersión completa:\nRol: [expertise necesario]\nContexto: [situación]\nTarea: [verbo + qué exactamente]\nFormato: [estructura]\nRestricciones: [límites]"},{num:"02",title:"Construye tu plantilla maestra",time:"20 min",desc:"Diseña una plantilla reutilizable para tu tarea más frecuente con Claude.",prompt:"Actúa como [rol experto].\n\n<contexto>\n[situación y antecedentes]\n</contexto>\n\n<tarea>\n[verbo + qué exactamente]\n</tarea>\n\n<formato>\n[estructura de respuesta]\n</formato>\n\n<restricciones>\n[qué evitar]\n</restricciones>"}]}
}

const QUIZ = [
  {q:"¿Cuál es la diferencia clave entre Claude Haiku, Sonnet y Opus?",opts:["Solo difieren en precio","Velocidad, capacidad y costo — Haiku más rápido/barato, Opus más capaz/costoso","Haiku es solo para texto, Opus solo para código","No hay diferencia real"],correct:1,fb:"Haiku prioriza velocidad y bajo costo, Sonnet equilibra para uso cotidiano, Opus ofrece máxima capacidad para tareas complejas."},
  {q:"¿Qué técnica mejora más la precisión en problemas lógicos complejos?",opts:["Few-shot con ejemplos simples","Zero-shot directo","Chain-of-Thought — razonamiento paso a paso","Usar mayúsculas en instrucciones clave"],correct:2,fb:"Chain-of-Thought fuerza al modelo a razonar explícitamente antes de concluir, reduciendo errores en razonamiento complejo."},
  {q:"¿Qué es el Model Context Protocol (MCP)?",opts:["Una forma de comprimir tokens","Un protocolo para conectar Claude con herramientas y datos externos de forma estandarizada","El límite máximo de contexto","Un método de fine-tuning"],correct:1,fb:"MCP es el estándar abierto de Anthropic para conectar Claude a cualquier fuente de datos o herramienta externa."},
  {q:"¿Cuándo usar XML tags en un prompt?",opts:["Solo para código HTML","Para separar claramente partes del prompt: contexto, instrucción, ejemplos, datos","Solo son útiles en el system prompt","No tienen ningún efecto"],correct:1,fb:"XML tags como <contexto>, <instrucciones>, <ejemplos> ayudan a Claude a identificar y procesar cada sección con mayor precisión."},
  {q:"¿Qué parámetro controla la creatividad vs precisión de Claude?",opts:["max_tokens","top_p","temperature","frequency_penalty"],correct:2,fb:"La temperatura (0–1) controla la aleatoriedad. Valores bajos = precisión. Valores altos = creatividad y variedad."},
  {q:"¿Qué significa que Claude genere respuestas 'token a token'?",opts:["Que cobra por cada palabra","Que produce la respuesta completa de golpe","Que construye la respuesta secuencialmente, cada pieza basada en las anteriores","Que revisa el texto antes de mostrarlo"],correct:2,fb:"Claude genera cada token mirando todos los anteriores. Esto explica el streaming y por qué puede cambiar de dirección."},
  {q:"¿Cuál es el propósito del system prompt?",opts:["Solo para instrucciones de formato","Definir comportamiento, personalidad y restricciones antes de cualquier interacción","Es lo mismo que el primer mensaje del usuario","Solo para administradores de Anthropic"],correct:1,fb:"El system prompt es el ADN invisible del asistente — define cómo se comporta y qué límites respeta, antes de cualquier interacción."},
  {q:"¿Qué es Constitutional AI?",opts:["Un tipo de arquitectura neuronal","El método donde el modelo aprende a auto-evaluar sus respuestas según principios de seguridad explícitos","Un protocolo de comunicación entre modelos","El equipo de seguridad de Anthropic"],correct:1,fb:"Constitutional AI es la técnica de Anthropic donde el modelo aprende a criticar y mejorar sus respuestas usando principios éticos definidos."}
]

const GLOSSARY = [
  {term:"Token",def:"Unidad mínima de texto que Claude procesa (~4 caracteres). Clave para entender costos y límites.",tag:"Fundamentos"},
  {term:"Ventana de contexto",def:"Cantidad máxima de tokens en una conversación. Claude Sonnet 4.6 tiene 200K tokens.",tag:"Fundamentos"},
  {term:"System Prompt",def:"Instrucciones invisibles al usuario que definen el comportamiento de Claude. El ADN de un asistente.",tag:"Prompting"},
  {term:"Tool Use / Function Calling",def:"Capacidad de Claude para invocar herramientas externas (APIs, bases de datos) de forma estructurada.",tag:"API"},
  {term:"MCP (Model Context Protocol)",def:"Protocolo abierto de Anthropic para conectar Claude a herramientas y servicios externos. El USB-C de la IA.",tag:"Agentes"},
  {term:"Chain-of-Thought (CoT)",def:"Técnica de prompting donde se pide a Claude que razone paso a paso antes de dar la respuesta final.",tag:"Prompting"},
  {term:"Few-shot Prompting",def:"Incluir ejemplos de input/output en el prompt para que Claude aprenda el patrón deseado.",tag:"Prompting"},
  {term:"Streaming",def:"Modo donde los tokens se envían al cliente conforme se generan, sin esperar la respuesta completa.",tag:"API"},
  {term:"Constitutional AI",def:"Método de entrenamiento donde el modelo aprende a auto-evaluar sus respuestas según principios de seguridad.",tag:"Fundamentos"},
  {term:"Agente (Agentic AI)",def:"Claude en modo autónomo: planifica, usa herramientas y ejecuta acciones para completar objetivos complejos.",tag:"Agentes"},
  {term:"RAG",def:"Retrieval-Augmented Generation: técnica para alimentar a Claude con documentos externos en tiempo real.",tag:"API"},
  {term:"Temperatura",def:"Parámetro (0–1) que controla la aleatoriedad. 0 = determinista, 1 = máxima creatividad.",tag:"API"},
  {term:"Embedding",def:"Representación numérica de un token en un espacio vectorial de alta dimensión que captura relaciones semánticas.",tag:"Fundamentos"},
  {term:"Zero-shot",def:"Pedir a Claude una tarea sin darle ejemplos previos. Funciona bien para tareas comunes.",tag:"Prompting"},
  {term:"Meta-prompting",def:"Pedirle a Claude que genere o mejore prompts para otras tareas.",tag:"Prompting"},
]

const SK = 'cc_v2'
function loadP() { try { return JSON.parse(localStorage.getItem(SK)||'{}') } catch { return {} } }
function saveP(p) { try { localStorage.setItem(SK, JSON.stringify(p)) } catch {} }
function totalLes() { return MODULES.reduce((a,m)=>a+m.lessons.length,0) }
function doneCount(p) { return Object.keys(p).filter(k=>k.startsWith('l_')).length }
function isDone(p,mi,li) { return !!p[`l_${mi}_${li}`] }
function modProg(p,mi) { const t=MODULES[mi].lessons.length; const d=MODULES[mi].lessons.filter((_,li)=>isDone(p,mi,li)).length; return {d,t,pct:t?Math.round(d/t*100):0} }

export default function Home() {
  const [page, setPage] = useState('home')
  const [mi, setMi] = useState(0)
  const [li, setLi] = useState(0)
  const [prog, setProg] = useState({})
  const [sbOpen, setSbOpen] = useState(false)
  const [ready, setReady] = useState(false)
  const [qIdx, setQIdx] = useState(0)
  const [qScore, setQScore] = useState(0)
  const [qAnswers, setQAnswers] = useState([])
  const [qChosen, setQChosen] = useState(null)
  const [qDone, setQDone] = useState(false)
  const [glosFilter, setGlosFilter] = useState('')

  useEffect(() => { setProg(loadP()); setReady(true) }, [])
  
  if (!ready) return null

  const done = doneCount(prog)
  const total = totalLes()
  const pct = total ? Math.round(done/total*100) : 0

  function upProg(p) { setProg(p); saveP(p) }
  function toggleDone(m,l) { const k=`l_${m}_${l}`; const n={...prog}; if(n[k]) delete n[k]; else n[k]=1; upProg(n) }
  function markDone(m,l) { if(!prog[`l_${m}_${l}`]) upProg({...prog,[`l_${m}_${l}`]:1}) }
  function goNext(m,l) { markDone(m,l); const mod=MODULES[m]; if(l<mod.lessons.length-1){setLi(l+1);setPage('lesson')} else if(m<MODULES.length-1){setMi(m+1);setPage('module')} else setPage('certificate') }
  function goPrev(m,l) { if(l>0){setLi(l-1);setPage('lesson')} else if(m>0){setMi(m-1);setPage('module')} }
  function nav(p) { setPage(p); setSbOpen(false) }
  function goMod(m) { setMi(m); setPage('module'); setSbOpen(false) }
  function goLesson(m,l) { setMi(m); setLi(l); setPage('lesson'); setSbOpen(false) }
  function resetQ() { setQIdx(0); setQScore(0); setQAnswers([]); setQChosen(null); setQDone(false) }
  function answerQ(i) { if(qChosen!==null)return; setQChosen(i); const ok=i===QUIZ[qIdx].correct; if(ok)setQScore(s=>s+1); setQAnswers(a=>[...a,ok]) }
  function nextQ() { if(qIdx+1>=QUIZ.length){setQDone(true)}else{setQIdx(i=>i+1);setQChosen(null)} }

  const mod = MODULES[mi]
  const lesson = mod?.lessons[li]
  const lKey = `${mi}-${li}`
  const lData = LESSON_CONTENT[lKey] || { body:`<h2>${lesson?.title}</h2><div class="callout callout-info"><div>Contenido en desarrollo. Usa el ejercicio a continuación para practicar este concepto directamente con Claude.</div></div><h2>Conceptos del módulo</h2><ul>${mod?.tags.map(t=>`<li><code>${t}</code></li>`).join('')}</ul>`, exercises:[{num:"01",title:"Exploración guiada",time:"15 min",desc:`Practica directamente el concepto: ${lesson?.title}`,prompt:`Quiero aprender sobre "${lesson?.title}".\nDame un ejemplo práctico paso a paso y un ejercicio para practicar.`}]}
  const lesIsDone = isDone(prog,mi,li)
  const gFiltered = glosFilter ? GLOSSARY.filter(g=>g.term.toLowerCase().includes(glosFilter.toLowerCase())||g.def.toLowerCase().includes(glosFilter.toLowerCase())) : GLOSSARY

  return (
    <>
      <Head><title>Domina Claude — Curso Pro Senior</title></Head>
      <div className="app">
        {sbOpen && <div className="mob-overlay show" onClick={()=>setSbOpen(false)}/>}
        <nav className={`sidebar${sbOpen?' open':''}`}>
          <div className="sb-logo">
            <span className="sb-wordmark" onClick={()=>nav('home')}>Domina Claude</span>
            <div className="sb-sub">Programa Pro Senior</div>
          </div>
          <div className="sb-prog">
            <div className="sb-prog-row"><span className="sb-prog-lbl">Progreso</span><span className="sb-prog-pct">{pct}%</span></div>
            <div className="sb-track"><div className="sb-fill" style={{width:`${pct}%`}}/></div>
          </div>
          <div className="sb-nav">
            <div className="sb-grp">General</div>
            {[['home','Inicio'],['quiz','Quiz de evaluación'],['glossary','Glosario'],['profile','Mi perfil'],['certificate','Certificado']].map(([id,label])=>(
              <div key={id} className={`sb-link${page===id?' active':''}`} onClick={()=>nav(id)}>{label}</div>
            ))}
            <div className="sb-grp" style={{marginTop:'.5rem'}}>Módulos</div>
            {MODULES.map((m,idx)=>{const{d,t}=modProg(prog,idx);return(
              <div key={idx} className="sb-mod" onClick={()=>goMod(idx)}>
                <span className="sb-mod-n">{m.num}</span>
                <span className="sb-mod-t">{m.title}</span>
                <span className="sb-mod-d">{d}/{t}</span>
              </div>
            )})}
          </div>
        </nav>

        <main className="main">
          <div className="mob-top">
            <button className="mob-btn" onClick={()=>setSbOpen(o=>!o)}>☰</button>
            <span className="mob-title">Domina Claude</span>
          </div>

          {/* HOME */}
          {page==='home' && <div className="page active">
            <div className="hero">
              <div className="hero-kick">Programa completo · Actualizado 2025</div>
              <h1 className="hero-h1">Domina <em>Claude</em><br/>de 0 a 100</h1>
              <p className="hero-sub">El curso más completo para convertirte en experto senior — desde fundamentos hasta agentes autónomos, API avanzada y todo el ecosistema.</p>
              <div className="hero-actions">
                <button className="btn btn-primary" onClick={()=>goMod(0)}>▶ Comenzar el curso</button>
                <button className="btn btn-outline" onClick={()=>nav('quiz')}>Evalúa tu nivel</button>
              </div>
              <p className="hero-note">Acceso completo gratuito · Sin registro · Progreso guardado localmente</p>
            </div>
            <div className="stats-strip">
              {[['8','Módulos'],['42','Lecciones'],['12h','Tiempo estimado'],['5','Niveles']].map(([n,l])=>(
                <div key={l} className="stat-cell"><div className="stat-n">{n}</div><div className="stat-l">{l}</div></div>
              ))}
            </div>
            <div className="mod-index">
              <div className="idx-hdr"><h2 className="idx-h2">Contenido del programa</h2><span className="idx-meta">{MODULES.length} módulos · {total} lecciones</span></div>
              {MODULES.map((m,idx)=>{const{d,t,pct:mp}=modProg(prog,idx);return(
                <div key={idx} className={`mod-row${d===t&&t>0&&d>0?' done':''}`} onClick={()=>goMod(idx)}>
                  <div className="mr-num">{m.num}</div>
                  <div className="mr-body"><div className="mr-title">{m.title}</div><div className="mr-desc">{m.desc}</div></div>
                  <div className="mr-right"><span className={`badge lv-${m.level}`}>{m.levelLabel}</span><span className="mr-prog">{d}/{t} lecciones</span></div>
                </div>
              )})}
            </div>
          </div>}

          {/* MODULE */}
          {page==='module' && <div className="page active">
            <div className="topbar">
              <div><div className="tb-title">Módulo {mod.num} — {mod.title}</div><div className="tb-meta">{modProg(prog,mi).d} de {mod.lessons.length} completadas</div></div>
              <div className="tb-right"><button className="btn btn-outline" onClick={()=>nav('home')}>← Volver</button></div>
            </div>
            <div className="mod-page">
              <div className="breadcrumb" onClick={()=>nav('home')}>← Todos los módulos</div>
              <div className="mod-hdr">
                <div className="mod-bg-num">{mod.num}</div>
                <div className="mod-kick">Módulo {mod.num} · {mod.levelLabel}</div>
                <h1 className="mod-h1">{mod.title}</h1>
                <p className="mod-desc">{mod.desc}</p>
              </div>
              <div className="les-tbl">
                <div className="les-tbl-hdr"><span>#</span><span>Lección</span><span>Duración</span><span></span></div>
                {mod.lessons.map((l,idx)=>{const d=isDone(prog,mi,idx);return(
                  <div key={idx} className={`les-row${d?' done':''}`} onClick={()=>goLesson(mi,idx)}>
                    <span className="les-n">{String(idx+1).padStart(2,'0')}</span>
                    <span className="les-t">{l.title}</span>
                    <span className="les-m">{l.meta}</span>
                    <span><div className={`les-dot${d?' done':''}`}/></span>
                  </div>
                )})}
              </div>
              <div className="concepts">
                <div className="concepts-lbl">Conceptos clave</div>
                <div className="concepts-tags">{mod.tags.map(t=><span key={t} className="ctag">{t}</span>)}</div>
              </div>
              <button className="btn btn-primary" onClick={()=>goLesson(mi,0)}>▶ {modProg(prog,mi).d>0?'Continuar módulo':'Comenzar módulo'}</button>
            </div>
          </div>}

          {/* LESSON */}
          {page==='lesson' && <div className="page active">
            <div className="topbar">
              <div><div className="tb-title">{lesson.title}</div><div className="tb-meta">Módulo {mod.num} · Lección {li+1} de {mod.lessons.length}</div></div>
              <div className="tb-right">
                <button className={`btn ${lesIsDone?'btn-done':'btn-outline'}`} onClick={()=>toggleDone(mi,li)}>
                  {lesIsDone?'✓ Completada':'Marcar completada'}
                </button>
              </div>
            </div>
            <div className="les-page">
              <div className="breadcrumb" onClick={()=>setPage('module')}>← {mod.title}</div>
              <h1 className="les-h1">{lesson.title}</h1>
              <div className="les-byline">
                <span>Módulo {mod.num}</span><span className="byline-sep">·</span><span>{lesson.meta}</span>
                {lesIsDone&&<><span className="byline-sep">·</span><span className="done-badge">✓ Completada</span></>}
              </div>
              <div className="les-body" dangerouslySetInnerHTML={{__html:lData.body}}/>
              {lData.exercises?.length>0&&<div className="ex-section">
                <h2 className="ex-h">Ejercicios prácticos</h2>
                {lData.exercises.map((ex,i)=>(
                  <div key={i} className="ex-card">
                    <div className="ex-head"><span className="ex-num">Ejercicio {ex.num}</span><span className="ex-title">{ex.title}</span><span className="ex-time">{ex.time}</span></div>
                    <div className="ex-body">{ex.desc}<div className="ex-prompt">{ex.prompt}</div></div>
                  </div>
                ))}
              </div>}
              <div className="les-nav">
                {(li>0||mi>0)?<button className="btn btn-outline" onClick={()=>goPrev(mi,li)}>← Anterior</button>:<div/>}
                <div className="spacer"/>
                <button className="btn btn-primary" onClick={()=>goNext(mi,li)}>
                  {(li<mod.lessons.length-1||mi<MODULES.length-1)?'Completar y continuar →':'Completar módulo ✓'}
                </button>
              </div>
            </div>
          </div>}

          {/* QUIZ */}
          {page==='quiz' && <div className="page active">
            <div className="topbar"><div><div className="tb-title">Quiz de evaluación</div><div className="tb-meta">Pon a prueba tu conocimiento</div></div></div>
            <div className="quiz-wrap">
              {qDone ? (
                <div className="quiz-result">
                  <div className="res-pct">{Math.round(qScore/QUIZ.length*100)}<span>%</span></div>
                  <div className="res-lbl">{qScore} de {QUIZ.length} correctas — {Math.round(qScore/QUIZ.length*100)>=80?'Excelente dominio.':Math.round(qScore/QUIZ.length*100)>=60?'Buen nivel. Refuerza los temas fallidos.':'Revisa los módulos fundamentales.'}</div>
                  <button className="btn btn-primary" onClick={resetQ}>↺ Repetir quiz</button>
                </div>
              ) : <>
                <h1 className="quiz-h1">Evaluación</h1>
                <p className="quiz-lead">{QUIZ.length} preguntas · Feedback inmediato · Tiempo libre</p>
                <div className="quiz-segs">{QUIZ.map((_,i)=>{let c='quiz-seg';if(i<qAnswers.length)c+=qAnswers[i]?' correct':' wrong';else if(i===qIdx)c+=' current';return<div key={i} className={c}/>})}</div>
                <div className="q-n">Pregunta {qIdx+1} de {QUIZ.length} · Puntuación: {qScore}</div>
                <div className="q-text">{QUIZ[qIdx].q}</div>
                <div className="q-opts">
                  {QUIZ[qIdx].opts.map((o,i)=>{let c='q-opt';if(qChosen!==null){if(i===QUIZ[qIdx].correct)c+=' correct';else if(i===qChosen&&qChosen!==QUIZ[qIdx].correct)c+=' wrong'}return<button key={i} className={c} onClick={()=>answerQ(i)} disabled={qChosen!==null}>{o}</button>})}
                </div>
                {qChosen!==null&&<>
                  <div className={`q-fb show ${qChosen===QUIZ[qIdx].correct?'ok':'fail'}`}><strong>{qChosen===QUIZ[qIdx].correct?'✓ Correcto.':'✗ Incorrecto.'}</strong> {QUIZ[qIdx].fb}</div>
                  <button className="btn btn-primary" style={{marginTop:'1rem'}} onClick={nextQ}>{qIdx<QUIZ.length-1?'Siguiente →':'Ver resultados ✓'}</button>
                </>}
              </>}
            </div>
          </div>}

          {/* GLOSSARY */}
          {page==='glossary' && <div className="page active">
            <div className="topbar"><div><div className="tb-title">Glosario</div><div className="tb-meta">{GLOSSARY.length} términos clave</div></div></div>
            <div className="glos-wrap">
              <h1 className="glos-h1">Glosario</h1>
              <p className="glos-lead">Términos esenciales del ecosistema Claude y la IA generativa.</p>
              <div className="glos-search">
                <span>🔍</span>
                <input value={glosFilter} onChange={e=>setGlosFilter(e.target.value)} placeholder="Buscar término..."/>
              </div>
              <table className="glos-tbl">
                <thead><tr><th>Término</th><th>Definición</th><th>Área</th></tr></thead>
                <tbody>{gFiltered.map((g,i)=><tr key={i}><td><span className="glos-term">{g.term}</span></td><td><span className="glos-def">{g.def}</span></td><td><span className="glos-tag">{g.tag}</span></td></tr>)}</tbody>
              </table>
            </div>
          </div>}

          {/* PROFILE */}
          {page==='profile' && <div className="page active">
            <div className="topbar">
              <div><div className="tb-title">Mi perfil</div><div className="tb-meta">Progreso y estadísticas</div></div>
              <div className="tb-right"><button className="btn btn-outline" onClick={()=>{if(confirm('¿Reiniciar todo el progreso?')){upProg({});nav('home')}}}>↺ Reiniciar</button></div>
            </div>
            <div className="prof-wrap">
              <h1 className="prof-h1">Mi progreso</h1>
              <div className="stats4">
                {[[done,'Completadas'],[total-done,'Pendientes'],[MODULES.filter((_,i)=>{const p=modProg(prog,i);return p.d===p.t&&p.t>0&&p.d>0}).length,'Módulos'],[pct+'%','Total']].map(([n,l])=>(
                  <div key={l} className="s4c"><div className="s4n">{n}</div><div className="s4l">{l}</div></div>
                ))}
              </div>
              <div className="prog-sec">
                <div className="prog-sec-h">Por módulo</div>
                {MODULES.map((m,i)=>{const{d,t,pct:mp}=modProg(prog,i);return(
                  <div key={i} className="mpr">
                    <span className="mpr-n">{m.num}</span>
                    <span className="mpr-name">{m.title}</span>
                    <div className="mpr-bar"><div className="mpr-fill" style={{width:`${mp}%`}}/></div>
                    <span className="mpr-pct">{mp}%</span>
                  </div>
                )})}
              </div>
              <div>
                <div className="ach-h">Logros</div>
                <div className="ach-list">
                  {[['▶ Primera lección',done>=1],['✓ 5 lecciones completadas',done>=5],['★ 10 lecciones completadas',done>=10],['📚 Módulo completo',MODULES.some((_,i)=>{const p=modProg(prog,i);return p.d===p.t&&p.t>0&&p.d>0})],['🏆 Mitad del curso',pct>=50],['🎓 Curso completo',pct===100]].map(([l,e],i)=>(
                    <div key={i} className={`ach-item${e?' earned':''}`}>{l}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>}

          {/* CERTIFICATE */}
          {page==='certificate' && <div className="page active">
            <div className="topbar"><div><div className="tb-title">Certificado</div></div>
              {pct===100&&<div className="tb-right"><button className="btn btn-outline" onClick={()=>window.print()}>🖨 Imprimir</button></div>}
            </div>
            <div className="cert-wrap">
              {pct<100 ? (
                <div className="cert-locked">
                  <div style={{fontSize:'48px',marginBottom:'1rem'}}>🔒</div>
                  <h2 className="cert-lock-h">Completa el curso para obtener tu certificado</h2>
                  <p className="cert-lock-p">Has completado el {pct}% del curso ({done} de {total} lecciones). Termina todas las lecciones para desbloquear tu certificado.</p>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:'13px',color:'var(--mid)',marginBottom:'6px'}}><span>Progreso</span><span>{pct}%</span></div>
                  <div className="cert-pt"><div className="cert-pf" style={{width:`${pct}%`}}/></div>
                  <button className="btn btn-primary" onClick={()=>nav('home')}>▶ Continuar aprendiendo</button>
                </div>
              ) : (
                <div className="cert-doc">
                  <div className="cert-kick">Certificado de finalización</div>
                  <h1 className="cert-title">Domina <em>Claude</em></h1>
                  <div className="cert-div"/>
                  <p className="cert-body">Este certificado acredita la finalización exitosa del programa completo de 8 módulos y 42 lecciones sobre el uso profesional avanzado de Claude.</p>
                  <div className="cert-date">{new Date().toLocaleDateString('es-ES',{year:'numeric',month:'long',day:'numeric'})} · Nivel Pro Senior</div>
                  <button className="btn btn-primary" onClick={()=>window.print()}>🖨 Imprimir certificado</button>
                </div>
              )}
            </div>
          </div>}
        </main>
      </div>
    </>
  )
}
