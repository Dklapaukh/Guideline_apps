# Guideline Apps

Turns guidelines (medical and non-medical) into simple phone apps that give the right information at the right
time. A prototype that builds new apps several times a day and gets more capable as it goes.

- **Dashboard** (all apps, scores, latest run): see `registry.json` → `dashboard.url`
- **Studio** (template in, app out, no AI): `registry.json` → `studio.url`
- **Template** to fill in by hand: `template/guideline-template.md`

How it works: `docs/DESIGN.md`. Build runs: `docs/ORCHESTRATOR.md`. Audits: `docs/AUDIT.md`. Queue: `docs/CURRICULUM.md`.

```
npm ci                       # once
npm test                     # build every guideline and drive every route in a fake browser
node tools/build-all.mjs     # build site/ (apps, studio, dashboard)
node tools/build.mjs guidelines/01-food-cooling   # build one
```

Everything here is a prototype and not for real-world use.
