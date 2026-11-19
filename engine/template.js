/* TEMPLATE READER: turns a filled-in guideline template (plain text, see template/guideline-template.md) into an
   app spec, with NO AI. It is deliberately forgiving: it never throws on a badly written template. Anything it
   cannot understand is kept (usually shown as plain text) and reported as a finding, so the author is prompted
   to fix it rather than the app breaking.

   readTemplate(text) -> { spec, findings }
     spec      what the runtime draws (format: docs/DESIGN.md "Spec")
     findings  [{ level: 'fix' | 'check' | 'info', line, step, message, suggestion }]
   Pure function: no file or network access (runs in node and in the browser). */

import { parseDuration, parseCondition, slug } from './util.js';

// Words an author might use for each kind of line, all mapped to one meaning. Matching ignores case.
const KEYS = {
  say: ['say', 'tell', 'text', 'info', 'information'],
  do: ['do', 'check', 'tick', 'action', 'task'],
  warning: ['warning', 'caution', 'danger', 'important'],
  quote: ['quote', 'source', 'from'],
  ask: ['ask', 'question', 'decide', 'choose'],
  next: ['next', 'go to', 'goto', 'then'],
  timer: ['timer', 'wait', 'countdown'],
  remind: ['remind', 'reminder', 'repeat'],
  stop: ['stop reminder', 'stop reminders', 'stop'],
  show: ['show', 'look up', 'lookup'],
  record: ['record', 'log', 'button'],
  end: ['end', 'finish', 'done'],
  note: ['note', 'author note', 'comment'],
};
const KEY_OF = new Map(Object.entries(KEYS).flatMap(([k, list]) => list.map((w) => [w, k])));
// The arrow between an answer and its step: "->", "-->", "→", "=>" or "—>", with any spaces around it.
const ARROW = /\s*(?:-->|->|→|=>|—>)\s*/;
// Splits "label -> target" on the LAST arrow, so arrows inside the label survive ("Breathing → normal -> end").
function splitArrow(text) {
  const all = [...text.matchAll(new RegExp(ARROW.source, 'g'))];
  if (!all.length) return [text, null];
  const m = all.at(-1);
  return [text.slice(0, m.index), text.slice(m.index + m[0].length)];
}

