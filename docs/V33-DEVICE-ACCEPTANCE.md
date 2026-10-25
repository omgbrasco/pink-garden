# v33 physical iPhone acceptance — prepared, not deployed

Built by: Codex. Claude Code remains implementation owner.

Reviewed app: `65d08b446e65251f06e30167fe0af0eeeaeab87d` (PR #7).
Baseline: `754261448581fc4670ac6a5780cad80229a4962c` (master inspected October 25, v32).
Canonical result log: https://github.com/omgbrasco/pink-garden/issues/8

## Hosting decision

Recommend a dedicated free Cloudflare Pages Direct Upload project, proposed name
`pink-garden-v33-acceptance` (availability not checked). No Git integration or
automatic deploys. A new HTTPS hostname is mandatory. Keep `/pink-garden/` so
the application path matches production. The returned hostname, not this
proposed name, becomes authoritative after deployment.

Do NOT use another repository/path on `omgbrasco.github.io`: localStorage and
CacheStorage are origin-wide, and this application's SW activation deletes ALL
caches except its current version. A path-only preview could affect production.
Do not use an iframe or a raw GitHub file renderer for acceptance.

This preview preserves application code, asset bytes, relative manifest scope,
standalone display, and SW registration. Its data intentionally starts separate
from production. Do not copy real feedback tokens or production localStorage.
An isolated origin cannot prove migration of existing production device data;
use representative test data and explicitly record this limitation.

Direct Upload documentation:
https://developers.cloudflare.com/pages/get-started/direct-upload/
Free-plan limits: https://developers.cloudflare.com/pages/platform/limits/

No Cloudflare connection was found in available plugin discovery. Deployment
requires an authorized Cloudflare account/session with Pages project creation
and upload access, plus confirmation that this additional public static copy
is wanted. Do not request tokens in chat. Sites is another available hosting
route, but its access gate and PWA/SW behavior need validation before substituting
it for a plain static origin. No hosting project or deployment has been created.

## Codex setup procedure

Run `python3 tools/prepare-device-test.py` from this checkout. It writes two ZIPs
and expanded folders into a new temporary directory, verifies every runtime
file against its Git blob ID, and creates an SHA-256 receipt. It never deploys.
Only the five app files and five runtime assets are served; docs, originals,
git metadata and the orphan feedback setup tool are excluded. App bytes remain
unchanged. The receipt at `/acceptance-build.json` sits outside the app's scope.

Once hosting is authorized:
1. Create ONLY the dedicated test project. Upload `v32-baseline.zip` first.
2. Verify HTTPS, correct JS/manifest MIME types, all 10 served file hashes against
   the receipt, no injected app scripts, and no redirects to production.
   Verify `/pink-garden/`, manifest start URL and scope, and SW registration.
3. Have both phones install and seed v32 test data using the steps below.
4. Wait for confirmed baseline installation before uploading `v33-reviewed.zip`
   to the SAME project hostname. Do not use a different immutable deployment URL
   for the update test. Do not clear site data or reinstall the icon.
5. Verify all served v33 hashes before asking users to reopen. Record receipt,
   deployed URL and time in issue #8. Check SW `dumpling-v33` and absence of v32
   caches when remote inspection is available. Do not confuse a receipt fetch
   with proof of which cached code the installed phone is running.
6. After update testing, keep that stable URL on the exact reviewed v33 build.
   Do not bump version numbers or alter app files just for testing.

## Phone test (iPhone 13 first, then iPhone 16 Pro)

Record exact iOS 26 version/build, model, date, URL, and tester for each phone.
Other iOS versions are extra evidence, not substitutes for the requested matrix.

1. Open the supplied TEST link in Safari. Add to Home Screen; name the icon
   `Dumpling TEST`. Leave the existing gift icon and website data alone.
2. On baseline v32: add `acceptance test` to My list, send a chat message, choose
   night garden, acknowledge existing news. Close/reopen TEST and confirm these
   persisted. Report `baseline ready` so Codex can deploy v33 to the same URL.
3. After Codex confirms v33: force-quit TEST and reopen online. Record v33 news,
   verify list/chat/skin survived, acknowledge news and check it does not repeat.
   A slow update is a result to report; don't erase data to make it pass.
4. In BOTH pink and night gardens, open keyboard, type/send, dismiss, then reopen
   quickly several times. Composer must remain usable above keyboard; after
   dismissal no large empty lift or hidden controls. Check safe-area edges.
5. Try a short and long reply. Record a screen video from send until it clears:
   replies should last max(9 seconds, min(20 seconds, characters × 0.13 seconds))
   without idle chatter cutting them off. Tap a reply to dismiss and confirm
   normal idle chatter resumes. Do this in both gardens.
6. Force-quit/reopen; confirm saved test data. After an online load, switch to
   airplane mode and reopen TEST to check cached launch. Restore connectivity.
   Repeat core keyboard/layout checks in Safari too; standalone results are
   required and cannot be replaced with Safari or desktop emulation.

If a failure occurs, record theme, mode, exact steps and screen recording or
screenshot. Stop at evidence collection; Claude owns implementation fixes.

## Evidence record (append to issue #8)

| Check | iPhone 13 / iOS 26 | iPhone 16 Pro / iOS 26 |
|---|---|---|
| Exact OS build / tester / time | NOT RUN | NOT RUN |
| Preview URL / source receipt / loaded-build evidence | NOT RUN | NOT RUN |
| v32 baseline installed and seeded | NOT RUN | NOT RUN |
| v32 → v33 news and data preservation | NOT RUN | NOT RUN |
| Standalone launch, safe areas, both themes | NOT RUN | NOT RUN |
| Keyboard open/dismiss/refocus, both themes | NOT RUN | NOT RUN |
| Short/long reply hold and tap-away, both themes | NOT RUN | NOT RUN |
| Relaunch and offline cached launch | NOT RUN | NOT RUN |
| Safari comparison | NOT RUN | NOT RUN |

Use PASS / FAIL / NOT RUN with evidence links. Label user-reported physical
observations as such, screen recordings as observed evidence, and simulated
browser/function checks separately. No physical acceptance has occurred in
this setup task. Keep issue #8 open as NEEDS DEVICE TEST. No PR #7 merge,
production deployment, or PR #9 integration is authorized by this document.
