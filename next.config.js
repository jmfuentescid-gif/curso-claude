@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --ink: #0A0A0F; --ink2: #3A3A42; --mid: #6B6A63; --ghost-txt: #9C9A92;
  --paper: #FAFAF7; --ghost: #F2F1EB; --rule: #E4E3DC; --rule2: #D0CFC7;
  --signal: #D4380D; --signal-bg: #FFF2EE; --signal-brd: #F5C4B8;
  --code-bg: #0F0F1A; --code-txt: #E8E6FF;
  --green: #1A5C2A; --green-bg: #EDFAF0;
  --amber: #7A4A00; --amber-bg: #FFF8E6;
  --font-d: 'Playfair Display', Georgia, serif;
  --font-b: 'Inter', -apple-system, sans-serif;
  --font-m: 'JetBrains Mono', monospace;
  --sw: 260px;
}

html { scroll-behavior: smooth; }
body { font-family: var(--font-b); background: var(--paper); color: var(--ink); line-height: 1.6; -webkit-font-smoothing: antialiased; }

.app { display: flex; min-height: 100vh; }

/* SIDEBAR */
.sidebar { width: var(--sw); flex-shrink: 0; background: var(--paper); border-right: 1px solid var(--rule); position: fixed; top: 0; left: 0; bottom: 0; overflow-y: auto; z-index: 100; display: flex; flex-direction: column; transition: transform .25s; }
.main { margin-left: var(--sw); flex: 1; min-height: 100vh; }
.sb-logo { padding: 1.5rem 1.25rem 1.25rem; border-bottom: 1px solid var(--rule); }
.sb-wordmark { font-family: var(--font-d); font-size: 16px; font-weight: 700; color: var(--ink); cursor: pointer; display: block; letter-spacing: -.02em; }
.sb-sub { font-size: 11px; color: var(--ghost-txt); margin-top: 3px; letter-spacing: .06em; text-transform: uppercase; }
.sb-prog { padding: 1rem 1.25rem; border-bottom: 1px solid var(--rule); }
.sb-prog-row { display: flex; justify-content: space-between; margin-bottom: 6px; }
.sb-prog-lbl { font-size: 11px; color: var(--ghost-txt); text-transform: uppercase; letter-spacing: .07em; }
.sb-prog-pct { font-size: 12px; font-weight: 600; color: var(--signal); font-family: var(--font-m); }
.sb-track { height: 1px; background: var(--rule2); position: relative; }
.sb-fill { height: 1px; background: var(--signal); position: absolute; top: 0; left: 0; transition: width .5s; }
.sb-nav { padding: .75rem 0; flex: 1; }
.sb-grp { font-size: 10px; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; color: var(--ghost-txt); padding: .75rem 1.25rem .3rem; }
.sb-link { display: flex; align-items: center; gap: 9px; padding: 6px 1.25rem; font-size: 13px; color: var(--mid); cursor: pointer; border-left: 2px solid transparent; transition: all .12s; }
.sb-link:hover { color: var(--ink); background: var(--ghost); }
.sb-link.active { color: var(--ink); border-left-color: var(--signal); background: var(--signal-bg); font-weight: 500; }
.sb-mod { display: flex; align-items: center; padding: 5px 1.25rem; font-size: 12px; color: var(--ghost-txt); cursor: pointer; gap: 8px; transition: color .12s; }
.sb-mod:hover { color: var(--mid); }
.sb-mod-n { font-family: var(--font-m); font-size: 10px; min-width: 20px; }
.sb-mod-t { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.sb-mod-d { font-family: var(--font-m); font-size: 10px; }

/* TOPBAR */
.topbar { position: sticky; top: 0; background: var(--paper); border-bottom: 1px solid var(--rule); padding: .875rem 2.5rem; display: flex; align-items: center; justify-content: space-between; z-index: 50; }
.tb-title { font-family: var(--font-d); font-size: 15px; font-weight: 700; }
.tb-meta { font-size: 11px; color: var(--ghost-txt); margin-top: 1px; text-transform: uppercase; letter-spacing: .06em; }
.tb-right { display: flex; gap: 8px; flex-shrink: 0; margin-left: 1rem; }

/* BUTTONS */
.btn { display: inline-flex; align-items: center; gap: 6px; padding: 7px 15px; font-size: 13px; font-weight: 500; font-family: var(--font-b); cursor: pointer; transition: all .12s; border: none; border-radius: 4px; white-space: nowrap; }
.btn-primary { background: var(--ink); color: var(--paper); }
.btn-primary:hover { background: var(--ink2); }
.btn-outline { background: transparent; color: var(--ink); border: 1px solid var(--rule2); }
.btn-outline:hover { border-color: var(--ink2); background: var(--ghost); }
.btn-done { background: var(--signal-bg); color: var(--signal); border: 1px solid var(--signal-brd); }

/* PAGES */
.page { display: none; animation: fu .18s ease; }
.page.active { display: block; }
@keyframes fu { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: none; } }

