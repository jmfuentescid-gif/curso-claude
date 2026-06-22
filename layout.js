@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --ink:        #0A0A0F;
  --ink2:       #3A3A42;
  --mid:        #6B6A63;
  --ghost-txt:  #9C9A92;
  --paper:      #FAFAF7;
  --ghost:      #F2F1EB;
  --rule:       #E4E3DC;
  --rule2:      #D0CFC7;
  --signal:     #D4380D;
  --signal-bg:  #FFF2EE;
  --signal-brd: #F5C4B8;
  --code-bg:    #0F0F1A;
  --code-txt:   #E8E6FF;
  --green:      #1A5C2A;
  --green-bg:   #EDFAF0;
  --amber:      #7A4A00;
  --amber-bg:   #FFF8E6;

  --font-display: 'Playfair Display', Georgia, serif;
  --font-body:    'Inter', -apple-system, sans-serif;
  --font-mono:    'JetBrains Mono', 'Courier New', monospace;

  --sidebar-w: 260px;
}

html { scroll-behavior: smooth; font-size: 16px; }

body {
  font-family: var(--font-body);
  background: var(--paper);
  color: var(--ink);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

/* ── LAYOUT ── */
.app { display: flex; min-height: 100vh; }

.sidebar {
  width: var(--sidebar-w);
  flex-shrink: 0;
  background: var(--paper);
  border-right: 1px solid var(--rule);
  position: fixed;
  top: 0; left: 0; bottom: 0;
  overflow-y: auto;
  z-index: 100;
  display: flex;
  flex-direction: column;
}

.main { margin-left: var(--sidebar-w); flex: 1; min-height: 100vh; }

/* ── SIDEBAR ── */
.sidebar-logo {
  padding: 1.5rem 1.25rem 1.25rem;
  border-bottom: 1px solid var(--rule);
}
.logo-wordmark {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 700;
  color: var(--ink);
  letter-spacing: -0.02em;
  text-decoration: none;
  display: block;
  cursor: pointer;
}
.logo-sub {
  font-size: 11px;
  color: var(--ghost-txt);
  margin-top: 3px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-weight: 500;
}

.sidebar-progress {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--rule);
}
.prog-row { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px; }
.prog-label { font-size: 11px; color: var(--ghost-txt); text-transform: uppercase; letter-spacing: 0.07em; font-weight: 500; }
.prog-pct { font-size: 12px; font-weight: 600; color: var(--signal); font-family: var(--font-mono); }
.prog-track { height: 1px; background: var(--rule2); position: relative; }
.prog-fill { height: 1px; background: var(--signal); position: absolute; top: 0; left: 0; transition: width .5s ease; }

