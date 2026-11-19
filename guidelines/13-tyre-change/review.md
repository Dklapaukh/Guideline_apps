# Review: 13-tyre-change (Changing a car tyre safely at the roadside)

Reviewer: independent AI review, 19 Nov 2026. Compared `template.md` with `source.txt` line by line and with the 13 gaps in `meta.json` `sourceNote`; built the app (13 steps, all reachable, 0 fix, 0 check, 5 info, 108/108 quotes exact) and drove every route in the fake browser (66 routes, 13 endings, no problems).

**Verdict: faithful and safe in order (get safe first, loosen before jacking, lower before full tightening, no invented numbers), with contradictions shown plainly; a few ordering and wording fixes are needed before the owner sees it, mainly the "get everyone out" order, the blowout entry and an unshown roadside-phone line.**

## What is right
- No invented numbers. Every number on screen is in source.txt: 80km/h, 111, ***555 / *555, ***222, 0800 500 222. No triangle distance, torque, tyre pressure or space-saver distance is made up; each one is named as a gap instead.
- The safety order is correct: get safe, then decide, then park and secure the car, then loosen the nuts on the ground ("Do not remove them at this point" is kept whole), then jack, swap, lower, fully tighten, shake test, then spare type and repair.
- "Do not", "never", "don't" and "unless"-type words are kept in every quote that has them ("Never attempt to change a tyre if...", "Never get underneath...", "Don't start or run the engine...", "do not attempt to fix the vehicle yourself", "Do not approach the AA Roadservice vehicle..."). None of the cut quotes changes meaning.
- Contradictions are shown, not settled: the AA breakdown guide's "do not attempt to fix the vehicle yourself" against the how-to pages (decide, motorway), ***555 against *555 (call-help), AA "in gear" against Drive's first/reverse (prepare), inside light against parking lights (start), ease off the accelerator against brake slowly (blowout).
- Sensible judgement calls: "Not sure" which spare goes to the space-saver screen (the cautious reading); "a nut won't move" and "no usable spare" go to call-help, backed by the AA's "If you're in doubt ... expert help".

## Findings

1. **"Get everyone out" comes before the handbrake, gear and engine off.** Where: `prepare`. The first tick is "Get everyone out of the car", then the handbrake, park/gear and engine off. Someone has to be in the driver's seat to do those, and a stressed person ticking from the top may get out with the engine running. This follows the AA's numbering (step 1 people out, step 2 handbrake), but Drive's pull-over list puts the car-securing actions first and getting out last ("7. Put the hand brake (or park brake) on ... 8. If your car's an automatic, put it in park ... 9. Turn the engine off. 10. Make sure the road is clear and safe before you get out of your car."). Fix: order the ticks handbrake, then park/gear, then engine off, then "Get everyone out of the car (out on the side away from traffic)", then block the wheels. Say in Notes that this uses Drive's order for these steps. Severity: **must fix**.

2. **The "emergency roadside phone" option is quoted but never shown.** Where: `call-help`. The Say line reads "...or use the AA (NZ) App. You could also call whānau...". The quote under it, "request an AA Roadservice callout on the AA (NZ) App, or use an emergency roadside phone if available", includes the roadside phone, but the screen text leaves it out. People without signal or a charged phone need this line most. Fix: add "or use an emergency roadside phone if there is one." Severity: **must fix**.

