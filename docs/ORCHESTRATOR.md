# Scheduled run: what the orchestrator does

A scheduled task starts a fresh session every four hours with no memory. This page is the whole procedure. The
session is the **orchestrator**: it plans, hands work to sub-agents, checks their work, and is the only one that
publishes, commits and pushes. Nobody is watching: never stop to ask. If something needs the owner, write it
under "Needs you" in `runs/LATEST.md` and carry on with what can be done.

## 0. Set up (about 2 minutes)
1. `add_repo` (owner `Dklapaukh`, repo `Guideline_apps`, access `push`), clone into `/home/claude/guideline_apps`
   as its answer says, `register_repo_root`, then `npm ci`. `google-chrome` and `pdftotext` are installed.
2. Pages are published with the **Artifact** tool and their feedback database read with **ArtifactData** (load it with
   ToolSearch `select:ArtifactData` if it is deferred). Before the first new page, call Artifact `action: "quickstart"`
   once, as that tool requires.
3. Read `CLAUDE.md`, `docs/DESIGN.md` (including "Looks and the owner's design brief"), `docs/LESSONS.md`, `docs/CURRICULUM.md`, `runs/LATEST.md`, `registry.json`.
4. `npm test`. If it fails before you change anything, fixing it is tonight's first job.

## 1. Owner feedback first
1. **Design review**: ArtifactData `list` the collections `reactions` and `comments` of the review page
   (`registry.json` → `review.url`). Reactions are love / parts / no per look; comments name the look they were left on.
   Act on them (change a look in `engine/looks/`, drop a look nobody likes, add a new one from another field) and
   record what changed in `runs/LATEST.md`.
2. **Comments on pages**: for every page in `registry.json`, read comments sent to Claude (ArtifactComments tool, if
   available) and reply in one or two plain sentences on what changed. Owner comments outrank the queue. If a
   comment is unclear, reply asking, and move on.

## 2. Choose tonight's work (in this order)
1. Anything the owner asked for in comments.
2. A failing test, or a `fix` finding in a published app.
3. The next `queued` guideline in `docs/CURRICULUM.md` (one per run; two only if both are level 1-2 and the
   first finished quickly). The last row, the final exam, follows its own rules in that file.

## 3. Sub-agents (use the Agent tool with model "opus"; give each a complete brief; they don't see this chat)
Run 3a and then 3b in sequence; 3c only if needed; 3d always, and it must not be the agent that wrote the template.

**3a. Researcher.** Find the current official version of the guideline (New Zealand source first). Save to
`guidelines/<nn-short-name>/`: `source.txt` (the guideline's own words only, never a summary; WebSearch result
excerpts are word for word and can be pieced together; WebFetch output is often reworded, so use it only to
understand, or mark the copy `web-fetch`), and `meta.json` (`id, title, domain, level, url, version, sourceCopy,
sourceNote`, optional `testInputs` list for the explorer). If a PDF of the guideline is in `sources/` (the owner may upload them there), extract it
with `pdftotext -layout` instead and mark `sourceCopy: "pdf"`. Report what could not be captured.

