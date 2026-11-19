/* Small shared helpers: durations, conditions, names. Pure functions (node and browser). */

// "Give 5 back blows" -> "give-5-back-blows"
export const slug = (text) => String(text).toLowerCase().normalize('NFKD').replace(/\p{M}/gu, '')   // drop accents
  .replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '') || 'step';                       // keep letters of every script

// "20 minutes", "2 hours", "90 s", "1.5 h", "4 min", "1 hour 30 minutes" -> milliseconds (null if unreadable)
const UNIT_MS = { s: 1000, sec: 1000, second: 1000, m: 60000, min: 60000, minute: 60000, h: 3600000, hr: 3600000, hour: 3600000, day: 86400000, d: 86400000, week: 604800000 };
export function parseDuration(text) {
  const t = String(text ?? '').toLowerCase().replace(/\bevery\b|\bfor\b|\bafter\b|\bwait\b/g, ' ');
  let total = 0, found = false;
  for (const m of t.matchAll(/(\d+(?:\.\d+)?)\s*(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?)\b/g)) {
    const unit = m[2].replace(/s$/, '').replace(/^secs?$/, 'sec');
    const ms = UNIT_MS[unit] ?? UNIT_MS[unit.replace(/s$/, '')];
    if (ms) { total += Number(m[1]) * ms; found = true; }
  }
  return found && total > 0 ? Math.round(total) : null;
}

// Human text for a duration: 125000 -> "2 min 5 s"
export function formatDuration(ms) {
  const s = Math.max(0, Math.round(ms / 1000));
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = s % 60;
  if (h) return `${h} h ${String(m).padStart(2, '0')} min`;
  if (m) return r ? `${m} min ${r} s` : `${m} min`;
  return `${r} s`;
}
// Clock text: 125000 -> "2:05", 3725000 -> "1:02:05"
export function clock(ms) {
  const s = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = s % 60;
  return (h ? `${h}:${String(m).padStart(2, '0')}` : `${m}`) + ':' + String(r).padStart(2, '0');
}

/* Conditions: "Weight < 10", "Age group is Child", "Age group = Child or Infant", "Breathing is not Yes",
   joined with "and". Returns { ok, value: [{ input, op, values }] } or { ok: false, why }. */
export function parseCondition(text) {
  const parts = String(text).split(/\s+and\s+/i);
  const out = [];
  for (const part of parts) {
    const m = /^(.+?)\s*(<=|>=|≤|≥|<|>|!=|≠|==|=|\bis not\b|\bis\b|\bequals\b|\bunder\b|\bover\b|\bat least\b|\bat most\b)\s*(.+)$/i.exec(part.trim());
    if (!m) return { ok: false, why: `no comparison in "${part}"` };
    const op = { '≤': '<=', '≥': '>=', '≠': '!=', '==': '=', is: '=', equals: '=', 'is not': '!=', under: '<', over: '>', 'at least': '>=', 'at most': '<=' }[m[2].toLowerCase()] ?? m[2];
    const values = m[3].split(/\s+or\s+|\s*\|\s*|\s*,\s*/i).map((v) => v.trim()).filter(Boolean);
    if (values.some((v) => /(<=|>=|≤|≥|<|>|!=|≠|=|\bis\b)/i.test(v))) return { ok: false, why: '"or" between two different details is not supported yet; split it into two lines' };
    if (/[<>]/.test(op) && !values.every((v) => !Number.isNaN(parseFloat(v)))) return { ok: false, why: `"${m[3]}" is not a number` };
    out.push({ input: m[1].trim(), op, values });
  }
  return { ok: true, value: out };
}

// Is a parsed condition true for the current answers? Unknown answer -> null (the runtime shows the line, marked "depends on ...").
export function testCondition(cond, answers, inputs) {
  if (!cond) return true;
  let unknown = false;
  for (const c of cond) {
    const input = findByName(inputs, c.input, (i) => [i.id, i.label]);
    const value = input ? answers[input.id] : answers[slug(c.input)];
    if (value === undefined || value === null || value === '') { unknown = true; continue; }
    const ok = compare(value, c.op, c.values);
    if (!ok) return false;
  }
  return unknown ? null : true;
}
// One comparison: "=" and "!=" match any of the listed values (ignoring case); < <= > >= compare numbers.
function compare(value, op, values) {
  if (op === '=' || op === '!=') {
    const hit = values.some((v) => String(v).toLowerCase() === String(value).toLowerCase());
    return op === '=' ? hit : !hit;
  }
  const a = Number(value), b = parseFloat(values[0]);
  return op === '<' ? a < b : op === '<=' ? a <= b : op === '>' ? a > b : a >= b;
}

