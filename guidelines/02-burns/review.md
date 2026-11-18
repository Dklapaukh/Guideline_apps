# Review: 02-burns (independent, 18 Nov 2026)

**Verdict: Works and routes are sound, but not yet faithful: several page instructions are missing and two lines change meaning; fix before publishing.**

Checked against the live page (WebFetch, twice). Build: 8 steps, 0 fix, 0 check, 9/9 quotes exact. Explorer: 34 routes, 11 endings, all 8 steps reached, no problems.

## Findings

1. **Missed: ask before touching.** Quick help says "Check that the person is happy for you to touch them before you give first aid" (and don't delay if they are unconscious and need lifesaving first aid). Not in the app. Where: start of the app. Fix: add a `Say:` at `start` or `call-check`.
2. **Child warning changed (trap 10).** Page: "Put small children or babies into a cold bath or shower for a full 20 minutes" under DO NOT, then "Remember to cool the burn not the child, so use cool (NOT cold) water." The app drops "use cool (NOT cold) water" (the reason, hypothermia). Where: `cool`. Fix: add that line with its quote.
3. **Chemical burns sent into the 20-minute heat timer.** Page says "Soak the area with lots of water" and gives no time; the template's own Note says so, yet `chemical` goes `Next: cool`, a 20-minute timer for "Pour cool water over the burn". That fills a gap the guideline leaves open (CLAUDE.md rule 3). Where: `chemical`. Fix: end the chemical route, or go to `cover` with a line saying the page gives no soaking time.
4. **Missed: bitumen.** "Very carefully try to crack the bitumen with scissors taking care not to damage the skin underneath" is only in a Note, not on screen, although the start answer offers bitumen. Where: `chemical`. Fix: add a `Do:` line.
5. **Missed: remove splashed clothing.** Cooling section says remove clothing splashed with hot liquid or chemicals, as well as tight clothing or jewellery. Only the second is in the app. Where: `cool`. Fix: add it to the clothing line.
6. **Missed: dressing choices.** Page offers a sterile dressing, or cling film or a plastic bag wrapped loosely. App only says non-adhesive dressing or cling film. The page also says why sticky dressings are bad (harm surrounding skin). Where: `cover`. Fix: add the options.
7. **Timer can be skipped.** On `cool` the only answer "Yes" (cooled 20 minutes) can be tapped at 0 minutes and goes to `cover`. There is no "No / can't cool for 20 minutes" answer (gap is in Notes, but not on screen). Where: `cool`. Fix: add an answer that shows "the page does not say; follow local advice", or rely on the timer only.
8. **Ambulance list incomplete and unquoted.** Page Quick help: larger than half the arm, severe pain, involves the eyes, or caused by a chemical or bitumen. App shows the first as quoted and the next two as a loose "The page also lists..." line. Fine as content, but the `Ask:` "Is any of these true?" reads awkwardly after one `Say:` plus a side note. Where: `call-check`. Fix: list all three as bullets under the question.
9. **Missed: signs.** "A dry cough can mean smoke or fire has damaged the airway" (plus skin signs) is not shown. A heat-burn user with a dry cough is never pointed to the airway route. Where: `start` or `call-check`. Fix: add the dry cough sign as background text or as a route hint to `smoke`.
10. **Clothing on fire: "Then: Cool the burns with lots of water."** App goes via `call-check` to `cool`, which matches. The "stop them running" line drops "or waving their arms". Minor. Where: `on-fire`.
11. **Smoke route ends without cooling or covering.** The page's smoke section gives no cooling step, so ending is faithful; just worth a one-line Note that this is deliberate.
12. **Sunburn left out** (stated in Notes). Acceptable for a prototype, but the sunburn section has its own "seek medical help if unwell or large area" line, so the Notes gap "page does not say when to see a doctor" should say "for heat burns".
13. **Electrical burns.** The page mentions electricity as a cause; the start question has no electrical answer. Page gives no separate electrical steps, so no fix beyond a Note.

No invented doses or times found. "Cool the burn, not the child" in the app is on the page (near word for word), so not invented. The "Do not" in the child warning is kept correctly.

**Missed instructions: 6** (consent to touch; cool NOT cold water; bitumen with scissors; remove splashed clothing; sterile dressing / plastic bag options; dry cough sign).

## After the review (orchestrator, 18 Nov 2026)
Fixed: 1, 2, 3 (chemical route goes to Cover with a "no soaking time" line, no 20-minute timer), 4, 5, 6, 7 (new "Cooling cut short" step), 8, 9, 10, 11, 12, 13. The exact wording the reviewer captured for findings 1, 2, 3 and 4 was added to source.txt, so those lines now carry quotes. Missed instructions now: 0 known; lines outside the captured quotes are still checked against a reworded copy only.
