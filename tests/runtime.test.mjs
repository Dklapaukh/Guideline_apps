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

const D = `# Details test
## Inputs
- Weight (kg): number, 1-100
- Group: choice: Adult | Child
## Tables
### Dose
Key: Weight
| Weight | Dose |
|---|---|
| up to 10 | 1 mg |
| over 10 | - |
## Steps
### a: Look up
Show: Dose
Say: Adults only [if Group = Adult]
Record: Dose given
Remind: every 5 minutes: Recheck
Next: b
### b: Stop it
Stop: Recheck
End:
`;

test('details pick the table row and the lines shown; "-" reads "Not stated"; Record counts; Stop ends a reminder', () => {
  const app = appFrom(D);
  app.type('[data-num="weight"]', '8');
  app.click('[data-input="group"][data-value="Child"]');
  app.click('[data-act="begin"]');
  assert.match(app.text(), /1 mg/);
  assert.doesNotMatch(app.text(), /Adults only/, 'a line whose condition is false is hidden');
  app.click('[data-rec="Dose given"]'); app.click('[data-rec="Dose given"]');
  assert.equal(app.state.records['Dose given'].n, 2);
  assert.ok(app.$('.rem'), 'the reminder is running');
  app.click('[data-act="next"]');
  assert.equal(app.$('.rem'), null, 'Stop: ended the reminder');
  app.click('[data-act="back"]');
  app.click('[data-tab="about"]'); app.type('[data-num="weight"]', '20'); app.click('[data-tab="steps"]');
  assert.match(app.text(), /Not stated in the guideline/);
});

test('a Record tap and the Log show the clock time of day, for handover', () => {
  const app = appFrom(D);
  app.type('[data-num="weight"]', '8');
  app.click('[data-act="begin"]');
  app.advance(120000);
  app.click('[data-rec="Dose given"]');
  const at = new Date(app.state.records['Dose given'].last);
  const hhmm = `${String(at.getHours()).padStart(2, '0')}:${String(at.getMinutes()).padStart(2, '0')}`;
  assert.match(app.text(), new RegExp(`last at ${hhmm}`), 'the Record button says the time of day');
  app.click('[data-tab="log"]');
  assert.match(app.$('.log').textContent, new RegExp(`2:00\\s+${hhmm}\\s+Dose given`), 'the Log shows time since start and time of day');
});

const W = `# Write test
## Steps
### a: During the call
Write: Caller's exact words
Write: <b>Where</b> is it?
Next: b
### b: After
Say: Done
End:
`;
// The time of day as the app writes it ("14:32"), from a time in ms.
const hhmm = (ms) => { const d = new Date(ms); return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; };
// Types into a box without leaving it (an "input" event only, as each key press does).
const keyIn = (app, sel, text) => { const el = app.$(sel); el.value = text; el.dispatchEvent(new app.window.Event('input', { bubbles: true })); };

test('"Write:" draws one labelled box per line; leaving a box saves it to the Log with both times', () => {
  const app = appFrom(W);
  app.click('[data-act="begin"]');
  const boxes = app.$$('textarea[data-note]');
  assert.equal(boxes.length, 2);
  assert.equal(app.$(`label[for="${boxes[0].id}"]`).textContent, "Caller's exact words", 'the label belongs to its box');
  app.advance(90000);
  app.type('textarea[data-note="a:0"]', 'It will go off at noon');
  const entry = app.state.log.at(-1);
  assert.equal(entry.what, "Caller's exact words"); assert.equal(entry.detail, 'It will go off at noon');
  assert.match(app.$('[data-note-status="a:0"]').textContent, new RegExp(`Saved in the Log at ${hhmm(entry.at)} \\(1:30 after start\\)`));
  app.type('textarea[data-note="a:0"]', 'It will go off at noon');
  assert.equal(app.state.log.filter((e) => e.what === "Caller's exact words").length, 1, 'saving the same text again adds nothing');
  app.click('[data-tab="log"]');
  assert.match(app.$('.log').textContent, new RegExp(`1:30\\s+${hhmm(entry.at)}\\s+Caller's exact words\\s+It will go off at noon`));
});

test('"Save to Log" saves typed text; boxes keep their text through Next and Back; unsaved text is saved on leaving the step', () => {
  const app = appFrom(W);
  app.click('[data-act="begin"]');
  keyIn(app, 'textarea[data-note="a:1"]', 'In the car park');
  assert.match(app.$('[data-note-status="a:1"]').textContent, /Not saved yet/);
  app.click('[data-note-save="a:1"]');
  assert.equal(app.state.log.at(-1).detail, 'In the car park');
  keyIn(app, 'textarea[data-note="a:0"]', 'Typed, then Next tapped');
  app.click('[data-act="next"]');
  assert.ok(app.state.log.some((e) => e.what === "Caller's exact words" && e.detail === 'Typed, then Next tapped'), 'unsaved text is logged before moving on');
  app.click('[data-act="back"]');
  assert.equal(app.$('textarea[data-note="a:0"]').value, 'Typed, then Next tapped');
  assert.equal(app.$('textarea[data-note="a:1"]').value, 'In the car park');
  app.click('[data-act="next"]'); app.click('[data-act="finish"]');
  assert.match(app.text(), /In the car park/, 'the finished screen lists the note');
});

test('text in a box is shown as text, never as HTML; a damaged saved run does not stop the app', () => {
  const app = appFrom(W);
  app.click('[data-act="begin"]');
  assert.equal(app.$('.note-lbl b'), null, 'the label is not HTML');
  assert.match(app.$$('.note-lbl')[1].textContent, /<b>Where<\/b>/);
  const evil = '</textarea><img src=x onerror="window.hacked=1"><b>bold</b>';
  app.type('textarea[data-note="a:0"]', evil);
  app.click('[data-tab="log"]');
  assert.equal(app.$('.log img'), null); assert.equal(app.$('.log b'), null);
  app.click('[data-tab="steps"]');
  assert.equal(app.$('main img'), null);
  assert.equal(app.$('textarea[data-note="a:0"]').value, evil);
  assert.equal(app.window.hacked, undefined);
  assert.deepEqual(app.errors, []);
  // A saved run whose notes are damaged: the app carries on.
  const dir = mkdtempSync(path.join(tmpdir(), 'ga-rt-'));
  writeFileSync(path.join(dir, 'template.md'), W);
  buildGuideline(dir, { built: 'test' });
  const file = path.join(dir, 'app.html');
  const saved = JSON.stringify({ screen: 'run', current: 'a', startedAt: 1, enteredAt: 1, history: [], log: [], ticks: {}, reminders: {}, records: {},
    notes: { 'a:0': null, 'a:1': { text: 42 }, 'zz:9': 'junk', 'no-colon': { label: 7 } } });
  writeFileSync(file, readFileSync(file, 'utf8').replace('<head>', `<head><script>localStorage.setItem('guideline-app:write-test', ${JSON.stringify(saved)})</script>`));
  const again = openApp(file);
  assert.equal(again.state.current, 'a');
  assert.equal(again.$('textarea[data-note="a:1"]').value, '42');
  again.type('textarea[data-note="a:0"]', 'ok');
  again.click('[data-act="next"]'); again.click('[data-act="finish"]');
  assert.deepEqual(again.errors, []);
});
