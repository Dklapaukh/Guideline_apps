// Runtime behaviour the reviewer found broken: Back keeps the clock, timers fire on any tab, deadlines can't be pushed back.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { buildGuideline } from '../tools/build.mjs';
import { openApp } from './helpers/fake-browser.mjs';

// Builds a template (and, if given, the saved guideline text it quotes) into a scratch folder and opens the app.
function appFrom(template, source = '') {
  const dir = mkdtempSync(path.join(tmpdir(), 'ga-rt-'));
  writeFileSync(path.join(dir, 'template.md'), template);
  if (source) writeFileSync(path.join(dir, 'source.txt'), source);
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

const SEA = `# Sea test
## Inputs
- Crew: choice: One | Two
## Steps
### a: Overboard
Say: Shout
Quote: "Shout <loudly>" (p1)
Tip: One person calls while the <b>skipper</b> steers
More: First extra
Quote: "Extra <i>one</i>" (p2)
Say: Main line two
More: Second extra [if Crew = Two]
Timer: 1 minute -> b
Quote: "within 1 minute"
Next: b
### b: After
Location: Where it happened
Say: Done
End:
`;
const SEA_SOURCE = 'You should Shout <loudly> at once.';

test('"Tip:" draws the app-tip badge; "More:" lines share one collapsed fold below the main lines', () => {
  const app = appFrom(SEA, SEA_SOURCE);
  app.click('[data-input="crew"][data-value="Two"]');
  app.click('[data-act="begin"]');
  const tip = app.$('.tip');
  assert.equal(tip.querySelector('.tip-badge').textContent, 'App tip · not from the guideline');
  assert.equal(tip.querySelector('b'), null, 'tip text is not HTML');
  assert.match(tip.textContent, /One person calls while the <b>skipper<\/b> steers/);
  const folds = app.$$('details.more');
  assert.equal(folds.length, 1, 'several More lines share one fold');
  assert.equal(folds[0].open, false, 'the fold starts closed');
  assert.equal(folds[0].querySelector('summary').textContent, 'More detail');
  assert.deepEqual([...folds[0].querySelectorAll('.more-line')].map((p) => p.textContent), ['First extra', 'Second extra']);
  assert.doesNotMatch(folds[0].textContent, /Main line two|Shout/, 'other lines stay outside the fold');
  const pos = (a, b) => a.compareDocumentPosition(b) & app.window.Node.DOCUMENT_POSITION_FOLLOWING;
  assert.ok(pos([...app.$$('main p')].find((p) => p.textContent === 'Main line two'), folds[0]), 'the fold comes after the main lines');
  assert.ok(pos(folds[0], app.$('[data-act="next"]')), 'and before the buttons');
  // A More line hidden by its condition is left out; a fold with nothing in it is not drawn.
  app.click('[data-tab="about"]'); app.click('[data-input="crew"][data-value="One"]'); app.click('[data-tab="steps"]');
  assert.deepEqual(app.$$('details.more .more-line').map((p) => p.textContent), ['First extra']);
  app.click('[data-act="next"]');
  assert.equal(app.$('details.more'), null);
  assert.deepEqual(app.errors, []);
});

test('each screen shows its quotes in ONE collapsed "Sources for this screen" fold, HTML escaped, with unconfirmed quotes flagged', () => {
  const app = appFrom(SEA, SEA_SOURCE);
  app.click('[data-act="begin"]');
  const folds = app.$$('details.sources');
  assert.equal(folds.length, 1, 'one Sources fold per screen');
  assert.equal(folds[0].open, false, 'the fold starts closed');
  assert.match(folds[0].querySelector('summary').textContent, /^Sources for this screen \(3\)$/);
  assert.equal(app.$$('main q').length, 3);
  assert.ok(app.$$('main q').every((q) => q.closest('details.sources') === folds[0]), 'no quote is drawn outside the fold');
  assert.equal(app.$('details.src'), null, 'no per-line "Guideline" links any more');
  const items = folds[0].querySelectorAll('.src-list li');
  assert.deepEqual([...items].map((li) => li.querySelector('q').textContent), ['within 1 minute', 'Shout <loudly>', 'Extra <i>one</i>'], 'in screen order: the timer (drawn at the top) first, then the lines');
  assert.equal(folds[0].querySelector('loudly'), null); assert.equal(folds[0].querySelector('i'), null, 'quotes are text, never HTML');
  assert.equal(items[1].querySelector('.where').textContent, 'p1');
  assert.match(items[1].querySelector('.for').textContent, /Supports: "Shout"/);
  assert.match(items[2].querySelector('.for').textContent, /Supports: "First extra"/);
  assert.match(items[0].querySelector('.for').textContent, /Supports: the timer \(1 minute\)/);
  assert.equal(items[1].querySelector('.src-flag'), null, 'a quote found in the guideline has no flag');
  assert.match(items[0].querySelector('.src-flag').textContent, /quote not confirmed/);
  assert.match(items[2].querySelector('.src-flag').textContent, /quote not confirmed/);
  app.click('[data-act="next"]');
  assert.equal(app.$('details.sources'), null, 'a screen without quotes has no Sources fold');
});

// Gives the fake browser a GPS (or takes it away): fix = a function (ok, err, options) => void.
const gps = (app, fix) => Object.defineProperty(app.window.navigator, 'geolocation', { configurable: true, value: fix ? { getCurrentPosition: fix } : undefined });
const NO_GPS = "This phone or page can't share its location here. Type the position instead.";

test('"Location:" fills the box from the phone\'s GPS, saves it to the Log, and keeps it through Back and to the Finished screen', () => {
  const app = appFrom(SEA, SEA_SOURCE);
  app.click('[data-act="begin"]'); app.click('[data-act="next"]');
  assert.equal(app.$(`label[for="${app.$('textarea[data-note]').id}"]`).textContent, 'Where it happened');
  const asked = [];
  gps(app, (ok, err, options) => { asked.push(options); ok({ coords: { latitude: -41.2853812, longitude: 174.7761234, accuracy: 12.4 }, timestamp: app.now }); });
  app.advance(60000);
  app.click('[data-gps="b:0"]');
  assert.equal(asked.length, 1); assert.equal(asked[0].enableHighAccuracy, true); assert.ok(asked[0].timeout > 0 && asked[0].timeout <= 60000);
  const want = `-41.28538, 174.77612 (±12 m, GPS at ${hhmm(app.now)})`;
  assert.equal(app.$('textarea[data-note="b:0"]').value, want);
  assert.equal(app.$('[data-gps-ddm="b:0"]').textContent, "Degrees and minutes: 41°17.123'S 174°46.567'E");
  const entry = app.state.log.at(-1);
  assert.equal(entry.what, 'Where it happened');
  assert.equal(entry.detail, `${want} · 41°17.123'S 174°46.567'E`);
  assert.match(app.$('[data-note-status="b:0"]').textContent, /Saved in the Log at/);
  assert.equal(app.$('[data-gps-msg="b:0"]').textContent, '', 'no second message: the status line is the one confirmation');
  assert.equal(app.$('.loc-box').textContent.match(/[Ss]aved in the Log/g).length, 1, 'the box says "saved" once');
  app.click('[data-act="back"]'); app.click('[data-act="next"]');
  assert.equal(app.$('textarea[data-note="b:0"]').value, want, 'the box keeps the position after Back');
  app.click('[data-act="finish"]');
  assert.match(app.text(), /41°17\.123'S 174°46\.567'E/, 'the Finished screen lists the position');
  assert.deepEqual(app.errors, []);
});

test('"Location:" with GPS refused, failing, unusable or missing shows a plain message and the box can still be typed in', () => {
  const cases = {
    refused: (ok, err) => err({ code: 1, message: 'User denied Geolocation' }),
    broken: () => { throw new Error('blocked by permissions policy'); },
    unusable: (ok) => ok({ coords: { latitude: NaN, longitude: 'x' } }),
    missing: null,
  };
  for (const [name, fix] of Object.entries(cases)) {
    const app = appFrom(SEA, SEA_SOURCE);
    app.click('[data-act="begin"]'); app.click('[data-act="next"]');
    gps(app, fix);
    app.click('[data-gps="b:0"]');
    assert.equal(app.$('[data-gps-msg="b:0"]').textContent, NO_GPS, name);
    assert.equal(app.$('textarea[data-note="b:0"]').value, '', name);
    app.type('textarea[data-note="b:0"]', '2 nm east of the <b>lighthouse</b>');
    assert.equal(app.state.log.at(-1).detail, '2 nm east of the <b>lighthouse</b>', name);
    assert.equal(app.$('[data-gps-ddm="b:0"]').textContent, '', `${name}: no degrees line for a typed bearing`);
    assert.equal(app.$('main b'), null, `${name}: typed text is not HTML`);
    assert.deepEqual(app.errors, [], name);
  }
  // A page where even asking for navigator.geolocation throws (some sandboxes) is handled the same way.
  const app = appFrom(SEA, SEA_SOURCE);
  app.click('[data-act="begin"]'); app.click('[data-act="next"]');
  Object.defineProperty(app.window.navigator, 'geolocation', { configurable: true, get() { throw new Error('no'); } });
  app.click('[data-gps="b:0"]');
  assert.equal(app.$('[data-gps-msg="b:0"]').textContent, NO_GPS);
  assert.deepEqual(app.errors, []);
});

test('the Rescue look applies from the template and the picker, with extra-large tap targets, and keeps the brand as a stripe', () => {
  const app = appFrom(B.replace('Look: wayfinding', 'Look: Rescue'));
  const html = app.window.document.documentElement;
  assert.equal(html.dataset.look, 'rescue');
  assert.equal(html.style.getPropertyValue('--brand'), '#1d4ed8');
  const css = [...app.window.document.querySelectorAll('style')].map((s) => s.textContent).join('\n');
  assert.match(css, /html\[data-look="rescue"\] \.big\.go\{/, 'the rescue sheet is in the app, scoped to its look');
  assert.match(css, /html\[data-look="rescue"\] \.bar\{[^}]*border-bottom:6px solid var\(--brand, var\(--orange\)\)/, 'a brand colour is a stripe under the top bar');
  const rescue = readFileSync(new URL('../engine/looks/rescue.css', import.meta.url), 'utf8');
  for (const m of rescue.matchAll(/min-height:(\d+)px/g)) assert.ok(+m[1] >= 64, `tap targets in Rescue are at least 64px (found ${m[0]})`);
  app.click('[data-tab="about"]');
  assert.ok(app.$('[data-look-pick="rescue"]').className.includes('on'));
  app.click('[data-look-pick="clinic"]'); assert.equal(html.dataset.look, 'clinic');
  app.click('[data-look-pick="rescue"]'); assert.equal(html.dataset.look, 'rescue');
  assert.deepEqual(app.errors, []);
});

test('a Record button says "Not tapped yet" until tapped, then the count and time', () => {
  const app = appFrom(D);
  app.type('[data-num="weight"]', '8');
  app.click('[data-act="begin"]');
  const status = () => app.$('[data-rec-name="Dose given"]').textContent;
  assert.equal(status(), 'Not tapped yet');
  assert.doesNotMatch(app.text(), /\bnot yet\b/, 'no bare "not yet" that reads like an instruction');
  app.click('[data-rec="Dose given"]');
  assert.match(status(), /^1× · last at \d\d:\d\d/);
});

test('the Log shows each answer with the step it was given on, before the next step', () => {
  const app = appFrom(`# Answer log
## Steps
### a: Watch them
Ask: Can you see them?
- Yes -> b
- No -> b
### b: Stop the boat
Ask: Ready?
- Done -> end
`);
  app.click('[data-act="begin"]');
  app.click('[data-opt="1"]');
  app.click('[data-opt="0"]');
  const rows = JSON.parse(JSON.stringify(app.state.log.map((e) => [e.what, e.detail])));   // plain arrays (the log lives in the page's realm)
  assert.deepEqual(rows, [['Started', ''], ['Watch them', ''], ['Can you see them?', 'No'], ['Stop the boat', ''], ['Ready?', 'Done'], ['Finished', '']]);
  app.click('[data-tab="log"]');
  const items = app.$$('.log li').map((li) => li.textContent.replace(/\s+/g, ' '));
  assert.ok(items.some((t) => /Can you see them\? No$/.test(t)));
  assert.ok(items.every((t) => !/Stop the boat .*No/.test(t)), 'the answer is not printed on the next step\'s line');
});

test('tips are lighter than the guideline\'s own lines in every look, and the badge stays bold', () => {
  const read = (f) => readFileSync(new URL(`../engine/${f}`, import.meta.url), 'utf8');
  // The last value a sheet gives a property inside rules whose selector includes the given class (null if none).
  const prop = (css, cls, name) => { let v = null; for (const m of css.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/([^{}]+)\{([^{}]*)\}/g)) if (m[1].split(',').some((x) => x.trim().endsWith(cls))) { const p = new RegExp(`(?:^|;)\\s*${name}\\s*:\\s*([^;]+)`).exec(m[2]); if (p) v = p[1].trim(); } return v; };
  const weight = (v) => ({ normal: 400, bold: 700 }[v] ?? Number(v));
  const base = read('runtime.css');
  assert.equal(weight(prop(base, '.tip-text', 'font-weight')), 400);
  assert.equal(prop(base, '.tip-text', 'color'), 'var(--mut)', 'tip text is muted');
  for (const look of ['clinic', 'wayfinding', 'flightdeck', 'rescue']) {
    const css = read(`looks/${look}.css`);
    const w = prop(css, '.tip-text', 'font-weight');
    assert.ok(w === null || weight(w) <= 400, `${look}: tip text is not bold (${w})`);
    const bw = prop(css, '.tip-badge', 'font-weight') ?? prop(base, '.tip-badge', 'font-weight');
    assert.ok(weight(bw) >= 700, `${look}: the badge stays bold`);
    assert.notEqual(prop(css, '.tip', 'background'), '#0057b8', `${look}: no solid colour block louder than the instructions`);
  }
  const app = appFrom(SEA, SEA_SOURCE);
  app.click('[data-act="begin"]');
  assert.equal(app.$('.tip .tip-badge').textContent, 'App tip · not from the guideline');
});
