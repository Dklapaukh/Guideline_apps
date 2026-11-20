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
