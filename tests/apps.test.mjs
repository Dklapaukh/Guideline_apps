// Every guideline folder builds, and every route through its app works in a fake browser.
// The work for each app runs in its own worker thread (tests/helpers/app-check.mjs) so memory is freed between apps.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, existsSync } from 'node:fs';
import { Worker } from 'node:worker_threads';

// Runs app-check.mjs for one guideline folder and resolves with what it posts back.
function checkApp(dir) {
  return new Promise((resolve, reject) => {
    const w = new Worker(new URL('./helpers/app-check.mjs', import.meta.url), { workerData: { dir } });
    w.once('message', resolve);
    w.once('error', reject);
    w.once('exit', (code) => code !== 0 && reject(new Error(`app check for ${dir} stopped with code ${code}`)));
  });
}

const dirs = readdirSync('guidelines').filter((d) => existsSync(`guidelines/${d}/template.md`));
for (const d of dirs) {
  test(`${d}: builds, every reachable step can be visited, every route can finish or continue`, async () => {
    const r = await checkApp(`guidelines/${d}`);
    for (const run of r.runs) {
      assert.deepEqual(run.problems, [], `problems with inputs ${JSON.stringify(run.inputs)}`);
      assert.ok(run.endings > 0 || r.stepCount === 0, 'at least one route reaches the end');
    }
    // Every step the checker says is reachable was actually shown on some route (add testInputs to meta.json
    // when a step only appears for certain details).
    assert.deepEqual(r.missing, [], 'reachable steps the explorer never reached');
    assert.ok(r.reachable >= 1);
  });
}