.sidebar-nav { padding: .75rem 0; flex: 1; }
.nav-group-label {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ghost-txt);
  padding: .75rem 1.25rem .3rem;
}
.nav-link {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 6px 1.25rem;
  font-size: 13px;
  color: var(--mid);
  cursor: pointer;
  text-decoration: none;
  border-left: 2px solid transparent;
  transition: all .12s;
  font-weight: 400;
}
.nav-link:hover { color: var(--ink); background: var(--ghost); }
.nav-link.active { color: var(--ink); border-left-color: var(--signal); background: var(--signal-bg); font-weight: 500; }
.nav-link svg { width: 15px; height: 15px; flex-shrink: 0; stroke: currentColor; fill: none; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
.nav-mod-row {
  display: flex;
  align-items: center;
  padding: 5px 1.25rem;
  font-size: 12px;
  color: var(--ghost-txt);
  cursor: pointer;
  transition: color .12s;
  gap: 8px;
}
.nav-mod-row:hover { color: var(--mid); }
.nav-mod-num { font-family: var(--font-mono); font-size: 10px; font-weight: 500; color: var(--rule2); flex-shrink: 0; min-width: 20px; }
.nav-mod-title { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.nav-mod-done { font-family: var(--font-mono); font-size: 10px; color: var(--rule2); flex-shrink: 0; }

/* ── TOPBAR ── */
.topbar {
  position: sticky; top: 0;
  background: var(--paper);
  border-bottom: 1px solid var(--rule);
  padding: .875rem 2.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 50;
}
.topbar-left { min-width: 0; }
.topbar-title { font-family: var(--font-display); font-size: 15px; font-weight: 700; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.topbar-meta { font-size: 11px; color: var(--ghost-txt); margin-top: 1px; text-transform: uppercase; letter-spacing: 0.06em; font-weight: 500; }
.topbar-right { display: flex; gap: 8px; align-items: center; flex-shrink: 0; margin-left: 1rem; }

/* ── BUTTONS ── */
.btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 7px 15px;
  font-size: 13px; font-weight: 500;
  font-family: var(--font-body);
  cursor: pointer;
  transition: all .12s;
  border: none;
  text-decoration: none;
  white-space: nowrap;
  border-radius: 4px;
}
.btn-primary { background: var(--ink); color: var(--paper); }
.btn-primary:hover { background: var(--ink2); }
.btn-outline { background: transparent; color: var(--ink); border: 1px solid var(--rule2); }
.btn-outline:hover { border-color: var(--ink2); background: var(--ghost); }
.btn-signal { background: var(--signal-bg); color: var(--signal); border: 1px solid var(--signal-brd); }
.btn-signal:hover { background: #FFE8E1; }
.btn-ghost-sm { background: transparent; color: var(--mid); font-size: 12px; padding: 5px 10px; border: 1px solid var(--rule); border-radius: 3px; }
.btn-ghost-sm:hover { color: var(--ink); border-color: var(--rule2); }
.btn svg { width: 14px; height: 14px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; flex-shrink: 0; }

/* ── PAGES ── */
.page { display: none; }
.page.active { display: block; animation: fadeUp .18s ease; }
@keyframes fadeUp { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: none; } }

/* ── HOME / LANDING ── */
.home-hero {
  padding: 4rem 2.5rem 3rem;
  border-bottom: 1px solid var(--rule);
  max-width: 760px;
}
.hero-kicker {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--signal);
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
  gap: 8px;
}
.hero-kicker::before { content: ''; display: block; width: 20px; height: 1px; background: var(--signal); }
.hero-h1 {
  font-family: var(--font-display);
  font-size: clamp(38px, 5.5vw, 58px);
  font-weight: 900;
  line-height: 1.02;
  letter-spacing: -0.03em;
  color: var(--ink);
  margin-bottom: 1.25rem;
}
.hero-h1 em { font-style: italic; color: var(--signal); }
.hero-sub {
  font-size: 16px;
  color: var(--mid);
  line-height: 1.7;
  max-width: 500px;
  font-weight: 300;
  margin-bottom: 2rem;
}
.hero-actions { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
.hero-note { font-size: 12px; color: var(--ghost-txt); margin-top: .75rem; }

.stats-strip {
  display: flex;
  border-bottom: 1px solid var(--rule);
}
.stat-item {
  flex: 1;
  padding: 1.5rem 2.5rem;
  border-right: 1px solid var(--rule);
}
.stat-item:last-child { border-right: none; }
.stat-n {
  font-family: var(--font-display);
  font-size: 32px;
  font-weight: 900;
  color: var(--ink);
  line-height: 1;
  margin-bottom: 3px;
}
.stat-n sup { font-size: 16px; color: var(--ghost-txt); }
.stat-l { font-size: 12px; color: var(--ghost-txt); text-transform: uppercase; letter-spacing: 0.06em; font-weight: 500; }

.modules-index { padding: 2.5rem 2.5rem; }
.index-header { margin-bottom: 2rem; display: flex; align-items: baseline; justify-content: space-between; border-bottom: 1px solid var(--rule); padding-bottom: 1rem; }
.index-h2 { font-family: var(--font-display); font-size: 22px; font-weight: 700; color: var(--ink); }
.index-meta { font-size: 12px; color: var(--ghost-txt); }

.module-row {
  display: flex;
  align-items: flex-start;
  gap: 0;
  border-bottom: 1px solid var(--rule);
  cursor: pointer;
  transition: background .1s;
  position: relative;
}
.module-row:hover { background: var(--ghost); }
.module-row::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 2px;
  background: transparent;
  transition: background .15s;
}
.module-row:hover::before { background: var(--rule2); }
.module-row.completed::before { background: var(--signal); }

.mod-row-num {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--ghost-txt);
  padding: 1.25rem 1.5rem 1.25rem 1.5rem;
  flex-shrink: 0;
  min-width: 64px;
  padding-top: 1.35rem;
}
.mod-row-body { flex: 1; padding: 1.25rem 0; min-width: 0; }
.mod-row-title {
  font-family: var(--font-display);
  font-size: 17px;
  font-weight: 700;
  color: var(--ink);
  margin-bottom: 3px;
  line-height: 1.3;
}
.mod-row-desc { font-size: 13px; color: var(--mid); line-height: 1.55; max-width: 520px; }
.mod-row-right { padding: 1.25rem 1.5rem; display: flex; flex-direction: column; align-items: flex-end; gap: 6px; flex-shrink: 0; }
.mod-level-badge {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 2px 8px;
  border-radius: 2px;
}
.lv-basico { background: var(--green-bg); color: var(--green); }
.lv-intermedio { background: var(--amber-bg); color: var(--amber); }
.lv-avanzado { background: var(--signal-bg); color: var(--signal); }
.lv-experto { background: var(--ink); color: var(--paper); }
.mod-row-progress { font-family: var(--font-mono); font-size: 11px; color: var(--ghost-txt); }

