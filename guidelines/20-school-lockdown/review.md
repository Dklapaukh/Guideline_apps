# Review: 20-school-lockdown

Verdict: Pass with fixes. The template is faithful line by line: 146 of 146 quotes are exact, no time, number or signal is invented, the 2025 edition is only ever shown as "2025 edition:" in More, and the gaps (no national alert or all-clear signal, no rule for a knock at the door, no blinds or lights advice, no time limits) are said plainly instead of filled in. But the lead route tells everyone to "Call Police on 111" even on a shelter in place for wasps or when Police started it (the guide's "(if relevant)" was dropped). A teacher who meets an attacker is never told to alert the principal or staff. The threat route has no answer for "Police have not decided yet". The attack route counts "111 called" twice. Fix findings 1 to 6 before publishing; the rest are smaller.

Checked by: an independent reviewer (AI) on 20 Nov 2026. I compared template.md with source.txt (sources A to F) and the meta.json sourceNote line by line, and checked it against docs/LESSONS.md. Built with `node tools/build.mjs guidelines/20-school-lockdown`: 33 steps, all reachable; 0 fix, 0 check, 8 info; 146 of 146 quotes exact. Explorer: 400 routes, 7 endings, 33 of 33 steps seen, no problems. In the fake browser I tapped through these routes by hand (tapping every Record button and reading the Log):
- attacker near me -> hide -> tell111 -> "Lockdown not called yet: I can call it" -> lockdown -> alert -> call111
- attacker near me -> escape -> tell111 -> lockdown
- I am calling it -> lockdown -> alert -> call111 -> roll -> secure -> staff -> tell -> hold -> stepdown -> hold -> lifted -> reunite
- Police told us -> told -> alert -> call111
- staff heard alert -> room -> room-lock -> room-roll -> room-hold -> knock -> room-hold -> room-lifted
- staff heard alert -> "Not told yet" -> room-unsure
- threat by email, post or phone -> threat -> "Something else" -> other (Finished)

Phone screenshots (flightdeck) of start, called, alert/call111, room-lock and tell: every screen fits without cutting off text; More folds keep most screens to 2 to 4 visible lines.

## Findings

1. **call111: "Call Police on 111" is shown on every lead route, including shelter in place and when Police started it ("if relevant" dropped).**
   - Where: call111 (reached from told, lockdown and shelter via alert).
   - What is wrong: the Do quotes the Escape. Hide. Tell. line, which is for an attack. The lead route's own checklist line is conditional: "Notify Police or other emergency services (if relevant) and keep communication open for updates both ways." (A9). So a principal sheltering from "a swarm of wasps" (A4) is told to call 111 and gets a "111 called" button; a principal whom Police just told to lock down is told to call 111 again. The "Police told you ... keep communication open" line is hidden in More. LESSONS trap 10 (a word that changes meaning when cut).
   - Suggested fix: make call111 a question, "Do Police or emergency services already know?" with answers "No: call 111 now (when it is safe)" (Record: 111 called) and "Yes: they told us / we are in contact" (Record: Police contact open). Do line quotes A9 in full, "(if relevant)" kept. Keep "Call Emergency Services if needed - 111" (A1) as the quote for the call.
   - Severity: high.

2. **attack / escape / hide / tell111: a teacher who meets an attacker is never told to alert the principal or other staff (missed instruction).**
   - Where: tell111's answers ("Lockdown not called yet: I can call it", "I lead the lockdown", "I am staff in a room").
   - What is wrong: only the principal, manager or delegate can call a lockdown (A4: "the school principal or delegate", "the early childhood service manager or person responsible"). An ordinary teacher who sees an attacker gets "I can call it" or "stay put". The guide says "Notify service provider/principal and all staff" (A1) and asks "Do staff members have cell phones to send and receive texts, if a trespasser or attacker is nearby and they are hiding?" (A3).
   - Suggested fix: on tell111 add `Do: When it is safe, tell the principal or manager and staff (staff channel).` quoting "Notify service provider/principal and all staff" (A1). Reword the answers: "I am the principal, manager or delegate: call the lockdown -> lockdown", "Lockdown already called: I lead it -> hold", "I am staff: stay hidden -> room-hold".
   - Severity: high.

3. **threat: no answer for "Police have not told us yet".**
   - Where: threat, Ask "What did Police say?" (Lock down / Something else).
   - What is wrong: while Police "assess the information ... determine whether it is credible", the principal has no honest answer, and the guide does have one: "If you have limited information at the time you are advised of an incident/event, implementing a lockdown is advised until you get further information from the Police or other emergency services." (A4). The threat route also never offers shelter in place, which Police may advise ("This may include a lockdown, evacuation or another safety measure").
   - Suggested fix: add answers "Not told yet / limited information -> called" and "Shelter in place -> shelter". Keep "Something else -> other".
   - Severity: medium.

4. **Attack route then lockdown route: "111 called" counts 2x, and "Lockdown called" appears twice in the Log.**
   - Where: tell111 -> lockdown -> alert -> call111.
   - What is wrong: in the fake browser the Log read "111 called" at 1:30 and again at 3:00, and the button showed "2×", which reads as two calls at the debrief. The route also makes the same person call 111 twice. Separately, the step title "Lockdown called" and the Record "Lockdown called" are the same words, so the Log shows "Lockdown called" twice at the same second.
   - Suggested fix: from tell111 send "I can call it" to a step that skips call111 (or let finding 1's question answer "Yes, they know"). Rename the step title to "You are calling a lockdown" (or the Record to "Lockdown called by me").
   - Severity: medium.

5. **escape: "Try to stop others from entering the area" is missing (missed instruction).**
   - Where: escape.
   - Source quote: "Try to stop others from entering the area, but only if it doesn’t put you in any danger." (Police, E).
   - Suggested fix: add to escape's More (with "but only if it doesn't put you in any danger" kept, trap 10). Also on hide, add E's "you may have to hide before you have the opportunity to escape" as an answer back to escape ("A safe way out opened -> escape"), since hide currently only leads to 111.
   - Severity: medium.

6. **shelter route uses lockdown words: "Secure your lockdown locations", "Stay inside", "Advised we can move to shelter in place", "Lockdown lifted".**
   - Where: shelter -> alert -> call111 -> roll -> secure -> staff -> tell -> hold -> lifted.
   - What is wrong: after choosing Shelter in place, the principal is told to "lock doors and entrances" (A9 says "Secure your lockdown/shelter in place location(s) as required"; A4 says "This may include locking"), is offered "Advised we can move to shelter in place" while already sheltering, and the end answer says "Lockdown lifted". The shelter in place details that matter (normal inside activity where possible) are only on the shelter screen.
   - Suggested fix: secure Do: "Secure your locations as required (this may include locking doors and entrances)", keeping both "as required" and "may include". Hold answers: "Lockdown or shelter in place lifted". Hide the step-down answer on the shelter route if the runtime allows (or word it "Lockdown: advised we can move to shelter in place").
   - Severity: medium.

7. **told: start answer and screen only allow "lock down"; Police or another service may instruct shelter in place.**
   - Where: start answer "Police or another service told us to lock down", told title "Told to lock down".
   - Source quote: "Instructions to shelter in place or lockdown may be initiated by: - the New Zealand Police ... - other emergency services" (A4). F says Police "usually" say lockdown, not always.
   - Suggested fix: start answer "Police or another service told us to lock down or shelter in place"; on told, ask "Which?" (Lockdown -> alert, Shelter in place -> shelter).
   - Severity: low.

8. **reunite: two guide lines on collection are missing (missed instructions).**
   - Where: reunite.
   - Source quotes: "Consider organising children and young people into class groups and moving them to an assigned area before they are picked up." (A8) and "When you are sending parents and caregivers messages for them to come and collect their child(ren), reinforce the reunification process." (A2).
   - Suggested fix: add both as Do lines (short: "Class groups to the assigned pick-up area." / "In the message, remind parents of the pick-up process."). Move the long "child who cannot be safely collected / going home alone" More below them, as now.
   - Severity: medium.

9. **lifted: "follow the steps in your emergency management plan" comes only at the very end (summary), after the debrief.**
   - Where: summary (line "Once the directive has been lifted, follow the steps set out in your emergency management plan.").
   - What is wrong: this is A4's instruction for the moment the lockdown is lifted. Placed after debrief, it reads as an afterthought. Mis-ordered.
   - Suggested fix: move it to lifted (Say) and room-lifted; keep summary to the Write box and the Log tip.
   - Severity: low.

10. **room-lifted -> "Back to usual activities" and reunite send a classroom teacher into leader tasks.**
    - Where: room-lifted answers.
    - What is wrong: a teacher in a room is taken to "Tell parents where and when they can collect their child" (reunite) or straight to debrief. Telling parents is the leader's job in A9. The teacher's real tasks after the all-clear are not stated in the source (a gap).
    - Suggested fix: room-lifted answers: "Follow the principal's or manager's instructions (staff channel)" -> a short end screen quoting "Once the directive has been lifted, follow the steps set out in your emergency management plan.", plus "I am helping with collection -> reunite". Say in Notes that the guide does not list a classroom teacher's steps after the all-clear.
    - Severity: low.

11. **Record and Write buttons missing for things needed afterwards.**
    - Where and what:
      - tell: one Record "Parents messaged" covers parents AND off-site groups. Add `Record: Off-site groups told` (A9 lists it separately and says to update them regularly).
      - lifted and room-lifted: no record of who lifted it. A4: "Who lifts the shelter in place or lockdown depends on who initiated" — add `Write: Lifted on whose advice`.
      - stepdown: add `Write: Advised by` ("Advised by Police/emergency services/other", A9).
      - needs: no Record for a child leaving the room for the bathroom or first aid; this changes the roll. Add `Record: Child left room (bathroom/first aid)` and `Write: Who left and who went with them`.
      - escape: add `Write: Who is with me` (for the roll; "Note any names of anyone who is unaccounted for", A9).
      - staff: add `Record: Staff updated`.
    - Severity: medium (the debrief and roll depend on these).

12. **start: the first line is a definition, and the most common user (a teacher who heard the alert) is the 4th of 5 answers.**
    - Where: start.
    - What is wrong: on a phone (screenshot) the definition and the app tip take the top third of the screen and the 5th answer ("threat by email, post or phone") is below the fold. A stressed teacher wants the question first. The question "What is happening?" itself is clear and the answers are plain.
    - Suggested fix: drop the Say definition from start (it is repeated on called) or move it to More; move the Tip to the About or to the first Record screen. Order answers: "An attacker is near me now", "I heard the lockdown alert (staff)", "I am calling a lockdown (principal, manager or delegate)", "Police or another service told us", "We got a threat by email, post or phone".
    - Severity: low.

13. **room-lock: Escape. Hide. Tell. "Hide" actions are given as the default for every lockdown room, unlabelled; secure labels the same lines as "Escape. Hide. Tell.".**
    - Where: room-lock Do lines vs secure More.
    - What is wrong: the barricade / windows / stay-away-from-doors lines come from A5 (attack advice), while A4's lockdown line is "This may include locking/securing doors/entrances". Reasonable for an attacker lockdown (A5 is in the lockdown section), but the two routes present the same lines differently.
    - Suggested fix: room-lock first Do: "Lock the doors." (A4 "locking/securing doors/entrances", F "lock the doors immediately" as 2025 edition). Second Do labelled "Attacker near (Escape. Hide. Tell.): lock windows, barricade, stay away from doors, be quiet and still, silence phones."
    - Severity: low.

14. **called: three long Says before the question (about 8 phone lines).**
    - Where: called (screenshot).
    - What is wrong: the most urgent decision screen for a principal is the longest. Owner wants 2 to 4 lines.
    - Suggested fix: put the definitions into the answers ("Lockdown: threat aimed at us (e.g. attacker on grounds)", "Shelter in place: threat outside, not aimed at us (e.g. wasps, smoke)", "Not sure: lockdown until Police say more"), and move the Say lines to More.
    - Severity: low.

15. **call111: More carries an authoring note ("The 2026 checklist lists telling Police after the roll check...").**
    - Where: call111 More.
    - What is wrong: this is reasoning for the author, already in Notes ("Order change"). It adds clutter in an emergency.
    - Suggested fix: remove from the screen; keep "Police help that is not urgent: 105." on its own.
    - Severity: low.

## Checked with no problem found
- No invented advice: nothing on blinds, curtains or lights; no rule on opening a door to a knock (knock says the guides are silent); no lockdown duration, no update interval, no alert or all-clear signal. "Sounding airhorn 3 times" is shown only as the guide's fill-in example. Notes say each gap.
- Tips: start, other, room-roll and summary tips describe the app only, with no numbers or advice.
- 2025 vs 2026: every F line is in More and starts "2025 edition:"; the roll check follows A9 (names unaccounted for), not F's "missing and extra children"; bathroom follows A4 ("an adult"), with F's "designated staff member" labelled.
- "do not / unless / only if / if it is safe" kept: "not using the bathroom unless it is deemed safe", "Do not move closer", "do not go back to get it if it puts you in danger", "but only help if it does not put yourself and others in any danger", "when it is safe" (except finding 1's "(if relevant)").
- Phone numbers are quoted as printed: 111, 105 (labelled as early learning page and A1), 0800 848 326.
- Message templates quoted word for word with "fill in the brackets"; the missing heading is noted.
- Version, Sources, empty "Reviewed by:", prototype banner: correct.
- Look: Flight deck (dark) is a sensible choice for a phone used while hiding in a room, and Notes say it is a design choice, not guideline advice. Screens read well and nothing is cut off. One caution: the owner found Wayfinding easiest to follow, and the escape route may be used outdoors in sunlight, where a dark screen is harder to read; worth showing the owner both on the review page. Keep flightdeck.
- Left out on purpose and fine: drills, lockdown kit planning, RIOD, parents' page, verbal warning examples.

Missed instructions: 5:
- E "Try to stop others from entering the area, but only if it doesn’t put you in any danger." (finding 5).
- A1 "Notify service provider/principal and all staff", for a teacher on the attack route (finding 2).
- A8 "Consider organising children and young people into class groups and moving them to an assigned area before they are picked up." (finding 8).
- A2 "reinforce the reunification process" in collection messages (finding 8).
- A9 "(if relevant)" on notifying Police, dropped so the instruction became unconditional (finding 1).

Also partial:
- A2 "Encourage students (and others) to avoid posting potentially misleading or incorrect messages on social media." is listed as left out as "planning", but it applies during the event too; could go in room-hold More.
- B2 "You can also complete an online report for non-emergency events." (threat route, non-emergency).

## Fixes made
After the fixes the build has 0 fix, 0 check and 8 info findings, with 166 of 166 quotes exact and 39 steps, all reachable. The explorer saw 39 of 39 steps with no problems. I also tapped through 9 routes by hand (lead, shelter, told, room, room collection, attack and hide, attack and escape, threat, threat other); each one finishes.

1. A new "police" step quotes A9 in full, with "(if relevant)" kept. It asks "Do Police or emergency services already know?" "No" goes to call111, which quotes A1 "Call Emergency Services if needed - 111". "Yes (they told us, or we are in contact), or not needed for this event" goes to the roll check, and the answer goes in the Log.
2. Added alert-staff after tell111. Its Do is "tell the principal or manager and all staff" (A1), with the A3 texting question in More. The answers are reworded: principal, manager or delegate; lockdown already called; staff.
3. threat now also offers "Shelter in place" and "Not told yet, or limited information" (which goes to called, A4). B2's online report is in More.
4. The attack route goes to lockdown-attack, which skips the Police question, so "111 called" is logged once. Step titles are now "Starting a lockdown" and "Starting a shelter in place", and the Records are "Lockdown started" and "Shelter in place started". No title repeats a Record label.
5. escape: added Police's "Try to stop others from entering the area, but only if it doesn't put you in any danger." hide: added "A safe way out opened", which goes back to escape (E). escape: added "Need to hide now".
6. The shared chain now uses wording for both: "Secure your locations as required. This may include locking doors and entrances", "Lockdown: advised we can move to shelter in place" and "Lockdown or shelter in place lifted". The shelter screen says usual inside activities can carry on. Not fully fixed: the runtime cannot hide an answer based on an earlier choice, so the step-down answer is labelled "Lockdown:" instead of being hidden.
7. The start answer and told now cover both: told asks "Which were you told?" (Lockdown or Shelter in place).
8. reunite: added a reminder of the pick-up process (A2) and class groups to an assigned area (A8). The release rule and the Write box moved to a new "release" screen.
9. "Follow the steps set out in your emergency management plan" moved to lifted and room-end, and was removed from summary.
10. room-lifted now offers "Follow the principal's or manager's instructions" (goes to room-end, which says the guide lists no teacher steps) and "I am helping with collection" (goes to release). The teacher no longer gets the parent-messaging tasks.
11. Added these Records: Off-site groups told, Staff updated, Child left room (needs and new room-needs). Added these Writes: Lifted on whose advice (lifted, room-lifted), Advised by (stepdown), Who left and who went with them, Who is with me (escape).
12. start is now only the question, with no definition first. The order is: attacker, staff who heard the alert, calling it, told, threat. The tip moved to the first screens with a Record.
13. room-lock's first Do is now "Lock the doors and entrances" (A4). The A5 lines are labelled "Attacker near? Police's Hide advice". hide and secure are labelled as Police's too.
14. called now shows 1 line plus 3 answers that carry the definitions. Everything else is in More.
15. Removed the author note from call111. "Police help that is not urgent: 105" stays.
Partial items: A2's social media line is in More on room-hold, and B2's online report is on threat. The tell screen now has 5 short visible lines (Do, two Records, Do, Record): I had to merge the Ministry screen back into it so the explorer could reach every step within its 400 routes.
