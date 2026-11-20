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

test('the same reminder with two intervals, and two "Next" lines, are contradictions to check', () => {
  const res = run(`# T
Source: Test
## Steps
### a: A
Remind: every 5 minutes: Recheck
Next: b
Next: a
### b: B
Remind: every 10 minutes: Recheck
End:
`);
  assert.ok(has(res, 'check', /"Recheck" is reminded every 10 minutes here but every 5 minutes/));
  assert.ok(has(res, 'check', /two "Next" lines/));
});

test('"Write:" boxes: read with their labels; no label, a box outside the steps and two boxes with one name become findings', () => {
  const res = run(`# T
Source: Test
Write: Not here
## Inputs
- Write down: Nor here
## Steps
### a: Call
Write: Caller's exact words
Quote: "Write down the exact wording"
Text box: Answer to question 1
Write:
Write: Caller's exact words
End:
`, 'Write down the exact wording of the threat');
  const boxes = res.spec.steps[0].lines.filter((l) => l.kind === 'write');
  assert.deepEqual(boxes.map((l) => l.text), ["Caller's exact words", 'Answer to question 1', 'Notes', "Caller's exact words"]);
  assert.equal(boxes[0].quotes.length, 1, 'a Quote under a box supports it');
  assert.equal(boxes[0].quotes[0].check, 'exact');
  assert.ok(has(res, 'fix', /"write:" line has no label.*called "Notes"/));
  assert.equal(res.findings.filter((f) => f.level === 'fix' && /outside "## Steps"/.test(f.message)).length, 2);
  assert.ok(has(res, 'check', /two writing boxes called "Caller's exact words"/));
  assert.equal(res.spec.inputs.length, 0, 'a misplaced box is not read as an input');
  assert.ok(!has(res, 'info', /no quote from the guideline/), 'a box label is not an instruction that needs a quote');
});

test('junk around "Write:" lines never makes the reader or checker throw', () => {
  const odd = ['Write:', 'Write: ', 'write down: <b>x</b>', 'Free text: 5 mg [if W < 3]', 'Write: [if', 'Write: x -> b', '- Write: y', 'Quote: "x"', '| Write: z |'];
  let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const bits = [...odd, '# T', '## Steps', '## Inputs', '## Tables', '### a: A', 'Say: x', 'Next: end', ''];
  for (let i = 0; i < 200; i++) {
    const text = Array.from({ length: 4 + Math.floor(rnd() * 20) }, () => bits[Math.floor(rnd() * bits.length)]).join('\n');
    assert.doesNotThrow(() => run(text, 'x 5 mg'), text);
  }
});

test('"Tip:", "More:" and "Location:" lines: read with their kinds; tip numbers and tip quotes, and boxes with no label, become findings', () => {
  const res = run(`# T
Source: Test
Location: Not here
Look: Rescue
## Inputs
- Location: choice: Harbour | Open sea
## Steps
### a: Overboard
Tip: One person calls while the skipper steers back
Tip: Call 111 within 2 minutes
Tip: Keep everyone watching
Quote: "Watch the person"
Tip:
More: Background the person may want
Quote: "Watch the person"
Location: Where they went in
Location:
Position: Where they went in
End:
`, 'Watch the person carefully');
  const kinds = res.spec.steps[0].lines.map((l) => l.kind);
  assert.deepEqual(kinds, ['tip', 'tip', 'tip', 'more', 'location', 'location', 'location']);
  assert.deepEqual(res.spec.steps[0].lines.filter((l) => l.kind === 'location').map((l) => l.text), ['Where they went in', 'Position', 'Where they went in']);
  const numbered = res.findings.filter((f) => f.level === 'check' && /Tips must not add numbers; numbers must come from the guideline/.test(f.message));
  assert.equal(numbered.length, 1, 'only the tip with numbers is reported');
  assert.match(numbered[0].message, /Call 111 within 2 minutes/);
  assert.ok(has(res, 'check', /"Keep everyone watching" has a Quote under it.*write it as "Say:"/), 'a Quote under a Tip: use Say instead');
  assert.ok(has(res, 'fix', /"tip:" line has no text/));
  assert.ok(has(res, 'fix', /"location:" line has no label.*called "Position"/));
  assert.ok(has(res, 'fix', /"location: Not here" is a position box, but it is outside "## Steps"/));
  assert.equal(res.spec.inputs.length, 1, 'an input called "Location" is still an input');
  assert.ok(has(res, 'check', /two writing boxes called "Where they went in"/));
  assert.ok(!has(res, 'info', /no quote from the guideline/), 'tips are not unquoted instructions, and the More line has its quote');
  assert.equal(res.spec.look, 'rescue');
  // An unquoted More line is an instruction like Say: it is counted.
  const bare = run('# T\nSource: Test\n## Steps\n### a: A\nMore: Unquoted detail\nTip: An app idea\nEnd:\n');
  assert.ok(has(bare, 'info', /1 line in "A" has no quote from the guideline \("Unquoted detail"\)/));
});

test('junk around "Tip:", "More:" and "Location:" lines never makes the reader or checker throw', () => {
  const odd = ['Tip:', 'Tip: call 111', 'tip: <b>x</b> [if W < 3]', 'More:', 'More: 5 mg', 'More detail: y [if', 'Location:', 'Position: <i>', 'GPS: z -> b', '- Location: q', 'Location: x [if W > 2]', 'Quote: "x"', '| Tip: z |', 'Tip: 12:30'];
  let seed = 23; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const bits = [...odd, '# T', '## Steps', '## Inputs', '## Tables', '### a: A', 'Say: x', 'Next: end', '- W (kg): number, 1-9', ''];
  for (let i = 0; i < 200; i++) {
    const text = Array.from({ length: 4 + Math.floor(rnd() * 20) }, () => bits[Math.floor(rnd() * bits.length)]).join('\n');
    assert.doesNotThrow(() => run(text, 'x 5 mg'), text);
  }
});
