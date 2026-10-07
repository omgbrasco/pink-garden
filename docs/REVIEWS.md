# Caught in review

One line per real bug the *other* agent caught. Anything that shows up twice becomes a rule in `AGENTS.md` ("Product rules that already bit us").

| Date | PR | Built by | Caught by | What | Rule now? |
|---|---|---|---|---|---|
| 2026-10-06 | #5 / #7 | Claude | Codex | Keyboard fallback guessed a keyboard from focus alone: false lift with no on-screen keyboard, and it came back after the keyboard closed. | Yes (keyboard bullet) |
| 2026-10-06 | #7 | Claude | Codex | Idle chatter ("zzz") replaced Dumpling's reply before she finished reading it. | Yes (reply hold) |
| 2026-10-06 | #7 | Claude | Codex | Visible change shipped without a what's-new card, against our own ship rule. | Already a rule |
| 2026-10-07 | #7 | Claude | Claude (while testing Codex's fix) | Night-garden speech bubble ignored taps, so "tap to hide" never worked there. | No |
