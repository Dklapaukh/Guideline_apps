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
