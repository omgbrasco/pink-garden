# Backlog

## Now

Braedon: create a private gist + gist-scoped GitHub token, enter both on `setup-feedback.html` on your phone and hers, so Feedback tab actually reaches you. Until then her entries queue locally, safe but unsent.

## Assistant roadmap (Braedon's call, mostly offline - one deliberate exception now, see AGENTS.md)

Phase 1 (done, v19): chat bubbles stop auto-vanishing before she reads them, tap to dismiss, full chat history kept and viewable from the `i` panel, plain-English "how I work" note.

Phase 2 (done, v25): day-streak badge; on-screen skin-switch bubble on the home screen; Feedback tab (type/dictate/voice memo -> private gist, so an idea never gets lost).

Phase 2 (done, v28): "leave me a note" - say "remember..." in chat, ask "what did I tell you?" to recall.

Phase 2 leftovers (not done): simple to-do/checklist. Local reminders/notifications explicitly on hold - Braedon: "only do real notifications if I could" - needs iOS 16.4+/permission/testing groundwork before it's worth building, don't start it speculatively.

Phase 3: variety in the firefly game so it doesn't get stale; expand the idle-thought pool past 5 lines; natural "go enjoy your day" closing lines instead of open-ended engagement.

## Make it useful for her (ideas, Braedon picks order)

- **Lists**: done in v31 (`dumpling-list-v1`). It was: "add oat milk to my list", "what's on my list", "done with oat milk". Local, works like notes.
- **Reminders**: in-app version done in v31; Braedon picked in-app, no server. The original idea, kept for reference: "remind me to call mom at 5". Real phone notifications need a small server to send them at the right time (iOS 16.4+, home-screen app, she taps Allow once). That breaks the no-backend rule, so it's Braedon's call. No-server version: Dumpling reminds her the next time she opens the app.
- **Countdowns**: "how many days until our trip?" Dates set by her or by Braedon in the repo.
- **A daily note from Braedon**: he writes a batch into the repo, one unlocks each morning. No backend needed.

## Next (optional, hired hands)

- Pink garden: Dumpling's reply bubbles sit on top of the floating dumpling (was like this before v30 too). Needs a call on where he floats.
- Speech-bubble nudge on 16 Pro. Ask for a screenshot first.
- Version git tags when a real slice ships (`v0.19.0` or keep cache numbers).
- First `docs/jobs/` file only when Claude/Codex is hired for a slice.

## Parked

- Reliable iOS page dictation without leaving the Safari sandbox.
- Unused landscape icon stays in originals, never served.