/* ── MODULE PAGE ── */
.mod-page { padding: 2.5rem; max-width: 740px; }
.breadcrumb {
  display: flex; align-items: center; gap: 6px;
  font-size: 12px; color: var(--ghost-txt);
  margin-bottom: 2rem; cursor: pointer;
  text-transform: uppercase; letter-spacing: 0.06em; font-weight: 500;
  transition: color .12s;
}
.breadcrumb:hover { color: var(--mid); }
.breadcrumb svg { width: 13px; height: 13px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.mod-page-header {
  border-bottom: 1px solid var(--rule);
  padding-bottom: 2rem;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
}
.mod-chapter-bg {
  position: absolute;
  right: -10px; top: -20px;
  font-family: var(--font-display);
  font-size: 120px;
  font-weight: 900;
  color: var(--rule);
  line-height: 1;
  pointer-events: none;
  user-select: none;
  letter-spacing: -0.05em;
}
.mod-page-kicker { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: var(--signal); margin-bottom: .75rem; }
.mod-page-h1 {
  font-family: var(--font-display);
  font-size: 30px; font-weight: 900;
  color: var(--ink); margin-bottom: .75rem;
  line-height: 1.15; letter-spacing: -0.02em;
  position: relative;
}
.mod-page-desc { font-size: 15px; color: var(--mid); line-height: 1.65; max-width: 540px; font-weight: 300; position: relative; }

.lessons-table { margin-bottom: 2.5rem; }
.lessons-table-header {
  display: grid;
  grid-template-columns: 40px 1fr 120px 80px;
  gap: 1rem;
  padding: .5rem 0;
  border-bottom: 1px solid var(--rule);
  font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--ghost-txt);
}
.lesson-table-row {
  display: grid;
  grid-template-columns: 40px 1fr 120px 80px;
  gap: 1rem;
  align-items: center;
  padding: .875rem 0;
  border-bottom: 1px solid var(--rule);
  cursor: pointer;
  transition: background .1s;
}
.lesson-table-row:hover { background: var(--ghost); margin: 0 -1rem; padding-left: 1rem; padding-right: 1rem; }
.lesson-table-row.done { background: var(--green-bg); margin: 0 -1rem; padding-left: 1rem; padding-right: 1rem; }
.lt-num { font-family: var(--font-mono); font-size: 11px; color: var(--ghost-txt); }
.lt-title { font-size: 14px; color: var(--ink); font-weight: 400; line-height: 1.35; }
.lesson-table-row.done .lt-title { color: var(--green); }
.lt-meta { font-size: 12px; color: var(--ghost-txt); }
.lt-status { display: flex; justify-content: flex-end; }
.status-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--rule2); }
.status-dot.done { background: var(--green); }

