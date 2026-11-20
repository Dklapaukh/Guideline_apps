# Review: 16-severe-bleeding (severe bleeding first aid, NZ: ANZCOR 9.1.1, St John, Healthify; tourniquet time, 111)

Verdict: Faithful on numbers and honest about the source differences. All 121 quotes are exact. Every number comes from the sources: 111, 5 cm, 10 and 20 minutes, pulse over 100, capillary refill over 2 seconds, and more than 2 hours. No pressing time, tourniquet limit or dose is invented, and the gaps (minutes to press, how to write the tourniquet time, no CPR steps, the 2-hour line with no action) are said on screen and in Notes. The nine differences in meta.json's sourceNote are all shown. It needs changes before sign-off. The most serious problems: (1) the tourniquet time, the one time a source says must be noted and told to paramedics, is kept only as minutes since the app was opened, not as a clock time, and the handover screen does not show it; (2) on the amputation route, a helper who needs a tourniquet never reaches "Save the cut-off part", and on that screen "keep it dry" is only in the folded quote; (3) several screens have no honest answer for "still bleeding, and I have no haemostatic dressing", so the helper has to tap "Bleeding under control", which puts a false line in the log; (4) the embedded-object screen warns only about "a large object", although the app says it follows ANZCOR (leave any object in); (5) the not-breathing screen puts "start CPR" first, before ANZCOR's rule that in life-threatening bleeding, stopping the bleeding comes first. 3 instructions are missing.

Checked: the template against source.txt (sections A1 to A12, B1 to B9, C1 to C6) line by line, and meta.json (sourceNote) and findings.json. Built with `node tools/build.mjs guidelines/16-severe-bleeding`: 27/27 steps reachable, 0 fix, 0 check, 9 info (7 app-wording lines, no reviewer, web-fetch copy), 121/121 quotes exact, 7/7 number lines quoted, 6/6 source amounts used. The explorer (`tests/helpers/explore.mjs`) drove 400 routes (its cap): 31 endings, all 27 steps seen, 0 problems. Words shown per screen (quotes folded): embedded 89, dressing 80, tq-on 79, tourniquet 77, soaking 76, shock 74, care 73, internal 68, start 65; the rest are under 65. Driven by hand in the fake browser: start (Pressure started, 111 called) → Blood soaking through → Yes, arm or leg → A tourniquet, and I am trained → Tourniquet on (Record at 2:15) → Still bleeding → tq-more → Bleeding has stopped → tq-on → care → Ambulance arrived → handover → log; soaking → make one → improvise → tq-apply; embedded → still bleeding from an arm or leg → tourniquet; amputation → save the part → part → care → handover; Other → Nosebleed (10-minute Timer and 20-minute bar start) → Timer at 10:00 → nose-10 → bar due at 20:00 → Still bleeding after 20 minutes → nose-help (bar stopped) → handover. No dead ends and no page errors.

## Findings

1. **The tourniquet time is not kept as a clock time, and the handover screen does not show it (most serious).**
   Where: `tq-apply` (`Record: Tourniquet on`), `tq-on` ("it is in the Log"), `handover` ("Tell them the time it went on (in the Log)"). The runtime's Log and "Copy log" show only time since Start (`clock(e.at - S.startedAt)` in `engine/runtime.js`).
   Source: A7 "The time of tourniquet application must be noted and communicated to emergency/paramedic personnel."
   Problem: tested. The log reads "2:15 Tourniquet on", which means 2 minutes 15 seconds after the app was opened. No clock time appears anywhere. A helper who opened the app late, or a paramedic who looks at the phone an hour later, cannot turn this into the time the tourniquet went on without working it out. On `handover` the helper has to leave the Steps tab and find one line among about 15 screen-entry lines. If the Record button was not tapped (both hands busy), the only clue is when the `tq-on` screen opened. This is the app's main handover job ("It keeps the times the ambulance will need").
   Fix: runtime (owner's decision, no AI): show the time of day next to each log line and in "Copy log" (e.g. "14:32 (2:15)"), and let a step show a recorded time ("Tourniquet on at 14:32, 47 min ago"), for example `Show: Record Tourniquet on`. Template, until then: on `tq-apply` add `Say: Note the clock time too, if you can.` (app wording; the instruction is ANZCOR's "must be noted"). On `handover` put the tourniquet line first, and say where in the Log to look. Say in Notes that the Log counts from Start.
   Severity: high.

