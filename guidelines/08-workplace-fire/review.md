# Review: 08-workplace-fire (FENZ workplace fire: evacuation and extinguisher use)

Verdict: Faithful and carefully quoted (70/70 quotes exact, no invented numbers). The example building's assembly point, flagpole, warden roles and "dial 1" are correctly kept out, and lifts are stated as a gap. Every "no / not sure" in the extinguisher check goes to "get out". It needs changes before sign-off. The most serious problem: the extinguisher route's "get out" path skips warning others and raising the alarm. Also, 111 comes fourth on the fire route, the door advice is softened into a non-instruction, one quote borrows a warden duty, and there is too much source text on the screens people use during a fire.

Checked: the template against source.txt line by line, and meta.json. Built the app (`node tools/build.mjs guidelines/08-workplace-fire`: 18/18 steps reachable, 0 fix, 0 check, 7 info, 70/70 quotes exact). The explorer drove 43 routes, saw all 18 steps, reached 6 endings, and found no problems or page errors. I drove these routes by hand: the full fire route (start → stay-out → Finish); the full extinguisher route to "fire is out"; extinguisher "not that small" → get-out → leave; extinguisher used but "still burning" → get-out; and Back twice from the extinguisher route, then the whole "Get ready" route. Back worked each time. No dead ends: every screen has an answer, Next or Finish.

## Findings

1. **The extinguisher route's "get out" never tells the person to warn others or raise the alarm (most serious, safety ordering).**
   Where: `get-out` → `Next: leave`. Reached from `start` → "Should I use the fire extinguisher?" and any "No / not sure".
   Source: "IF YOU DISCOVER A FIRE / WARN OTHER BUILDING OCCUPANTS & DIAL 111"; "Operate the nearest fire alarm manual call point".
   Problem: someone who has just found a fire and opened the extinguisher question first is the person most likely to be the discoverer. When the check sends them out, they skip `warn` entirely: no shout, no call point. On the main route, the first screen is `warn`. The successful extinguisher route also never says to raise the alarm. It only asks afterwards whether 111 has been called.
   Fix: point `get-out` to `warn`, not `leave`. Or put the shout and call-point lines on `get-out` itself. Also add one line at the top of `ext-small`, quoting the same lines: "First: shout 'Fire, Fire, Fire' and set off the alarm."

2. **111 is the fourth screen on the fire route.**
   Where: `warn` → `leave` → `smoke` → `call`.
   Source: Fire Action Notice: "WARN OTHER BUILDING OCCUPANTS & DIAL 111 FROM A SAFE PHONE". The example: call 111 comes before "Evacuate". 3-Step Plan: "Call emergency services as soon as you are out and safe."
   Problem: Notes says this is ordering only. But for someone who has a safe phone to hand, the source puts the call together with warning others. In the app they first read two screens of escape advice. The banner says "Call 111", which helps, but the step order does not match the Notice.
   Fix: add to `warn` a line quoting the Notice ("Call 111 from a safe phone and ask for FIRE, or as soon as you are out"). Keep `call` for the address and the "who is still inside" details once out. Or move `call` before `smoke`. Update the "Order of 111" note.

3. **"Close doors" is softened into a fact plus "follow your training".**
   Where: `smoke` lines 48-53.
   Source: 3-Step Escape Plan heading "Close doors", then "A closed door buys you time."
   Problem: the source gives an instruction ("Close doors"). The app says only "A closed door slows the fire and buys you time", then tells a person who is escaping to "follow your workplace's training". That reads as neither yes nor no. It is fair to flag that the plan is written for homes, but the instruction itself was dropped. LESSONS trap 10 (meaning changes when cut).
   Fix: `Do: Close doors behind you as you go.` with `Quote: "Close doors"`. Keep the "home escape plan" provenance in `Note:` / `## Notes`, not on the screen (see 6).

4. **The "all-clear" line borrows the example building's Head Warden duty, and leaves out who else can give it.**
   Where: `stay-out` line 76-77.
   Source: Head Warden: "Do not allow anyone to re-enter the building until the emergency is over and Fire and Emergency have given the all clear". Area Wardens: "until the all-clear has been given by the Head Warden or Fire and Emergency".
   Problem: Notes says warden roles are left out, yet this screen quotes one, and it shows as "Example evacuation scheme, Head Warden". The example itself also lets the Head Warden give the all-clear. So "only FENZ" is one of two readings, and both come from a made-up building. The general rule in the source (3-Step Plan) is the stricter "Don't ... go back inside for any reason", which the screen already shows.
   Fix: drop the all-clear `Say:`, or reword it: "Your workplace's plan says who gives the all-clear (in FENZ's example it is Fire and Emergency or the Head Warden)." Mention it in Notes under warden roles.