.concepts-row { margin-bottom: 2rem; }
.concepts-label { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--ghost-txt); margin-bottom: 8px; }
.concepts-list { display: flex; flex-wrap: wrap; gap: 6px; }
.concept-pill {
  font-family: var(--font-mono);
  font-size: 11px;
  padding: 3px 10px;
  background: var(--ghost);
  border: 1px solid var(--rule);
  color: var(--mid);
  border-radius: 2px;
  cursor: default;
}

/* ── LESSON PAGE ── */
.lesson-page { padding: 2.5rem; max-width: 680px; }
.lesson-h1 {
  font-family: var(--font-display);
  font-size: 28px; font-weight: 900;
  line-height: 1.15; letter-spacing: -0.02em;
  color: var(--ink); margin-bottom: .75rem;
}
.lesson-byline {
  display: flex; align-items: center; gap: 1rem;
  font-size: 12px; color: var(--ghost-txt);
  text-transform: uppercase; letter-spacing: 0.06em; font-weight: 500;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--rule);
}
.byline-sep { color: var(--rule2); }
.done-badge { color: var(--green); font-weight: 600; }

/* Lesson body typography */
.lesson-body { font-size: 15px; line-height: 1.78; color: var(--ink); }
.lesson-body h2 {
  font-family: var(--font-display);
  font-size: 20px; font-weight: 700;
  color: var(--ink); margin: 2.5rem 0 .75rem;
  letter-spacing: -0.01em;
  border-top: 1px solid var(--rule);
  padding-top: 1.5rem;
}
.lesson-body h2:first-child { border-top: none; padding-top: 0; margin-top: 0; }
.lesson-body h3 { font-family: var(--font-display); font-size: 17px; font-weight: 700; color: var(--ink2); margin: 1.75rem 0 .5rem; }
.lesson-body p { margin-bottom: 1.1rem; }
.lesson-body ul, .lesson-body ol { padding-left: 1.5rem; margin-bottom: 1.1rem; }
.lesson-body li { margin-bottom: .4rem; }
.lesson-body strong { font-weight: 600; color: var(--ink); }
.lesson-body em { font-style: italic; }
.lesson-body code {
  font-family: var(--font-mono);
  font-size: 12.5px;
  background: var(--ghost);
  border: 1px solid var(--rule);
  padding: 1px 5px;
  border-radius: 2px;
  color: var(--signal);
}
.lesson-body pre {
  background: var(--code-bg);
  color: var(--code-txt);
  border-radius: 4px;
  padding: 1.25rem 1.5rem;
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.65;
  overflow-x: auto;
  margin-bottom: 1.25rem;
  border-left: 2px solid var(--signal);
}
.lesson-body blockquote {
  border-left: 2px solid var(--signal);
  padding: .75rem 1.25rem;
  margin: 1.25rem 0;
  background: var(--signal-bg);
}
.lesson-body blockquote p { color: var(--signal); margin-bottom: 0; font-style: italic; }