/* HOME */
.hero { padding: 4rem 2.5rem 3rem; border-bottom: 1px solid var(--rule); max-width: 760px; }
.hero-kick { font-size: 11px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; color: var(--signal); margin-bottom: 1.25rem; display: flex; align-items: center; gap: 8px; }
.hero-kick::before { content: ''; display: block; width: 20px; height: 1px; background: var(--signal); }
.hero-h1 { font-family: var(--font-d); font-size: clamp(36px,5.5vw,56px); font-weight: 900; line-height: 1.02; letter-spacing: -.03em; margin-bottom: 1.25rem; }
.hero-h1 em { font-style: italic; color: var(--signal); }
.hero-sub { font-size: 16px; color: var(--mid); line-height: 1.7; max-width: 500px; font-weight: 300; margin-bottom: 2rem; }
.hero-actions { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: .75rem; }
.hero-note { font-size: 12px; color: var(--ghost-txt); }
.stats-strip { display: flex; border-bottom: 1px solid var(--rule); }
.stat-cell { flex: 1; padding: 1.5rem 2.5rem; border-right: 1px solid var(--rule); }
.stat-cell:last-child { border-right: none; }
.stat-n { font-family: var(--font-d); font-size: 32px; font-weight: 900; line-height: 1; margin-bottom: 3px; }
.stat-l { font-size: 12px; color: var(--ghost-txt); text-transform: uppercase; letter-spacing: .06em; }
.mod-index { padding: 2.5rem; }
.idx-hdr { display: flex; align-items: baseline; justify-content: space-between; border-bottom: 1px solid var(--rule); padding-bottom: 1rem; margin-bottom: 0; }
.idx-h2 { font-family: var(--font-d); font-size: 22px; font-weight: 700; }
.idx-meta { font-size: 12px; color: var(--ghost-txt); }
.mod-row { display: flex; align-items: flex-start; border-bottom: 1px solid var(--rule); cursor: pointer; transition: background .1s; position: relative; }
.mod-row::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 2px; background: transparent; transition: background .15s; }
.mod-row:hover { background: var(--ghost); }
.mod-row:hover::before { background: var(--rule2); }
.mod-row.done::before { background: var(--signal); }
.mr-num { font-family: var(--font-m); font-size: 11px; color: var(--ghost-txt); padding: 1.35rem 1.5rem; flex-shrink: 0; min-width: 64px; }
.mr-body { flex: 1; padding: 1.25rem 0; }
.mr-title { font-family: var(--font-d); font-size: 17px; font-weight: 700; margin-bottom: 3px; line-height: 1.3; }
.mr-desc { font-size: 13px; color: var(--mid); line-height: 1.55; max-width: 520px; }
.mr-right { padding: 1.25rem 1.5rem; display: flex; flex-direction: column; align-items: flex-end; gap: 6px; flex-shrink: 0; }
.badge { font-size: 10px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; padding: 2px 8px; border-radius: 2px; }
.lv-basico { background: var(--green-bg); color: var(--green); }
.lv-intermedio { background: var(--amber-bg); color: var(--amber); }
.lv-avanzado { background: var(--signal-bg); color: var(--signal); }
.lv-experto { background: var(--ink); color: var(--paper); }
.mr-prog { font-family: var(--font-m); font-size: 11px; color: var(--ghost-txt); }

