// The template reader and checker: forgiving (never throw) and good at spotting mistakes.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readTemplate } from '../engine/template.js';
import { checkSpec } from '../engine/check.js';
import { findQuote } from '../engine/quotes.js';

const run = (text, sourceText = '') => { const r = readTemplate(text); return checkSpec(r.spec, { sourceText, findings: r.findings }); };
const has = (res, level, re) => res.findings.some((f) => f.level === level && re.test(f.message + ' ' + (f.suggestion ?? '')));

const MESSY = `# Messy
Source: Test guideline
## Inputs
- Weight (kg): number, 200-1
- Age group: choice: Adult | Child
## Tables
### Dose
Key: Weight
| Weight | Dose |
|---|---|
| 0-10 | 1 mg |
| 8-20 | 2 mg |
| 30-40 | 3 mg |
| 30-40 | 4 mg |
| 41+ | - |
## Steps
### start: Begin
Say: Give 10 minutes of cooling.
Quote: "Cool for 20 minutes" (p1)
Show: Dosage
Say: Only for kids [if Age group = Kid]
Say: Uses an unknown input [if Height > 3]
Ask: Is it bad?
- Yes -> secnd
- Yes -> start
Timer: 5 minutes -> nowhere
Timer: 7 minutes
### second: Second
Next: start
### orphan: Never reached
End:
### start: Duplicate name
Frobnicate: something odd
`;

test('a messy template is read without throwing, and every mistake becomes a prompt', () => {
  const res = run(MESSY, 'Cool for 20 minutes with running water.');
  assert.ok(has(res, 'check', /runs backwards/));
  assert.ok(has(res, 'check', /overlap/));
  assert.ok(has(res, 'check', /nothing covers values between 20 and 30/));
  assert.ok(has(res, 'check', /row "30-40" twice/));
  assert.ok(has(res, 'info', /Not stated in the guideline/));
  assert.ok(has(res, 'check', /says 10 minute, but its quote says 20 minute/));
  assert.ok(has(res, 'fix', /names a table that doesn't exist.*Did you mean "Dose"/));
  assert.ok(has(res, 'check', /"Kid", which is not one of its options/));
  assert.ok(has(res, 'fix', /"Height", which is not one of the inputs/));
  assert.ok(has(res, 'fix', /no step with that name.*Did you mean "second"/));
  assert.ok(has(res, 'check', /two timers/));
  assert.ok(has(res, 'check', /Nothing leads to "Never reached"/));
  assert.ok(has(res, 'fix', /Two steps are called "start"/));
  assert.ok(has(res, 'info', /"frobnicate:" is not a known line type/));
  assert.ok(has(res, 'check', /loop with no way to finish/));
});

test('a quote with a small typo is a "near" match that shows the guideline wording', () => {
  const r = findQuote('Cool the burn for 20 minuts under running water', 'First aid: Cool the burn for 20 minutes under cool running water. Then cover it.');
  assert.equal(r.found, 'near');
  assert.ok(r.missing.includes('minuts'));
  assert.equal(findQuote('cool  running\nwater', 'under cool running water.').found, 'exact');
});

test('random junk never makes the reader or checker throw', () => {
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const bits = ['# T', '## Steps', '## Inputs', '## Tables', '### a: A', '### b', 'Say: x', 'Ask: q', '- y -> b', '- n -> zz', 'Timer: 3 min -> a', 'Remind: every 2 min: r', 'Show: t', '| a | b |', '|---|---|', '| 1-2 | x |', '- W (kg): number, 1-9', 'Next: end', 'Quote: "x"', '[if W < 3]', 'Stop: all', 'End:', ':::', '', 'Timer: soon'];
  for (let i = 0; i < 300; i++) {
    const text = Array.from({ length: 5 + Math.floor(rnd() * 30) }, () => bits[Math.floor(rnd() * bits.length)] + (rnd() < 0.2 ? ' [if W > 2]' : '')).join('\n');
    assert.doesNotThrow(() => run(text, 'x y z 3 min'), text);
  }
});

test('review fixes: sentences with colons stay text, arrows in labels, quotes under timers, names in any script', () => {
  const res = run(`# T
## Inputs
- 体重 (kg): number, 1-100
- 年龄: choice: 成人 | 儿童
## Steps
### a: First
Stop the bleeding: press firmly on the wound
End the call: only when told to
Say: Cool for 20 minutes
Remind: every 5-10 minutes: Recheck
Quote: "recheck every 5 to 10 minutes"
- Breathing → normal -> b
- Go to hospital -> b
- Then go to the sink and wash hands
### b: Second
End:
`, 'Cool for 20 minutes. recheck every 5 to 10 minutes');
  const a = res.spec.steps[0];
  assert.equal(a.lines.filter((l) => l.kind === 'say').length, 4, 'both colon sentences and the bullet are shown as text');
  assert.equal(a.end, false); assert.equal(a.stop, null);
  assert.deepEqual(a.ask.options.map((o) => [o.label, o.target]), [['Breathing → normal', 'b'], ['Go to hospital', 'b']]);
  assert.equal(a.reminders[0].quotes.length, 1);
  assert.ok(!has(res, 'check', /says 20 minute/), 'no false contradiction from a quote under a reminder');
  assert.equal(res.spec.inputs.length, 2, 'two inputs named in Chinese are both kept');
});

test('review fixes: decimal gaps, choice-keyed tables, "or" across details', () => {
  const res = run(`# T
## Inputs
- Weight (kg): number, 1-100
- Group: choice: Adult | Child | Infant
## Tables
### Dose
Key: Weight
| Weight | Dose |
|---|---|
| 5–10 kg | 1 mg |
| 11-20 kg | 2 mg |
### Size
Key: Group
| Group | Size |
|---|---|
| Adult | 4 |
| Children | 3 |
## Steps
### a: A
Show: Dose
Show: Size
Say: x [if Group = Child or Weight < 10]
End:
`);
  assert.ok(has(res, 'check', /nothing covers values between 10 and 11/));
  assert.ok(has(res, 'check', /row "Children" is not one of.*Did you mean "Child"/));
  assert.ok(has(res, 'check', /no row for "Infant"/));
  assert.ok(has(res, 'fix', /"or" between two different details/));
});

test('branding and look: bad colour, hard-to-read colour and unknown look become findings, never errors', () => {
  const T = (top) => `# Brand test\nSource: Test\n${top}\n## Steps\n### a: Only\nSay: Hello\nEnd:\n`;
  const bad = run(T('Brand: Acme\nBrand colour: blue-ish'));
  assert.ok(has(bad, 'fix', /not a colour/)); assert.equal(bad.spec.brand.colour, ''); assert.equal(bad.spec.brand.name, 'Acme');
  const light = run(T('Brand colour: #ffe066'));
  assert.ok(has(light, 'check', /hard to read/)); assert.equal(light.spec.brand.colour, '#ffe066');
  const good = run(T('Brand colour: #1D4ED8\nLook: Flight deck'));
  assert.ok(!has(good, 'check', /hard to read/)); assert.equal(good.spec.brand.colour, '#1d4ed8'); assert.equal(good.spec.look, 'flightdeck');
  const typo = run(T('Look: wayfindng'));
  assert.ok(has(typo, 'check', /Did you mean "Wayfinding"/)); assert.equal(typo.spec.look, '');
});