**3b. Author.** Fill `template.md` from `template/guideline-template.md` using only `source.txt` (and the
researcher's notes). Every instruction gets a `Quote:` copied exactly from `source.txt`. Follow
`docs/LESSONS.md`. Design for "right information at the right time": timers and reminders where the guideline
gives times, questions where it branches, tables where it gives numbers by size or age. Gaps and contradictions
in the guideline go in the step (plainly) and in `## Notes`. Leave `Reviewed by:` empty. Then run
`node tools/build.mjs guidelines/<id>` and fix every `fix` finding and every `check` finding that is the
template's fault; leave the ones that are the guideline's fault, explained in Notes.

**3c. Engine builder (only when the guideline needs something the runtime can't do).** Add the smallest new
building block that does it (reader in `engine/template.js`, checks in `engine/check.js`, drawing in
`engine/runtime.js`, help text in `template/guideline-template.md`, a row in `docs/DESIGN.md`, tests in
`tests/`). It must stay forgiving (bad input = finding, never a crash) and every earlier app must still pass
`npm test`. Prefer general blocks (a counter, a score, a second clock) over guideline-specific code.

**3d. Reviewer (fresh agent, sceptical, has not seen the authoring).** Compare `template.md` with `source.txt`
line by line: anything left out, changed, invented, mis-ordered, or a trap from `docs/LESSONS.md` missed. Open
the built app in the fake browser (`tests/helpers/explore.mjs`) and try the main routes. Write
`guidelines/<id>/review.md`: verdict, numbered findings, and a "missed instructions" count. The orchestrator then
fixes what can be fixed (back to 3b, at most twice) and leaves the rest listed in review.md.

## 4. Build, test, look
`node tools/build-all.mjs`, `node tools/review.mjs` (puts the newest app into the design review page, one copy per
look) then `npm test` (all must pass). Then look at the new app on a phone-size screen: `node tools/screenshot.mjs
site/apps/<id>.html "begin,next,next"` writes `/tmp/shots/<id>-0.png` and one PNG after each tap ("begin", "next",
"finish", or "opt:0" for the first answer). If `google-chrome` is missing, use Playwright (`require('playwright')`,
`chromium.launch()`) the same way. Open each PNG with the Read tool and fix anything cut off, ugly or unreadable,
in every look.

## 5. Publish (Artifact tool)
- Which pages changed: `git status --short site/`. An unchanged app keeps its old build date, so its file is
  byte-identical and needs no republish. Republish only files that changed or are new.
- New app: Artifact publish with `file_path` = `site/apps/<id>.html`, `icon` "timer" and a one-sentence `description`;
  add the returned url to `registry.json` under `apps`.
- Existing page (an app, studio, dashboard): Artifact `action: "read"` of its url first (the server refuses a
  publish to a page this session has not read), then publish the new file with `url` set. Omit `icon`.
- Review page: publish `site/review.html` to `registry.json` → `review.url` the same way. Omit `capabilities` so its
  feedback database stays declared. Old feedback is kept; each item carries the round it belongs to.
- Publish the dashboard last (it contains the links). Every page stays private to the owner; never share anything.

## 6. Record and save
1. `docs/CURRICULUM.md`: mark the status (`built`, `built (needs review)`, or `skipped: reason`).
2. `meta.json` `status`: one line for the dashboard card (e.g. "Reviewer: 2 instructions missed, fixed").
3. `runs/<YYYY-MM-DD>.md` (today's date in New Zealand: `TZ=Pacific/Auckland date +%F`) and `runs/LATEST.md` (rewrite LATEST): plain English, short. Built; scores
   (to fix / to check / quotes confirmed / reviewer misses); building blocks added; gaps found in guidelines;
   "Needs you" (or "nothing"); what's next.
4. Rebuild and republish the dashboard so it shows LATEST.
5. Commit to `main` with a clear message and push (`git -c push.negotiate=true push origin main`).

## 7. Finish
End with a short summary for a phone screen: what was built, the dashboard and review links from `registry.json`,
anything that needs the owner. The owner reads it on a phone, so keep it under 80 words.

## When the queue is empty
Improve what exists, in this order: the owner's design feedback, the looks (try one new look from a field not yet
tried, such as wayfinding, cockpit, kitchen tickets or sports scoreboards), findings in published apps, then add
new rows to the queue (mixed medical and non-medical, New Zealand sources first) and build them.

## Limits
- Never write to any repository except Guideline_apps. Never weaken a test, never delete an app or its history.
- Never invent clinical or safety numbers; never mark an app reviewed.
- If a step fails twice, write down why in `runs/LATEST.md` and move on to the next step.
- Stop after two guidelines or when the work is done, whichever comes first.
