// Runtime behaviour the reviewer found broken: Back keeps the clock, timers fire on any tab, deadlines can't be pushed back.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync } from 'node:fs';
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
