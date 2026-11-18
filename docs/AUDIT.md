# Audit run: keep the code and documents easy to follow

A separate scheduled task runs this every three days in a fresh session. The goal: a human programmer who has
never seen the project can find where anything happens, see why, and trust that it is written down once.
Nobody is watching: never stop to ask. The owner has approved committing and pushing to `main`.

## 0. Set up
Same as `docs/ORCHESTRATOR.md` step 0.1 (attach, clone, `npm ci`), then `npm test`. If tests fail before you change
anything, fix that first (the cause, never the test). Read `CLAUDE.md`, every file in `docs/`, and `runs/LATEST.md`.

## 1. Check (write findings to `runs/audit-<YYYY-MM-DD>.md`, New Zealand date)
1. **Traceable**: every building block in `docs/DESIGN.md` points to the file and function that does it, and every
   file in `engine/`, `tools/`, `studio/` and `tests/` is named in a doc. Each function has a one-line comment
   saying what it does. Each app's lines trace to `source.txt` (`Quote:`) or carry a `Note:` saying why not.
2. **Understandable**: names say what things are; no function longer than about 60 lines without a reason; no
   clever one-liners where a plain loop reads better; comments explain why, not what the next line says.
3. **Once only (redundancy)**: the same rule, constant, procedure or paragraph written in two places (code or
   docs). Keep the one in the right home (the map in `CLAUDE.md` says which file owns what) and point to it from
   the other. Dead code, unused files and stale docs that describe something no longer true.
4. **True now**: docs match the code (CLAUDE.md rule 7). Commands in docs actually run.
5. **Tests**: each building block and each check has a test; nothing tested only by accident.

## 2. Fix
Fix what is safe: comments, doc wording, moving duplicated text to one place, deleting dead code, renaming for
clarity, small refactors. Every change keeps `npm test` passing and every app's behaviour unchanged (an unchanged
template must give the same `spec.json` and `findings.json`). Never weaken a test. Anything bigger (a redesign, a
behaviour change) goes in the audit file under "Suggested, not done", with the reason.

## 3. Save
Rebuild (`node tools/build-all.mjs`, `node tools/review.mjs`) and test. If an app or page changed, republish it as
in `docs/ORCHESTRATOR.md` step 5. Add one line to `runs/LATEST.md` under "Audit" (date, number of findings, fixed,
left). Commit to `main` with a message listing what changed and push. Finish with a summary of 60 words or fewer.
