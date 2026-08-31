# How to undo without wrecking her phone

## Rule

`master` is what GitHub Pages serves. **Never** `git push --force` to `master`. Never rebase published commits. Never `git reset --hard` on a commit that already went to origin unless Braedon says the exact hash and "yes".

## Bad ship, go back

1. `git log --oneline -8` and find the last good commit.
2. Do **not** reset. Revert:

```
git revert --no-edit HEAD
```

3. Then **bump the cache version forward** (v18, v19, …) even if the code looks like v16. iOS and the service worker will keep a stale `dumpling-v17` if you jump backward to an old number.
4. Push `master`.
5. Tell Braedon to force-quit the home-screen icon.

## One file went wrong

Fix forward in a new commit (preferred), or `git checkout <good-hash> -- path` then bump cache and commit.

## localStorage

Play state lives on **her phone**, not in git. Reverting code does not wipe her moon/skin. Do not add a "reset all visitors" switch.

## Originals

If you mangle an asset, copy back from `originals/` and re-export WebP. Do not delete the PNG.

## Branch if the job is big

```
git checkout -b wip/short-name
```

Merge to `master` only when the garden, chat, mic, and both skins still work. Delete the branch after merge. Do not leave long-lived forks that Pages is not serving.
