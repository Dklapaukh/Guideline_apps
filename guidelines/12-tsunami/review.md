# Review: 12-tsunami (Long or Strong, Get Gone: natural signs, official warnings, lakes, boats, after)

Verdict: Faithful and honest. All 110 quotes match exactly. There are no invented distances, times or depths: the only numbers are the source's 50 metres, ten minutes, 24 hours and "a minute". Nothing on screen advises vertical evacuation or going up buildings. The gaps are stated plainly ("the guidance does not say ..."), and the main contradictions (the one-minute wording, 24 hours vs "be cautious") are flagged. Screens are short: 17 to 64 words are shown per screen, and the quotes are folded under "Guideline". The first screen gives the action before asking anything. It needs changes before sign-off, because some routes can still slow down or misdirect a person who should be leaving. The most serious problems:
1. The first-screen answer "It's over: what now?" can be read as "the earthquake is over", and it skips Get Gone.
2. The first screen tells everyone to move to high ground. That contradicts the activity-advisory, outside-zone and at-sea boat advice, and the contradiction is not flagged.
3. "Saw the sea drop" goes through a screen that lists the signs and asks a question before the action appears.
4. "Do not spend time looking for animals" and the grab-bag rule are only on an optional screen, which the person reaches after leaving.
5. The boat "ten minutes of a natural warning" question drops what starts the clock.

3 instructions are missing.

Checked: the template against source.txt (sections A to D) line by line, and the sourceNote in meta.json. Build (`node tools/build.mjs guidelines/12-tsunami`): 29/29 steps reachable, 0 fix, 0 check, 7 info (5 app-wording lines without a quote, no reviewer, web-fetch copy), 110/110 quotes exact, 2/2 number lines quoted. The explorer (`tests/helpers/explore.mjs`, maxRoutes 2000) drove 348 routes, saw all 29 steps and reached 26 endings, with no problems and no page errors. The fake browser has no dead ends and no loops. Driven by hand in the fake browser:
- Long earthquake: quake → long-strong Yes → get-gone → reached safety → stay-there → after.
- Not sure: not-sure → watch → not-long → nothing more → finish.
- Saw the sea drop: signs → near the sea → get-gone → can't walk → driving.
- Lake: signs → lake → get-gone.
- Official, evacuate immediately: get-gone → tips → on-the-way → stay-there.
- Prepare to evacuate: prepare → prepare-more → time to go → get-gone → can't get out → stay-there.
- Advisory: advisory → stay-there.
- Outside the zones: outside-zone → stay-there.
- Informal warning: informal → official.
- Boat, shallow water: boat → shallow → Yes → boat-dock → get-gone. Also boat → shallow → No → boat-to-deep → boat-at-sea → Finish.
- Boat, deep water: boat → deep → boat-at-sea.
- After: after → after-water → after-help → property → finish.

The prototype banner ("Not reviewed. Not for real-world use.") shows on every screen.

## Findings

1. **"It's over: what now?" on the first screen can skip Get Gone (most serious).**
   Where: `start`, answer 6 → `after`.
   Source: A "As soon as the shaking stops, move immediately to the nearest high ground or as far inland as you can out of tsunami evacuation zones." / B "After a tsunami, only return home once you are told it is safe to do so."
   Problem: just after a quake, a frightened person can read "It's over" as "the shaking is over". Leaving is due at exactly that moment, but this answer goes to the after screens ("Only return home once ...", the water, insurance). It never says to go. The after pages are written for after the tsunami or the all-clear.
   Fix: relabel it "All-clear given, or the tsunami is over" and make it the last answer, visually apart from the others. Consider adding a line on `after`: "Shaking only just stopped and you're near the coast? Go now" → `get-gone`.

