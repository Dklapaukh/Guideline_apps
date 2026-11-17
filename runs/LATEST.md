Set-up session, 18 Nov 2026 (not a nightly run).

Built:
- The engine: template reader, checker (contradictions, gaps, unreachable steps, quote matching), phone runtime.
- The Studio: paste a template, see checks and a live preview, copy the finished app. No AI.
- App 1: Cooling freshly cooked food (MPI Yellow Card). 8 steps, 12 of 12 quotes found in the saved guideline text.
  The 6-hour limit is a one-off deadline bar from the first screen. Two gaps in the guideline itself are shown in
  the app: no action given if stage 1 takes over 2 hours, and the 4-hour stage limit vs the 6-hour total.

An independent reviewer then tried to break it and found 21 problems. Fixed: ordinary sentences with a colon were
being hidden, arrows inside answer text, quotes attaching to the wrong line, the clock restarting after "Back",
timers not firing while another tab was open, names in non-Latin scripts, gaps in decimal number bands, tables
keyed by a choice, a bad settings file crashing the build, slow quote checking, and the nightly instructions.
Apps now also beep when something is due and carry on after the page is reloaded.

Needs you: nothing. Comments you leave on any app or this dashboard are read by the next run.
Tip: guideline PDFs uploaded to the repo's sources/ folder make quote checking exact.
Next run: guideline 2 in the queue (burns first aid).
