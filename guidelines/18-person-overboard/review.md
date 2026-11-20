# Review: 18-person-overboard

Verdict: Pass with fixes. The numbers, phone numbers and quotes are faithful, and the non-NZ lines are labelled almost everywhere. But two routes have real gaps: losing sight of the person skips "stop and turn back" and "mark the position" (finding 1), and there is no way to call for help after the person is on board, for example if they are unconscious (finding 2). The order also makes the caller go through the whole Mayday before "go back to the person" (finding 3). Fix findings 1 to 5 before this is shown as finished; the rest are smaller.

Checked by: an independent reviewer (AI) on 21 Nov 2026. I compared template.md with source.txt and the meta.json sourceNote line by line, then built the app (26 steps, all reachable, 0 fix, 0 check, 11 info, 75 of 75 quotes exact). I ran the explorer (312 routes, 8 endings, 26 of 26 steps seen, no problems) and tapped through these routes by hand: the full radio route to Finished; lost sight then 111; no reply then 111; "already back on board" from the start; hard recovery then "still in the water". Every Record button logged a time, and two taps showed "2×". Every Write box saved to the Log with both times, showed on the Finished screen, and kept its text on Back. The prototype banner and "Not reviewed" are shown.

## Coastguard NZ four steps and labelling check
- **A5 four steps:** all present, in Coastguard's order, one per screen: shout (start), throw (throw), watch (watch), stop and turn back (stop). The prop warning (A5) is on stop and again on approach. Wellington's Point, "make a path back" and "avoid jumping in" (C1) are on the right screens.
- **Numbers:** every number on screen is in source.txt: VHF 16, 111, *500, the four SSB frequencies, 0508 472 269, 0508 222 433, 24 hours, "under 10 minutes", "less than 11 minutes".
- **Non-NZ labels:** every Victoria and RYA line is labelled "Australian guide (Victoria)" or "UK guide (RYA)" on the line itself, except the tick box on alongside (finding 8).
- **The *500 disagreement** is shown on the phone screen, with both quotes.

## Findings

1. **lost: losing sight skips "stop and turn back" and "mark the position".**
   - What is wrong: watch -> "No, we lost sight of them" goes to lost, and lost offers only help, stop ("We can see them again") or approach. So on the lost route the person never sees stop (Coastguard's 4th step, the prop warning, Victoria's "neutral and swing the propeller away") or mark (bearings, waypoint, MOB button, and the Position box). Driven route: start > throw > watch > lost > help > phone > approach. Yet losing sight is exactly when the position matters most: Victoria says the bearings and waypoint "will assist if a search is required". Later, say2 says "Your position is in the Log if you typed it", but on this route there was never a box to type it in.
   - Suggested fix: send lost to mark (or put the mark lines and the Position box on lost), then on to stop, then help. Or make watch -> "No" go to stop and then mark, as on the main route, and ask "Can you see them?" again after mark.
   - Whose fault: the template's.

2. **aboard: no way to call for help after the person is on board.**
   - What is wrong: aboard says "for someone not breathing or unconscious, take all the appropriate steps ... use your first aid training and call for help if needed". But aboard has only Next -> warm -> cancel -> report. There is no button to call 111 or make a Mayday. This matters most on the "They are already back on board" route from start, which skips help entirely. The help screen can't simply be reused, because every way out of it leads back to approach ("Go back to the person").
   - Suggested fix: on aboard, ask a question such as "Do they need help now (not breathing, unconscious, hurt)?" with "Yes" going to a short screen: call 111 or VHF 16, quoting A1 ("someone is injured or life is in danger, immediately call VHF Channel 16 ... or call 111"), then on to warm. Don't add first aid steps: no source gives any.
   - Whose fault: the template's.