2. **The first screen tells everyone to move now, which contradicts the advisory, outside-zone and boat-at-sea advice. This is not flagged.**
   Where: `start` Warning "Long or Strong, Get Gone. Move immediately to the nearest high ground or as far inland as possible." versus `advisory`, `outside-zone` and `boat-deep`/`boat-at-sea`.
   Source: A "If an earthquake is Long or Strong: Get Gone. Move immediately ..." (conditional) / D "Evacuation of land areas is not required but people should stay out of the water ..." / D "If you are outside of tsunami evacuation zones you do not need to evacuate." / D "Do not return to port if you are at sea and a tsunami warning is issued."
   Problem: the "If an earthquake is Long or Strong" condition is dropped (trap 10). A person under an activity advisory, a person outside the zones, or a boat in deep water first reads "Move immediately to high ground", and a later screen says the opposite. Notes does not mention this.
   Fix: keep the action first but put the condition back: "Near the coast and felt a long or strong earthquake, or saw the sea rise or fall? Move immediately to the nearest high ground or as far inland as possible." Quote A's "If an earthquake is Long or Strong: Get Gone." Add a line to Notes on why the other routes differ.

3. **"Saw the sea drop" goes through a sign list and a question before the action.**
   Where: `start` "Strange sea, water or noises" → `signs` (a list of 3 signs, "Do not wait", then "Where are you?") → `get-gone`. For a lake there are two extra screens: `signs` → `lake` (a sign list, then Next) → `get-gone`.
   Source: C "If you are near a shore and experience any of the following, take action. Do not wait for official warnings." / D "you need to act immediately if you experience any of the following".
   Problem: the person has already seen the sign. The `signs` screen asks them to re-read a list of signs, and its only action is "Act if you notice any of these". The "move" instruction is one screen further on. A lake user reads two sign lists before the action screen.
   Fix: split the first-screen answer into "The sea suddenly rose or fell, or made loud noises" → `get-gone` and "At a lake: strange water, landslide or loud noises" → `lake`. Make `lake` start with the action ("Move away from the water's edge to higher ground now"). Put its list after the action, or drop it, since the person is already there because of a sign. Keep `signs` for "not sure what I'm seeing", or reach it from `not-long` only.

4. **"Do not spend time looking for animals" is missing from the screen, and the pet and grab-bag rules come only after leaving (1 missed instruction).**
   Where: `on-the-way` (reached only from the optional "Tips for the way" on `get-gone`). The Say line reads "Take your animals and grab bag only if it won't delay you. Do not go back into the zone for them."
   Source: A/C/D "Take your animals with you only if it will not delay you." / "Do not spend time looking for them and if you are not at home, do not return to get them." / D "Take your grab bag with you if possible, but do not travel into the evacuation zone to collect your grab bag or other belongings."
   Problem: (a) the shown text drops "Do not spend time looking for them" (trap 10). The quote has it, but quotes are folded away. "If you are not at home, do not return to get them" becomes "do not go back into the zone". (b) The grab bag's "if possible" becomes "only if it won't delay you", which changes the wording slightly. (c) The pet and grab-bag decision is made before leaving, but the line sits on an optional screen that people reach once they are already on the move. A person at home deciding whether to look for the cat never sees it.
   Fix: put one short line on `get-gone`: "Don't spend time looking for pets or packing. Take them or your grab bag only if it won't delay you." Quote both A lines and D's grab-bag line. On `on-the-way` keep "If you're not at home, don't go back for them" and "Don't go back into the zone for your grab bag or belongings."

5. **Boat ten-minute question: the clock start is dropped, and so is "small boat" (trap 6).**
   Where: `boat-shallow` Ask "Can you be ashore and on foot within ten minutes?"
   Source: D "If you can beach or dock your small boat and evacuate on foot within ten minutes of a natural warning, then this is your best chance."
   Problem: the source counts the ten minutes from the natural warning. The question counts them from now. Someone who saw the sign 7 minutes ago would honestly answer "Yes" and head for shore. "Small boat" is also dropped, so a large vessel could choose "Yes". Notes explains why there is no timer, but not that the question changes the clock.
   Fix: "Small boat: can you beach or dock it and be on foot within ten minutes of when you first noticed the warning sign?" Add one line to Notes on what starts the clock.

