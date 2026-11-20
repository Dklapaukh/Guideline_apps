/* PHONE SCREENSHOTS of a built app with headless Chrome, so a run can look at what it built.
   Usage: node tools/screenshot.mjs site/apps/<id>.html [clicks] [--look=<id>] [--open] [--tall]
     e.g.  node tools/screenshot.mjs site/apps/02-burns.html "begin,next" --look=rescue --open
   clicks: comma list of data-act names ("begin", "next", "finish"), "opt:0" (first answer) or "tab:log" (a tab),
           applied in order.
   --look=<id>  opens the app in that look (clinic, wayfinding, flightdeck, rescue), as if picked under About.
   --open       opens every fold ("More detail", "Sources for this screen") before the picture is taken.
   --tall       a taller window (390 x 1800), to see a whole long screen at once.
   Writes /tmp/shots/<id>[-<look>]-0.png (start screen) and one PNG after each click. Look at them with the Read tool. */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const args = process.argv.slice(2);
const flags = args.filter((a) => a.startsWith('--'));
const [fileArg, clickArg] = args.filter((a) => !a.startsWith('--'));
const look = flags.find((f) => f.startsWith('--look='))?.slice(7) ?? '';
const openFolds = flags.includes('--open'), tall = flags.includes('--tall');
const file = path.resolve(fileArg);
const clicks = (clickArg ?? 'begin,next').split(',').filter(Boolean);
const id = path.basename(file, '.html') + (look ? '-' + look : '');
mkdirSync('/tmp/shots', { recursive: true });
const html = readFileSync(file, 'utf8');
// Before the app starts: forget any earlier run on this browser, and pick the look if one was asked for.
const before = `<script>try{localStorage.clear();${look ? `localStorage.setItem('guideline-app-look', ${JSON.stringify(look)});` : ''}}catch(e){}</script>`;
// The JavaScript for one tap.
const tap = (c) => c.startsWith('opt:') ? `document.querySelector('[data-opt="${c.slice(4)}"]').click();`
  : c.startsWith('tab:') ? `document.querySelector('[data-tab="${c.slice(4)}"]').click();`
  : `document.querySelector('[data-act="${c}"]').click();`;
for (let k = 0; k <= clicks.length; k++) {
  const script = clicks.slice(0, k).map(tap).join('') + (openFolds ? `document.querySelectorAll('details').forEach(function(d){d.open=true});` : '');
  const page = `/tmp/shots/${id}-${k}.html`, png = `/tmp/shots/${id}-${k}.png`;
  writeFileSync(page, html.replace('<head>', '<head>' + before).replace('</body>', `<script>${script}</script></body>`));
  execFileSync('google-chrome', ['--headless=new', '--no-sandbox', '--disable-gpu', '--hide-scrollbars', `--window-size=390,${tall ? 1800 : 844}`, '--virtual-time-budget=2000', `--screenshot=${png}`, `file://${page}`], { stdio: 'ignore', timeout: 60000 });
  console.log(png);
}
