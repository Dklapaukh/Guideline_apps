# Traps when turning a guideline into an app

Started from what building Pocket Resus taught; the nightly runs add to it. The author and the reviewer check
every template against this list. Where a trap applies, write it in the step (`Say:`/`Warning:`) and in `## Notes`.

1. **A range where the app needs one value** ("20–25 J", "1–2 litres"). Show the range as printed; don't pick
   a value. If the app must act on one number, say which and why in Notes.
2. **"-" or an empty cell means "not stated / seek advice", not zero.** Write `-` in the table.
3. **Bands, not exact values.** Tables headed "5 kg, 10 kg, 20 kg" usually mean bands (up to 5, up to 10...).
   Write rows as ranges; say how in-between values round (up or down) and quote where the guideline says so.
4. **Ages and part-years.** "1 year" vs "11 months"; "under 1" vs "1 or under". Quote the rule; don't assume.
5. **A specific instruction beats a general one** (a drug-specific page beats a general table; a printed dose
   beats a formula). If two parts of the guideline disagree, keep both visible and flag it.
6. **Timing words.** "Every 4 minutes", "after 3 shocks", "within 2 hours", "repeat once": what starts the
   clock, does it include earlier events, what happens when it's missed? Gaps go in Notes.
7. **Limits that overlap.** Two rules on the same clock (2 h + 4 h stages, 6 h total) can disagree at the edges.
   Flag which one the app shows first; don't silently pick.
8. **Things the guideline leaves to judgement** ("clinical judgement must be used", "consider"). Show them as
   text, never as an automatic action.
9. **Background text vs instructions.** Only instructions become steps; background can go in `About:`.
10. **Words that change meaning when cut**: "Do not", "unless", "except", "only if". A quote must not drop them.
11. **Units.** mg vs mcg, mL vs L, °C. A number without a unit is a finding.
12. **Version and date.** Record the guideline's version/date in `Version:`; guidelines change.
13. **Gaps in the guideline itself** (e.g. a limit with no "what to do if missed"). Say plainly in the app that
    the guideline does not say, and suggest following local procedure. Don't invent the answer.