6. **Deep water inside a harbour or channel: a gap that is not stated.**
   Where: `boat` answer "On water deeper than 50 metres" → `boat-deep` ("If you are outside harbours and channels, keep heading to deeper water").
   Source: D "If you are on the water at greater than 50 metres outside of harbours/channels, continue to head to deeper water ..."
   Problem: a boat that is deeper than 50 m but inside a harbour or channel is told what to do only "if you are outside". The screen does not say what to do otherwise, and Notes covers only "small boats already in deep water".
   Fix: relabel the answer "Deeper than 50 metres, outside harbours and channels". Send "deep but in a harbour or channel" to `boat-shallow`, or add "The guidance does not say what to do in a deep harbour or channel; check with your harbourmaster" (trap 13).

7. **The boat route treats every tsunami as local, and the advisory's "leave your boat" contradicts "don't return to port" without a flag.**
   Where: `boat` → all screens. `advisory` Do "On a boat or at a marina: move onto shore" versus `boat-at-sea` "Do not return to port ...". `boat-at-sea` uses the harbourmaster line.
   Source: D: all the boat actions are under "Local source tsunami". "Regional or distant source tsunami: Check with your local harbourmaster to find out what your local tsunami response procedures are." / D advisory "People on boats, liveaboards and at marinas should leave their boats/vessels and move onto shore." / D "Do not return to port if you are at sea and a tsunami warning is issued."
   Problem: (a) for a distant tsunami with hours of warning, the source gives only the harbourmaster line. The app gives the local-source actions without saying they are for a local tsunami. The harbourmaster line, which belongs to distant tsunamis, is moved to the at-sea screen as a "nothing more" fallback. (b) A boater at sea under an activity advisory gets "move onto shore" on one screen and "do not return to port" on another. The source does not say which applies.
   Fix: on `boat`, say "This boat advice is for a local tsunami (minutes). For a distant tsunami warning, check with your local harbourmaster." On `advisory`, say "At sea, not at a marina? The guidance does not say whether to come in under an advisory; listen to maritime radio." Add both to Notes.

8. **The "Outside the evacuation zones" answer sits beside "Evacuate immediately" and suggests looking up your address.**
   Where: `official` answer 4 → `outside-zone` "Not sure? Search your address on your Civil Defence Group's evacuation zone maps."
   Source: D "If you are outside of tsunami evacuation zones you do not need to evacuate." / A "Search your home, work or school address ..." (under before-a-tsunami preparation) / D "Immediately follow the advice of any emergency warning. Do not wait for more messages before you act."
   Problem: under an evacuate-now alert, a person unsure of their zone may pick "outside" and then start searching a map site. That slows down leaving, and the source puts the address search under preparation, not during an alert. The source does not say what to do if you're not sure of your zone. That gap is not stated.
   Fix: relabel the answer "I know I'm outside the evacuation zones". On `outside-zone`, replace the search line with "Not sure? The guidance does not say. The evacuate-now advice is to move immediately", linking to `get-gone`, and keep the address search for the prepare route only.

9. **The lake small-earthquake risk is missing on the "No, it wasn't long or strong" route.**
   Where: `long-strong` "No" → `not-long`, which mentions only the sea.
   Source: D "Even a small earthquake could trigger a large landslide at a mountain lake or fiord/sound that generates a tsunami. In these cases, natural warning signs may be weak or unnoticeable."
   Problem: the small-earthquake lake line appears only on `not-sure`. A person at a mountain lake or fiord who honestly answers "No" is told to watch for sea signs. Fiords and sounds are not mentioned anywhere.
   Fix: add to `not-long`: "At a mountain lake or fiord? Even a small earthquake can cause a tsunami. Move away from the water's edge if you see unusual water, rock falls or hear loud noises" → `lake`. Quote D.

10. **Drop, Cover and Hold: how to do it is missing (1 missed instruction), and "now or just now" sends people whose shaking has stopped through it.**
    Where: `quake`; `start` answer "Earthquake, now or just now".
    Source: A "Drop down on your hands and knees or as low as you can." / "Cover your head and neck if you can." / "Hold on to your position or shelter."
    Problem: the screen has the brace and can't-get-up variants but not the three basic moves. Someone whose shaking has already stopped must read the DCH screen and tap Next before the long-or-strong question.
    Fix: on `quake`, add one line, "Get down low, cover your head and neck, hold on", quoting A. Split the first-screen answer into "Shaking now" → `quake` and "Shaking has stopped" → `long-strong`.

