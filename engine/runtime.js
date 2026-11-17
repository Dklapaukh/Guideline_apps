/* RUNTIME: draws a checked spec as a phone app and runs it. One generic program for every guideline:
   steps, questions, checklists, timers, repeating reminders, table look-ups and a timed log.
   It never crashes on a problem in the spec: a broken link or missing table is shown as an "author check"
   note in place, and the person can carry on.

   mount(root, { spec, findings, summary, built }) -> app   (app.state is exposed for tests)
   Uses only Date.now(), setInterval and the DOM, so tests can run it in a fake browser with a fake clock. */

import { testCondition, clock, formatDuration, keyMatches, findByName, slug } from './util.js';
import { END } from './check.js';

export function mount(root, { spec, findings = [], summary = {}, built = '' }) {
  const S = {
    screen: 'start', tab: 'steps', answers: {}, current: null, history: [], ticks: {}, log: [],
    startedAt: null, enteredAt: null, timerDone: false, reminders: {}, records: {}, note: '',
  };
  const byId = new Map(spec.steps.map((s) => [s.id, s]));
  const esc = (t) => String(t ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const now = () => Date.now();
  const log = (what, detail = '') => S.log.push({ at: now(), what, detail });
  const counts = { fix: findings.filter((f) => f.level === 'fix').length, check: findings.filter((f) => f.level === 'check').length };

  /* ---------- moving through the steps ---------- */
  function begin() {
    S.startedAt = now(); S.screen = 'run'; log('Started');
    const inputsGiven = spec.inputs.filter((i) => S.answers[i.id] !== undefined && S.answers[i.id] !== '');
    if (inputsGiven.length) log('Details', inputsGiven.map((i) => `${i.label}: ${S.answers[i.id]}${i.unit ? ' ' + i.unit : ''}`).join(', '));
    go(spec.start, null);
  }
  function go(target, why) {
    if (target === END) return finish(why);
    const step = byId.get(target);
    if (!step) { S.note = 'This leads to a step that is missing from the template (see Checks). Choose another option or go back.'; render(); return; }
    // Remember where we were, with its clock and reminders, so "Back" puts everything back as it was.
    if (S.current) S.history.push({ id: S.current, enteredAt: S.enteredAt, timerDone: S.timerDone, reminders: JSON.parse(JSON.stringify(S.reminders)) });
    S.current = step.id; S.enteredAt = now(); S.timerDone = false; S.note = '';
    for (const k of Object.keys(S.ticks)) if (k.startsWith(step.id + ':')) delete S.ticks[k];   // a repeated cycle starts with clear boxes
    log(step.title, why ?? '');
    if (step.stop) for (const id of Object.keys(S.reminders)) {
      const want = step.stop.toLowerCase();
      if (want === 'all' || slug(step.stop) === id || S.reminders[id].text.toLowerCase().startsWith(want)) { log('Reminder stopped', S.reminders[id].text); delete S.reminders[id]; }
    }
    for (const r of step.reminders) if (!S.reminders[r.id]) { S.reminders[r.id] = { text: r.text, ms: r.ms, every: r.every, once: !!r.once, dueAt: now() + r.ms, alerted: false }; log('Reminder started', `${r.text} (${r.once ? 'after' : 'every'} ${r.every})`); }
    render();
  }
  function back() {
    const prev = S.history.pop(); if (!prev) return;
    S.current = prev.id; S.enteredAt = prev.enteredAt; S.timerDone = prev.timerDone; S.reminders = prev.reminders; S.note = '';
    log('Went back to', byId.get(prev.id).title); render();
  }
  function finish(why) { S.screen = 'done'; log('Finished', why ?? ''); render(); }
  function restart() { try { localStorage.removeItem(KEY); } catch { /* fine */ } Object.assign(S, { screen: 'start', tab: 'steps', current: null, history: [], ticks: {}, log: [], startedAt: null, reminders: {}, records: {}, note: '' }); render(); }

  /* ---------- drawing ---------- */
  function render() {
    root.innerHTML = `
      <header class="bar"><div class="t">${esc(spec.title)}</div><div class="clock" data-clock="elapsed">${S.startedAt ? clock(now() - S.startedAt) : ''}</div></header>
      <div class="proto">Prototype built automatically from a guideline. ${spec.reviewedBy ? 'Reviewed by ' + esc(spec.reviewedBy) + '.' : 'Not reviewed.'} Not for real-world use.</div>
      ${reminderBar()}
      <main id="main">${S.tab === 'steps' ? (S.screen === 'start' ? startView() : S.screen === 'done' ? doneView() : stepView()) : S.tab === 'log' ? logView() : S.tab === 'checks' ? checksView() : aboutView()}</main>
      <nav class="tabs">${['steps', 'log', 'checks', 'about'].map((t) => `<button data-tab="${t}" class="${S.tab === t ? 'on' : ''}">${{ steps: 'Steps', log: 'Log', checks: `Checks${counts.fix + counts.check ? ` (${counts.fix + counts.check})` : ''}`, about: 'About' }[t]}</button>`).join('')}</nav>`;
    tick();
  }
  function startView() {
    return `<section class="card">
      <h1>${esc(spec.title)}</h1>
      ${spec.about ? `<p>${esc(spec.about)}</p>` : ''}
      ${spec.warning ? `<p class="warn">${esc(spec.warning)}</p>` : ''}
      ${counts.fix ? `<p class="author">The template has ${counts.fix} problem${counts.fix > 1 ? 's' : ''} the author needs to fix (see Checks). The app still runs.</p>` : ''}
      ${inputsForm()}
      <button class="big go" data-act="begin">Start</button></section>`;
  }
  function inputsForm() {
    if (!spec.inputs.length) return '';
    return `<div class="inputs">${spec.inputs.map((i) => `<label class="inp">${esc(i.label)}${i.unit ? ` (${esc(i.unit)})` : ''}${i.optional ? ' <small>optional</small>' : ''}
      ${i.type === 'choice'
        ? `<span class="choices">${i.options.map((o) => `<button data-input="${i.id}" data-value="${esc(o)}" class="${S.answers[i.id] === o ? 'on' : ''}">${esc(o)}</button>`).join('')}</span>`
        : `<input inputmode="decimal" data-num="${i.id}" value="${esc(S.answers[i.id] ?? '')}" placeholder="${i.min != null ? `${i.min}–${i.max}` : ''}">`}
      <span class="bad" data-bad="${i.id}">${esc(numberProblem(i, S.answers[i.id]) ?? '')}</span></label>`).join('')}</div>`;
  }
  function numberProblem(i, v) {
    if (i.type !== 'number' || v === undefined || v === '') return null;
    const x = Number(v);
    if (Number.isNaN(x)) return 'Not a number';
    if ((i.min != null && x < i.min) || (i.max != null && x > i.max)) return `Outside ${i.min}–${i.max}`;
    return null;
  }
  function stepView() {
    const s = byId.get(S.current);
    const lines = s.lines.filter((l) => l.kind !== 'note').map(lineView).join('');
    const opts = (s.ask?.options ?? []).map((o, k) => {
      const shown = testCondition(o.cond, S.answers, spec.inputs);
      if (shown === false) return '';
      return `<button class="big opt${o.target ? '' : ' broken'}" data-opt="${k}">${esc(o.label)}${shown === null ? ' <small>(depends on details)</small>' : ''}</button>`;
    }).join('');
    const next = nextTarget(s);
    const final = s.end || (!opts && !next && !s.timer?.target);
    return `<section class="card step">
      <div class="crumb">${S.history.length ? `<button class="link" data-act="back">‹ Back</button>` : ''}<span>Step ${S.history.length + 1}</span></div>
      <h2>${esc(s.title)}</h2>
      ${lines}
      ${s.timer ? `<div class="timer ${S.timerDone ? 'due' : ''}"><div class="lbl">${esc(s.timer.label)}</div><div class="big-clock" data-clock="timer">${clock(s.timer.ms)}</div>
         ${S.timerDone && s.timer.target ? `<button class="big go" data-act="timer-go">Time's up: continue</button>` : ''}
         ${s.timer.to && !s.timer.target ? `<p class="author">The timer leads to "${esc(s.timer.to)}", which is missing.</p>` : ''}</div>` : ''}
      ${s.ask ? `<p class="q">${esc(s.ask.question)}</p><div class="opts">${opts || '<p class="author">No answer applies with the details entered (see Checks).</p>'}</div>` : ''}
      ${S.note ? `<p class="author">${esc(S.note)}</p>` : ''}
      ${next ? `<button class="big ${s.ask ? 'skip' : 'go'}" data-act="next">${s.ask ? 'Skip' : 'Next'}: ${esc(byId.get(next)?.title ?? 'Finish')}${nextDepends(s) ? ' <small>(depends on details not entered)</small>' : ''}</button>` : ''}
      ${final ? `<button class="big go" data-act="finish">Finish</button>` : ''}
    </section>`;
  }
  // The first "Next" whose condition is true; one that depends on details not yet entered only if nothing else fits.
  function nextTarget(s) {
    const list = (s.nexts ?? []).filter((n) => n.target);
    return list.find((n) => testCondition(n.cond, S.answers, spec.inputs) === true)?.target
      ?? list.find((n) => testCondition(n.cond, S.answers, spec.inputs) === null)?.target ?? null;
  }
  const nextDepends = (s) => { const t = nextTarget(s); const n = (s.nexts ?? []).find((x) => x.target === t); return n && testCondition(n.cond, S.answers, spec.inputs) === null; };
  function lineView(l, k) {
    const shown = testCondition(l.cond, S.answers, spec.inputs);
    if (shown === false) return '';
    const dep = shown === null ? `<small class="dep">Depends on: ${esc(l.cond.map((c) => c.input).join(', '))}</small>` : '';
    const q = l.quotes?.length ? `<details class="src"><summary>Guideline</summary>${l.quotes.map((x) => `<q>${esc(x.text)}</q>${x.where ? ` <small>${esc(x.where)}</small>` : ''}${x.check && x.check !== 'exact' ? ' <small class="dep">quote not confirmed</small>' : ''}`).join('<br>')}</details>` : '';
    const key = `${S.current}:${k}`;
    if (l.kind === 'do') return `<label class="do"><input type="checkbox" data-tick="${key}" ${S.ticks[key] ? 'checked' : ''}> <span>${esc(l.text)}</span>${dep}${q}</label>`;
    if (l.kind === 'warning') return `<p class="warn">${esc(l.text)}${dep}${q}</p>`;
    if (l.kind === 'record') { const r = S.records[l.text]; return `<div class="rec"><button class="big rec-btn" data-rec="${esc(l.text)}">${esc(l.text)}</button><small data-clock="rec" data-rec-name="${esc(l.text)}">${r ? `${r.n}× · last ${formatDuration(now() - r.last)} ago` : 'not yet'}</small>${dep}${q}</div>`; }
    if (l.kind === 'show') return `<div class="show">${showTable(l)}${dep}${q}</div>`;
    return `<p class="${l.bullet ? 'bul' : ''}">${esc(l.text)}${dep}${q}</p>`;
  }
  function showTable(l) {
    const t = spec.tables.find((x) => x.id === l.tableId);
    if (!t) return `<p class="author">"${esc(l.table)}" table is missing from the template.</p>`;
    const cols = l.column ? t.columns.filter((c) => slug(c) === slug(l.column)) : t.columns.slice(1);
    if (!t.keyInput) return `<table><tr>${t.columns.map((c) => `<th>${esc(c)}</th>`).join('')}</tr>${t.rows.map((r) => `<tr>${t.columns.map((c) => `<td>${cell(r.cells[c])}</td>`).join('')}</tr>`).join('')}</table>`;
    const inp = spec.inputs.find((i) => i.id === t.keyInput);
    const v = S.answers[inp.id];
    if (v === undefined || v === '') return `<p><b>${esc(t.title)}:</b> enter ${esc(inp.label)} to see this. <button class="link" data-tab="about">Enter details</button></p>`;
    const row = t.rows.find((r) => keyMatches(r.match, v));
    if (!row) return `<p class="author"><b>${esc(t.title)}:</b> the table has no row for ${esc(inp.label)} ${esc(v)}${inp.unit ? ' ' + esc(inp.unit) : ''}.</p>`;
    return `<div class="lookup"><div class="lk">${esc(t.title)} <small>(${esc(row.key)})</small></div>${cols.map((c) => `<div class="lv"><span>${esc(c)}</span><b>${cell(row.cells[c])}</b></div>`).join('')}</div>`;
  }
  const cell = (v) => (/^\s*(-|–|—|n\/?a)?\s*$/i.test(v ?? '') ? '<i>Not stated in the guideline</i>' : esc(v));
  function reminderBar() {
    const list = Object.entries(S.reminders);
    if (!list.length) return '';
    return `<div class="reminders">${list.map(([id, r]) => `<div class="rem" data-rem="${id}"><span class="rt">${esc(r.text)}</span><span class="rc" data-clock="rem" data-rem-id="${id}"></span>${r.once && !r.alerted ? '' : `<button data-remdone="${id}">${r.once ? 'OK' : 'Done'}</button>`}<button class="x" data-remstop="${id}" title="Stop">✕</button></div>`).join('')}</div>`;
  }
  function doneView() {
    return `<section class="card"><h2>Finished</h2><p>Total time ${clock((S.log.at(-1)?.at ?? now()) - (S.startedAt ?? now()))}.</p>${logList()}<button class="big" data-act="copy">Copy log</button><button class="big go" data-act="restart">Start again</button></section>`;
  }
  function logView() { return `<section class="card"><h2>Log</h2>${S.log.length ? logList() + '<button class="big" data-act="copy">Copy log</button>' : '<p>Nothing yet.</p>'}</section>`; }
  function logList() { return `<ol class="log">${S.log.map((e) => `<li><time>${S.startedAt ? clock(e.at - S.startedAt) : ''}</time> ${esc(e.what)}${e.detail ? ` <small>${esc(e.detail)}</small>` : ''}</li>`).join('')}</ol>`; }
  function logText() { return S.log.map((e) => `${S.startedAt ? clock(e.at - S.startedAt) : ''}  ${e.what}${e.detail ? ' - ' + e.detail : ''}`).join('\n'); }
  function checksView() {
    const order = ['fix', 'check', 'info'];
    const name = { fix: 'Needs fixing', check: 'Please check', info: 'For information' };
    const stepTitle = (id) => byId.get(id)?.title ?? id;
    return `<section class="card"><h2>Author checks</h2><p>Found automatically by comparing the template with itself and with the guideline text. Fix them in the template; the app keeps running meanwhile.</p>
      ${order.map((lvl) => { const fs = findings.filter((f) => f.level === lvl); return fs.length ? `<h3 class="lvl-${lvl}">${name[lvl]} (${fs.length})</h3><ul class="findings">${fs.map((f) => `<li class="lvl-${lvl}">${f.step ? `<b>${esc(stepTitle(f.step))}</b> · ` : ''}${f.line ? `<small>line ${f.line}</small> ` : ''}${esc(f.message)}${f.suggestion ? `<br><i>${esc(f.suggestion)}</i>` : ''}</li>`).join('')}</ul>` : ''; }).join('') || '<p>No findings.</p>'}
    </section>`;
  }
  function aboutView() {
    return `<section class="card"><h2>About</h2>${spec.about ? `<p>${esc(spec.about)}</p>` : ''}
      ${spec.inputs.length ? `<h3>Details</h3>${inputsForm()}` : ''}
      <h3>Source</h3><ul>${spec.sources.map((s) => `<li>${esc(s.name)}${s.link ? ` <a href="${esc(s.link)}" target="_blank" rel="noopener">link</a>` : ''}</li>`).join('') || '<li>Not stated</li>'}</ul>
      <p><small>${spec.version ? 'Guideline version: ' + esc(spec.version) + ' · ' : ''}${built ? 'Built ' + esc(built) + ' · ' : ''}${summary.quotes != null ? `${summary.quotesExact}/${summary.quotes} quotes confirmed` : ''}</small></p>
      ${S.screen !== 'start' ? '<button class="big" data-act="restart">Start again</button>' : ''}</section>`;
  }

  /* ---------- the clock: countdowns, reminders (checked from the state, whichever tab is open) ---------- */
  function tick() {
    const t = now();
    const s = S.screen === 'run' && S.current && byId.get(S.current);
    if (s?.timer && !S.timerDone && t - S.enteredAt >= s.timer.ms) { S.timerDone = true; log('Timer finished', `${s.title}: ${s.timer.label}`); buzz(); render(); return; }
    let newlyDue = false;
    for (const r of Object.values(S.reminders)) if (r.dueAt <= t && !r.alerted) { r.alerted = true; newlyDue = true; log(r.once ? 'Deadline reached' : 'Reminder due', r.text); buzz(); }
    if (newlyDue) { render(); return; }
    save();
    for (const el of root.querySelectorAll('[data-clock]')) {
      const kind = el.dataset.clock;
      if (kind === 'elapsed' && S.startedAt) el.textContent = clock(t - S.startedAt);
      if (kind === 'timer' && s?.timer) el.textContent = clock(s.timer.ms - (t - S.enteredAt));
      if (kind === 'rem') {
        const r = S.reminders[el.dataset.remId]; if (!r) continue;
        const left = r.dueAt - t;
        el.textContent = left > 0 ? clock(left) : `${r.once ? 'NOW' : 'DUE'} · ${clock(-left)} ago`;
        el.parentElement.classList.toggle('due', left <= 0);
      }
      if (kind === 'rec') { const r = S.records[el.dataset.recName]; if (r) el.textContent = `${r.n}× · last ${formatDuration(t - r.last)} ago`; }
    }
  }
  // Alert: vibrate where the phone allows it, and two short beeps (sound works after the first tap on Start).
  let audio = null;
  const buzz = () => {
    try { navigator.vibrate?.([200, 100, 200]); } catch { /* not supported */ }
    try {
      audio ??= new (window.AudioContext || window.webkitAudioContext)();
      for (const at of [0, 0.3]) { const o = audio.createOscillator(), g = audio.createGain(); o.frequency.value = 880; g.gain.value = 0.2; o.connect(g); g.connect(audio.destination); o.start(audio.currentTime + at); o.stop(audio.currentTime + at + 0.18); }
    } catch { /* no sound available */ }
  };
  // Keeps the run through a page reload (one phone, one browser). Times are absolute, so clocks carry on correctly.
  const KEY = 'guideline-app:' + slug(spec.title);
  let lastSaved = '';
  function save() { try { const j = JSON.stringify(S); if (j !== lastSaved) { localStorage.setItem(KEY, j); lastSaved = j; } } catch { /* storage unavailable */ } }
  function load() { try { const j = localStorage.getItem(KEY); if (j) { const old = JSON.parse(j); if (old.screen === 'run' && old.current && byId.has(old.current)) { Object.assign(S, old, { tab: 'steps', note: 'Carried on from where this was left (the page was reloaded).' }); } } } catch { /* ignore a bad save */ } }

  /* ---------- taps ---------- */
  root.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    const d = b.dataset;
    if (d.tab) { S.tab = d.tab; render(); return; }
    if (d.input) { S.answers[d.input] = S.answers[d.input] === d.value ? undefined : d.value; if (S.screen === 'run') log('Detail changed', `${d.input}: ${d.value}`); render(); return; }
    if (d.opt !== undefined) {
      const s = byId.get(S.current), o = s.ask.options[+d.opt];
      if (!o.target) { S.note = `"${o.label}" leads to "${o.to}", which is missing from the template (see Checks).`; render(); return; }
      return go(o.target, `${s.ask.question || s.title}: ${o.label}`);
    }
    if (d.rec) { const r = (S.records[d.rec] ??= { n: 0, last: 0 }); r.n++; r.last = now(); log(d.rec); render(); return; }
    if (d.remdone) {
      const r = S.reminders[d.remdone];
      if (r) { log('Done', r.text); if (r.once) delete S.reminders[d.remdone]; else { r.dueAt = now() + r.ms; r.alerted = false; } }   // a deadline is never pushed back
      render(); return;
    }
    if (d.remstop) { const r = S.reminders[d.remstop]; if (r) log('Reminder stopped', r.text); delete S.reminders[d.remstop]; render(); return; }
    switch (d.act) {
      case 'begin': try { audio ??= new (window.AudioContext || window.webkitAudioContext)(); } catch { /* no sound */ } return begin();
      case 'back': return back();
      case 'next': return go(nextTarget(byId.get(S.current)), 'Next');
      case 'timer-go': return go(byId.get(S.current).timer.target, 'Timer finished');
      case 'finish': return finish();
      case 'restart': return restart();
      case 'copy': try { navigator.clipboard?.writeText(logText()); b.textContent = 'Copied'; } catch { b.textContent = 'Could not copy'; } return;
    }
  });
  root.addEventListener('change', (e) => {
    const el = e.target;
    if (el.dataset.num && S.screen === 'run') log('Detail changed', `${el.dataset.num}: ${el.value.trim()}`);
    if (el.dataset.tick) { S.ticks[el.dataset.tick] = el.checked; const s = byId.get(S.current); const l = s?.lines.filter((x) => x.kind !== 'note')[+el.dataset.tick.split(':').pop()]; log(el.checked ? 'Ticked' : 'Unticked', l?.text ?? ''); }
  });
  root.addEventListener('input', (e) => {
    const el = e.target;
    if (el.dataset.num) {
      S.answers[el.dataset.num] = el.value.trim();
      const i = spec.inputs.find((x) => x.id === el.dataset.num);
      const bad = root.querySelector(`[data-bad="${el.dataset.num}"]`); if (bad) bad.textContent = numberProblem(i, el.value.trim()) ?? '';
    }
  });

  load();
  const timer = setInterval(tick, 250);
  render();
  return { state: S, render, stop: () => clearInterval(timer) };
}

export { findByName };