3. **help: the whole Mayday comes before "go back to the person", and you can't skip calling.**
   - What is wrong: the route is stop > mark > help > radio > say1 > say2 > say3 > say4 > reply > contact, and only then approach. A skipper on their own who follows the screens in order will make the full call before going back to someone who may be a few metres away. Coastguard says to "turn back as soon as you're able", and RYA says time is short (stop shows "less than 11 minutes"). The help question also has no "not calling yet" answer. The only way past it is "Help is already coming", which isn't true for someone who chose not to call.
   - Suggested fix: on help, add "Not calling yet: go back to them now -> approach", and add "Call for help" to approach and recover so that it can be done later. Say on help that another crew member can make the call while the skipper goes back (and say in Notes that this is the app's own suggestion, as for the Warning banner). Don't make the call automatic or required: whether to call is the skipper's judgement (LESSONS trap 8).
   - Whose fault: the template's (the order). The guideline has a gap too: Coastguard's four steps don't say when to call.

4. **say3, say4: script words the author filled in are shown as the script.**
   - What is wrong: say3 shows "We have a person overboard." in quote marks, as if Coastguard's script said it. The script says "We have (state what is wrong, the nature of your distress)." The Notes admit this is the author's wording, but the screen doesn't. say4 also adds "(for example, what the person is wearing)", which no source says.
   - Suggested fix: say3: `Say: "We have [what is wrong]." Here, for example: "a person overboard".` Mark the example as the app's. say4: drop "what the person is wearing", or label it "app's suggestion". The "Description of the person in the water" box can stay.
   - Whose fault: the template's.

5. **help: "A person overboard is a Mayday emergency" is stronger than the source, and its quote is only three words.**
   - What is wrong: Coastguard (A2) says a Mayday is for "grave and imminent danger and requires immediate assistance", and gives "a person overboard" as an example. The quote "a person overboard" is too short to show that context. The screen drops the condition and also never mentions Pan-pan: Wellington C4 says "make a Pan-pan or Mayday call on channel 16", and Wellington C3 and Northland D1 describe Pan-pan for urgent problems that are not life-threatening. The Notes explain the choice, but on screen the disagreement is resolved silently.
   - Suggested fix: "Coastguard NZ gives a person overboard as an example of a Mayday: grave and imminent danger, needing immediate help." Quote the whole A2 sentence. Add one line: "Wellington and Northland describe Pan-pan for urgent problems with no immediate danger; no source gives Pan-pan wording."
   - Whose fault: the template's.

6. **stop: too much on the most urgent screen, and the survival times are chosen selectively.**
   - What is wrong: stop has a tick, a Record, a Warning and four Say lines (Victoria prop, "no NZ manoeuvre", Maritime NZ under 10 minutes, RYA under 11 minutes), at the moment the boat is turning. It shows only the two shortest times. The NZ Wellington guide's "1-3 hours in the water with a life jacket on and around 10 minutes without" is left out, though it is NZ and is the line that disagrees (sourceNote difference 4).
   - Suggested fix: keep the tick, the Record, the prop Warning and the Victoria neutral line on stop. Move the survival times to About or a "Why speed matters" detail, and show Wellington's with/without lifejacket line beside the other two, all labelled. Don't make any of them a timer.
   - Whose fault: the template's.

7. **signals: "Use these signals only to indicate distress" is left out.**
   - What is wrong: Northland D2 ends with "Use these signals only to indicate distress". It is an "only" instruction (LESSONS trap 10), and it has no screen.
   - Suggested fix: add `Warning: Use these signals only to show you are in distress.` with the quote.
   - Whose fault: the template's.

8. **alongside: the main tick box merges Victoria and RYA, and the label comes after it.**
   - What is wrong: "Engine in neutral or off. The propeller must not hit them." is a tick box built from Victoria ("stop engines") and RYA ("neutral or switched off"). The tick itself carries no "Australian/UK" label; the label is in the Say line below it, and the screen title "Beside them: stop the propeller" is not labelled either. RYA's judgement line ("Whether or not you switch off the engine depends on weather conditions, your vessel, or a variety of other factors") is dropped, so the choice reads as a rule.
   - Suggested fix: start the tick with "Australian and UK guides:". Add RYA's "depends on weather conditions, your vessel ..." as text, labelled UK, so that neutral or off is shown as the skipper's choice.
   - Whose fault: the template's.

9. **radio: Coastguard's "another local VHF channel you know is being monitored" is left out.**
   - What is wrong: A1 says "immediately call VHF Channel 16 ... or another local VHF channel you know is being monitored". The app gives Channel 16 only.
   - Suggested fix: add one line on radio, quoting A1: "Or another local VHF channel you know is being monitored."
   - Whose fault: the template's (minor).

10. **say1 to say4: the Mayday is split over four screens, so the caller has to tap in the middle of the call.**
    - What is wrong: the script is nine short lines. Split over four screens, the person has to tap Next while transmitting, on a moving boat, often holding the handset in one hand. The position they typed is "in the Log", which is on another tab, mid-call.
    - Suggested fix: put the whole Coastguard script on one screen (Maritime NZ's alternatives in small text under the line they belong to), then reply. If the runtime can't show the Position box's text on another screen, keep the Position box on that screen too, so the typed position is in view while they speak.
    - Whose fault: the template's (design). The runtime can't yet show a saved note on a later screen.

11. **Several screens ask for a tick and a Record for the same action.**
    - What is wrong: throw, stop and help each have a tick box and a Record button for the same thing ("Throw ..." plus "Flotation thrown"; "Stop the boat ..." plus "Boat stopped, turning back"; "Put your lifejacket on ..." plus "Beacon activated"). That is two taps per action for someone with wet, busy hands, and only the Record gives a time. start's answer is labelled "Shouted: next", which reads oddly.
    - Suggested fix: on the first screens, keep the Record and make the instruction a Say (or a Warning), so there is one tap per action. Rename "Shouted: next" to "Done: next".
    - Whose fault: the template's (minor).

12. **stop, lost, aboard, cancel: advice the app added, not marked as the app's.**
    - What is wrong: four lines are the app's own advice, not quoted:
      - stop: "Use the way you have practised." Victoria H10 says practise the drill, but that line isn't quoted.
      - lost: "Call for help now if you have not."
      - aboard: "call for help if needed".
      - cancel: "Ask Coastguard or Maritime Radio."
      All are sensible (LESSONS trap 13 allows "follow local procedure"), but they read as if a guideline said them.
    - Suggested fix: on stop, quote H10 labelled Victoria ("Practice your 'man overboard' drill whenever possible and in all conditions"), or start the line with "App's suggestion:". Do the same for the other three.
    - Whose fault: the template's (minor).

13. **Non-NZ instructions left out: RYA DSC alert, briefing the crew, and the danger to rescuers with an unconscious person.**
    - What is wrong:
      - RYA I2 "issue a MAYDAY or DSC Alert": DSC (the radio's distress button) is not mentioned anywhere, and no NZ source covers it.
      - RYA I2 "Always ensure the crew is properly briefed on your next steps during recovery" is left out.
      - RYA I4 "A crew member will need to secure a lifting device to the casualty's lifejacket or harness ... other crew members will be at risk reaching overboard" is left out of hard. That is a warning about danger to rescuers.
    - Suggested fix: on radio, add a UK-labelled line for the DSC alert. On approach, add the briefing line, labelled UK. On hard, add the I4 lines as a UK-labelled Warning.
    - Whose fault: the template's (non-NZ, so lower priority).

14. **report: "immediately" is shown at the end of the route.**
    - What is wrong: Tasman G2 says to report "immediately" to Maritime Radio or RCCNZ. The app puts this after warming and cancelling. That is a sensible order (the person comes first), but the screen doesn't say that a Mayday or 111 call may already have told them. The line is from one regional harbourmaster page. It is labelled "Tasman harbourmaster page", which is good.
    - Suggested fix: add "If you made a Mayday, Maritime Radio may already know; the page doesn't say whether that counts as reporting." Leave the order as it is.
    - Whose fault: the guideline's gap. The template could say it.

## Checked with no problem found
- All quotes are exact (75 of 75), and none drops a "do not / unless / only / if" from its own sentence: "Avoid jumping in the water if possible. If you must", "if they are close to the boat", "(if carried on your vessel)", "if needed", "if you have one", "(calm conditions only)", "If the casualty is conscious and can assist". The exceptions are findings 7 and 8.
- The two Mayday scripts (Coastguard A3, Maritime NZ B3) are in the same order, and the app follows it. Boat name 3 times, then call sign once, as both say. The example boat "Achiever ZMW3545" is replaced with placeholders.
- No timers or reminders are built from the survival times, which is right: no source gives a time to act on.
- The gaps are said on screen: no NZ turning or approach method, no GPS or MOB button in NZ, no search method, no first aid steps, no NZ medical review, no way to cancel a deliberate beacon or a Mayday, no list of what to record. The 0508 472 269 number is shown only as being for accidental activation.
- Maritime NZ cold water (E) and Water Safety NZ F1 to F4 are written for the person in the water, and Notes say why they aren't used. That is reasonable. C5 (overdue plan), the C6 pouch, the C7 warm layers and wetsuits, B7 (the sticker) and H10 (the practice drill) are preparation, not steps.
- Version, Sources (non-NZ marked "NOT NZ"), Audience and the empty "Reviewed by:" are correct. The prototype banner shows.

Missed instructions: 2 (NZ sources: Northland D2 "Use these signals only to indicate distress", finding 7; Coastguard A1 "another local VHF channel you know is being monitored", finding 9). Non-NZ instructions with no screen: 3 (RYA DSC alert, crew briefing, I4 rescuer risk with an unconscious person; finding 13). Also on one route: on the lost-sight route, stop and mark (with the Position box) are never shown (finding 1), and on every route there is no way to call for help after recovery (finding 2). Preparation lines (C5, C6 pouch, C7 layers and wetsuits, B7, H10) are not counted.

## Fixes applied
1. Fixed: lost now goes on to stop, then mark (with the Position box), then help, so every route passes stop and mark. Losing sight later, while going back, has its own short screen (lost-again: keep pointing, seen again or call for help).
2. Fixed: aboard asks "Do they need help now (not breathing, unconscious or hurt)?". Yes goes to a new urgent screen, which quotes Coastguard A1 and offers VHF or 111. After any call (contact, phone, signals) the app asks where the person is: in the water goes to approach, on board goes to warm. No first aid steps were added.
3. Fixed: help has "Not calling yet, or already called: go back to them", plus an "App's suggestion" line that one person can call while the skipper goes back. "Call for help now" is offered on approach, lost-again and hard. It was taken off recover to keep the route count down; from recover, "Not yet: it's hard" leads to hard, which has it. no-reply also offers "Go back to the person now". The NZ order is kept: shout, throw, watch, stop, mark, then the call question.
4. Fixed: the script uses Coastguard's own placeholder "(state what is wrong, the nature of your distress)", followed by "App's note: here, a person overboard." "What the person is wearing" was removed, and the Write box is now labelled "Description of the person".
5. Fixed: the help screen now reads "Coastguard NZ gives a person overboard as an example of a Mayday: grave and imminent danger, needing immediate help", and quotes the whole A2 sentence. A Pan-pan line quotes Wellington C3 and Northland D1, and says no source gives Pan-pan wording.
6. Fixed: stop now has only the stop and turn back line, the Record, the prop Warning, the Victoria neutral line and the one-line "no NZ manoeuvre" gap. The survival times moved to help, as three quoted information lines: Wellington (1-3 hours with a lifejacket, around 10 minutes without), Maritime NZ (under 10 minutes) and RYA (less than 11 minutes, UK). None is a timer.
7. Fixed: signals has a Warning, "Use these signals only to show you are in distress", with the Northland quote.
8. Fixed: the alongside tick starts "Australian and UK guides:". RYA's "depends on weather conditions, your vessel..." line is quoted in full, labelled UK, as the skipper's call. The title no longer reads as a rule.
9. Fixed: radio has "Coastguard NZ: or another local VHF channel you know is being monitored", quoted.
10. Fixed: the whole Mayday is on one screen (script), with Maritime NZ's alternatives under the line they belong to. That screen has its own "Position you are reading out" box, because the runtime can't show the mark screen's text there.
11. Fixed: start, throw and stop now show the instruction as a Say line with one Record button. The beacon is a Say line with a "Beacon activated" Record, on radio. "Shouted: next" is now "Done: next". lost uses a Say line with its Record.
12. Fixed: stop's "Use the way you have practised" was removed. lost's "Call for help now if you have not" became "App's note: the sources do not say how to search...". aboard's "call for help if needed" was replaced by the need-help question. cancel's line now reads "App's suggestion: ask Coastguard or Maritime Radio."
13. Fixed: there is a UK-labelled DSC alert line on radio, a UK-labelled crew briefing line on approach, and a UK-labelled Warning on hard about the lifting device and the risk to crew (RYA I4).
14. Fixed (guideline gap said plainly): report now says "If you made a Mayday, Maritime Radio may already know. The page does not say whether that counts as reporting." This is also in Notes. The order is unchanged.

Rebuilt: 25 steps, all reachable, 0 fix, 0 check, 14 info (app-wording lines with no quote, unused background amounts, no reviewer, web-fetch copy). 87 of 87 quotes are exact. Explorer: 286 routes (the full exploration, not cut off at the 400 limit), 10 endings, 25 of 25 steps seen, no problems. npm test: 37 of 37 pass.

## Owner feedback round (21 Nov)
What the owner asked for: app additions clearly marked and no new advice; use the phone's GPS; less text per screen, more urgency, less source clutter.
- Look: Rescue is set at the top.
- Less on each screen: every screen now shows a title, one or two short Say or Do lines, its Record or Location button, then the question. Visible lines per screen, before then after, roughly: help 12 to 2, script 12 to 9 (the script itself), signals 10 to 4, approach 7 to 2, hard 8 to 3, contact 7 to 4, phone 7 to 4, radio 6 to 3, start 6 to 3, report 6 to 4, watch 5 to 2, stop 5 to 3.
- More detail: AU and UK guidance, background, the survival-time figures, the source disagreements and the gap statements all moved into More lines (43 in all), folded under "More detail" with their quotes kept. Quotes now sit in the one "Sources for this screen" fold.
- Labels: non-NZ lines start "AU guide:" or "UK guide:".
- Warnings left on screen: only the safety-critical ones (avoid jumping in, the propeller on stop, approach and alongside, signals only for distress, risk to crew with an unconscious person).
- GPS: the mark screen's Write box is now `Location: Where the person went in`, with a "Use GPS position" button. It is supported by the Victoria waypoint quote and the RYA man overboard button quote, and More says that only the AU and UK guides mention GPS. The "Position marked" Record was removed because the Location box already logs the time. The Mayday script screen has `Location: Position to read out` at the top.
- App tips (the app's own flow or tool suggestions, no numbers, no safety advice):
  - start: "Tap the buttons as you go: the app keeps the times."
  - mark: "One person keeps pointing while another taps the GPS button."
  - help: "If there is crew, one person calls while the skipper steers back."
  - script: "Tap the GPS button first, then read the position out."
  - cancel: "Not sure how to cancel? Ask Coastguard or Maritime Radio when you speak to them."
  The script's "here, what is wrong is a person overboard" stays in More as an "App's note". It is wording help, not a flow tip.
- Kept: every route, the NZ urgency order, and all 14 earlier reviewer fixes.
- Result: 25 steps, 0 fix, 0 check, 14 info. 91 of 91 quotes exact. Explorer: 286 routes, 10 endings, 25 of 25 steps seen, no problems. npm test: 44 of 44 pass.
- Screenshots in the Rescue look (start, stop, mark with GPS, the Mayday script, help with folds open, recover) looked fine: nothing cut off, and the question is on the first screen except on start and mark.

## Second review (21 Nov, owner feedback round)
Checked by: a second independent reviewer (AI) on 21 Nov 2026, who wrote none of this. I read CLAUDE.md, LESSONS, DESIGN, source.txt, template.md and the review above; rebuilt the app (25 steps, all reachable, 0 fix, 0 check, 14 info, 91 of 91 quotes exact); ran the explorer (286 routes, 10 endings, 25 of 25 steps seen, no problems); and took phone screenshots (390 x 844, and tall) in Rescue of home, start, stop, mark (GPS success with a faked position, and GPS refused), help, the Mayday script, phone, recover, warm, signals, cancel and the Log, plus help and mark in Clinic and two screens of app 16 (severe bleeding) in Clinic.

Verdict: Pass with fixes. The owner's three asks are mostly met: every Tip carries an unmistakable "App tip · not from the guideline" badge with no numbers, screens are much shorter, the GPS button works and its fail message reads well, and no quote, number or earlier fix was lost. But two Tips go beyond flow/tool help (findings 1 and 2), two first taps sit below the fold on a normal phone (findings 3 and 4), and three safety lines that matter at the moment of action are now folded away (findings 5 to 7). Fix 1 to 4 before the owner sees it as finished.

### Findings
1. **help, Tip: "If there is crew, one person calls while the skipper steers back" is crew-task advice, and can take the only spotter off the person.**
   - What is wrong: no source says who should call. It is advice about how to run the rescue, not about using the app. On a two-person boat the "one person" who is not steering is also the one Coastguard tells "don't take your eyes off them!" and Wellington tells to keep pointing; the Tip would send them to the radio. The banner's "Best used by a crew member who is not steering or watching the person" gets it right; this Tip doesn't.
   - Suggested fix: make it a tool tip that can't clash with watching, e.g. `Tip: Hand this phone to someone who is not steering or watching the person.` Or drop it. If the owner wants the call-while-returning idea kept, put it in More as "App's note (not from the sources): ..." and add "never the person watching them".
2. **cancel, Tip: "Not sure how to cancel? Ask Coastguard or Maritime Radio when you speak to them" is procedural advice for a gap, not flow help.**
   - What is wrong: the sources don't say how to cancel a Mayday or a beacon set off on purpose (LESSONS trap 13). The Tip fills that gap with the app's own procedure, and it is the visible line, while the honest gap statement ("No source says how to cancel...") is folded in More. It is sensible and badged, but the owner asked for no new advice in Tips.
   - Suggested fix: make the gap the visible line (`Say: The sources don't say how to cancel a Mayday or a beacon you set off on purpose.`), keep the 0508 accidental-activation line in More, and either drop the Tip or turn it into a tool tip (`Tip: The Log shows what you called and when.`).
3. **Home screen: the START button is hidden under the tab bar on a normal phone (390 x 844).**
   - What is wrong: the About paragraph and the yellow Warning push START to about 815 px; the tab bar covers it. In a person-overboard the first tap needs a scroll. (Other apps share the layout, but this is the most time-critical one.)
   - Suggested fix: shorten `About:` to one or two lines (e.g. "Shout, throw, watch, stop, call for help, recover, warm, report. Keeps the times."), and move the source-mixing sentence to Notes or the Warning. Longer term (engine): put Start above the About text, or make the start button sticky.
4. **script: on a normal phone only "Mayday. Mayday. Mayday." is visible; the rest of the call needs scrolling.**
   - What is wrong: the Location box (title, GPS button, text box, Save to Log, help text) and the Tip fill the first screen, so the caller scrolls mid-call, which is what putting the whole Mayday on one screen was meant to avoid. The script lines are also regular weight, lighter than the Tip above them.
   - Suggested fix: keep the position on mark only (the Log already has it, and the script's own placeholder says "in position (latitude & longitude)"), or put the Location box under the script lines and drop the "Tap the GPS button first" Tip. Engine idea for later: a compact Location box (button and text only), and a way to show the mark position on a later screen.
5. **recover: the small-boat capsize risk is folded away.**
   - What is wrong: the only visible line is "Use the boat hook". The AU line "preferably over the stern, as a small vessel might capsize or take on water if you try taking them in over the side" is in More, though it is the line that decides how they pull the person in, at that moment, on exactly the boats this app is for.
   - Suggested fix: make it a visible labelled line: `Say: AU guide: bring them in over the stern if you can; a small boat may capsize over the side.` (same quote). Keep ladder and heaving line in More.
6. **warm: "go to a medical facility to be checked" (secondary drowning) is folded away.**
   - What is wrong: the only line on aftercare that tells people to get the person checked is in More. A conscious, warmed-up person can look fine; this is the line a clinician would least want hidden. It is UK-only, which More already says.
   - Suggested fix: one visible line: `Say: UK guide: they should be checked at a medical facility (risk of secondary drowning). No NZ source says this.` with the existing quotes.
7. **phone: the *500 disagreement is now folded away; LESSONS trap 5 says keep both visible.**
   - What is wrong: *500 is the Coastguard number many NZ boaties know, and Northland lists it for emergencies. On the phone screen the disagreement is now inside More. The visible 111 instruction is right, so this is lower risk than 5 and 6.
   - Suggested fix: one short visible line: `Say: *500: the sources disagree on using it for emergencies (see More).` Don't add "don't call *500": no source says that.
8. **stop: the AU "neutral and swing the propeller away" line is folded away.**
   - What is wrong: it is the only concrete propeller action and it applies exactly when stopping near the person. The NZ propeller Warning is visible, so this is minor.
   - Suggested fix: optional: add it to the visible Warning area as a labelled Say, or leave in More if the owner prefers fewer lines.
9. **Rescue look: the Tip is the boldest text on several screens, heavier than the guideline instruction.**
   - What is wrong: in Rescue, Tip text is bold and the Say line is regular weight, so on help and cancel the app's own suggestion looks more important than the guideline's line. In Clinic the Tip is regular weight in a pale blue box, which reads correctly.
   - Suggested fix (engine/looks/rescue.css, for the builder): Tip text regular weight (keep the badge and dashed border), or Say lines bold in Rescue.
10. **handover and End: unmarked app advice on screen.**
    - What is wrong: "Show rescuers or Maritime NZ the Log: the times, the position and the description you typed" is visible as a Say; only the folded More says it is the app's summary. "Keep this phone's Log" is also the app's.
    - Suggested fix: make the first line a Tip (`Tip: Show rescuers the Log: the times, the position and the description you typed.`). That is tool help and fits the Tip rule.
11. **Labels don't match: the top Warning says "Lines marked Australian or UK", but lines now say "AU guide:" / "UK guide:". Notes ("Which source leads") still says lines say "Australian guide (Victoria)" or "UK guide (RYA)".**
    - Suggested fix: Warning: "Lines marked AU guide or UK guide are not New Zealand guidance." Rewrite that Notes sentence to the current labels (docs hold what is true now).
12. **Small things.**
    - mark: after GPS, two messages say the same thing ("Position from GPS at 03:03, saved in the Log." and "Saved in the Log at 03:03 (0:01 after start)"). Engine: show one.
    - mark Tip "One person keeps pointing while another taps the GPS button" is fine as flow help, but assumes two people; "If you have crew, ..." would match the help Tip.
    - signals More: "Arms: slowly and again and again" reads oddly; "slowly and repeatedly" is the source's own wording.
    - "not yet" under every Record button reads like an instruction; "not tapped yet" is clearer (engine, all apps).
    - Log: an answer is printed on the next step's line ("Throw something that floats  Then?: Done: next"), which reads as if the answer belonged to Throw (engine, all apps).

### Checked with no problem found
- Tips: none has a number or a Quote; start ("Tap the buttons as you go") and script ("Tap the GPS button first") are pure tool help; the badge "APP TIP · NOT FROM THE GUIDELINE" with a dashed border is unmistakable in Rescue and Clinic.
- Unquoted lines: every unquoted More is a gap statement or a labelled summary ("No New Zealand source...", "The sources do not say...", "App's note: here, what is wrong is a person overboard"). No invented numbers, doses or times: the 4 number lines are all quoted, and every number on screen is in source.txt.
- Still visible at the moment of action: avoid jumping in (throw), propeller Warning (stop, approach, alongside), Maritime NZ lifejacket and beacon before the call (radio, as the first Say), "only to indicate distress" (signals), rescuer risk with an unconscious person (hard), take off wet clothing and get out of the wind (warm), report within 24 hours (report).
- No quote dropped or reworded: all 91 quotes are exact; every quote from the first review's fix list is still in the template; the earlier missed items (Northland "only to indicate distress", Coastguard "another local VHF channel", RYA DSC, briefing, I4) are all present. All 14 earlier fixes still hold.
- GPS: success fills "-41.28539, 174.77612 (±8 m, GPS at HH:MM)" plus degrees and minutes, and the Log carries both forms. A refusal shows "This phone or page can't share its location here. Type the position instead." above a box that still works; it reads well.
- Sources fold: one collapsed "Sources for this screen (N)" at the bottom of every screen; opened, it numbers the quotes in screen order with source, "Supports:" and no clutter above. Older app 16 (severe bleeding) in Clinic is cleaner than before: one quiet fold at the bottom, nothing cut off, all lines and answers still visible.
- Prototype banner and "Not reviewed" show; "Reviewed by:" is empty.

Missed instructions: 0 (NZ sources). Not on any screen, non-NZ only and not counted, as in the first review: RYA I3 "halyard, block and tackle ... davit" and "inflation of a life raft or over the side of a RIB or tender" (recovery gear), RYA I2 "reduce your speed to avoid further man overboard situations" (NZ "stop the boat" covers it). Nothing was lost in the owner feedback round; three safety lines were moved out of view (findings 5 to 7).

### Fixes applied (second review)
1. Fixed: the help Tip is now "Hand this phone to someone who is not steering or watching the person." The crew-task tip is gone.
2. Fixed: the cancel gap is now a visible Say line: "The sources don't say how to cancel a Mayday or a beacon you set off on purpose." The 0508 accidental-activation line stays in More. The Tip is now "The Log shows what you called and when."
3. Fixed: About is now one short line. START shows on a 390 x 844 screen without scrolling (screenshot checked).
4. Fixed: on the Mayday screen the script comes first and the whole call shows on the first phone screen (screenshot checked). The "Position to read out" Location box is below the script, and the GPS-first Tip was removed.
5. Fixed: recover has a visible line "AU guide: bring them in over the stern if you can; a small boat may capsize over the side." The ladder and heaving line stay in More.
6. Fixed: warm has a visible line "UK guide: they should be checked at a medical facility (risk of secondary drowning). No NZ source says this." It carries both RYA quotes.
7. Fixed: phone has a visible line "*500: the sources disagree on using it for emergencies (see More)." It carries both quotes. It does not add "don't call *500".
8. Fixed: stop has a visible line "AU guide: if they are close, motor in neutral and swing the propeller away from them."
9. Left: the Rescue Tip weight is an engine item, being handled by the engine agent.
10. Fixed: the handover line is now a Tip: "Show rescuers the Log: the times, the position and the description you typed."
11. Fixed: the top Warning says "Lines marked AU guide or UK guide are not New Zealand guidance." The Notes now use the current labels.
12. Fixed: signals More now says "slowly and repeatedly". The mark Tip now starts "If you have crew, ...". Left: the duplicate GPS message, "not yet" and the Log answer placement are engine items, for the engine agent.

Result: 25 steps, 0 fix, 0 check, 15 info. 94 of 94 quotes exact. Explorer: 286 routes, 10 endings, 25 of 25 steps seen, no problems.