// Find a thing by any of its names, forgiving case, spaces and dashes.
export function findByName(list, name, namesOf) {
  const want = slug(name);
  return list.find((x) => namesOf(x).some((n) => slug(n) === want)) ?? null;
}

// Closest name in a list (for "did you mean ...?"). Returns null if nothing is reasonably close.
const NUMBER_WORDS = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };
const numbersAsDigits = (s) => s.replace(/\b(one|two|three|four|five|six|seven|eight|nine|ten)\b/g, (w) => NUMBER_WORDS[w]);
export function closest(name, candidates) {
  const want = numbersAsDigits(slug(name)).replace(/-/g, ' ').trim().replace(/ /g, '-');
  let best = null, bestD = Infinity;
  for (const c of candidates) {
    const s = numbersAsDigits(slug(c).replace(/-/g, ' ')).replace(/ /g, '-');
    const d = s === want ? 0 : Math.min(s.length, want.length) >= 3 && (s.includes(want) || want.includes(s)) ? 1 : editDistance(want, s);
    if (d < bestD) { bestD = d; best = c; }
  }
  return best && bestD <= Math.max(2, Math.floor(want.length / 3)) ? best : null;
}
// How many letters must change to turn a into b (Levenshtein distance, one row of memory).
function editDistance(a, b) {
  const row = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0]; row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const keep = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = keep;
    }
  }
  return row[b.length];
}

/* Table key matching: a row key may be a value ("Adult"), a number ("5 kg") or a range ("< 5", "5-10",
   "10 to 20", "over 40", "≤ 25", "up to 10", "40+"). Returns { kind: 'value', value } or { kind: 'range', low, high, lowIn, highIn }. */
export function readKey(text) {
  // Drop a trailing unit ("5 kg", "2 years") so the number or range is read.
  const t = String(text).toLowerCase().trim().replace(/\s*(kg|g|mg|years?|yrs?|y|months?|cm|mm|%|°c|℃|minutes?|mins?|hours?)\.?$/, '').replace(/\s*(kg|years?|months?)\s*(?=-|–|to\b)/, ' ').trim();
  let m;
  const num = '(-?\\d+(?:\\.\\d+)?)';
  if ((m = new RegExp(`^(?:>|over|more than|above)\\s*${num}\\s*(?:-|–|to|up to)\\s*${num}`).exec(t))) return { kind: 'range', low: +m[1], high: +m[2], lowIn: false, highIn: true };   // "over 5 to 10"
  if ((m = new RegExp(`^${num}\\s*(?:-|–|to)\\s*${num}`).exec(t))) return { kind: 'range', low: +m[1], high: +m[2], lowIn: true, highIn: true };
  if ((m = new RegExp(`^(?:<|under|less than|below)\\s*${num}`).exec(t))) return { kind: 'range', low: -Infinity, high: +m[1], lowIn: false, highIn: false };
  if ((m = new RegExp(`^(?:<=|≤|up to|at most|max)\\s*${num}`).exec(t))) return { kind: 'range', low: -Infinity, high: +m[1], lowIn: false, highIn: true };
  if ((m = new RegExp(`^(?:>|over|more than|above|greater than)\\s*${num}`).exec(t))) return { kind: 'range', low: +m[1], high: Infinity, lowIn: false, highIn: false };
  if ((m = new RegExp(`^(?:>=|≥|at least|min)\\s*${num}`).exec(t)) || (m = new RegExp(`^${num}\\s*\\+$`).exec(t))) return { kind: 'range', low: +m[1], high: Infinity, lowIn: true, highIn: false };
  if ((m = new RegExp(`^${num}$`).exec(t))) return { kind: 'number', value: +m[1] };
  return { kind: 'value', value: String(text).trim() };
}
// Does a table row key (from readKey) fit the value entered? Never true for an empty value.
export function keyMatches(key, value) {
  if (value === undefined || value === null || value === '') return false;
  if (key.kind === 'value') return String(value).toLowerCase() === key.value.toLowerCase();
  const v = Number(value);
  if (Number.isNaN(v)) return false;
  if (key.kind === 'number') return v === key.value;
  // An open end is ±Infinity, which JSON (the spec inside a built app) stores as null: null means "no limit".
  const low = key.low ?? -Infinity, high = key.high ?? Infinity;
  return (key.lowIn ? v >= low : v > low) && (key.highIn ? v <= high : v < high);
}

// A table cell that gives no value: empty, "-", a dash or "n/a". Shown as "Not stated in the guideline", never zero.
export const isNotStated = (cell) => /^\s*(-|–|—|n\/?a)?\s*$/i.test(cell ?? '');