2. **Amputation with a tourniquet never reaches "Save the cut-off part"; "keep it dry" is only in the folded quote.**
   Where: `amputation` answers: "Still bleeding from an arm or leg" goes to `tourniquet` → ... → `tq-on` (`Next: care`) → `handover`. The `part` screen is reached only from "Bleeding controlled: save the part". `part` `Do:` "Put the part in a plastic bag and seal it. Put the bag in water with ice."
   Source: B7 "Put the body part in a sealed plastic bag – keep it dry." / B7 "Place the sealed plastic bag in a container of water and ice." / C6 "Make sure the amputated part is taken to hospital with the patient." / A3 "amputated or partially amputated limb above wrist or ankle" (life-threatening).
   Problem: an amputation above the wrist or ankle is exactly the case that needs a tourniquet, and on that route the bag-and-ice steps are never shown. `handover` says only that the part goes to hospital. On `part`, the shown text drops "keep it dry", so a helper may put the part straight into the iced water. That is the one thing both St John's wording ("sealed", "keep it dry") and Healthify's ("seal the bag", "cushion of air") are guarding against.
   Fix: on `tq-on`, `care` and `handover`, add an answer or line: "A cut-off part? Save it" → `part` (or make `part` reachable from `care`). Change the `part` `Do:` to "Put the part in a plastic bag; keep it dry. Seal the bag. Put the bag in water with ice." Counted as 1 missed instruction ("keep it dry").
   Severity: high.

3. **No honest answer for "still bleeding, no haemostatic dressing"; the helper must log "Bleeding under control".**
   Where: `dressing` answers: "Bleeding under control" / "Still bleeding from an arm or leg" / "Not breathing normally". `tq-more` offers only "Still bleeding: haemostatic dressing". `soaking` "Yes, from somewhere else" goes straight to `dressing`. `embedded` has no "Not breathing normally".
   Source: A4 "we suggest to apply a haemostatic dressing, if trained in its use and one is available." / C4 "Keep pressure on until help arrives or the bleeding stops."
   Problem: most bystanders have no haemostatic dressing. Someone bleeding from the neck or trunk goes soaking → dressing, and the screen's own line says "No dressing? Keep pressing hard", but the only way on is "Bleeding under control" (logged with its time) or a limb answer that does not apply. The same happens after two tourniquets fail. The log then says the bleeding was controlled when it was not.
   Fix: add "Still bleeding, no dressing: keep pressing" → `care` on `dressing`, `tq-more` and `embedded`; add "Not breathing normally" → `not-breathing` to `embedded`. On `soaking`, word the non-limb answer "Yes, from somewhere else (neck, body)".
   Severity: high.

4. **The embedded-object warning narrows ANZCOR's rule to "a large object".**
   Where: `embedded` `Warning: Do not pull out a large object (like a knife or screwdriver).` The same screen's `Say:` ends "The app follows ANZCOR: leave it in." `start` says "Do not pull it out" with no size.
   Source: A6 "Do not remove the embedded object because it may be plugging the wound and restricting bleeding." / C1 "If an object is stuck in the wound, don't remove it." / B4 "If it's small, like a nail or a staple, and near the surface of the skin, remove it."
   Problem: the bold warning, which is what a panicking reader sees, follows St John's size rule and implies small objects may come out. The text below says the app follows ANZCOR. The screen contradicts itself, and it is the longest screen in the app (89 words).
   Fix: `Warning: Do not pull it out, whatever its size. It may be plugging the wound.` Quote A6 and C1. Keep St John's small-object rule in the "sources differ" line. Shorten that line.
   Severity: medium.

