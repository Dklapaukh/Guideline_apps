/* CHECKER: looks over a spec (from template.js) and the guideline's saved text, links every "go to" to its
   step, and lists anything that is missing, unreachable, contradictory or unsupported by the guideline.
   It never stops the build. Every finding is a prompt for the author, with a suggestion where it can make one:
     fix    the app cannot do what the template says (it uses a safe fallback and shows the problem)
     check  possibly wrong: a contradiction, a gap, a quote that does not match, a step that can't be reached
     info   worth knowing; nothing is wrong

   checkSpec(spec, { sourceText }) -> { spec (with links resolved), findings, summary }
   Pure function (node and browser). */

import { findQuote, amounts } from './quotes.js';
import { findByName, closest, readKey, slug, isNotStated } from './util.js';
import { LOOKS, parseColour, contrastWithWhite } from './looks.js';

export const END = '__end';
const END_WORDS = /^(end|finish|finished|stop|done|exit|complete)$/i;

// Links, checks and summarises a spec; earlier findings (from the reader) are kept first. Never throws.
export function checkSpec(input, { sourceText = '', findings: earlier = [] } = {}) {
  const spec = JSON.parse(JSON.stringify(input));   // a copy (structuredClone is missing in older phone browsers)
  const findings = [...earlier];
  const add = (level, where, message, suggestion) => findings.push({ level, ...where, message, ...(suggestion ? { suggestion } : {}) });
  const stepNames = spec.steps.flatMap((s) => [s.id, s.title]);

  /* ---- 1. Link every "go to" to a step ---- */
  const link = (to, where, what) => {
    if (!to) return null;
    const step = findByName(spec.steps, to, (s) => [s.id, s.title]);
    if (step) return step.id;                       // a step's own name wins, even "finished"
    if (END_WORDS.test(to.trim())) return END;
    const near = closest(to, stepNames);
    add('fix', where, `${what} goes to "${to}", but there is no step with that name. The app shows this problem instead of moving on.`,
      near ? `Did you mean "${near}"?` : 'Add the step, or correct the name.');
    return null;
  };
  for (const s of spec.steps) {
    const where = { step: s.id, line: s.line };
    if (s.ask) for (const o of s.ask.options) o.target = link(o.to, { step: s.id, line: o.line }, `Answer "${o.label}" in "${s.title}"`);
    for (const nx of s.nexts ?? []) nx.target = link(nx.to, { step: s.id, line: nx.line }, `"Next" in "${s.title}"`);
    if (s.next) s.next.target = s.nexts?.[0]?.target ?? link(s.next.to, where, `"Next" in "${s.title}"`);
    if (s.timer?.to) s.timer.target = link(s.timer.to, { step: s.id, line: s.timer.line }, `The timer in "${s.title}"`);
  }

  /* ---- 2. Inputs, conditions and tables refer to things that exist ---- */
  const inputNames = spec.inputs.flatMap((i) => [i.id, i.label]);
  const checkCond = (cond, where) => {
    for (const c of cond ?? []) {
      const inp = findByName(spec.inputs, c.input, (i) => [i.id, i.label]);
      if (!inp) {
        const near = closest(c.input, inputNames);
        add('fix', where, `A condition uses "${c.input}", which is not one of the inputs, so the app can't tell whether it applies (it shows the line marked "depends").`,
          near ? `Did you mean "${near}"?` : `Add "${c.input}" under "## Inputs".`);
        continue;
      }
      c.inputId = inp.id;
      if (inp.type === 'choice') {
        if (/[<>]/.test(c.op)) add('check', where, `"${inp.label}" is a choice, but the condition compares it with ${c.op} ${c.values[0]}.`);
        for (const v of c.values) if (!inp.options.some((o) => o.toLowerCase() === v.toLowerCase())) {
          const near = closest(v, inp.options);
          add('check', where, `The condition checks "${inp.label}" for "${v}", which is not one of its options (${inp.options.join(', ')}).`, near ? `Did you mean "${near}"?` : null);
        }
      } else if (/[<>]/.test(c.op)) {
        const v = parseFloat(c.values[0]);
        if ((inp.min != null && v < inp.min) || (inp.max != null && v > inp.max)) add('check', where, `The condition "${inp.label} ${c.op} ${v}" is outside the allowed range ${inp.min}-${inp.max}, so it is always or never true.`);
      }
    }
  };
  for (const s of spec.steps) {
    for (const l of s.lines) checkCond(l.cond, { step: s.id, line: l.line });
    for (const o of s.ask?.options ?? []) checkCond(o.cond, { step: s.id, line: o.line });
    for (const nx of s.nexts ?? []) checkCond(nx.cond, { step: s.id, line: nx.line });
  }
  for (const t of spec.tables) checkTable(t, spec, add);
  for (const s of spec.steps) for (const l of s.lines.filter((x) => x.kind === 'show')) {
    const t = findByName(spec.tables, l.table, (x) => [x.id, x.title]);
    if (!t) {
      const near = closest(l.table, spec.tables.map((x) => x.title));
      add('fix', { step: s.id, line: l.line }, `"Show: ${l.text}" names a table that doesn't exist.`, near ? `Did you mean "${near}"?` : 'Add it under "## Tables".');
      continue;
    }
    l.tableId = t.id;
    if (l.column && !t.columns.some((c) => slug(c) === slug(l.column))) add('fix', { step: s.id, line: l.line }, `Table "${t.title}" has no column "${l.column}" (columns: ${t.columns.join(', ')}).`);
  }

  /* ---- 3. The flow: every step reachable, no dead ends, no loops without a way out ---- */
  const byId = new Map(spec.steps.map((s) => [s.id, s]));
  const exits = (s) => [...(s.ask?.options ?? []).map((o) => o.target), ...(s.nexts ?? []).map((n) => n.target), s.timer?.target].filter(Boolean);
  for (const s of spec.steps) {
    const where = { step: s.id, line: s.line };
    const out = exits(s);
    if (s.ask && !s.ask.options.length) add('fix', { step: s.id, line: s.ask.line }, `"${s.title}" asks "${s.ask.question}" but lists no answers. Add lines like "- Yes -> next-step".`);
    if (s.ask?.options.length === 1) add('info', { step: s.id, line: s.ask.line }, `"${s.title}" has a question with only one answer.`);
    if (s.ask && s.next) add('check', where, `"${s.title}" has both a question and a "Next". Which should happen? The app shows the answers, with "Next" as a "Skip" button.`);
    if (s.ask?.options.length && s.ask.options.every((o) => o.cond)) add('check', { step: s.id, line: s.ask.line }, `Every answer in "${s.title}" has a condition, so some patients/situations may see no answers at all.`);
    const labels = new Map();
    for (const o of s.ask?.options ?? []) {
      const k = o.label.toLowerCase();
      if (labels.has(k) && labels.get(k) !== o.target && !o.cond) add('check', { step: s.id, line: o.line }, `"${s.title}": the answer "${o.label}" appears twice and goes to two different places. Which one is right?`);
      labels.set(k, o.target);
    }
    if (!out.length && !s.end && !(s.ask?.options.length)) {
      add('check', where, `"${s.title}" has no way forward (no answers, "Next", timer or "End"). The app offers "Finish" here.`, 'Add "Next: <step>" or "End:" if this is meant to be the last step.');
    }
  }
  const reach = new Set();
  const walk = (id) => { if (!id || id === END || reach.has(id)) return; reach.add(id); exits(byId.get(id)).forEach(walk); };
  walk(spec.start);
  for (const s of spec.steps) if (!reach.has(s.id)) add('check', { step: s.id, line: s.line }, `Nothing leads to "${s.title}", so the app will never show it.`, 'Point an answer or "Next" at it, or delete it.');
  // Can each reachable step get to an ending (End step, End link, or a dead end that gets "Finish")?
  const isFinal = (s) => s.end || exits(s).includes(END) || !exits(s).length;
  const canFinish = new Set(spec.steps.filter(isFinal).map((s) => s.id));
  for (let changed = true; changed;) {
    changed = false;
    for (const s of spec.steps) if (!canFinish.has(s.id) && exits(s).some((t) => canFinish.has(t))) { canFinish.add(s.id); changed = true; }
  }
  const trapped = [...reach].filter((id) => !canFinish.has(id));
  if (trapped.length) add('check', { step: trapped[0], line: byId.get(trapped[0]).line },
    `These steps loop with no way to finish: ${trapped.map((id) => `"${byId.get(id).title}"`).join(', ')}. That may be right for a repeating cycle, but the guideline usually says when to stop.`,
    'Add an answer such as "- Stop -> end" where the guideline says the process ends.');
  if (!spec.steps.some((s) => s.end || exits(s).includes(END))) add('info', {}, 'No step is marked "End"; the app offers "Finish" at the last step.');

  /* ---- 4. Guideline support: quotes match the source, and numbers agree with their quotes ---- */
  let quoteCount = 0, quoteExact = 0, numberLines = 0, numberLinesQuoted = 0;
  const templateAmounts = new Set();
  // Looks a quote up in the guideline text, counts it, marks it (q.check) and reports a near or missing match.
  const checkQuote = (q, where) => {
    quoteCount++;
    const r = findQuote(q.text, sourceText);
    q.check = r.found;
    if (r.found === 'exact') quoteExact++;
    else if (r.found === 'near') add('check', where, `The quote "${q.text}" is close to, but not the same as, the guideline${r.missing.length ? ` (the guideline doesn't have: ${r.missing.join(', ')})` : ''}.`, `Guideline text nearby: "${r.passage}"`);
    else if (sourceText) add('check', where, `The quote "${q.text}" was not found in the saved guideline text.`, 'Check it against the guideline; the saved copy may also be incomplete.');
    amounts(q.text).forEach((a) => templateAmounts.add(a));
  };
  for (const s of spec.steps) {
    const holders = [s.timer, ...s.reminders].filter((h) => h?.quotes?.length);
    const stepQuotes = [...(s.quotes ?? []), ...s.lines.flatMap((l) => l.quotes ?? []), ...holders.flatMap((h) => h.quotes)];
    for (const q of [...(s.quotes ?? []), ...holders.flatMap((h) => h.quotes)]) checkQuote(q, { step: s.id, line: s.line });   // quotes not under a text line: still checked
    for (const l of s.lines) {
      const said = l.kind === 'show' || l.kind === 'note' ? [] : amounts(l.text);
      said.forEach((a) => templateAmounts.add(a));
      if (said.length) { numberLines++; if (l.quotes?.length) numberLinesQuoted++; }
      for (const q of l.quotes ?? []) {
        checkQuote(q, { step: s.id, line: l.line });
        const quoted = amounts(q.text);
        const differ = said.filter((a) => quoted.length && !agrees(a, quoted));
        if (differ.length) add('check', { step: s.id, line: l.line }, `This line says ${differ.join(', ')}, but its quote says ${quoted.join(', ')}. Which is right?`);
      }
    }
    // Timers and reminders should agree with any time the step's quotes give
    const quotedTimes = stepQuotes.flatMap((q) => amounts(q.text)).filter((a) => /second|minute|hour|day|week/.test(a));
    const timed = [s.timer && { what: 'timer', label: s.timer.label, line: s.timer.line }, ...s.reminders.map((r) => ({ what: 'reminder', label: r.every, line: r.line }))].filter(Boolean);
    for (const t of timed) {
      const a = amounts(t.label)[0];
      if (a) templateAmounts.add(a);
      if (a && quotedTimes.length && !agrees(a, quotedTimes)) add('check', { step: s.id, line: t.line }, `The ${t.what} is ${t.label}, but the quotes in this step give ${quotedTimes.join(', ')}.`);
      if (!quotedTimes.length) add('info', { step: s.id, line: t.line }, `The ${t.what} (${t.label}) has no quote in this step showing where the time comes from.`);
    }
  }
  // The same reminder text with two different intervals in different steps is a contradiction.
  const seenReminders = new Map();
  for (const s of spec.steps) for (const r of s.reminders) {
    const prev = seenReminders.get(r.id);
    if (prev && prev.ms !== r.ms) add('check', { step: s.id, line: r.line }, `"${r.text}" is reminded every ${r.every} here but every ${prev.every} in "${prev.step}". Which is right?`);
    else seenReminders.set(r.id, { ...r, step: s.title });
  }
  // Instructions with no quote: one note per step (numbers are called out, since they matter most).
  for (const s of spec.steps) {
    const bare = s.lines.filter((l) => ['say', 'do', 'warning'].includes(l.kind) && !l.quotes?.length);
    if (!bare.length) continue;
    const withNumbers = bare.filter((l) => amounts(l.text).length);
    add('info', { step: s.id, line: bare[0].line }, `${bare.length} line${bare.length > 1 ? 's' : ''} in "${s.title}" ${bare.length > 1 ? 'have' : 'has'} no quote from the guideline${withNumbers.length ? `, including ${withNumbers.length} with numbers ("${short(withNumbers[0].text)}")` : ` ("${short(bare[0].text)}")`}. Fine for app wording; an instruction should quote its source.`);
  }
  for (const t of spec.tables) for (const r of t.rows) Object.values(r.cells).forEach((c) => amounts(c).forEach((a) => templateAmounts.add(a)));

  // Numbers in the guideline that the template never mentions: a hint at something left out.
  const sourceAmounts = [...new Set(amounts(sourceText))];
  const missed = sourceAmounts.filter((a) => !templateAmounts.has(a));
  if (sourceText && missed.length) add('info', {}, `The guideline mentions ${missed.length} amount${missed.length > 1 ? 's' : ''} the template never uses: ${missed.slice(0, 12).join(', ')}${missed.length > 12 ? ' …' : ''}. Some may be background; check none were left out.`);

  /* ---- 5. About the template as a whole ---- */
  if (!spec.sources.length) add('check', {}, 'The template names no source guideline ("Source: name - link").');
  if (!sourceText) add('info', {}, 'No saved guideline text was given, so quotes could not be checked.');
  if (!spec.reviewedBy) add('info', {}, 'Nobody is named under "Reviewed by:", so the app shows "Not reviewed".');
  checkLook(spec, add);

  const count = (lvl) => findings.filter((f) => f.level === lvl).length;
  const summary = {
    steps: spec.steps.length, reachable: reach.size, fix: count('fix'), check: count('check'), info: count('info'),
    quotes: quoteCount, quotesExact: quoteExact, numberLines, numberLinesQuoted,
    sourceAmounts: sourceAmounts.length, sourceAmountsUsed: sourceAmounts.length - missed.length,
  };
  return { spec, findings, summary };
}

/* Branding and look: a colour the app can't use, or white text that would be hard to read on it, or a look
   that doesn't exist. Bad values are dropped (the app keeps its normal colours) and become findings. */
function checkLook(spec, add) {
  spec.brand = { name: '', colour: '', ...(spec.brand ?? {}) };
  const c = spec.brand.colour;
  if (c) {
    const rgb = parseColour(c);
    if (!rgb) { add('fix', {}, `"Brand colour: ${c}" is not a colour the app can read, so the look's own colour is used.`, 'Write it as a hex code, e.g. "Brand colour: #1d4ed8".'); spec.brand.colour = ''; }
    else {
      spec.brand.colour = '#' + rgb.map((v) => v.toString(16).padStart(2, '0')).join('');
      const ratio = contrastWithWhite(rgb);
      if (ratio < 4.5) add('check', {}, `White button text on the brand colour ${spec.brand.colour} is hard to read (contrast ${ratio.toFixed(1)} to 1; 4.5 or more is easy to read).`, 'Choose a darker shade of the brand colour.');
    }
  }
  if (spec.look) {
    const flat = (t) => slug(t).replace(/-/g, '');   // "Flight deck", "flight-deck" and "flightdeck" all match
    const look = LOOKS.find((l) => flat(l.id) === flat(spec.look) || flat(l.name) === flat(spec.look));
    if (look) spec.look = look.id;
    else {
      const near = closest(spec.look, LOOKS.map((l) => l.name));
      add('check', {}, `"Look: ${spec.look}" is not one of the looks (${LOOKS.map((l) => l.name).join(', ')}), so the app opens in ${LOOKS[0].name}.`, near ? `Did you mean "${near}"?` : undefined);
      spec.look = '';
    }
  }
}

/* A table: which input picks the row, duplicate or contradictory rows, overlapping or missing bands. */
function checkTable(t, spec, add) {
  const where = { table: t.id, line: t.line };
  if (!t.rows.length) { add('fix', where, `Table "${t.title}" has no rows.`); return; }
  let inp = t.key ? findByName(spec.inputs, t.key, (i) => [i.id, i.label]) : findByName(spec.inputs, t.columns[0] ?? '', (i) => [i.id, i.label]);
  if (!inp && !t.key) inp = spec.inputs.find((i) => slug(t.columns[0] ?? '').includes(i.id) || i.id.includes(slug(t.columns[0] ?? ''))) ?? null;
  if (!inp) { add('fix', where, `Table "${t.title}": the builder can't tell which input picks the row. The app shows the whole table instead.`, `Add "Key: <input name>" under the table heading (inputs: ${spec.inputs.map((i) => i.label).join(', ') || 'none yet'}).`); }
  else t.keyInput = inp.id;
  for (const r of t.rows) r.match = readKey(r.key);
  const kinds = new Set(t.rows.map((r) => r.match.kind));
  if (inp?.type === 'number' && kinds.has('value')) add('check', where, `Table "${t.title}" is looked up by "${inp.label}" (a number), but some rows are words: ${t.rows.filter((r) => r.match.kind === 'value').map((r) => `"${r.key}"`).join(', ')}.`);
  if (inp?.type === 'number' && kinds.size === 1 && kinds.has('number')) add('check', where, `Table "${t.title}" has single numbers as rows (${t.rows.map((r) => r.key).join(', ')}), so only those exact values find a row. If they are bands, write them as ranges ("0-5", "5.1-10", "over 40").`);
  // Same key twice with different values
  const seen = new Map();
  for (const r of t.rows) {
    const k = r.key.toLowerCase(), cells = JSON.stringify(r.cells);
    if (seen.has(k) && seen.get(k) !== cells) add('check', { table: t.id, line: r.line }, `Table "${t.title}" has the row "${r.key}" twice with different values. Which is right?`);
    seen.set(k, cells);
  }
  // Number bands: overlap and gaps
  const ranges = t.rows.filter((r) => r.match.kind === 'range' || r.match.kind === 'number')
    .map((r) => ({ r, low: r.match.kind === 'number' ? r.match.value : r.match.low, high: r.match.kind === 'number' ? r.match.value : r.match.high, m: r.match }))
    .sort((a, b) => a.low - b.low || a.high - b.high);
  for (let i = 1; i < ranges.length; i++) {
    const a = ranges[i - 1], b = ranges[i];
    if (a.m.kind === 'number' && b.m.kind === 'number') continue;
    const overlap = b.low < a.high || (b.low === a.high && (a.m.highIn ?? true) && (b.m.lowIn ?? true));
    if (overlap) add('check', { table: t.id, line: b.r.line }, `Table "${t.title}": rows "${a.r.key}" and "${b.r.key}" overlap, so a value of ${b.low} fits both. The app uses the first.`);
    else if (b.low > a.high && !(inp?.whole && a.high + 1 === b.low && Number.isInteger(a.high))) add('check', { table: t.id, line: b.r.line }, `Table "${t.title}": nothing covers values between ${a.high} and ${b.low} (between rows "${a.r.key}" and "${b.r.key}"). The app says "no row for this value".`);
    else if (b.low === a.high && !(a.m.highIn ?? true) && !(b.m.lowIn ?? true)) add('check', { table: t.id, line: b.r.line }, `Table "${t.title}": exactly ${b.low} is in neither "${a.r.key}" nor "${b.r.key}".`);
  }
  // A table picked by a choice: every row should be one of the choices, and every choice should have a row.
  if (inp?.type === 'choice') {
    for (const r of t.rows) if (!inp.options.some((o) => o.toLowerCase() === r.key.toLowerCase())) {
      const near = closest(r.key, inp.options);
      add('check', { table: t.id, line: r.line }, `Table "${t.title}": row "${r.key}" is not one of the "${inp.label}" choices (${inp.options.join(', ')}), so no one will ever see it.`, near ? `Did you mean "${near}"?` : null);
    }
    for (const o of inp.options) if (!t.rows.some((r) => r.key.toLowerCase() === o.toLowerCase())) add('check', where, `Table "${t.title}" has no row for "${o}", so the app will say "no row" when "${inp.label}" is ${o}.`);
  }
  for (const r of t.rows) for (const [col, v] of Object.entries(r.cells)) {
    if (isNotStated(v) && col !== t.columns[0]) add('info', { table: t.id, line: r.line }, `Table "${t.title}", row "${r.key}", column "${col}" is empty or "-". The app shows "Not stated in the guideline", not zero.`);
  }
}

// Cuts long text for a finding message.
const short = (t) => (t.length > 60 ? t.slice(0, 57) + '…' : t);
// Two normalised amounts ("5 minute", "20-40 ml/kg") have the same unit.
const sameUnit = (a, b) => a.split(' ')[1] === b.split(' ')[1];
// An amount agrees with a quote's amounts if one is the same, or a quoted range with the same unit contains it.
const agrees = (amount, quoted) => quoted.includes(amount) || quoted.some((b) => sameUnit(amount, b) && rangeHas(b, amount));
// "20-40 ml/kg" contains "30 ml/kg"
function rangeHas(range, single) {
  const m = /^(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)/.exec(range);
  const v = parseFloat(single);
  return m ? v >= +m[1] && v <= +m[2] : false;
}