11. **Prepare to evacuate: the radio, TV and website line is missing (1 missed instruction), and there is no "still waiting" or "cancelled" choice.**
    Where: `prepare`, `prepare-more`.
    Source: D "Listen to the radio or TV for updates, and check your local Civil Defence Emergency Management Group's website".
    Problem: the line is left out (only "Listen to local Civil Defence ..." is shown). `prepare-more` offers only "It's time to go" or "outside the zones". A person who is still waiting, or whose warning is cancelled, has only Back.
    Fix: add the line to `prepare` as a `Do:`. Add an answer "Still waiting: keep listening", which stays on the screen or goes to `stay-there`. You could also add "Warning cancelled or all-clear" → `after`.

12. **Activity advisory: "this assessment may change" is dropped, and "No need to leave land" is easy to misread.**
    Where: `advisory`.
    Source: D "A tsunami activity advisory will be issued when inundation of land areas near the shore is not expected (although this assessment may change) ..."
    Problem: the advisory user is told that land evacuation isn't needed but not that this can change, so they have no reason to keep listening. "No need to leave land" sits next to "stay off beaches and shore areas" and can read as permission to stay on the beach.
    Fix: "You don't need to evacuate, but stay off beaches and shore areas. This can change: keep listening for warnings." Quote D's advisory definition.

13. **Informal warning: no answer for "not going", which forces a judgement (trap 8).**
    Where: `informal` answers "Go now" / "There is an official warning".
    Source: A "If the warning seems trustworthy, consider evacuating." / D "If you trust them and you feel unsafe, consider evacuating."
    Problem: "consider" is the person's judgement. If they decide not to go, no answer fits, so they have only Back.
    Fix: add "Not going for now: watch for signs and warnings" → `not-long`.

14. **Reading load on the urgent route (usability, small).**
    Where: `long-strong` "The pages differ at exactly one minute: Civil Defence says ..."; `not-sure` opens with "The guidance does not say what to do if you are not sure. Follow local advice."; the pre-start Warning "Read this on the way."; `driving`, `on-the-way` and `cant-get-out` all go Next to `stay-there` ("Stay there until the all-clear") while the person is still travelling.
    Problem: the source-difference sentence is for authors and appears right after the quake. `not-sure` gives a non-action first, and "follow local advice" means nothing in the minute after shaking. "Read this on the way" invites reading a phone while running or cycling past fallen power lines. The A line "avoid hazards ... especially fallen power lines" applies here. The Next from the travel screens labels a destination the person hasn't reached.
    Fix: move the one-minute difference to Notes, or make it a short "(Civil Defence: a minute or more)". On `not-sure`, put the self-evacuate rule first and say "The guidance doesn't say what to do if you're not sure" second, without "follow local advice". Change the Warning to "... Go now. Look at this only when you've stopped somewhere safe." On the travel screens, make the button "I've reached safety", or send Back to `get-gone`.

15. **Small points (not counted).**
    - `boat-to-deep` drops D's "Be aware that tsunami can interact with wind waves and produce unusual effects." Add it as a short Say.
    - `on-the-way` uses only A's power-lines line. D's "a large local earthquake may damage powerlines and bridges and create liquefaction and landslides" adds bridges and landslides, which are useful on the way.
    - `on-the-way` "If these routes appear slow or congested, use a different route" comes from D's prepare-to-evacuate list (a distant tsunami). It is fine to show for everyone, but say so in Notes.
    - `boat-dock` Warning drops "out of tsunami evacuation zones" and the "if you see or hear natural warning signs" condition. Both are acceptable in context.
    - `get-gone` and other urgent screens use `Do:` tick boxes ("Walk, run or cycle"). Ticking is not needed while fleeing, so consider `Say:`/`Warning:` there.
    - Good: no vertical evacuation; "can't get out" quotes only "go as far or as high as you can" and states the gap. The 24-hour vs "be cautious" difference is shown honestly. The Twitter handle is left out for good reason. The outside-zone route is kept off the long-or-strong path. Version, sources and Reviewed-by (empty) are correct (trap 12).

