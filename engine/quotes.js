/* QUOTE MATCHING: checks that a quote in a template really appears in the guideline's saved text.
   Adapted from Pocket Resus (src/cards/check.js), made general and forgiving:
     - an exact match ignores spacing, line breaks, quote style and dash style;
     - if there is no exact match, the closest passage is found and the differing words are reported,
       so a small typo in the template (or in the fetched copy) becomes a prompt, not a failure.
   Pure functions: no file or network access, so they run in node and in the browser. */

// Makes text comparable: same words in the same order count as the same, whatever the spacing,
// line breaks, quote style or dash style. Case is kept (a capital can matter: "Do not" vs "do not" is still caught by words).
export function sameWords(text) {
  return String(text ?? '').normalize('NFC')
    .replace(/ﬁ/g, 'fi').replace(/ﬂ/g, 'fl')   // PDF joined letters
    .replace(/[‘’‚‛′]/g, "'")
    .replace(/[“”„″]/g, '"')
    .replace(/[‐-―−]/g, '-')
    .replace(/­/g, '')                                  // soft hyphen
    .replace(/\s+/g, ' ')
    .trim();
}

// Lower-case word list used for the near-match search (punctuation dropped).
const words = (text) => sameWords(text).toLowerCase().replace(/[^\p{L}\p{N}.%/\- ]/gu, ' ').split(' ').filter(Boolean);

/* Looks for quote in sourceText. Returns
     { found: 'exact' }                                   the quote is in the source, word for word
     { found: 'near', score, passage, missing, extra }    a close passage exists; missing = quote words not in it
     { found: 'none' }                                    nothing close (or no source text to compare with)
   score is the share of quote words matched in order (0..1); 'near' needs at least 0.75. */
export function findQuote(quote, sourceText) {
  if (!sourceText) return { found: 'none', reason: 'no saved source text' };
  const want = sameWords(quote).toLowerCase();
  if (!want) return { found: 'none', reason: 'empty quote' };
  const hay = sameWords(sourceText).toLowerCase();
  if (hay.includes(want)) return { found: 'exact' };

  // Near match: slide a window the length of the quote over the source words, score by longest common subsequence.
  const q = words(quote), s = words(sourceText);
  if (!q.length || !s.length) return { found: 'none' };
  const n = q.length, span = Math.min(s.length, n + Math.ceil(n * 0.3) + 2);
  let best = { score: 0, at: 0 };
  const qset = new Set(q);
  for (let at = 0; at + 1 <= s.length; at++) {
    if (!qset.has(s[at])) continue;                       // windows start on a quote word (keeps this fast)
    const win = s.slice(at, at + span);
    const score = lcs(q, win) / n;
    if (score > best.score) best = { score, at };
    if (score === 1) break;
  }
  if (best.score < 0.75) return { found: 'none', score: best.score };
  const passageWords = s.slice(best.at, best.at + span);
  const inPassage = new Set(passageWords);
  const inQuote = new Set(q);
  return {
    found: 'near',
    score: Math.round(best.score * 100) / 100,
    passage: passageWords.join(' '),
    missing: q.filter((w) => !inPassage.has(w)),           // quote words the source does not have nearby
    extra: [...new Set(passageWords.filter((w) => !inQuote.has(w)))].slice(0, 8),
  };
}

// Length of the longest common subsequence of two word lists (standard dynamic programme, one row of memory).
function lcs(a, b) {
  const row = new Array(b.length + 1).fill(0);
  for (let i = 1; i <= a.length; i++) {
    let prev = 0;
    for (let j = 1; j <= b.length; j++) {
      const keep = row[j];
      row[j] = a[i - 1] === b[j - 1] ? prev + 1 : Math.max(row[j], row[j - 1]);
      prev = keep;
    }
  }
  return row[b.length];
}

// Numbers with units in a piece of text, e.g. "5 minutes", "0.5 mg", "20 mL/kg", "2 hours". Used to spot
// a line that says one amount while its quote says another.
const UNIT = '(?:mg|mcg|micrograms?|g|kg|ml|mL|l|L|litres?|liters?|mmol|J|joules?|%|°C|degrees|seconds?|secs?|s|minutes?|mins?|hours?|hrs?|h|days?|weeks?|times|cm|mm|m|metres?|meters?|km|breaths|compressions)';
const AMOUNT = new RegExp('(\\d+(?:\\.\\d+)?)(?:\\s?(?:-|to|–)\\s?(\\d+(?:\\.\\d+)?))?\\s?(' + UNIT + ')(?![\\p{L}])', 'giu');
export function amounts(text) {
  const out = [];
  for (const m of sameWords(text).matchAll(AMOUNT)) out.push(normalAmount(m[1], m[2], m[3]));
  return out;
}
function normalAmount(a, b, unit) {
  const u = unit.toLowerCase().replace(/s$/, '').replace(/^(min|minute)$/, 'minute').replace(/^(sec|second|s)$/, 'second')
    .replace(/^(h|hr|hour)$/, 'hour').replace(/^(litre|liter|l)$/, 'l').replace(/^(microgram|mcg)$/, 'mcg').replace(/^joule$/, 'j');
  return b ? `${a}-${b} ${u}` : `${a} ${u}`;
}