/* MODULE PAGE */
.mod-page { padding: 2.5rem; max-width: 740px; }
.breadcrumb { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--ghost-txt); margin-bottom: 2rem; cursor: pointer; text-transform: uppercase; letter-spacing: .06em; font-weight: 500; transition: color .12s; }
.breadcrumb:hover { color: var(--mid); }
.mod-hdr { border-bottom: 1px solid var(--rule); padding-bottom: 2rem; margin-bottom: 2rem; position: relative; overflow: hidden; }
.mod-bg-num { position: absolute; right: -10px; top: -20px; font-family: var(--font-d); font-size: 120px; font-weight: 900; color: var(--rule); line-height: 1; pointer-events: none; user-select: none; }
.mod-kick { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .1em; color: var(--signal); margin-bottom: .75rem; }
.mod-h1 { font-family: var(--font-d); font-size: 30px; font-weight: 900; margin-bottom: .75rem; line-height: 1.15; letter-spacing: -.02em; position: relative; }
.mod-desc { font-size: 15px; color: var(--mid); line-height: 1.65; max-width: 540px; font-weight: 300; position: relative; }
.les-tbl { margin-bottom: 2.5rem; }
.les-tbl-hdr { display: grid; grid-template-columns: 40px 1fr 140px 40px; gap: 1rem; padding: .5rem 0; border-bottom: 1px solid var(--rule); font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: .08em; color: var(--ghost-txt); }
.les-row { display: grid; grid-template-columns: 40px 1fr 140px 40px; gap: 1rem; align-items: center; padding: .875rem 0; border-bottom: 1px solid var(--rule); cursor: pointer; transition: background .1s; }
.les-row:hover { background: var(--ghost); margin: 0 -1rem; padding-left: 1rem; padding-right: 1rem; }
.les-row.done { background: var(--green-bg); margin: 0 -1rem; padding-left: 1rem; padding-right: 1rem; }
.les-n { font-family: var(--font-m); font-size: 11px; color: var(--ghost-txt); }
.les-t { font-size: 14px; line-height: 1.35; }
.les-row.done .les-t { color: var(--green); }
.les-m { font-size: 12px; color: var(--ghost-txt); }
.les-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--rule2); }
.les-dot.done { background: var(--green); }
.concepts { margin-bottom: 2rem; }
.concepts-lbl { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: .08em; color: var(--ghost-txt); margin-bottom: 8px; }
.concepts-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.ctag { font-family: var(--font-m); font-size: 11px; padding: 3px 10px; background: var(--ghost); border: 1px solid var(--rule); color: var(--mid); border-radius: 2px; }