.callout {
  display: flex; gap: 12px;
  padding: 1rem 1.25rem;
  margin: 1.25rem 0;
  border-left: 2px solid;
  font-size: 14px;
  line-height: 1.6;
}
.callout svg { width: 16px; height: 16px; flex-shrink: 0; margin-top: 2px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.callout-info { background: #EEF4FF; border-color: #3B72E8; color: #1A3A8F; }
.callout-tip { background: var(--green-bg); border-color: var(--green); color: var(--green); }
.callout-warn { background: var(--amber-bg); border-color: var(--amber); color: var(--amber); }
.callout-body strong { font-weight: 600; }

.exercises-section { margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid var(--rule); }
.exercises-h { font-family: var(--font-display); font-size: 18px; font-weight: 700; margin-bottom: 1.25rem; color: var(--ink); }
.exercise {
  border: 1px solid var(--rule);
  border-radius: 4px;
  margin-bottom: 1rem;
  overflow: hidden;
}
.exercise-head {
  display: flex; align-items: center; gap: 10px;
  padding: .75rem 1.25rem;
  background: var(--ghost);
  border-bottom: 1px solid var(--rule);
}
.ex-num { font-family: var(--font-mono); font-size: 10px; font-weight: 500; color: var(--ghost-txt); text-transform: uppercase; letter-spacing: 0.08em; }
.ex-title { font-size: 13px; font-weight: 600; color: var(--ink); }
.ex-time { font-family: var(--font-mono); font-size: 11px; color: var(--ghost-txt); margin-left: auto; }
.exercise-body { padding: .875rem 1.25rem; font-size: 13px; color: var(--mid); line-height: 1.6; }
.exercise-prompt {
  margin: .75rem 0 0;
  padding: .875rem 1rem;
  background: var(--code-bg);
  color: var(--code-txt);
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 1.65;
  border-radius: 3px;
  white-space: pre-wrap;
}

.lesson-nav-bar {
  display: flex; gap: 10px;
  margin-top: 3rem; padding-top: 1.5rem;
  border-top: 1px solid var(--rule);
  align-items: center;
}
.lesson-nav-bar .spacer { flex: 1; }

/* ── QUIZ ── */
.quiz-wrap { padding: 2.5rem; max-width: 640px; }
.quiz-h1 { font-family: var(--font-display); font-size: 28px; font-weight: 900; color: var(--ink); margin-bottom: .5rem; letter-spacing: -0.02em; }
.quiz-lead { font-size: 14px; color: var(--mid); margin-bottom: 2rem; font-weight: 300; }
.quiz-progress-strip { display: flex; gap: 3px; margin-bottom: 2rem; }
.qp-seg { flex: 1; height: 2px; background: var(--rule2); transition: background .3s; }
.qp-seg.answered { background: var(--signal); }
.qp-seg.correct { background: var(--green); }
.qp-seg.wrong { background: var(--mid); }
.question-n { font-size: 11px; color: var(--ghost-txt); text-transform: uppercase; letter-spacing: 0.08em; font-weight: 500; margin-bottom: .75rem; }
.question-text { font-family: var(--font-display); font-size: 20px; font-weight: 700; color: var(--ink); line-height: 1.4; margin-bottom: 1.5rem; letter-spacing: -0.01em; }
.quiz-opts { display: flex; flex-direction: column; gap: 8px; }
.quiz-opt {
  padding: .875rem 1.125rem;
  border: 1px solid var(--rule2);
  background: var(--paper);
  color: var(--ink);
  font-size: 14px;
  font-family: var(--font-body);
  cursor: pointer;
  transition: all .1s;
  text-align: left;
  border-radius: 3px;
  line-height: 1.4;
}
.quiz-opt:hover:not(:disabled) { border-color: var(--ink2); background: var(--ghost); }
.quiz-opt.correct { border-color: var(--green); background: var(--green-bg); color: var(--green); font-weight: 500; }
.quiz-opt.wrong { border-color: var(--mid); background: var(--ghost); color: var(--mid); text-decoration: line-through; }
.quiz-opt:disabled { cursor: default; }
.quiz-feedback {
  margin-top: 1rem;
  padding: .875rem 1.125rem;
  font-size: 13px; line-height: 1.6;
  border-left: 2px solid;
  display: none;
}
.quiz-feedback.show { display: block; }
.quiz-feedback.ok { border-color: var(--green); background: var(--green-bg); color: var(--green); }
.quiz-feedback.fail { border-color: var(--mid); background: var(--ghost); color: var(--ink2); }
.quiz-result { padding: 3rem 0; text-align: center; }
.result-pct { font-family: var(--font-display); font-size: 72px; font-weight: 900; color: var(--ink); line-height: 1; letter-spacing: -0.04em; margin-bottom: .5rem; }
.result-pct span { font-size: 36px; color: var(--mid); }
.result-label { font-size: 14px; color: var(--mid); margin-bottom: 2rem; font-weight: 300; }

/* ── GLOSSARY ── */
.glossary-wrap { padding: 2.5rem; max-width: 700px; }
.glos-h1 { font-family: var(--font-display); font-size: 28px; font-weight: 900; color: var(--ink); margin-bottom: .5rem; letter-spacing: -0.02em; }
.glos-lead { font-size: 14px; color: var(--mid); margin-bottom: 2rem; font-weight: 300; }
.glos-search {
  display: flex; align-items: center; gap: 10px;
  border: 1px solid var(--rule2); border-radius: 3px;
  padding: .625rem .875rem;
  margin-bottom: 1.5rem;
  background: var(--paper);
}
.glos-search svg { width: 15px; height: 15px; color: var(--ghost-txt); stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; flex-shrink: 0; }
.glos-search input { flex: 1; border: none; outline: none; font-size: 14px; font-family: var(--font-body); background: transparent; color: var(--ink); }
.glos-table { width: 100%; border-collapse: collapse; }
.glos-table th { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--ghost-txt); padding: .5rem 0; border-bottom: 1px solid var(--rule2); text-align: left; }
.glos-table th:last-child { text-align: right; }
.glos-table td { padding: 1rem 0; border-bottom: 1px solid var(--rule); vertical-align: top; }
.glos-table td:first-child { width: 30%; padding-right: 1.5rem; }
.glos-table td:last-child { width: 15%; text-align: right; }
.glos-term { font-family: var(--font-display); font-size: 15px; font-weight: 700; color: var(--ink); }
.glos-def { font-size: 13px; color: var(--mid); line-height: 1.55; }
.glos-tag { font-family: var(--font-mono); font-size: 10px; padding: 2px 7px; background: var(--ghost); border: 1px solid var(--rule); color: var(--ghost-txt); border-radius: 2px; white-space: nowrap; }

/* ── PROFILE ── */
.profile-wrap { padding: 2.5rem; max-width: 660px; }
.profile-h1 { font-family: var(--font-display); font-size: 28px; font-weight: 900; color: var(--ink); margin-bottom: 2rem; letter-spacing: -0.02em; border-bottom: 1px solid var(--rule); padding-bottom: 1.5rem; }
.stats-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; border: 1px solid var(--rule); margin-bottom: 2.5rem; border-radius: 3px; overflow: hidden; }
.stat4-cell { padding: 1.25rem; border-right: 1px solid var(--rule); }
.stat4-cell:last-child { border-right: none; }
.stat4-n { font-family: var(--font-display); font-size: 28px; font-weight: 900; color: var(--ink); line-height: 1; }
.stat4-l { font-size: 11px; color: var(--ghost-txt); text-transform: uppercase; letter-spacing: 0.06em; margin-top: 3px; font-weight: 500; }
.progress-section { margin-bottom: 2.5rem; }
.ps-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1rem; }
.ps-title { font-family: var(--font-display); font-size: 16px; font-weight: 700; color: var(--ink); }
.ps-meta { font-size: 12px; color: var(--ghost-txt); }
.module-progress-row { display: flex; align-items: center; gap: 12px; padding: .75rem 0; border-bottom: 1px solid var(--rule); }
.mpr-num { font-family: var(--font-mono); font-size: 11px; color: var(--ghost-txt); width: 24px; flex-shrink: 0; }
.mpr-name { font-size: 13px; color: var(--mid); flex: 1; }
.mpr-bar { width: 80px; height: 1px; background: var(--rule2); position: relative; flex-shrink: 0; }
.mpr-fill { position: absolute; top: 0; left: 0; height: 100%; background: var(--signal); transition: width .4s; }
.mpr-pct { font-family: var(--font-mono); font-size: 11px; color: var(--ghost-txt); width: 32px; text-align: right; flex-shrink: 0; }
.achievements-section { }
.ach-title { font-family: var(--font-display); font-size: 16px; font-weight: 700; color: var(--ink); margin-bottom: 1rem; }
.ach-list { display: flex; flex-direction: column; gap: 6px; }
.ach-item { display: flex; align-items: center; gap: 12px; padding: .75rem 1rem; border: 1px solid var(--rule); border-radius: 3px; font-size: 13px; color: var(--ghost-txt); }
.ach-item.earned { background: var(--green-bg); border-color: rgba(26,92,42,.2); color: var(--green); }
.ach-item svg { width: 14px; height: 14px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; flex-shrink: 0; }

