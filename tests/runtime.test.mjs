// Runtime behaviour the reviewer found broken: Back keeps the clock, timers fire on any tab, deadlines can't be pushed back.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { buildGuideline } from '../tools/build.mjs';
import { openApp } from './helpers/fake-browser.mjs';

function appFrom(template) {
  const dir = mkdtempSync(path.join(tmpdir(), 'ga-rt-'));
  writeFileSync(path.join(dir, 'template.md'), template);
  buildGuideline(dir, { built: 'test' });
  return openApp(path.join(dir, 'app.html'));
}
const T = `# Clock test
## Steps
### a: Wait
Remind: after 10 minutes: Deadline
Timer: 4 minutes -> b
Next: b
### b: Second
Do: Tick me
Next: a
`;

test('Back restores the step clock instead of restarting it', () => {
  const app = appFrom(T);
  app.click('[data-act="begin"]');
  app.advance(180000);                                   // 1 minute left on step a
  app.click('[data-act="next"]'); app.advance(5000);
  app.click('[data-act="back"]');
  assert.equal(app.$('[data-clock="timer"]').textContent, '0:55');
});

test('a timer finishes while another tab is open', () => {
  const app = appFrom(T);
  app.click('[data-act="begin"]');
  app.click('[data-tab="log"]');
  app.advance(241000);
  assert.equal(app.state.timerDone, true);
});

test('a deadline reminder is cleared by OK, never restarted; a repeated step starts with clear boxes', () => {
  const app = appFrom(T);
  app.click('[data-act="begin"]');
  app.click('[data-act="next"]');
  app.tick('[data-tick]'); assert.equal(app.$('[data-tick]').checked, true);
  app.click('[data-act="next"]'); app.click('[data-act="next"]');
  assert.equal(app.$('[data-tick]').checked, false);
  app.advance(600000);
  assert.match(app.$('.rem').className, /due/);
  app.click('[data-remdone]');
  assert.equal(app.$('.rem'), null);
});

const B = `# Brand app
Brand: Acme Ltd
Brand colour: #1d4ed8
Look: wayfinding
## Steps
### a: Only
Say: Hello
End:
`;

test('the template look and brand apply; the person can switch look and the choice is kept', () => {
  const app = appFrom(B);
  const html = app.window.document.documentElement;
  assert.equal(html.dataset.look, 'wayfinding');
  assert.equal(html.style.getPropertyValue('--brand'), '#1d4ed8');
  assert.match(app.$('.bar .t').textContent, /Acme Ltd/);
  app.click('[data-tab="about"]');
  app.click('[data-look-pick="flightdeck"]');
  assert.equal(html.dataset.look, 'flightdeck');
  assert.equal(app.window.localStorage.getItem('guideline-app-look'), 'flightdeck');
  assert.match(app.$('[data-look-pick="flightdeck"]').className, /on/);
});

test('with no look named the app opens in the default look; a locked page keeps its look and shows no picker', () => {
  const plain = appFrom(T);
  assert.equal(plain.window.document.documentElement.dataset.look, 'clinic');
  const dir = mkdtempSync(path.join(tmpdir(), 'ga-rt-'));
  writeFileSync(path.join(dir, 'template.md'), T);
  buildGuideline(dir, { built: 'test' });
  const file = path.join(dir, 'app.html');
  writeFileSync(file, readFileSync(file, 'utf8').replace('<html lang="en">', '<html lang="en" data-look="flightdeck" data-look-lock>'));
  const locked = openApp(file);
  locked.click('[data-tab="about"]');
  assert.equal(locked.window.document.documentElement.dataset.look, 'flightdeck');
  assert.equal(locked.$('[data-look-pick]'), null);
});
