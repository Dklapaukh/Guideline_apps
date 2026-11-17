# Guideline Apps: read this first

Turns guidelines (medical and non-medical) into simple phone apps. A prototype builder that runs every night,
unattended, and gets more capable over time. Owner: a clinician, not a programmer.

1. **Pipeline**: guideline text → filled-in template (`template/guideline-template.md`) → plain code reads and
   checks it (`engine/template.js`, `engine/check.js`) → one generic runtime draws the app (`engine/runtime.js`).
   AI is used only to draft the template from the guideline text and to review it. Never put AI calls in the
   engine, the runtime or the studio.
2. **Forgiving, not rigid**: a mistake in a template or guideline (missing step, contradiction, gap, typo in a
   quote) must become a finding with a plain-English suggestion, shown in the app's Checks tab. The build and
   the app must never fail because of it. New checks follow the same rule.
3. **Faithful to the source**: every instruction in a template quotes the guideline (`Quote:`). Never invent
   doses, times or thresholds. Where the guideline is silent or contradicts itself, say so in the step and in
   `## Notes`; don't fill the gap from general knowledge.
4. **Prototypes only**: every app shows the prototype banner; "Reviewed by" stays empty unless the owner names
   a reviewer. Nothing here is for real-world use.
5. **Never break earlier apps**: `npm test` builds every guideline and drives every route in a fake browser.
   Run it before and after every change. Never loosen a test to make it pass.
6. **Separate from Pocket Resus**: never write to the Pocket_Resus repository. It may be read only for the
   final-exam guideline (docs/CURRICULUM.md), and its clinical content must not be copied here before then.
7. **Docs hold what is true now** (rewrite, don't append history). Explain simply. Comment what each function
   does. The nightly run follows `docs/ORCHESTRATOR.md` and writes `runs/LATEST.md` for the owner.

Map: `docs/DESIGN.md` (how it works, spec format), `docs/LESSONS.md` (traps when reading guidelines),
`docs/CURRICULUM.md` (guideline queue), `docs/ORCHESTRATOR.md` (nightly procedure), `registry.json`
(published page links), `site/` (built pages), `guidelines/<nn-name>/` (one folder per guideline).
