/* DESIGN REVIEW PAGE: one phone page that shows a built app in each design "look" (engine/looks.js),
   with one-tap reactions and a comment box per look. Feedback is saved in the published page's database
   (collections "reactions" and "comments"), which the next run reads.
   Usage: node tools/review.mjs [guideline-id]     (default: the newest guideline)   -> site/review.html */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { ROOT, nzDate } from './build.mjs';
import { LOOKS } from '../engine/looks.js';
import { escapeHtml as esc, scriptSafe } from '../engine/page.js';

// A built app file shown in one fixed look (all looks are already inside every app; this picks one and hides
// the app's own look picker, so each review tab shows exactly the look being judged).
export function withLook(appHtml, look) {
  return appHtml.replace('<html lang="en">', `<html lang="en" data-look="${look.id}" data-look-lock>`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.join(ROOT, 'tools/review.mjs')) {
  const ids = readdirSync(path.join(ROOT, 'guidelines')).filter((d) => existsSync(path.join(ROOT, 'guidelines', d, 'app.html'))).sort();
  const id = process.argv[2] ?? ids.at(-1);
  const app = readFileSync(path.join(ROOT, 'guidelines', id, 'app.html'), 'utf8');
  const title = JSON.parse(readFileSync(path.join(ROOT, 'guidelines', id, 'spec.json'), 'utf8')).title;
  const round = `${nzDate()} ${id}`;   // tags each piece of feedback with what was on show
  const page = readFileSync(path.join(ROOT, 'studio/review.html'), 'utf8')
    .replace('{{TITLE}}', () => esc(title))
    .replace('/*DATA*/', () => scriptSafe(JSON.stringify({ round, looks: LOOKS.map((l) => ({ id: l.id, name: l.name, from: l.from, html: withLook(app, l) })) })));
  writeFileSync(path.join(ROOT, 'site/review.html'), page);
  console.log('site/review.html', round);
}