/* ── CERTIFICATE ── */
.cert-wrap { padding: 2.5rem; max-width: 680px; }
.cert-doc {
  border: 1px solid var(--rule2);
  border-top: 3px solid var(--signal);
  padding: 3rem;
  text-align: center;
  border-radius: 3px;
}
.cert-kicker { font-size: 10px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: var(--ghost-txt); margin-bottom: 1.5rem; }
.cert-title { font-family: var(--font-display); font-size: 36px; font-weight: 900; color: var(--ink); letter-spacing: -0.03em; line-height: 1.1; margin-bottom: .5rem; }
.cert-title em { font-style: italic; color: var(--signal); }
.cert-body { font-size: 14px; color: var(--mid); line-height: 1.65; max-width: 380px; margin: 1.5rem auto 2rem; font-weight: 300; }
.cert-divider { width: 60px; height: 1px; background: var(--rule2); margin: 1.5rem auto; }
.cert-date { font-family: var(--font-mono); font-size: 11px; color: var(--ghost-txt); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 2rem; }
.cert-locked { text-align: center; padding: 4rem 2rem; }
.cert-lock-icon { font-size: 32px; margin-bottom: 1.5rem; color: var(--ghost-txt); }
.cert-lock-h { font-family: var(--font-display); font-size: 22px; font-weight: 700; color: var(--ink); margin-bottom: .5rem; }
.cert-lock-p { font-size: 14px; color: var(--mid); font-weight: 300; max-width: 380px; margin: 0 auto 1.5rem; line-height: 1.65; }
.cert-prog-row { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px; color: var(--mid); }
.cert-prog-track { height: 1px; background: var(--rule2); position: relative; margin-bottom: 2rem; }
.cert-prog-fill { position: absolute; top: 0; left: 0; height: 1px; background: var(--signal); transition: width .5s; }

