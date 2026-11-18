# Review: 03-earthquake (independent, 18 Nov 2026)

**Verdict: Faithful and well quoted, with routes that work. One route sends a person fleeing a tsunami into "do not run outside" and a long after-earthquake checklist, and the Outside line can be read the wrong way round. Fix both before publishing.**

Checked against source.txt (Sections A and B). Build: 17 steps, all reachable, 0 fix, 0 check, 8 info, 61/61 quotes exact. Fake browser: tried each of the 8 "Where are you?" answers, coast Yes/No, long-or-strong Yes/No and damage Yes/No. Every route reaches "Keep safe". No screen failed, and no doses, times or thresholds were invented ("longer than a minute" is in the source).

## Findings

1. **The Get Gone route gives mixed messages (wrong order for this route).** Where: `get-gone` → `Next: after`. The fake browser shows that, right after "Move quickly to the nearest high ground...", the next screen says "Do not run outside. Staying inside is frightening, but it is much safer than going outside". It then goes on to the gas, power, neighbours, pets, insurance and photos screens. The "unless ... you are in a tsunami evacuation zone" exception is there, but only as the fourth line down. Why it matters: a frightened person who has just been told to leave reads "Do not run outside" first and may stay. The after-list jobs also delay the evacuation, and the source puts no after-list job before evacuating. Fix: make `get-gone` an `End:`, or send it to `finish` only. Put the source line "You do not have to evacuate a building straight away unless it is showing obvious signs of distress or you are in a tsunami evacuation zone." at the top of `after`, above "Do not run outside", so the exception is read first.

2. **The Outside line can be read the opposite way.** Where: `outside`. The screen says "Move no more than a few steps away from buildings, trees, streetlights and power lines." A reader can take this as "stay within a few steps of buildings", which is the reverse of the intent. Source: "If you are outside, move no more than a few steps away from buildings, trees, streetlights and power lines, then Drop, Cover and Hold." The source itself is ambiguous. Fix: keep the quote, split the screen text into "Move away from buildings, trees, streetlights and power lines. Move no more than a few steps." and add a Note that the source sentence is ambiguous and the split is how the app reads it. If the owner prefers not to interpret it, show the quote word for word and say in Notes that it is ambiguous.

3. **The Outside, Lift and Somewhere else routes never say how to Drop, Cover and Hold (missed instruction).** Where: `outside`, `lift`, `elsewhere`. Each says only "Drop, Cover and Hold". The how-to lines are shown only on `indoors`: "Drop down on your hands and knees or as low as you can.", "Cover your head and neck if you can.", "Hold on to your position or shelter." These apply wherever the person is told to Drop, Cover and Hold. Fix: add those three Section A lines (short, with their quotes) to the three steps, or route them through a shared Drop, Cover and Hold screen.

4. **Indoors drops the "can't get up" warning (trap 10).** Where: `indoors`. Someone indoors who cannot get up from the floor may tap "Inside a building" rather than the cane option. They then see "Drop down on your hands and knees" with no exception. Fix: add `Warning:` "If you can't get up from the floor without help, don't drop to the ground." with Quote "If you can’t get up from the floor without help, don’t drop to the ground in an earthquake." (the same as `cane`).

5. **"Those in charge" is moved from after to during.** Where: `elsewhere`. The source puts "If you are in a store, unfamiliar commercial building or on public transport, follow the instructions of those in charge." in the "What to do after an earthquake" list. Showing it during shaking changes when it applies. The Note admits this, but the screen does not. It is also shown again in `others`. Fix: begin the line on `elsewhere` with "When the shaking stops," or remove it there and rely on `others`.

6. **The first screen has 8 answers.** Where: `start`. That is a lot for someone under a table, and the last label is long. The top lines do say Drop, Cover and Hold first, which is good. Fix (optional): shorten the last label to "Somewhere else". The crowd, bus, cliff and child list is already on the next screen.

7. **The cane option label drops "mobility impairment".** Where: `start`, option 3. Source: "If you have a mobility impairment or use a cane...". Fix: change the label to "I have a mobility problem or use a cane, or I can't get up from the floor without help".

8. **"Obvious signs of distress" is not plain for the public.** Where: `after`. A frightened reader may think it means people in distress, not the building. The source does not define it. Fix: write "unless the building shows obvious signs of distress (damage)". If that counts as interpretation, add a `Say:` "The guideline does not say what these signs are."

9. **The outside gap is narrower on screen than in the Note.** Where: `outside`. The Note says "nothing on cliffs, slopes or crowds outdoors", but the screen mentions only cliffs and slopes. Fix: add crowds to the `Say:` line.

10. **The tsunami link is not shown.** Where: `get-gone`. Source: "Find out more about how to protect yourself from a tsunami." This is minor, and it is a pointer rather than a step. Fix: add it as a `Say:` with its quote on `get-gone` or `finish`.

11. **Small reasons are dropped (acceptable).** "This is to protect yourself from injury by broken objects." (clothing), "An earthquake is not like a fire." and the doorway reason ("a swinging door can cause more injury") are background. Leaving them out is fine. The doorway reason would help people trust "Not in a doorway", so it is worth adding to `indoors`.

12. **Section B "Get ready" preparation is left out on purpose.** This is stated in Notes. It is acceptable because the app covers during and after.

The checks that passed: the "Do not" lines are kept (`start`, `after`, `property`). "unless" is kept in the evacuate line. "if it is safe to do so", "if you can" and "if advised to" are kept in `hazards`. The "sit on in a chair" typo is handled openly. The two-page source and the wording differences are stated in Notes. The gaps (not sure if long or strong, walk or drive, stuck lift, going back into a damaged building) are stated on screen with "follow local advice".

**Missed instructions: 2** (the Drop, Cover and Hold how-to on the outside, lift and somewhere-else routes; the "don't drop if you can't get up" warning on the indoors route).

## After review (orchestrator)
Findings 1 to 11 were fixed by the author in one round (Get Gone now ends the route; Drop, Cover and Hold how-to on every situation screen; the "can't get up" warning on Inside; mobility answers grouped behind one answer). Finding 12 (preparation advice) is left out of scope. The Outside line is shown word for word with a note that its meaning is unclear; a person should decide how it reads.
