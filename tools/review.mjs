/* DESIGN REVIEW PAGE: one phone page that shows a built app in each design "look" (engine/looks/*.css),
   with one-tap reactions and a comment box per look. Feedback is saved in the published page's database
   (collections "reactions" and "comments"), which the next run reads.
   Usage: node tools/review.mjs [guideline-id]     (default: the newest guideline)   -> site/review.html */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { ROOT, nzDate } from './build.mjs';

// The looks on show, with the field each one borrows from and its web fonts (fallbacks are in each CSS file).
export const LOOKS = [
  { id: 'clinic', name: 'Clinic', from: 'Patient and wellbeing apps: calm cards, one teal action colour, soft and friendly.',
    fonts: 'family=Inter:wght@400;600;700' },
  { id: 'flightdeck', name: 'Flight deck', from: 'Aviation checklists and cockpit displays: dark, high contrast, built for stress and low light.',
    fonts: 'family=IBM+Plex+Sans:wght@400;500;700&family=IBM+Plex+Sans+Condensed:wght@600;700&family=IBM+Plex+Mono:wght@500' },
  { id: 'wayfinding', name: 'Wayfinding', from: 'Transit maps and road signs: bold type, actions as stations on a line, sign-yellow cautions.',
    fonts: 'family=Archivo:wght@500;700;800;900' },
];

// A built app file with one look added: the look's fonts and CSS go after the base stylesheet, so they win.
export function withLook(appHtml, look) {
  const css = readFileSync(path.join(ROOT, 'engine/looks', look.id + '.css'), 'utf8');
  return appHtml
    .replace('<html lang="en">', `<html lang="en" data-look="${look.id}">`)
    .replace('</head>', `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${look.fonts}&display=swap">\n<style>${css}</style></head>`);
}

const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

if (process.argv[1] && path.resolve(process.argv[1]) === path.join(ROOT, 'tools/review.mjs')) {
  const ids = readdirSync(path.join(ROOT, 'guidelines')).filter((d) => existsSync(path.join(ROOT, 'guidelines', d, 'app.html'))).sort();
  const id = process.argv[2] ?? ids.at(-1);
  const app = readFileSync(path.join(ROOT, 'guidelines', id, 'app.html'), 'utf8');
  const title = JSON.parse(readFileSync(path.join(ROOT, 'guidelines', id, 'spec.json'), 'utf8')).title;
  const round = `${nzDate()} ${id}`;   // tags each piece of feedback with what was on show
  const page = readFileSync(path.join(ROOT, 'studio/review.html'), 'utf8')
    .replace('{{TITLE}}', () => esc(title))
    .replace('/*DATA*/', () => JSON.stringify({ round, looks: LOOKS.map((l) => ({ id: l.id, name: l.name, from: l.from, html: withLook(app, l) })) })
      .replace(/<\/(script)/gi, '<\\/$1').replace(/<!--/g, '<\\!--'));
  writeFileSync(path.join(ROOT, 'site/review.html'), page);
  console.log('site/review.html', round);
}
