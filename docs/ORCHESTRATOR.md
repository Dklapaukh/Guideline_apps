# Nightly run: what the orchestrator does

The scheduled task starts a fresh session each night with no memory. This page is the whole procedure. The
session is the **orchestrator**: it plans, hands work to sub-agents, checks their work, and is the only one that
publishes, commits and pushes. Nobody is watching: never stop to ask. If something needs the owner, write it
under "Needs you" in `runs/LATEST.md` and carry on with what can be done.

## 0. Set up (about 2 minutes)
1. `add_repo` (owner `Dklapaukh`, repo `Guideline_apps`, access `push`), clone into `/home/claude/guideline_apps`
   as its answer says, `register_repo_root`, then `npm ci`. `google-chrome` and `pdftotext` are installed.
2. Load the page tools in one ToolSearch call (they are deferred): `select:mcp__claude-artifacts__read_comments,
   mcp__claude-artifacts__reply_comment,mcp__claude-artifacts__get_artifact,mcp__claude-artifacts__list_files,
   mcp__claude-artifacts__publish_files,mcp__claude-artifacts__guide`. Before the first publish, call `guide`
   with topic `pages` once (the server requires it).
3. Read `CLAUDE.md`, `docs/DESIGN.md`, `docs/LESSONS.md`, `docs/CURRICULUM.md`, `runs/LATEST.md`, `registry.json`.
4. `npm test`. If it fails before you change anything, fixing it is tonight's first job.

## 1. Owner feedback first
For every slug in `registry.json` (apps, studio, dashboard): `read_comments`. Owner comments outrank the queue.
Act on each (fix a template, add a guideline to the queue, change the engine), then reply in the thread with
one or two plain sentences on what changed (`reply_comment`). If a comment is unclear, reply asking, and move on.

## 2. Choose tonight's work (in this order)
1. Anything the owner asked for in comments.
2. A failing test, or a `fix` finding in a published app.
3. The next `queued` guideline in `docs/CURRICULUM.md` (one per night; two only if both are level 1-2 and the
   first finished quickly). Row 16, the final exam, follows its own rules in that file.

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
`node tools/build-all.mjs` then `npm test` (all must pass). Then look at the new app on a phone-size screen:
`node tools/screenshot.mjs site/apps/<id>.html "begin,next,next"` writes `/tmp/shots/<id>-0.png` (start screen)
and one PNG after each tap ("begin", "next", "finish", or "opt:0" for the first answer). Open each PNG with the
Read tool and fix anything cut off, ugly or unreadable.

## 5. Publish (claude-artifacts tools)
- Which pages changed: `git status --short site/`. An unchanged app keeps its old build date, so its file is
  byte-identical and needs no republish. Republish only files that changed or are new.
- New app: `publish_files` with `files: [{as: "index.html", path: "/home/claude/guideline_apps/site/apps/<id>.html"}]`,
  `title` (the app title) and `icon` ("timer" or similar); add the returned slug and url to `registry.json`.
- Existing page: `get_artifact` (live `version`), then `list_files` (the server requires it before changing a
  page), then `publish_files` with the same `files`, `slug` and `base_version` = that version. Omit title and icon.
- Studio (if the engine or examples changed) the same way, then rebuild and publish the dashboard last
  (it contains the links). Every page stays private to the owner; never try to share anything.

## 6. Record and save
1. `docs/CURRICULUM.md`: mark the status (`built`, `built (needs review)`, or `skipped: reason`).
2. `meta.json` `status`: one line for the dashboard card (e.g. "Reviewer: 2 instructions missed, fixed").
3. `runs/<YYYY-MM-DD>.md` (today's date in New Zealand: `TZ=Pacific/Auckland date +%F`) and `runs/LATEST.md` (rewrite LATEST): plain English, short. Built; scores
   (to fix / to check / quotes confirmed / reviewer misses); building blocks added; gaps found in guidelines;
   "Needs you" (or "nothing"); what's next.
4. Rebuild and republish the dashboard so it shows LATEST.
5. Commit to `main` with a clear message and push (`git -c push.negotiate=true push origin main`).

## 7. Finish
End with a short summary (what was built, the dashboard link from `registry.json`, anything that needs the
owner). Send it with SendUserMessage if available.

## Limits
- Never write to any repository except Guideline_apps. Never weaken a test, never delete an app or its history.
- Never invent clinical or safety numbers; never mark an app reviewed.
- If a step fails twice, write down why in `runs/LATEST.md` and move on to the next step.
- Stop after two guidelines or when the work is done, whichever comes first.