/* ── MOBILE ── */
.mobile-top { display: none; }
@media (max-width: 768px) {
  .sidebar { transform: translateX(-100%); transition: transform .25s; }
  .sidebar.open { transform: none; }
  .main { margin-left: 0; }
  .mobile-top {
    display: flex; align-items: center;
    padding: .75rem 1rem;
    border-bottom: 1px solid var(--rule);
    position: sticky; top: 0; background: var(--paper); z-index: 50;
    gap: 12px;
  }
  .mobile-menu-btn { background: none; border: 1px solid var(--rule); padding: 6px 8px; cursor: pointer; border-radius: 3px; }
  .mobile-menu-btn svg { width: 16px; height: 16px; stroke: var(--ink); fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; display: block; }
  .mobile-title { font-family: var(--font-display); font-size: 14px; font-weight: 700; color: var(--ink); }
  .mobile-overlay { display: none; position: fixed; inset: 0; background: rgba(10,10,15,.4); z-index: 99; }
  .mobile-overlay.show { display: block; }
  .home-hero { padding: 2rem 1.25rem; }
  .stats-strip { flex-wrap: wrap; }
  .stat-item { flex: 1 1 50%; border-bottom: 1px solid var(--rule); }
  .modules-index { padding: 1.5rem 1.25rem; }
  .topbar { display: none; }
  .mod-page, .lesson-page, .quiz-wrap, .glossary-wrap, .profile-wrap, .cert-wrap { padding: 1.25rem; }
  .lessons-table-header { display: none; }
  .lesson-table-row { grid-template-columns: 32px 1fr 60px; }
  .lt-meta { display: none; }
  .stats-4 { grid-template-columns: repeat(2, 1fr); }
  .stat4-cell:nth-child(1), .stat4-cell:nth-child(2) { border-bottom: 1px solid var(--rule); }
}