5. **"Start CPR" comes before ANZCOR's "stop the bleeding first" on the not-breathing screen.**
   Where: `not-breathing`: the `Do:` "Not responding and not breathing normally: start CPR." comes first, and the priority rule is a `Say:` below it. Notes do not mention this tension.
   Source: A2 "In life-threatening bleeding, control of bleeding takes priority over airway and breathing interventions." / A4 "If the person is unresponsive and not breathing normally, follow the Basic Life Support Flowchart." / A4 "For the majority of non-life-threatening cases, first aiders should follow the sequence of DRSABCD, where control of bleeding follows establishing airway and commencing CPR if required." / C4 "If the person isn't responding and isn't breathing normally, start CPR."
   Problem: this screen is reached from the soaking, tourniquet, amputation and shock screens, that is, mostly from life-threatening bleeding. There ANZCOR puts bleeding control first, but the first thing on the screen is a tick-box saying start CPR. ANZCOR's two lines (A2 and A4) and Healthify's line pull in different directions; the app shows them all, but its order quietly picks Healthify's (trap 5).
   Fix: put the priority line first, as a `Warning:` ("Bleeding badly? Stopping the bleeding comes first (ANZCOR)"), then the CPR line. Add this difference to Notes.
   Severity: medium.

6. **Training is required for a shop-made tourniquet, but not for a home-made one.**
   Where: `tourniquet` answers: "A tourniquet, and I am trained" → `tq-apply`; "No tourniquet: make one" → `improvise` → `tq-apply`; "Not trained, or can't" → `no-tq`. The `no-tq` quote is about "a tourniquet is not available or has failed", not about having no training.
   Source: A4 "we suggest to apply an arterial tourniquet above the bleeding point, if trained in its use and one is available." / A7 "Effective use of commercial tourniquets is optimal when first aid providers are trained in proper application techniques." / A7 "in the context of life-threatening bleeding, an improvised tourniquet is likely to be better than no tourniquet."
   Problem: an untrained helper holding a commercial tourniquet is sent away from it (to pressure only), but an untrained helper with no tourniquet is sent to make one with no training question. ANZCOR's text gates training in 1.1 and calls training "optimal" in 1.4. It does not say an untrained person should leave a commercial tourniquet unused. The app's answers settle this without saying so. There is also no answer for "I have one but I am not trained".
   Fix: add "I have one, not trained" and show ANZCOR's two lines (1.1 "if trained" and 1.4 "optimal when ... trained") side by side without choosing; or apply the same gate to `improvise`. Note the choice in Notes. Correct the `no-tq` quote, or add A4's "if trained in its use".
   Severity: medium.

7. **Missed instruction: "keep the edges of the wound together".**
   Where: `start`; the St John quote stops at "to press on the wound".
   Source: B4 "If there isn't a cloth nearby, don't waste time – use the person's hand or your hand (wear gloves) to press on the wound and keep the edges of the wound together."
   Fix: `start` `Do:` "Press hard on the wound with a clean cloth, or your hand. Keep the edges of the wound together." Quote the whole line. Counted as 1 missed instruction.
   Severity: low.

8. **Missed instruction: check that a conscious person is happy to be touched.**
   Where: left out on purpose (Notes, "consent to touch (St John)").
   Source: B1 "If the person is conscious, check they are happy for you to touch them before you give first aid." / B1 "If the person is unconscious and you need to check for injuries or give lifesaving first aid, then don't delay."
   Problem: it is an instruction, not background. The second half ("don't delay") supports speed.
   Fix: one short line on `start`: "Awake? Ask if you can help. Not awake? Don't delay." (St John). Counted as 1 missed instruction.
   Severity: low.