3. **The blowout option invites reading the phone while driving, and the first screen talks to someone still moving.** Where: `start` (option "Tyre just blew out: how to pull over") and `blowout`. The app's own top warning says "Stop somewhere safe before you read this", yet the start screen opens with "Don't stop suddenly. Indicate and steer as far to the left as you can", and the blowout screen begins with "Grip the steering wheel firmly". A person who has stopped can't act on these any more. A person who is still driving should not be reading. Fix: relabel the option "My tyre blew out (I've stopped now)". On `blowout`, show the after-stopping lines first ("Make sure your wheels are pointing straight ahead.", "Put the hand brake (or park brake) on and switch on your hazard warning lights.", "Turn the engine off."), and move the while-driving lines under a heading such as "What to do if it happens again". On `start`, reword the first Warning as a check: "Check you are in a safe spot: as far left as you can, off the road if possible, on a straight piece of road", keeping the same quotes. Severity: **should fix**.

4. **"Wheels pointing straight ahead" is missing on the main route.** Where: `prepare` (it appears only on `blowout`). A slow puncture goes start → decide → prepare, and that route never shows Drive's "Make sure your wheels are pointing straight ahead." Fix: add it as a tick on `prepare`, quoted. Severity: **should fix**.

5. **Gap (3), working beside traffic, is noted but not shown in the app.** Where: `loosen`, `jack`, `swap`. Notes say "Not added". LESSONS trap 13 says the app must say plainly when the guideline is silent. This is the biggest real-world risk of the whole task: kneeling at a wheel on the traffic side. Fix: add one Say on `loosen` (or `prepare`): "The sources don't say what to do if the wheel is on the traffic side. Don't stand in the road. If your safety is at risk, stop and call for help." Quote "don’t stand in the road" and "Never attempt to change a tyre if your personal safety is at risk". Severity: **should fix**.

6. **Two Road Code instructions are left out.** Where: `call-help` / `wait-help`. (a) "if you need help from other drivers, leave plenty of space for them to stop." (b) "if you don’t have a cellphone and it’s not safe to walk, wait for help in your car" (motorway version: "if you don’t have a cellphone and it isn’t safe to walk, stay in your car and wait for help"). The app assumes everyone has a phone. Fix: add both as Say lines on `wait-help` (b) and `call-help` (a), quoted. Severity: **should fix**.

7. **The car-manual quote is used as if it were about nut tightness.** Where: `lower`. "The sources don't say how tight is tight enough ... The AA says read the car manual." The AA's "Read the car manual." is a general preparation tip, not advice on nut tightness. Fix: "The sources don't say how tight is tight enough, or whether to check the nuts again later. Your car manual may say." Keep the quote, but don't say the AA advises it for this. Severity: **should fix**.

8. **Confusing wording: "This screen is shown to be safe".** Where: `space-saver`. A non-technical reader may take this to mean "it has been shown to be safe". Fix: "Not sure which spare you fitted? We show this screen just in case. Your car manual may say." Severity: **should fix**.

9. **The nut order assumes four nuts.** Where: `swap`, `lower`. Drive's top, opposite, left, right order covers four nuts. Many cars have five, and no source says what to do then. The gap is not flagged. Fix: add a Say line: "This order is from Drive; the sources don't give an order for wheels with five nuts." Severity: **minor**.

10. **The decide screen is long for the roadside.** Where: `decide`. It has five text blocks before the question: never-attempt, tools and locking nuts, hard ground, heavy wheel, and the sources-differ note. Fix: keep the never-attempt warning and the sources-differ note here. Move "Only use the jack on hard level surfaces..." to `jack`, the locking-nut line to `loosen` (where it bites), and the heavy-wheel line to `swap`. Severity: **minor**.

11. **"A heavy wheel is a job for two people" is stronger than the source.** Where: `decide`. The source says "We recommend two pairs of hands as this is quite a tricky job." Fix: "For a heavy wheel the AA recommends two people." Severity: **minor**.

12. **"Be seen" is dropped.** Where: `start`. The AA says "Always consider safety first – be seen and use the car’s hazard lights." Only the hazard lights part is shown. Gap (13), no advice on bright clothing, is also not stated. Fix: add "Be seen." with that quote, plus "The sources don't mention bright or reflective clothing." Severity: **minor**.

13. **No way out if the spare turns out flat or won't fit during the swap.** Where: `swap` (Next only). Gap (12) is handled at `decide` ("No usable spare") and `loosen`, but not once the car is on the jack. Fix: make the `swap` step an Ask: "Spare on?" with "Yes -> lower" and "Spare is flat or won't fit: get help -> call-help". Add a line saying the sources don't say what to do; quote "If you're in doubt, it may be wise to get some expert help from our AA Roadservice team." Severity: **minor**.

14. **A Say line has no quote on its own step.** Where: `prepare`. "leave on the side away from traffic" has no quote on this step; it is quoted only on `wait-help`. Fix: add the quote "leave the vehicle from the passenger side away from traffic (usually the passenger door)" here too. Severity: **minor**.

Not counted as missed (preparation or background, fair to leave out or already in Notes): the AA practice run on a flat surface, "Read the car manual" before you need it, checking that tools are in place when a car has several drivers, checking the locking-nut key when buying a car, tyre-care background, and the Road Code's front-pull / rear-sway description of a blowout.

Missed instructions: 5 (Road Code "leave plenty of space for them to stop"; Road Code "if you don't have a cellphone ... wait for help in your car"; AA "use an emergency roadside phone if available" (quoted, not shown); Drive "Make sure your wheels are pointing straight ahead" on the main route; AA "be seen").

## Fixes applied
1. `prepare` order is now: wheels straight, handbrake, park/gear, engine off, then everyone out (on the side away from traffic, once the road is clear), then block the wheels. Notes say this follows Drive's order.
2. `call-help` now says "or use an emergency roadside phone if there is one".
3. The start answer now reads "My tyre blew out (I've stopped now)". The first Warning on `start` is now a check ("Check you are in a safe spot..."), and it adds "Still driving? Don't stop suddenly, and don't read this until you've stopped." `blowout` opens with the after-stopping ticks (wheels straight, hand brake and hazards, engine off, road clear). The while-driving lines come after them under "What to do if it happens again while driving (read this later, not now)".
4. Added a wheels-straight-ahead tick to `prepare`.
5. Added a Warning on `loosen` about the traffic-side gap, quoting "don’t stand in the road" and "Never attempt to change a tyre if your personal safety is at risk". The answer now reads "A nut won't move, or it isn't safe: get help".
6. Added (a) "leave plenty of space for them to stop" to `call-help` and (b) the no-cellphone lines from both Road Code lists to `wait-help`.
7. `lower` now reads "Your car manual may say."
8. `space-saver` now reads "We show this screen just in case. Your car manual may say."
9. `swap` now says the order is from Drive and that no source gives an order for five nuts.
10. Moved the hard-ground line to `jack`, the locking-nut line to `loosen` and the heavy-wheel line to `swap`. `decide` keeps only the never-attempt warning, the tools line and the note that the sources differ.
11. `swap` now reads "For a heavy wheel the AA recommends two people", with that quote.
12. `start` now says "Be seen", with the AA quote, and that the sources don't mention bright or reflective clothing.
13. `swap` now ends with the Ask "Is the spare on?" (lower / call-help), a line saying the sources don't cover this case, and the AA "If you're in doubt" quote.
14. Added the passenger-side quote to `prepare`.
Rebuilt: 13 steps, 0 fix, 0 check, 118/118 quotes exact. The explorer found no problems (67 routes, 14 endings).