5. **The `ext-done` quote is taken out of context.**
   Where: `ext-done` line 143-144.
   Source: "Liaise with Fire and Emergency upon their arrival" comes under "After hours, if you discover a fire", after evacuating. It is not about a fire that has been put out.
   Problem: the quote doesn't support "Tell Fire and Emergency what happened" after a fire is out. The rest of the screen states the gap correctly.
   Fix: keep the line but label it as app wording. Or say "FENZ's example scheme says to liaise with Fire and Emergency when they arrive" and keep the gap sentence. Also consider adding the 3-Step Plan quote "Don't leave the meeting place to go back inside" if the person is now outside. The source doesn't say whether to stay with the extinguished fire, so say that.

6. **Too much source explanation on the screens people use during a fire (usability).**
   Where: `leave` (4 instructions plus the lift gap sentence), `smoke` (get low, doors, plus the 2-line "This advice is from FENZ's home escape plan..." sentence), and `ext-confident` (gas, dry powder, wet chemical, metal, label, confidence: 6 messages before one question).
   Problem: a stressed person walking out of a building should see short orders. The provenance text belongs in `Note:` / `## Notes` / `About:`. That is where the template already explains it, so the screen text repeats it. On `ext-confident`, the question ("confident you know how?") is under three warnings about choosing the right type, and none of them is a decision.
   Fix: on `leave`, keep "Leave now by the nearest exit / Don't stop for your things / Help others / Use the stairs, not your workplace's plan for lifts" in short lines, e.g. "Lifts: FENZ doesn't say; follow your workplace plan." On `smoke`, cut the provenance sentence. Split `ext-confident` into two decisions: "Is this the right extinguisher for this fire?" (show the gas, dry powder, wet chemical and metal warnings; No/not sure → get-out), then "Are you confident you know how to use it?". Both are covered by the source's "confident you understand how to use the extinguisher correctly".