9. **"Ideally" is dropped from the tourniquet placement rule.**
   Where: `tq-apply` `Do: Not over a joint, the wound, clothing or a wetsuit.`
   Source: A7 "Ideally, a tourniquet should not be applied over a joint or wound" / A7 "Ideally the tourniquet is not applied over clothing nor wetsuits".
   Problem: the quotes keep "Ideally", but the shown line makes it absolute (trap 10). A helper may waste time cutting off a wetsuit or looking for a spot that is not over a joint, while the bleeding goes on.
   Fix: "If you can, not over a joint, the wound, clothing or a wetsuit."
   Severity: low.

10. **Life-threatening bleeding has no direct route from the first screen.**
    Where: `start` answers. The ANZCOR list of when to treat bleeding as life-threatening is on `tourniquet`, two screens in.
    Source: A3 "Bleeding should be managed as severe, life-threatening bleeding in the following situations: ... shark attack, propeller cuts or similar major trauma ... bleeding not controlled by local pressure".
    Problem: "Blood soaking through" does not describe a limb that is pouring or spurting. The helper must read the second-pad screen (76 words) before getting to the tourniquet. ANZCOR's order (pressure first) is followed, which is right, but the answer wording slows the worst case. The first screen also has 6 answers, 2 Record buttons and 4 instructions.
    Fix: reword the first answer "Pouring, spurting or soaking through". Consider dropping the "Pressure started" Record (the Start tap is logged), so the first screen has one button fewer.
    Severity: low.

11. **Head wound: "don't press if the skull may be broken" leaves no next step, and the next screen says keep pressing.**
    Where: `head` (Warning) → "Bleeding badly" → `care` ("Keep pressing until help arrives").
    Source: C3 "If the person is bleeding from a head injury, apply direct firm pressure to the wound to stem the bleeding." / C3 "But don't apply pressure if you think they might have a skull fracture."
    Problem: both Healthify lines are under its "Minor bleeding" heading, but the app uses them for a bleeding head wound with no label. A helper who suspects a broken skull is told not to press, then sent to a screen whose first line is "Keep pressing".
    Fix: on `head`, say that Healthify gives this under minor bleeding, and that no source says what to do instead if the skull may be broken (call 111). Add an answer "Skull may be broken" → `handover` or `shock`, not `care`.
    Severity: low.

12. **Small points (no count).**
    - `care` has no "Monitor the vital signs at frequent intervals" (A11). It is only on `shock`, but `care` is where everyone waits. Add one line.
    - `internal`: ANZCOR's signs "vaginal bleeding or bleeding from the penis" and "Severe bleeding may also occur from complications of pregnancy" (A9) are not shown. Recognition only, but add them to the Say list.
    - `nose-help` → `handover`: the handover screen is about tourniquets and ambulances, while ANZCOR says only "seek medical assistance". `nose-10` has no "after a head injury" or "child: something in the nose" answers.
    - The amputation screen shows the raise-or-not difference without saying which the app follows, while `care` says "The app follows ANZCOR". Say the same on both.
    - `start`'s embedded-object Warning is supported only by "use pressure around the object"; add A6 "Do not remove the embedded object".
    - ANZCOR's "standard precautions (e.g. gloves, protective glasses)" (A4): glasses are not mentioned.
    - "111 called" Record is on 9 screens; the log may show it several times.
    - Gaps (minutes to press, how to write the time, the 2-hour line with no action, no CPR steps) are said on screen and in Notes. Good, keep them. The choice of no 2-hour reminder is correct.

Missed instructions: 3 (findings 2, 7, 8)

## Not fixed
- 10 (part): the "Pressure started" Record stays on the first screen. The owner's brief asks for a record of when pressure started for the handover, and opening the app is not the same moment. The first screen now has five answers instead of six.
- 12: "111 called" is still on every screen where calling is the step, so it may be logged more than once. Each tap is a real time, and taking it off a screen would leave that route with no way to record the call.
- 6: no source says whether an untrained helper should use a tourniquet they have, or whether training applies to a home-made one. The app shows ANZCOR's lines and leaves the choice to the helper. It does not decide for them.
- 5 and 11: no source says what a lone helper should do when bleeding control and CPR are both needed, or how to slow bleeding from a head wound when the skull may be broken. Both are said on screen as gaps.
