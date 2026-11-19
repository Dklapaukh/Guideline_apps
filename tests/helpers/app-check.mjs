/* APP CHECK (runs in its own worker thread): builds one guideline into a scratch folder and drives every route
   with the explorer. Each app gets a fresh worker because jsdom keeps memory from every page it opens, and
   exploring all apps in one heap runs out of memory. Posts back plain data; tests/apps.test.mjs does the asserts. */
import { parentPort, workerData } from 'node:worker_threads';
import { existsSync, readFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { buildGuideline } from '../../tools/build.mjs';
import { explore } from './explore.mjs';

const dir = workerData.dir;
const out = mkdtempSync(path.join(tmpdir(), 'ga-'));               // build into a scratch folder: tests never change the repo
const { spec, summary } = buildGuideline(dir, { built: 'test', outDir: out });
const meta = existsSync(`${dir}/meta.json`) ? JSON.parse(readFileSync(`${dir}/meta.json`, 'utf8')) : {};
const runs = [], seen = new Set();
for (const inputs of meta.testInputs ?? [{}]) {
  const r = await explore(path.join(out, 'app.html'), { inputs });
  runs.push({ inputs, problems: r.problems, endings: r.endings });
  r.stepsSeen.forEach((id) => seen.add(id));
}
// Steps the checker says nothing leads to; every other step must have been shown on some route.
const unreachable = JSON.parse(readFileSync(path.join(out, 'findings.json'), 'utf8')).findings
  .filter((f) => /Nothing leads to/.test(f.message)).map((f) => f.step);
const missing = spec.steps.map((s) => s.id).filter((id) => !unreachable.includes(id) && !seen.has(id));
parentPort.postMessage({ runs, missing, stepCount: spec.steps.length, reachable: summary.reachable });