7. **Missed instruction: "Check the area you are in for other people".**
   Where: not in the template. `leave` has only "Help others get out if they need it".
   Source: "After hours, if you hear the alarm / Check the area you are in for other people". Also "assisting anyone else you see on the way".
   Problem: this is a general action, not one of the example building's warden roles. The after-hours section isn't listed under "Left out on purpose", so it looks dropped, not decided.
   Fix: add `Do: Check the area you're in for other people, and help anyone you see on the way.` to `leave`, quoting both lines (and noting they come from the example's after-hours section). Or list it in Notes as left out on purpose, with the reason. Counted below as 1 missed instruction.

8. **"Location" dropped from the size check.**
   Where: `ext-small`.
   Source (home page): "It's safe to do so considering the size and location of the fire".
   Problem: the app asks only about size (the commercial page's "waste paper basket or pot"). A small fire in a bad place (e.g. blocking the only exit, near gas cylinders) is not covered except by `ext-escape`. Small loss, but it is part of an "only use when" list.
   Fix: change the line to "The fire must be small (no bigger than a waste paper basket or a pot on a stove) and somewhere you can safely reach", quoting the size-and-location line. Or ask "Is the fire that small, and safe to get near?".

9. **"From about 2-3 metres away" drops "most" and "a safe distance".**
   Where: `ext-use` line 130.
   Source: "Aim the nozzle at the base of the fire from a safe distance." / "Most extinguishers are designed to be operated from about 2 - 3 metres away."
   Problem: the app makes it absolute for every extinguisher. Minor (LESSONS trap 10, a qualifier cut).
   Fix: "Aim at the base of the fire from a safe distance (most extinguishers work from about 2-3 metres)."

10. **`get-out` wording is wrong after the extinguisher has been used.**
    Where: `ext-use` → "No, it's still burning" → `get-out` ("Don't use the extinguisher. Leave now.").
    Problem: the person has just used it. "Don't use the extinguisher" reads oddly at that point. "Don't fight it" is the right message.
    Fix: change the warning to "Stop fighting the fire. Leave now." This fits both arrivals. Keep the quotes.

11. **"Be fast" appears only in the "Get ready" route.**
    Where: `prep-plan`. The live route has "Don't stop for your things" but not "Be fast".
    Source: 3-Step Escape Plan "Be fast", "Don't spend time trying to save possessions."
    Problem: it isn't missing, but it matters most during the event. Minor.
    Fix: optionally add "Be fast." to `leave` (quote "Be fast"), keeping the "house fire" timing only in prep as now.

12. **The business checklist is shown as `Do:` steps the user usually can't do.**
    Where: `prep-workplace`.
    Source: it is a checklist for the business ("You have monitored fire alarms...").
    Problem: as `Do:` lines, an ordinary worker is told to "do" "Monitored fire alarms connected to Fire and Emergency".
    Fix: show them as `Say:` lines or a list ("Your workplace should have:"), and add "If any are missing, tell your manager" only if it is marked as app wording. Better, leave the advice out, since FENZ doesn't say it.

13. **(Minor) "Who to tell if you need help to get out" guesses what the blank holds.**
    Where: `prep-notice` line 166.
    Source: "IF YOU REQUIRE ASSISTANCE TO EVACUATE" followed by a blank.
    Problem: the Note admits it is app wording, but the blank could hold a procedure, not a person.
    Fix: "What to do if you need help to get out."

14. **(Minor) The prep-types screen gives one pairing without its two warnings.**
    Where: `prep-types` line 214.
    Problem: "Wet chemical is best for cooking oil and fat fires" appears without "don't use wet chemical ... live electrical source" or "never [dry powder] on a cooking oil or fat fire". Those appear only on `ext-confident`. Someone learning ahead sees only the positive half.
    Fix: add the same two warnings (same quotes) to `prep-types`.

## Checked and fine
- The example's grass area, flagpole, "dial 1 for an outside line", Building/Area/Head Warden duties and "if in any doubt, make another 111 call" are not shown as the user's own. (Exception: the all-clear line, finding 4.)
- Lifts: stated as a gap ("These FENZ pages say nothing about lifts"), not filled from general knowledge. Doors: provenance flagged, but see finding 3.
- Extinguisher check: every condition from both pages is asked (size, escape path, FENZ called, everyone out, confident), and each one's "No / not sure" goes to `get-out`. The stricter home-page condition is kept and noted. The ranges "10-15 seconds" and "2 - 3 metres" are shown as printed. "Never", "don't", "only" and "always" are kept in the quotes.
- Gas-off and metal-fire lines are present. The unreadable suitability table is stated as a gap, with no pairings invented.
- Version and source-copy grade recorded. "Reviewed by" is empty. The prototype banner and Warning are present.
- The 80% / 90% statistics are background and fine to leave out.

Missed instructions: 1

## Fixes (round 1)
Rebuilt: 19/19 steps reachable, 0 fix, 0 check, 9 info, 78/78 quotes exact. The explorer drove 48 routes, saw all 19 steps, reached 6 endings, with no problems. `npm test` passes (21/21).

Fixed:
1. `get-out` now goes to `warn` (shout, call point, 111), not `leave`. `ext-small` opens with "First, shout 'Fire, Fire, Fire' and set off the fire alarm" (quoting the Notice and the call-point line).
2. 111 is now on the first fire screen with warning others ("Call 111 from a safe phone and ask for FIRE. If you can't safely, call as soon as you are out"), as the Notice orders it. `call` became "Once you're out": call if not yet called, then the address and who is missing. The Notes on order are updated.
3. `smoke` now says `Do: Close doors behind you. A closed door buys you time.` (quoting "Close doors"). Where the advice comes from is now in the Get ready route and Notes.
4. The Head Warden all-clear quote is removed. Stay-out now says "Your workplace's plan says who can give the all-clear" (app wording). The example's "Head Warden or Fire and Emergency" is in a Note and in Notes.
5. `ext-done` no longer quotes the after-hours "Liaise" line. It is app wording for the gap (what to do once a fire is out, e.g. whether to stay nearby), and this is noted.
6. In-fire screens are cut down: the lift gap is one short line, and the source text is moved off `smoke`. `ext-confident` is split into `ext-type` ("Are you sure this extinguisher is right for this fire?", with the gas, dry powder, wet chemical and metal warnings) and `ext-confident` (one question).
7. Added "Check the area you're in for other people. Help anyone who needs it on the way out" to `leave`, quoting both after-hours lines.
8. The size check now includes location ("size and location of the fire"): "Is the fire that small, and safe to get near?".
9. "Aim at the base of the fire from a safe distance (most extinguishers work from about 2-3 metres)".
10. `get-out` now says "Stop fighting the fire. Leave now."
11. Added "Be fast" to `leave`.
12. The business checklist is now a plain list, not tick-box actions, and no "tell your manager" advice is added.
13. The Notice blank now reads "What to do if you need help to get out."
14. `prep-types` now shows the wet chemical/live electricity and dry powder/cooking oil warnings too.

Left (and why):
- The 6 unquoted lines (info) are deliberate app wording: gap statements (lifts, aftercare), pointers to the workplace's own notice or plan where FENZ leaves blanks, and the supportive closing lines.
- "111 called and everyone out" stays as one question to keep the extinguisher route at 7 screens. Both must be yes.
- The gaps can't be answered from the source and stay stated on screen and in Notes: lifts, closing doors at work specifically, which extinguisher suits which class (table unreadable), aftercare once a fire is out, and an unsafe assembly point.
- A person who reaches `get-out` after already raising the alarm sees the warn screen again. This is kept on purpose, because its lines are conditional ("If the alarm isn't going") and safety comes first.
