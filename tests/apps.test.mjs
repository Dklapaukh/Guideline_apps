// Every guideline folder builds, and every route through its app works in a fake browser.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, existsSync, readFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { buildGuideline } from '../tools/build.mjs';
import { explore } from './helpers/explore.mjs';

const dirs = readdirSync('guidelines').filter((d) => existsSync(`guidelines/${d}/template.md`));
for (const d of dirs) {
  test(`${d}: builds, every reachable step can be visited, every route can finish or continue`, () => {
    const out = mkdtempSync(path.join(tmpdir(), 'ga-'));            // build into a scratch folder: tests never change the repo
    const { spec, summary } = buildGuideline(`guidelines/${d}`, { built: 'test', outDir: out });
    const meta = existsSync(`guidelines/${d}/meta.json`) ? JSON.parse(readFileSync(`guidelines/${d}/meta.json`, 'utf8')) : {};
    const seen = new Set();
    for (const inputs of meta.testInputs ?? [{}]) {
      const r = explore(path.join(out, 'app.html'), { inputs });
      assert.deepEqual(r.problems, [], `problems with inputs ${JSON.stringify(inputs)}`);
      assert.ok(r.endings > 0 || spec.steps.length === 0, 'at least one route reaches the end');
      r.stepsSeen.forEach((id) => seen.add(id));
    }
    // Every step the checker says is reachable was actually shown on some route (add testInputs to meta.json
    // when a step only appears for certain details).
    const reachableIds = JSON.parse(readFileSync(path.join(out, 'findings.json'), 'utf8')).findings
      .filter((f) => /Nothing leads to/.test(f.message)).map((f) => f.step);
    const missing = spec.steps.map((s) => s.id).filter((id) => !reachableIds.includes(id) && !seen.has(id));
    assert.deepEqual(missing, [], 'reachable steps the explorer never reached');
    assert.ok(summary.reachable >= 1);
  });
}
