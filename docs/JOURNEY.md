# Dev journey: Pink Garden

What building this taught me, so the next project starts smarter.

**How to use:** after each ship, add one entry at the top of "Entries". Three lines max. What changed, what bit you, what you'd do again.

## Entries

### v30 (2026-10-02): clean home + side menu
- Changed: tab bar gone. Home is just Dumpling. ☰ menu holds Chat history, garden switch, fireflies, Settings. Feedback moved into Settings.
- Bit me: an empty voice-memo chip had been showing in the Feedback box. No test caught it; it only showed up when someone looked at a screenshot.
- Do again: check every iPhone size automatically (9 sizes × 2 gardens), then actually look at the screenshots.

### v29 (2026-10-01): Dumpling stops misreading words
- Changed: "I'm tired" no longer turns the moon red. Command words match whole words only.
- Bit me: this was broken for many versions because nobody typed normal sentences. Only commands got tested.
- Do again: first PR instead of pushing straight to live. Test with things she'd actually say.

## Lessons so far (v1 to v30)

### iPhone web apps
- Test on the real phone. Desktop lies. Safari's toolbar looked like a keyboard to the code and made Dumpling vanish (v15).
- Don't fight the screen height. A `screen.height` trick pushed the tab bar off her 13 (v23). Use the real visible height plus safe areas.
- The app icon must be square (512×512) or iOS stretches it (v14).
- iOS caches hard. Bump one version number everywhere, then force-quit the icon. Icon art only changes if she deletes it and adds it again.

### Shipping
- Never force-push or reset the live branch. Revert, then bump the version forward (`docs/REVERSING.md`).
- Small PR → look at screenshots → merge. Merging is the deploy.
- Write down *why*, not just what. The changelog and `AGENTS.md` stop the same mistake twice.

### Product
- Remove things all the way. The joke egg left in v18, but its reply lived until v29.
- Less on screen wins. v30 cut the tab bar and the home screen got better.
- Her data stays on her phone. No accounts, no servers, fewer things to break.

### Working with AI helpers
- Give them rails. `AGENTS.md` holds every "this bit us" rule, and every helper reads it first.
- One job per chat. Long chats drift.
- Ask for a test run and screenshots before you merge.

## Industry practices

**Already doing:** version control, changelog, small PRs, revert-don't-reset, offline-first web app, cache versioning, written rules for helpers.

**Not yet, in order of payoff:**
1. **Automatic checks on every PR (CI).** Run the iPhone-size and chat tests on GitHub so a broken PR can't be merged. Test tools stay dev-only and never ship to her phone.
2. **Real-phone check before merge.** Two minutes on the 16 Pro catches what headless tests can't: the keyboard, the mic, how it feels.
3. **A git tag per ship.** One-tap rollback points.
4. **Backup for her stuff.** Chats and notes live only on her phone. If the icon gets deleted, they're gone.

## Template

```
### vNN (YYYY-MM-DD): title
- Changed:
- Bit me:
- Do again / never again:
```
