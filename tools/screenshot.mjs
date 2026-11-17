/* PHONE SCREENSHOTS of a built app with headless Chrome, so a run can look at what it built.
   Usage: node tools/screenshot.mjs site/apps/<id>.html [clicks]   e.g.  node tools/screenshot.mjs site/apps/02-burns.html "begin,next"
   clicks: comma list of data-act names ("begin", "next", "finish") or "opt:0" (first answer), applied in order.
   Writes /tmp/shots/<id>-0.png (start screen) and one PNG after each click. Look at them with the Read tool. */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const file = path.resolve(process.argv[2]);
const clicks = (process.argv[3] ?? 'begin,next').split(',').filter(Boolean);
const id = path.basename(file, '.html');
mkdirSync('/tmp/shots', { recursive: true });
const html = readFileSync(file, 'utf8');
for (let k = 0; k <= clicks.length; k++) {
  const script = clicks.slice(0, k).map((c) => c.startsWith('opt:')
    ? `document.querySelector('[data-opt="${c.slice(4)}"]').click();`
    : `document.querySelector('[data-act="${c}"]').click();`).join('');
  const page = `/tmp/shots/${id}-${k}.html`, png = `/tmp/shots/${id}-${k}.png`;
  writeFileSync(page, html.replace('</body>', `<script>try{localStorage.clear()}catch(e){}${script}</script></body>`));
  execFileSync('google-chrome', ['--headless=new', '--no-sandbox', '--disable-gpu', '--hide-scrollbars', '--window-size=390,844', '--virtual-time-budget=2000', `--screenshot=${png}`, `file://${page}`], { stdio: 'ignore', timeout: 60000 });
  console.log(png);
}
