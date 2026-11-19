/* STUDIO: the "guideline in, app out" website, with no AI. Paste or type a filled-in template (and,
   optionally, the guideline's text so quotes can be checked); the checks and a working preview update as
   you type; "Copy app code" gives a self-contained app file to paste and save. Everything runs in the browser. */
import { readTemplate } from '../engine/template.js';
import { checkSpec } from '../engine/check.js';
import { mount } from '../engine/runtime.js';
import { escapeHtml as esc, appPage } from '../engine/page.js';

/* global APP_JS, APP_CSS, FONTS_LINK, EXAMPLES */
const $ = (s) => document.querySelector(s);
// localStorage that never throws (private browsing): the studio keeps the typed template between visits.
const store = { get: (k) => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* private mode */ } } };

let app = null, latest = null, timer = null;

// Re-reads and re-checks the typed template, then redraws the checks list and the live preview.
function update() {
  const text = $('#tpl').value, source = $('#src').value;
  store.set('studio-template', text); store.set('studio-source', source);
  const first = readTemplate(text);
  latest = { ...checkSpec(first.spec, { sourceText: source, findings: first.findings }), built: 'studio preview' };
  const { findings, summary } = latest;
  const n = (l) => findings.filter((f) => f.level === l).length;
  $('#count').textContent = `${n('fix')} to fix · ${n('check')} to check · ${n('info')} notes`;
  $('#tab-checks').textContent = `Checks (${n('fix') + n('check')})`;
  $('#checks').innerHTML = `<p class="sum">${summary.steps} steps, ${summary.reachable} reachable · ${summary.quotesExact}/${summary.quotes} quotes found in the guideline text${source ? '' : ' (paste the guideline text to check quotes)'}</p>` +
    ['fix', 'check', 'info'].map((lvl) => findings.filter((f) => f.level === lvl).map((f) =>
      `<li class="lvl-${lvl}" data-line="${f.line ?? ''}"><b>${{ fix: 'Fix', check: 'Check', info: 'Note' }[lvl]}</b>${f.line ? ` · line ${f.line}` : ''}: ${esc(f.message)}${f.suggestion ? `<br><i>${esc(f.suggestion)}</i>` : ''}</li>`).join('')).join('');
  if (app) app.stop();
  $('#preview').innerHTML = '<div id="app"></div>';
  app = mount($('#preview #app'), latest);
}

// Shows one of the four panes (template, guideline text, checks, preview).
function show(tab) {
  for (const t of ['template', 'source', 'checks', 'preview']) {
    $(`#pane-${t}`).hidden = t !== tab;
    $(`#tab-${t}`).classList.toggle('on', t === tab);
  }
}

// Copies text (downloads are blocked where the studio is hosted, so copying is the way out).
async function copy(button, text, what) {
  try { await navigator.clipboard.writeText(text); button.textContent = `${what} copied`; }
  catch { button.textContent = 'Copy blocked here'; }
  setTimeout(() => { button.textContent = `Copy ${what.toLowerCase()}`; }, 2500);
}
// The finished app as one HTML file, made the same way as the builder makes it (engine/page.js).
function appFile() {
  return appPage({ ...latest, built: new Date().toISOString().slice(0, 10) + ' (studio)' }, { css: APP_CSS, js: APP_JS, fontsLink: FONTS_LINK });
}

$('#tpl').addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(update, 300); });
$('#src').addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(update, 300); });
document.addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.pane) show(b.dataset.pane);
  if (b.dataset.example !== undefined) {
    const ex = EXAMPLES[+b.dataset.example];
    if (!$('#tpl').value.trim() || confirmReplace()) { $('#tpl').value = ex.template; $('#src').value = ex.source; update(); show('preview'); }
  }
  if (b.id === 'dl-app') copy(b, appFile(), 'App code');      // paste into a file ending .html to keep the app
  if (b.id === 'dl-tpl') copy(b, $('#tpl').value, 'Template');
});
// Asking before replacing typed work, without a browser dialog: a second tap within 4 s confirms.
let armed = 0;
function confirmReplace() {
  if (Date.now() - armed < 4000) return true;
  armed = Date.now(); $('#count').textContent = 'Tap the example again to replace your template.'; return false;
}
$('#examples').innerHTML = EXAMPLES.map((x, i) => `<button data-example="${i}">${esc(x.name)}</button>`).join('');
$('#tpl').value = store.get('studio-template') ?? EXAMPLES[0].template;
$('#src').value = store.get('studio-source') ?? EXAMPLES[0].source;
update();
show('template');
