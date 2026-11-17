/* BUILDER: template (+ saved guideline text) -> checked spec -> one self-contained HTML app file.
   No AI anywhere in here. Usage:  node tools/build.mjs guidelines/<id>      (one)
                                   node tools/build-all.mjs                 (all, plus dashboard and studio)
   Writes into the guideline folder: spec.json, findings.json, app.html. */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSync } from 'esbuild';
import { createHash } from 'node:crypto';
import { readTemplate } from '../engine/template.js';
import { checkSpec } from '../engine/check.js';

// Today's date in New Zealand (the owner's time zone), as YYYY-MM-DD.
export const nzDate = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Pacific/Auckland' }).format(new Date());

export const ROOT = fileURLToPath(new URL('..', import.meta.url));
const read = (p) => (existsSync(p) ? readFileSync(p, 'utf8') : '');

// Bundles a browser entry file (and everything it imports) into one plain script.
export function bundle(entry) {
  return buildSync({ entryPoints: [path.join(ROOT, entry)], bundle: true, format: 'iife', write: false, minify: false, target: 'es2020' }).outputFiles[0].text;
}
// Safe to put inside <script>: stops "</script" in data from ending the tag early.
export const scriptSafe = (text) => text.replace(/<\/(script)/gi, '<\\/$1').replace(/<!--/g, '<\\!--');

// Reads, checks and builds one guideline folder. Returns { spec, findings, summary }.
export function buildGuideline(dir, { built = nzDate(), outDir = dir } = {}) {
  const template = read(path.join(dir, 'template.md'));
  const sourceText = read(path.join(dir, 'source.txt'));
  let meta = {}, metaProblem = null;
  try { meta = existsSync(path.join(dir, 'meta.json')) ? JSON.parse(read(path.join(dir, 'meta.json'))) : {}; }
  catch (e) { metaProblem = `meta.json could not be read (${e.message}); built without it.`; }
  const first = readTemplate(template);
  if (metaProblem) first.findings.push({ level: 'fix', message: metaProblem });
  const { spec, findings, summary } = checkSpec(first.spec, { sourceText, findings: first.findings });
  if (meta.sourceCopy === 'web-fetch') findings.push({ level: 'info', message: 'The saved guideline text is a web copy made by a fetch tool and may not be word-perfect, so a "quote not found" may be the copy\'s fault. Add the PDF to sources/ for exact checking.' });
  summary.info = findings.filter((f) => f.level === 'info').length;
  // Keep the earlier build date when nothing changed, so an unchanged app's file stays byte-identical
  // (the nightly run republishes only apps whose site/apps file changed).
  const hash = createHash('sha256').update(JSON.stringify({ spec, findings, summary }) + bundle('engine/app-entry.js') + read(path.join(ROOT, 'engine/runtime.css'))).digest('hex').slice(0, 16);
  const stampFile = path.join(outDir, 'built.json');
  const previous = existsSync(stampFile) ? (() => { try { return JSON.parse(read(stampFile)); } catch { return {}; } })() : {};
  if (previous.hash === hash && previous.date) built = previous.date;
  writeFileSync(stampFile, JSON.stringify({ hash, date: built }) + '\n');
  const data = { spec, findings, summary, built };
  writeFileSync(path.join(outDir, 'spec.json'), JSON.stringify(spec, null, 1) + '\n');
  writeFileSync(path.join(outDir, 'findings.json'), JSON.stringify({ summary, findings }, null, 1) + '\n');
  writeFileSync(path.join(outDir, 'app.html'), appHtml(spec.title, data));
  return data;
}

export function appHtml(title, data) {
  const css = readFileSync(path.join(ROOT, 'engine/runtime.css'), 'utf8');
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#14213d">
<title>${title.replace(/</g, '&lt;')}</title>
<style>${css}</style></head>
<body><div id="app"></div>
<script type="application/json" id="spec">${scriptSafe(JSON.stringify(data))}</script>
<script>${scriptSafe(bundle('engine/app-entry.js'))}</script>
</body></html>
`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const dir = path.resolve(process.argv[2] ?? '.');
  const { summary } = buildGuideline(dir);
  console.log(path.basename(dir), JSON.stringify(summary));
}
