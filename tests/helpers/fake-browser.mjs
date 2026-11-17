/* FAKE BROWSER: opens a built app.html in jsdom with a controlled clock, so tests can tap through it.
   Adapted from Pocket Resus tests/helpers/dom-app.mjs. */
import { JSDOM } from 'jsdom';
import { readFileSync } from 'node:fs';

export const T0 = 1700000000000;          // fixed start time

export function openApp(htmlPath) {
  const html = readFileSync(htmlPath, 'utf8');
  let now = T0, tickFn = null;
  const errors = [];
  const dom = new JSDOM(html, {
    url: 'https://example.test/', pretendToBeVisual: true, runScripts: 'dangerously',
    beforeParse(w) {
      const RealDate = w.Date;
      class FakeDate extends RealDate { constructor(...a) { a.length ? super(...a) : super(now); } static now() { return now; } }
      w.Date = FakeDate;
      w.setInterval = (fn) => { tickFn = fn; return 1; };
      w.addEventListener('error', (e) => errors.push(e.message));
      w.navigator.vibrate = () => true;
    },
  });
  const w = dom.window;
  const $ = (sel) => w.document.querySelector(sel);
  const $$ = (sel) => [...w.document.querySelectorAll(sel)];
  const api = {
    window: w, errors, $, $$,
    get state() { return w.__app.state; },
    get now() { return now; },
    advance(ms) { now += ms; tickFn && tickFn(); },
    click(sel) {
      const el = typeof sel === 'string' ? $(sel) : sel;
      if (!el) throw new Error('Nothing to click: ' + sel);
      el.dispatchEvent(new w.MouseEvent('click', { bubbles: true, cancelable: true }));
      tickFn && tickFn();
    },
    type(sel, value) {
      const el = $(sel); if (!el) throw new Error('No field: ' + sel);
      el.value = value; el.dispatchEvent(new w.Event('input', { bubbles: true })); el.dispatchEvent(new w.Event('change', { bubbles: true }));
    },
    tick(sel) { const el = $(sel); el.checked = !el.checked; el.dispatchEvent(new w.Event('change', { bubbles: true })); },
    text() { return w.document.getElementById('main').textContent.replace(/\s+/g, ' ').trim(); },
  };
  return api;
}
