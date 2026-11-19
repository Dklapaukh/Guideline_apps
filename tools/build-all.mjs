/* Builds every guideline app, the studio (template -> app website) and the dashboard into site/.
   Usage: node tools/build-all.mjs [--date YYYY-MM-DD]
   site/ is what gets published: site/apps/<id>.html, site/studio.html, site/dashboard.html. */
import { readdirSync, existsSync, readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import path from 'node:path';
import { buildSync } from 'esbuild';
import { ROOT, buildGuideline, bundle, nzDate, appCss, fontsLink } from './build.mjs';
import { escapeHtml as esc, scriptSafe } from '../engine/page.js';

const date = process.argv.includes('--date') ? process.argv[process.argv.indexOf('--date') + 1] : nzDate();
const G = path.join(ROOT, 'guidelines'), SITE = path.join(ROOT, 'site');
mkdirSync(path.join(SITE, 'apps'), { recursive: true });
// Reads a JSON file, or gives the fallback if it is missing or broken.
const readJson = (p, fallback) => { try { return existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : fallback; } catch { console.log('Could not read ' + p); return fallback; } };

// 1. Every guideline
const rows = [];
for (const id of readdirSync(G).filter((d) => existsSync(path.join(G, d, 'template.md'))).sort()) {
  const dir = path.join(G, id);
  const { spec, summary } = buildGuideline(dir, { built: date });
  copyFileSync(path.join(dir, 'app.html'), path.join(SITE, 'apps', id + '.html'));
  rows.push({ id, title: spec.title, meta: readJson(path.join(dir, 'meta.json'), {}), summary });
  console.log(id.padEnd(28), JSON.stringify(summary));
}

// 2. The studio, with the finished-app code inside it so "Download app" works offline
const css = appCss();
const examples = [{ name: 'Blank template', template: readFileSync(path.join(ROOT, 'template/guideline-template.md'), 'utf8'), source: '' },
  ...rows.map((r) => ({ name: r.title, template: readFileSync(path.join(G, r.id, 'template.md'), 'utf8'), source: existsSync(path.join(G, r.id, 'source.txt')) ? readFileSync(path.join(G, r.id, 'source.txt'), 'utf8') : '' }))];
const studioJs = buildSync({ entryPoints: [path.join(ROOT, 'studio/studio-entry.js')], bundle: true, format: 'iife', write: false, target: 'es2020',
  define: { APP_JS: JSON.stringify(bundle('engine/app-entry.js')), APP_CSS: JSON.stringify(css), FONTS_LINK: JSON.stringify(fontsLink()), EXAMPLES: JSON.stringify(examples) } }).outputFiles[0].text;
const studioHtml = readFileSync(path.join(ROOT, 'studio/studio.html'), 'utf8')
  .replace('/*APP_CSS*/', () => css).replace('<!--FONTS-->', () => fontsLink()).replace('/*STUDIO_JS*/', () => scriptSafe(studioJs)).replace('{{DATE}}', () => date);  // functions: no $-pattern surprises
writeFileSync(path.join(SITE, 'studio.html'), studioHtml);

// 3. The dashboard
const registry = readJson(path.join(ROOT, 'registry.json'), { apps: {} });
const latestRun = existsSync(path.join(ROOT, 'runs/LATEST.md')) ? readFileSync(path.join(ROOT, 'runs/LATEST.md'), 'utf8') : 'No build run yet.';
const curriculum = existsSync(path.join(ROOT, 'docs/CURRICULUM.md')) ? readFileSync(path.join(ROOT, 'docs/CURRICULUM.md'), 'utf8') : '';
writeFileSync(path.join(SITE, 'dashboard.html'), dashboardHtml({ rows, registry, latestRun, curriculum, date }));
console.log('site/ built', date);

// The dashboard page: a card per app (scores, status, link), the latest run report and the guideline queue.
function dashboardHtml({ rows, registry, latestRun, curriculum, date }) {
  const link = (id) => registry.apps?.[id]?.url;
  const pct = (a, b) => (b ? Math.round((100 * a) / b) + '%' : '-');
  const queue = [...curriculum.matchAll(/^\|\s*(\d+)\s*\|([^|]*)\|([^|]*)\|([^|]*)\|([^|]*)\|/gm)].map((m) => m.slice(1).map((s) => s.trim()));
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Guideline Apps dashboard</title><style>
:root{--ink:#1b1f24;--mut:#5d6670;--line:#dde1e6;--bg:#f4f5f7}
body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
main{max-width:640px;margin:0 auto;padding:12px}
header{background:#14213d;color:#fff;padding:14px 16px}header h1{margin:0;font-size:20px}header p{margin:4px 0 0;opacity:.8;font-size:14px}
.card{background:#fff;border:1px solid var(--line);border-radius:12px;padding:12px 14px;margin:10px 0}
.card h2{font-size:17px;margin:0 0 4px}.card a.open{display:inline-block;margin-top:8px;padding:10px 14px;background:#0b6e4f;color:#fff;border-radius:8px;text-decoration:none;font-weight:600}
.tags span{display:inline-block;font-size:12px;padding:2px 8px;border-radius:999px;background:#eef1f4;margin:2px 4px 2px 0}
.n{display:flex;gap:6px;flex-wrap:wrap;margin-top:6px}.n div{flex:1;min-width:90px;background:#f7f8fa;border-radius:8px;padding:6px 8px;font-size:13px;color:var(--mut)}.n b{display:block;font-size:18px;color:var(--ink)}
.fix b{color:#b91c1c}.check b{color:#9a3412}
pre{white-space:pre-wrap;font:14px/1.45 ui-monospace,Menlo,monospace;background:#fff;border:1px solid var(--line);border-radius:12px;padding:12px}
table{border-collapse:collapse;width:100%;font-size:14px;background:#fff}td,th{border:1px solid var(--line);padding:4px 6px;text-align:left}
h3{font-size:14px;text-transform:uppercase;letter-spacing:.04em;color:var(--mut);margin:18px 0 6px}
</style></head><body><header><h1>Guideline Apps</h1><p>Prototype builder · ${rows.length} app${rows.length === 1 ? '' : 's'} · updated ${esc(date)}</p></header><main>
${registry.studio?.url ? `<div class="card"><h2>Studio</h2><p>Paste a filled-in template, see the checks and the app. No AI.</p><a class="open" href="${esc(registry.studio.url)}" target="_blank" rel="noopener">Open studio</a></div>` : ''}
${registry.review?.url ? `<div class="card"><h2>Design review</h2><p>See the newest app in each candidate look and tap a reaction. Your choices steer the next builds.</p><a class="open" href="${esc(registry.review.url)}" target="_blank" rel="noopener">Review the looks</a></div>` : ''}
<h3>Apps</h3>
${rows.map((r) => { const s = r.summary, m = r.meta; return `<div class="card"><h2>${esc(r.title)}</h2>
<div class="tags"><span>${esc(m.domain ?? '')}</span><span>level ${esc(m.level ?? '?')}</span><span>source: ${esc(m.sourceCopy ?? 'unknown')}</span>${m.builtBy ? `<span>${esc(m.builtBy)}</span>` : ''}</div>
<div class="n"><div class="fix"><b>${s.fix}</b>to fix</div><div class="check"><b>${s.check}</b>to check</div><div><b>${s.quotesExact}/${s.quotes}</b>quotes confirmed</div><div><b>${s.reachable}/${s.steps}</b>steps reachable</div><div><b>${pct(s.sourceAmountsUsed, s.sourceAmounts)}</b>guideline numbers used</div></div>
${m.status ? `<p>${esc(m.status)}</p>` : ''}
${link(r.id) ? `<a class="open" href="${esc(link(r.id))}" target="_blank" rel="noopener">Open app</a>` : '<p><i>Not published yet</i></p>'}</div>`; }).join('')}
<h3>Latest run</h3><pre>${esc(latestRun)}</pre>
${queue.length ? `<h3>Guideline queue</h3><table><tr><th>#</th><th>Guideline</th><th>Type</th><th>Level</th><th>Status</th></tr>${queue.map((q) => `<tr>${q.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</table>` : ''}
</main></body></html>
`;
}
