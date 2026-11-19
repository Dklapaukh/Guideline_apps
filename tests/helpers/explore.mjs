/* EXPLORER: drives a built app through every route the person could take (every answer, Next, timer
   and finish), from a fixed start, and reports what it found. Used by tests and by the nightly run to
   prove an app works without anyone tapping through it.
   explore(htmlPath, { inputs, maxRoutes }) -> { stepsSeen:Set, endings, routes, problems:[text] } */
import { openApp } from './fake-browser.mjs';

// Breadth-first: each new route is one more move added to a route already tried.
export function explore(htmlPath, { inputs = {}, maxRoutes = 400, maxDepth = 40 } = {}) {
  const stepsSeen = new Set(), problems = [];
  let routes = 0, endings = 0;
  // A route is a list of choices; replay it from a fresh app each time (simple and repeatable).
  const queue = [[]];
  const seenStates = new Set();
  while (queue.length && routes < maxRoutes) {
    const route = queue.shift();
    const app = openApp(htmlPath);
    try {
      setInputs(app, inputs);
      app.click('[data-act="begin"]');
      for (const choice of route) act(app, choice);
    } catch (e) { problems.push(`route ${JSON.stringify(route)}: ${e.message}`); continue; }
    if (app.errors.length) problems.push(`route ${JSON.stringify(route)}: page error ${app.errors.join('; ')}`);
    routes++;
    const S = app.state;
    if (S.screen === 'done') { endings++; continue; }
    stepsSeen.add(S.current);
    const key = S.current + '|' + route.filter((c) => c.startsWith('opt')).slice(-3).join(',');
    if (route.length >= maxDepth || seenStates.has(S.current + '|' + route.length) ) continue;
    if (seenStates.has(key) && route.length > 2) continue;   // loops: each step/answer pair explored once
    seenStates.add(key);
    const options = app.$$('[data-opt]').map((b) => 'opt:' + b.dataset.opt);
    const moves = [...options];
    if (app.$('[data-act="next"]')) moves.push('next');
    if (app.$('[data-act="finish"]')) moves.push('finish');
    const step = app.window.__app.state.current;
    const spec = JSON.parse(app.window.document.getElementById('spec').textContent).spec;
    const s = spec.steps.find((x) => x.id === step);
    if (s.timer?.target) moves.push('timer');
    if (!moves.length) problems.push(`step "${s.title}" has nothing to tap (route ${JSON.stringify(route)})`);
    for (const m of moves) queue.push([...route, m]);
  }
  return { stepsSeen, endings, routes, problems };
}

// Enters the test details: taps a choice button, or types into a number box.
function setInputs(app, inputs) {
  for (const [id, v] of Object.entries(inputs)) {
    const choice = app.$(`[data-input="${id}"][data-value="${v}"]`);
    if (choice) app.click(choice); else app.type(`[data-num="${id}"]`, String(v));
  }
}
// Makes one move on the current step: an answer, Next, Finish, or letting the timer run out and continuing.
function act(app, choice) {
  if (choice.startsWith('opt:')) app.click(`[data-opt="${choice.slice(4)}"]`);
  else if (choice === 'next') app.click('[data-act="next"]');
  else if (choice === 'finish') app.click('[data-act="finish"]');
  else if (choice === 'timer') {
    const spec = JSON.parse(app.window.document.getElementById('spec').textContent).spec;
    const s = spec.steps.find((x) => x.id === app.state.current);
    app.advance(s.timer.ms + 1000);
    app.click('[data-act="timer-go"]');
  }
}