// Reads the whole template line by line; the section (top, Inputs, Tables, Steps, Notes) decides how each line is read.
export function readTemplate(text) {
  const findings = [];
  const say = (level, line, message, extra = {}) => findings.push({ level, line, message, ...extra });
  const spec = { title: '', about: '', sources: [], warning: '', audience: '', reviewedBy: '', version: '',
                 brand: { name: '', colour: '' }, look: '', inputs: [], tables: [], steps: [], start: null };

  const lines = String(text ?? '').replace(/\r\n?/g, '\n').split('\n');
  let section = 'top', step = null, table = null, lastLine = null, ask = null;

  lines.forEach((raw, index) => {
    const n = index + 1;
    const line = raw.replace(/\s+$/, '');
    const bare = line.trim();
    if (!bare || /^<!--.*-->$/.test(bare) || bare.startsWith('>')) return;   // blank, comment, or guidance quote

    // Headings choose the section
    let m;
    if ((m = /^#\s+(.+)$/.exec(bare))) { spec.title = m[1].trim(); return; }
    if ((m = /^##\s+(.+)$/.exec(bare))) {
      const name = m[1].trim().toLowerCase();
      section = /input|detail|ask first|patient|before/.test(name) ? 'inputs'
        : /table/.test(name) ? 'tables'
        : /step|flow|process/.test(name) ? 'steps'
        : /note|reference|change/.test(name) ? 'notes'
        : 'unknown';
      if (section === 'unknown') say('info', n, `Section "${m[1].trim()}" is not one the builder knows (Inputs, Tables, Steps, Notes), so it is ignored.`);
      step = null; table = null; ask = null; lastLine = null;
      return;
    }
    if ((m = /^###\s+(.+)$/.exec(bare))) {
      ask = null; lastLine = null;
      if (section === 'tables') { table = newTable(m[1].trim()); spec.tables.push(table); return; }
      if (section !== 'steps') { section = 'steps'; say('info', n, 'A step heading (###) appeared outside "## Steps"; it was read as a step.'); }
      step = newStep(m[1].trim(), n); spec.steps.push(step);
      return;
    }

    if (section === 'top') return readTop(bare, n);
    if (section === 'inputs') return readInput(bare, n);
    if (section === 'tables') return readTableLine(bare, n);
    if (section === 'steps') return readStepLine(bare, n);
  });

  /* ---- top of the template: About, Source, Warning, ... ---- */
  function readTop(bare, n) {
    const kv = keyValue(bare);
    if (!kv) { spec.about = (spec.about ? spec.about + ' ' : '') + bare; return; }
    const { key, value } = kv;
    if (/^about|^purpose|^description/.test(key)) spec.about = value;
    else if (/^source|^guideline|^reference/.test(key)) spec.sources.push(readSourceValue(value));
    else if (/^warning|^disclaimer/.test(key)) spec.warning = value;
    else if (/^audience|^for|^user/.test(key)) spec.audience = value;
    else if (/^review/.test(key)) spec.reviewedBy = value;
    else if (/^version|^date|^updated/.test(key)) spec.version = value;
    else if (/^(brand )?colou?r/.test(key)) spec.brand.colour = value;          // checked in check.js
    else if (/^brand|^company|^organi[sz]ation/.test(key)) spec.brand.name = value;
    else if (/^look|^design|^style/.test(key)) spec.look = value;
    else say('info', n, `"${key}" at the top is not a known field; kept as part of the description.`), spec.about += ' ' + value;
  }

  /* ---- inputs: "- Weight (kg): number, 1-300, optional" or "- Age group: choice: Adult | Child" ---- */
  function readInput(bare, n) {
    const body = bare.replace(/^[-*]\s*/, '');
    const m = /^(.+?)(?:\s*\(([^)]+)\))?\s*:\s*(.+)$/.exec(body);
    if (!m) { say('fix', n, `Input "${body}" needs a type, e.g. "- ${body}: number" or "- ${body}: choice: A | B".`); return; }
    const [, label, unit = '', rest] = m;
    const input = { id: slug(label), label: label.trim(), unit: unit.trim(), type: 'number', optional: /optional/i.test(rest), whole: /whole|integer|count/i.test(rest), line: n };
    if (/choice|option|one of|select/i.test(rest) || rest.includes('|')) {
      input.type = 'choice';
      const list = rest.replace(/^(choice|options?|one of|select)\s*:?\s*/i, '').replace(/,?\s*optional\s*$/i, '');
      input.options = list.split(list.includes('|') ? /\s*\|\s*/ : /\s*,\s*/).map((s) => s.trim()).filter(Boolean);   // "|" if used, else commas
      if (input.options.length < 2) say('check', n, `Choice input "${input.label}" has fewer than two options.`);
    } else if (/yes\s*\/\s*no|yes or no|boolean/i.test(rest)) {
      input.type = 'choice'; input.options = ['Yes', 'No'];
    } else {
      const r = /(-?\d+(?:\.\d+)?)\s*(?:-|to|–)\s*(-?\d+(?:\.\d+)?)/.exec(rest);
      if (r) { input.min = Number(r[1]); input.max = Number(r[2]); if (input.min > input.max) { say('check', n, `Input "${input.label}": the range ${r[0]} runs backwards; read as ${input.max}-${input.min}.`); [input.min, input.max] = [input.max, input.min]; } }
      if (!/number|numeric|amount|value/i.test(rest) && !r) say('info', n, `Input "${input.label}": type not stated, read as a number.`);
    }
    if (spec.inputs.some((i) => i.id === input.id)) { say('fix', n, `Input "${input.label}" is listed twice; the second one is ignored.`); return; }
    spec.inputs.push(input);
  }

  /* ---- tables: "### Title", optional "Key: Weight", "Source: ...", then a markdown table ---- */
  // A new, empty table; readTableLine fills it from the lines below its heading.
  function newTable(title) { return { id: slug(title), title, key: null, columns: [], rows: [], source: '', line: null }; }
  // One line under a table heading: a header or data row, the "|---|" line, "Key:" or "Source:".
  function readTableLine(bare, n) {
    if (!table) { table = newTable('Table'); spec.tables.push(table); say('info', n, 'Table rows came before a "### Table name" heading; it was named "Table".'); }
    table.line ??= n;
    if (bare.startsWith('|')) {
      const cells = bare.replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
      if (cells.every((c) => /^:?-{2,}:?$/.test(c))) return;                         // the |---| line
      if (!table.columns.length) { table.columns = cells; return; }
      if (cells.length !== table.columns.length) say('check', n, `Table "${table.title}": this row has ${cells.length} cells but the header has ${table.columns.length}.`);
      table.rows.push({ key: cells[0], cells: Object.fromEntries(table.columns.map((c, i) => [c, cells[i] ?? ''])), line: n });
      return;
    }
    const kv = keyValue(bare);
    if (kv && /^key|^by|^look ?up by/.test(kv.key)) table.key = kv.value;
    else if (kv && /^source|^quote|^from/.test(kv.key)) table.source = kv.value;
    else say('info', n, `Line "${bare}" in table "${table.title}" was not understood and is ignored.`);
  }

  /* ---- steps ---- */
  // A new step from "### id: Title" (or "### Title", whose id is made from the title).
  function newStep(heading, n) {
    const m = /^([\w-]+)\s*:\s*(.+)$/.exec(heading);
    const title = m ? m[2].trim() : heading;
    return { id: m ? slug(m[1]) : slug(title), title, lines: [], ask: null, next: null, timer: null,
             reminders: [], stop: null, end: false, line: n };
  }
  // One line in a step: an answer ("- Yes -> step"), a bullet, a typed line ("Timer: ...") or plain text.
  function readStepLine(bare, n) {
    if (!step) { step = newStep('Start', n); spec.steps.push(step); say('info', n, 'Text came before the first "### step" heading; it was put in a step called "Start".'); }
    const { text, cond, condProblem } = splitCondition(bare);
    if (condProblem) say('fix', n, condProblem, { step: step.id });

    // An answer to the current question: "- Yes -> next-step"
    if (/^[-*]\s+/.test(text) && ARROW.test(text)) {
      const [label, to] = splitArrow(text.replace(/^[-*]\s+/, ''));
      if (!label.trim()) say('fix', n, `An answer going to "${to.trim()}" has no text for its button.`, { step: step.id, suggestion: 'Write it as "- Answer text -> step-name".' });
      if (!ask) { ask = { question: '', options: [], line: n }; step.ask = ask; }
      ask.options.push({ label: label.trim() || to.trim(), to: to.trim(), cond, line: n });
      lastLine = null;
      return;
    }
    if (/^[-*]\s+/.test(text)) { addLine({ kind: 'say', text: text.replace(/^[-*]\s+/, ''), bullet: true, cond, line: n }); return; }

    const kv = keyValue(text);
    // Only an exact line-type word counts ("Stop:"), so a sentence like "Stop the bleeding: press firmly" stays text.
    const kind = kv ? KEY_OF.get(kv.key) ?? null : null;
    if (!kv || !kind) {
      const near = kv && matchKeyStart(kv.key);
      if (near) say('info', n, `"${kv.key}:" is shown as text. If it was meant as a "${near}" line, write "${near[0].toUpperCase() + near.slice(1)}:" on its own.`, { step: step.id });
      else if (kv && kv.key.split(' ').length === 1) say('info', n, `"${kv.key}:" is not a known line type; shown as text. Known types: Say, Do, Warning, Quote, Ask, Next, Timer, Remind, Stop, Show, Record, End, Note.`, { step: step.id });
      addLine({ kind: 'say', text, cond, line: n });
      return;
    }
    const value = kv.value;
    switch (kind) {
      case 'say': case 'do': case 'warning': case 'note': addLine({ kind, text: value, cond, line: n }); return;
      case 'record': addLine({ kind: 'record', text: value, cond, line: n }); return;
      case 'show': addLine({ kind: 'show', ...readShow(value), cond, line: n }); return;
      case 'quote': {
        const q = readQuote(value);
        if (!lastLine) { say('check', n, 'A Quote line has nothing above it to support; it is kept as a step source.', { step: step.id }); step.quotes = [...(step.quotes ?? []), q]; return; }
        (lastLine.quotes ??= []).push(q);
        return;
      }
      case 'ask': lastLine = null; ask = { question: value, options: [], line: n, cond }; if (step.ask) say('check', n, `Step "${step.title}" asks two questions; only the last is used. Split it into two steps.`, { step: step.id }); step.ask = ask; return;
      case 'next': {
        if (step.next) say('check', n, `Step "${step.title}" has two "Next" lines (${step.next.to} and ${value}). The first one is used unless it has a condition.`, { step: step.id });
        lastLine = null;
        const target = { to: value.replace(ARROW, '').trim(), cond, line: n };
        (step.nexts ??= []).push(target); step.next ??= target;
        return;
      }
      case 'timer': {
        const [time, to] = splitArrow(value);
        const ms = parseDuration(time);
        if (ms == null) { say('fix', n, `Timer "${value}" has no time the builder can read (e.g. "Timer: 20 minutes -> next-step").`, { step: step.id }); return; }
        if (step.timer) say('check', n, `Step "${step.title}" has two timers (${step.timer.label} and ${time.trim()}). Which is right? The first is used.`, { step: step.id });
        else { step.timer = { ms, label: time.trim(), to: to?.trim() || null, line: n }; lastLine = step.timer; }   // a Quote below supports the timer
        return;
      }
      case 'remind': {
        // "Remind: every 4 minutes: Give adrenaline" repeats; "Remind: after 6 hours: Throw out" happens once (a deadline)
        const m = /^(every\s+|after\s+|in\s+)?(.+?)\s*[:,-]\s+(.+)$/i.exec(value);
        const ms = m ? parseDuration(m[2]) : null;
        if (ms == null) { say('fix', n, `Reminder "${value}" needs a time and a message, e.g. "Remind: every 5 minutes: Reassess breathing" or "Remind: after 6 hours: Deadline".`, { step: step.id }); return; }
        const once = /^(after|in)\s/i.test(m[1] ?? '');
        if (!m[1]) say('info', n, `Reminder "${m[3].trim()}" doesn't say "every" (repeats) or "after" (once); read as repeating.`, { step: step.id });
        const r = { ms, every: m[2].trim(), once, text: m[3].trim(), id: slug(m[3]).slice(0, 40), line: n };
        step.reminders.push(r); lastLine = r;
        return;
      }
      case 'stop': lastLine = null; step.stop = value && !/^all$/i.test(value) ? value : 'all'; return;
      case 'end': step.end = true; if (value) addLine({ kind: 'say', text: value, cond, line: n }); return;
    }
  }
  // Adds a shown line to the step; a Quote line straight after it supports it.
  function addLine(l) { step.lines.push(l); lastLine = l; }

  spec.start = spec.steps[0]?.id ?? null;
  if (!spec.title) say('fix', 1, 'The template has no title line ("# App name").'), spec.title = 'Untitled guideline';
  if (!spec.steps.length) say('fix', 1, 'The template has no steps ("## Steps" then "### step-name: Title").');
  uniqueStepIds(spec, say);
  return { spec, findings };
}

/* ---- small readers ---- */

// "Key: value" (key up to 3 words). Returns { key (lower case), value } or null.
function keyValue(text) {
  const m = /^([A-Za-z][A-Za-z ]{0,24}?)\s*:\s*(.*)$/.exec(text);
  if (!m || m[1].trim().split(' ').length > 3) return null;
  return { key: m[1].trim().toLowerCase(), value: m[2].trim() };
}
// Accept "Reminder every" style keys by their first word(s).
function matchKeyStart(key) {
  for (const [w, k] of KEY_OF) if (key.startsWith(w + ' ')) return k;
  return null;
}
// "[if Weight < 10]" at the end of a line.
function splitCondition(text) {
  const m = /\s*\[\s*(?:if|only if|when)\s+(.+?)\s*\]\s*$/i.exec(text);
  if (!m) return { text };
  const cond = parseCondition(m[1]);
  return { text: text.slice(0, m.index).trim(), cond: cond.ok ? cond.value : null,
           condProblem: cond.ok ? null : `Condition "[if ${m[1]}]" could not be read (${cond.why}); the line is always shown.` };
}
// 'Quote: "Give 5 back blows" (p3)' -> { text, where }
function readQuote(value) {
  const m = /^["“](.+?)["”]\s*(?:\((.+)\)|[-–,]\s*(.+))?$/.exec(value);
  return m ? { text: m[1], where: (m[2] ?? m[3] ?? '').trim() } : { text: value.replace(/^["“]|["”]$/g, ''), where: '' };
}
// "Adrenaline dose" or "Adrenaline dose: Dose" (table, optional column)
function readShow(value) {
  const [table, column] = value.split(/\s*[:>]\s*|\s+column\s+/i);
  return { table: table.trim(), column: column?.trim() || null, text: value };
}
// "St John CPG 3.14 - https://..." -> { name, link }
function readSourceValue(value) {
  const link = /(https?:\/\/\S+)/.exec(value)?.[1] ?? '';
  return { name: value.replace(link, '').replace(/[\s|–—-]+$/, '').trim() || link, link };
}
// Two steps with the same id: rename the later one (id-2) and say so.
function uniqueStepIds(spec, say) {
  const seen = new Set();
  for (const s of spec.steps) {
    if (!seen.has(s.id)) { seen.add(s.id); continue; }
    let k = 2; while (seen.has(`${s.id}-${k}`)) k++;
    say('fix', s.line, `Two steps are called "${s.id}". The second was renamed "${s.id}-${k}"; links to "${s.id}" go to the first.`, { step: s.id });
    s.id = `${s.id}-${k}`; seen.add(s.id);
  }
}