Missed instructions: 3 (findings 4, 10, 11)

## Fixes (round 1)

Rebuilt: 29/29 steps reachable, 0 fix, 0 check, 7 info, 121/121 quotes exact. `npm test` 25/25 pass.

1. Fixed. Answer is now "All-clear given: going home", the last answer. The `after` screen asks "The all-clear was given" or "Shaking only just stopped, and I'm near the coast" (which goes to `long-strong`).
2. Fixed. The first screen reads "Long or strong earthquake, sea suddenly rising or falling, or told to evacuate? Move immediately ...". It quotes A's "If an earthquake is Long or Strong: Get Gone.", C's sea-level line and D's "evacuate immediately". Notes say why the advisory, outside-zone and at-sea routes differ.
3. Fixed. First-screen answers "Sea rose or fell, or loud noises" go to `get-gone` and "Lake: strange water or rock falls" goes to `lake`, one tap each. `lake` opens with the action, then gives a one-line list of signs. The separate `signs` screen is removed: its signs are on the first screen and on `not-long`, which also goes straight to `get-gone` and `lake`.
4. Fixed. `get-gone` shows "Don't spend time looking for pets; take them only if it won't delay you. Grab bag: if possible." `on-the-way` keeps "Not at home? Don't go back for pets. Don't go into the zone for your grab bag or belongings." Both quote A and D.
5. Fixed. The question now reads "Small boat: can you be ashore on foot within ten minutes of first noticing the sign?". Notes say what starts the clock.
6. Fixed. Answers now say "Over 50 metres, outside harbours/channels" and "Over 50 metres, in a harbour or channel". The second goes to a new `boat-harbour` screen. It says the guidance does not cover this, and points to the harbourmaster and Maritime Radio. It quotes D on bays and harbours.
7. Fixed. `boat` says "This is for a local tsunami (minutes away). Distant one? Check with your harbourmaster." The harbourmaster line was moved there from `boat-at-sea`. `advisory` says "Out at sea? The guidance doesn't say whether to come in. Listen to Maritime Radio." Both are in Notes.
8. Fixed. The answer now reads "I know I'm outside the evacuation zones". `outside-zone` drops the address search and says "Not sure? The guidance doesn't say. If you are told to evacuate immediately, move immediately", with a choice to go (`get-gone`). The address search is on the prepare route only.
9. Fixed. `not-long` adds "Mountain lake or fiord? Even a small quake can cause a tsunami; signs may be weak.", quoting D, and has a lake answer.
10. Fixed. `quake` adds "Get down on your hands and knees or as low as you can. Cover your head and neck. Hold on.", quoting A. The first screen splits into "Shaking now" (`quake`) and "Shaking has stopped" (`long-strong`).
11. Fixed. `prepare` adds the radio, TV and website line, quoting D. `prepare-more` adds the answers "Still waiting" (back to `prepare`) and "Cancelled or all-clear" (`after`).
12. Fixed. `advisory` now says "Land flooding isn't expected, but this can change.", quoting D's "(although this assessment may change)".
13. Fixed. `informal` adds "Not going for now: watch for signs", which goes to `not-long`.
14. Fixed. The one-minute difference is now a short bracket, "(Civil Defence: a minute or more)". `not-sure` puts the self-evacuate rule first and drops "follow local advice". The pre-start Warning now says "Look at this only when you've stopped somewhere safe." The travel screens (`on-the-way`, `cant-get-out`, `driving`) now ask "I've reached safety" or "Still on my way" instead of a Next to `stay-there`.
15. Fixed: the wind-waves line on `boat-to-deep`, D's bridges and landslides line on `on-the-way`, and the slow or congested routes note. Urgent screens (`quake`, `get-gone`, `driving`, the boat screens) now use Say/Warning, not tick boxes. Left as is, as the review allows: `boat-dock` keeps its short Warning, and the full quote carries the condition.

Left: nothing. Some screens are still over about 50 words, counting the answer buttons. The start screen is 81 words, about 30 of them text without the 8 answers. Every line was kept because the review asked for it.