/* LESSON PAGE */
.les-page { padding: 2.5rem; max-width: 680px; }
.les-h1 { font-family: var(--font-d); font-size: 28px; font-weight: 900; line-height: 1.15; letter-spacing: -.02em; margin-bottom: .75rem; }
.les-byline { display: flex; align-items: center; gap: 1rem; font-size: 12px; color: var(--ghost-txt); text-transform: uppercase; letter-spacing: .06em; margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--rule); }
.byline-sep { color: var(--rule2); }
.done-badge { color: var(--green); font-weight: 600; }
.les-body { font-size: 15px; line-height: 1.78; color: var(--ink); }
.les-body h2 { font-family: var(--font-d); font-size: 20px; font-weight: 700; margin: 2.5rem 0 .75rem; border-top: 1px solid var(--rule); padding-top: 1.5rem; letter-spacing: -.01em; }
.les-body h2:first-child { border-top: none; padding-top: 0; margin-top: 0; }
.les-body h3 { font-family: var(--font-d); font-size: 17px; font-weight: 700; color: var(--ink2); margin: 1.75rem 0 .5rem; }
.les-body p { margin-bottom: 1.1rem; }
.les-body ul, .les-body ol { padding-left: 1.5rem; margin-bottom: 1.1rem; }
.les-body li { margin-bottom: .4rem; }
.les-body strong { font-weight: 600; }
.les-body code { font-family: var(--font-m); font-size: 12.5px; background: var(--ghost); border: 1px solid var(--rule); padding: 1px 5px; border-radius: 2px; color: var(--signal); }
.les-body pre { background: var(--code-bg); color: var(--code-txt); border-radius: 4px; padding: 1.25rem 1.5rem; font-family: var(--font-m); font-size: 13px; line-height: 1.65; overflow-x: auto; margin-bottom: 1.25rem; border-left: 2px solid var(--signal); }
.les-body blockquote { border-left: 2px solid var(--signal); padding: .75rem 1.25rem; margin: 1.25rem 0; background: var(--signal-bg); }
.les-body blockquote p { color: var(--signal); margin-bottom: 0; font-style: italic; }
.callout { display: flex; gap: 12px; padding: 1rem 1.25rem; margin: 1.25rem 0; border-left: 2px solid; font-size: 14px; line-height: 1.6; }
.callout-info { background: #EEF4FF; border-color: #3B72E8; color: #1A3A8F; }
.callout-tip { background: var(--green-bg); border-color: var(--green); color: var(--green); }
.callout-warn { background: var(--amber-bg); border-color: var(--amber); color: var(--amber); }
.ex-section { margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid var(--rule); }
.ex-h { font-family: var(--font-d); font-size: 18px; font-weight: 700; margin-bottom: 1.25rem; }
.ex-card { border: 1px solid var(--rule); border-radius: 4px; margin-bottom: 1rem; overflow: hidden; }
.ex-head { display: flex; align-items: center; gap: 10px; padding: .75rem 1.25rem; background: var(--ghost); border-bottom: 1px solid var(--rule); }
.ex-num { font-family: var(--font-m); font-size: 10px; color: var(--ghost-txt); text-transform: uppercase; letter-spacing: .08em; }
.ex-title { font-size: 13px; font-weight: 600; }
.ex-time { font-family: var(--font-m); font-size: 11px; color: var(--ghost-txt); margin-left: auto; }
.ex-body { padding: .875rem 1.25rem; font-size: 13px; color: var(--mid); line-height: 1.6; }
.ex-prompt { margin: .75rem 0 0; padding: .875rem 1rem; background: var(--code-bg); color: var(--code-txt); font-family: var(--font-m); font-size: 12px; line-height: 1.65; border-radius: 3px; white-space: pre-wrap; }
.les-nav { display: flex; gap: 10px; margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid var(--rule); align-items: center; }
.les-nav .spacer { flex: 1; }

/* QUIZ */
.quiz-wrap { padding: 2.5rem; max-width: 640px; }
.quiz-h1 { font-family: var(--font-d); font-size: 28px; font-weight: 900; letter-spacing: -.02em; margin-bottom: .5rem; }
.quiz-lead { font-size: 14px; color: var(--mid); margin-bottom: 2rem; font-weight: 300; }
.quiz-segs { display: flex; gap: 3px; margin-bottom: 2rem; }
.quiz-seg { flex: 1; height: 2px; background: var(--rule2); transition: background .3s; }
.quiz-seg.current { background: var(--ink2); }
.quiz-seg.correct { background: var(--green); }
.quiz-seg.wrong { background: var(--mid); }
.q-n { font-size: 11px; color: var(--ghost-txt); text-transform: uppercase; letter-spacing: .08em; margin-bottom: .75rem; }
.q-text { font-family: var(--font-d); font-size: 20px; font-weight: 700; line-height: 1.4; margin-bottom: 1.5rem; letter-spacing: -.01em; }
.q-opts { display: flex; flex-direction: column; gap: 8px; }
.q-opt { padding: .875rem 1.125rem; border: 1px solid var(--rule2); background: var(--paper); color: var(--ink); font-size: 14px; font-family: var(--font-b); cursor: pointer; transition: all .1s; text-align: left; border-radius: 3px; line-height: 1.4; }
.q-opt:hover:not(:disabled) { border-color: var(--ink2); background: var(--ghost); }
.q-opt.correct { border-color: var(--green); background: var(--green-bg); color: var(--green); font-weight: 500; }
.q-opt.wrong { border-color: var(--mid); background: var(--ghost); color: var(--mid); text-decoration: line-through; }
.q-opt:disabled { cursor: default; }
.q-fb { margin-top: 1rem; padding: .875rem 1.125rem; font-size: 13px; line-height: 1.6; border-left: 2px solid; display: none; border-radius: 3px; }
.q-fb.show { display: block; }
.q-fb.ok { border-color: var(--green); background: var(--green-bg); color: var(--green); }
.q-fb.fail { border-color: var(--mid); background: var(--ghost); color: var(--ink2); }
.quiz-result { padding: 3rem 0; text-align: center; }
.res-pct { font-family: var(--font-d); font-size: 72px; font-weight: 900; line-height: 1; letter-spacing: -.04em; margin-bottom: .5rem; }
.res-pct span { font-size: 36px; color: var(--mid); }
.res-lbl { font-size: 14px; color: var(--mid); margin-bottom: 2rem; font-weight: 300; }

/* GLOSSARY */
.glos-wrap { padding: 2.5rem; max-width: 700px; }
.glos-h1 { font-family: var(--font-d); font-size: 28px; font-weight: 900; letter-spacing: -.02em; margin-bottom: .5rem; }
.glos-lead { font-size: 14px; color: var(--mid); margin-bottom: 2rem; font-weight: 300; }
.glos-search { display: flex; align-items: center; gap: 10px; border: 1px solid var(--rule2); border-radius: 3px; padding: .625rem .875rem; margin-bottom: 1.5rem; }
.glos-search input { flex: 1; border: none; outline: none; font-size: 14px; font-family: var(--font-b); background: transparent; color: var(--ink); }
.glos-tbl { width: 100%; border-collapse: collapse; }
.glos-tbl th { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: .08em; color: var(--ghost-txt); padding: .5rem 0; border-bottom: 1px solid var(--rule2); text-align: left; }
.glos-tbl th:last-child { text-align: right; }
.glos-tbl td { padding: 1rem 0; border-bottom: 1px solid var(--rule); vertical-align: top; }
.glos-tbl td:first-child { width: 28%; padding-right: 1.5rem; }
.glos-tbl td:last-child { width: 14%; text-align: right; }
.glos-term { font-family: var(--font-d); font-size: 15px; font-weight: 700; }
.glos-def { font-size: 13px; color: var(--mid); line-height: 1.55; }
.glos-tag { font-family: var(--font-m); font-size: 10px; padding: 2px 7px; background: var(--ghost); border: 1px solid var(--rule); color: var(--ghost-txt); border-radius: 2px; white-space: nowrap; }

/* PROFILE */
.prof-wrap { padding: 2.5rem; max-width: 660px; }
.prof-h1 { font-family: var(--font-d); font-size: 28px; font-weight: 900; letter-spacing: -.02em; margin-bottom: 2rem; border-bottom: 1px solid var(--rule); padding-bottom: 1.5rem; }
.stats4 { display: grid; grid-template-columns: repeat(4,1fr); border: 1px solid var(--rule); border-radius: 3px; overflow: hidden; margin-bottom: 2.5rem; }
.s4c { padding: 1.25rem; border-right: 1px solid var(--rule); }
.s4c:last-child { border-right: none; }
.s4n { font-family: var(--font-d); font-size: 28px; font-weight: 900; line-height: 1; }
.s4l { font-size: 11px; color: var(--ghost-txt); text-transform: uppercase; letter-spacing: .06em; margin-top: 3px; }
.prog-sec { margin-bottom: 2.5rem; }
.prog-sec-h { font-family: var(--font-d); font-size: 16px; font-weight: 700; margin-bottom: 1rem; }
.mpr { display: flex; align-items: center; gap: 12px; padding: .75rem 0; border-bottom: 1px solid var(--rule); }
.mpr-n { font-family: var(--font-m); font-size: 11px; color: var(--ghost-txt); width: 24px; flex-shrink: 0; }
.mpr-name { font-size: 13px; color: var(--mid); flex: 1; }
.mpr-bar { width: 80px; height: 1px; background: var(--rule2); position: relative; flex-shrink: 0; }
.mpr-fill { position: absolute; top: 0; left: 0; height: 1px; background: var(--signal); transition: width .4s; }
.mpr-pct { font-family: var(--font-m); font-size: 11px; color: var(--ghost-txt); width: 32px; text-align: right; flex-shrink: 0; }
.ach-h { font-family: var(--font-d); font-size: 16px; font-weight: 700; margin-bottom: 1rem; }
.ach-list { display: flex; flex-direction: column; gap: 6px; }
.ach-item { display: flex; align-items: center; gap: 10px; padding: .75rem 1rem; border: 1px solid var(--rule); border-radius: 3px; font-size: 13px; color: var(--ghost-txt); }
.ach-item.earned { background: var(--green-bg); border-color: rgba(26,92,42,.2); color: var(--green); }

/* CERT */
.cert-wrap { padding: 2.5rem; max-width: 680px; }
.cert-doc { border: 1px solid var(--rule2); border-top: 3px solid var(--signal); padding: 3rem; text-align: center; border-radius: 3px; }
.cert-kick { font-size: 10px; font-weight: 600; letter-spacing: .15em; text-transform: uppercase; color: var(--ghost-txt); margin-bottom: 1.5rem; }
.cert-title { font-family: var(--font-d); font-size: 36px; font-weight: 900; letter-spacing: -.03em; line-height: 1.1; margin-bottom: .5rem; }
.cert-title em { font-style: italic; color: var(--signal); }
.cert-body { font-size: 14px; color: var(--mid); line-height: 1.65; max-width: 380px; margin: 1.5rem auto 2rem; font-weight: 300; }
.cert-div { width: 60px; height: 1px; background: var(--rule2); margin: 1.5rem auto; }
.cert-date { font-family: var(--font-m); font-size: 11px; color: var(--ghost-txt); text-transform: uppercase; letter-spacing: .08em; margin-bottom: 2rem; }
.cert-locked { text-align: center; padding: 4rem 2rem; }
.cert-lock-h { font-family: var(--font-d); font-size: 22px; font-weight: 700; margin: 1rem 0 .5rem; }
.cert-lock-p { font-size: 14px; color: var(--mid); font-weight: 300; max-width: 380px; margin: 0 auto 1.5rem; line-height: 1.65; }
.cert-pt { height: 1px; background: var(--rule2); position: relative; margin: .5rem 0 2rem; }
.cert-pf { position: absolute; top: 0; left: 0; height: 1px; background: var(--signal); transition: width .5s; }

/* MOBILE */
.mob-top { display: none; }
@media (max-width: 768px) {
  .sidebar { transform: translateX(-100%); }
  .sidebar.open { transform: none; }
  .main { margin-left: 0; }
  .mob-top { display: flex; align-items: center; padding: .75rem 1rem; border-bottom: 1px solid var(--rule); position: sticky; top: 0; background: var(--paper); z-index: 50; gap: 12px; }
  .mob-btn { background: none; border: 1px solid var(--rule); padding: 6px 8px; cursor: pointer; border-radius: 3px; font-size: 16px; }
  .mob-title { font-family: var(--font-d); font-size: 14px; font-weight: 700; }
  .mob-overlay { display: none; position: fixed; inset: 0; background: rgba(10,10,15,.4); z-index: 99; }
  .mob-overlay.show { display: block; }
  .hero { padding: 2rem 1.25rem; }
  .stats-strip { flex-wrap: wrap; }
  .stat-cell { flex: 1 1 50%; border-bottom: 1px solid var(--rule); }
  .mod-index, .mod-page, .les-page, .quiz-wrap, .glos-wrap, .prof-wrap, .cert-wrap { padding: 1.25rem; }
  .topbar { display: none; }
  .les-tbl-hdr { display: none; }
  .les-row { grid-template-columns: 32px 1fr 32px; }
  .les-m { display: none; }
  .stats4 { grid-template-columns: repeat(2,1fr); }
  .s4c:nth-child(1),.s4c:nth-child(2) { border-bottom: 1px solid var(--rule); }
}
