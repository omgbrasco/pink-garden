"""Build exact, isolated-host upload packages. Does not deploy anything."""
import hashlib
import json
from pathlib import Path
import subprocess
import tempfile
import zipfile

REPO = Path(__file__).resolve().parents[1]
REFS = {
    "v32-baseline": "754261448581fc4670ac6a5780cad80229a4962c",
    "v33-reviewed": "65d08b446e65251f06e30167fe0af0eeeaeab87d",
}
FILES = ["index.html", "styles.css", "app.js", "sw.js", "manifest.webmanifest",
         "assets/dumpling-avatar.webp", "assets/dumpling-icon.png",
         "assets/garden.webp", "assets/moon.webp", "assets/skin-blue.webp"]
out = Path(tempfile.mkdtemp(prefix="pink-garden-acceptance-"))
for label, commit in REFS.items():
    rows = []
    folder = out / label
    for name in FILES:
        data = subprocess.check_output(["git", "show", f"{commit}:{name}"], cwd=REPO)
        blob = subprocess.check_output(["git", "rev-parse", f"{commit}:{name}"], cwd=REPO).decode().strip()
        actual = hashlib.sha1(b"blob " + str(len(data)).encode() + b"\0" + data).hexdigest()
        assert actual == blob, name
        target = folder / "pink-garden" / name
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(data)
        rows.append({"path": "pink-garden/" + name, "git_blob": blob,
                     "sha256": hashlib.sha256(data).hexdigest(), "bytes": len(data)})
    # Receipt is outside the app and never changes reviewed application bytes.
    receipt = {"source_commit": commit, "files": rows}
    (folder / "acceptance-build.json").write_text(json.dumps(receipt, indent=2) + "\n")
    with zipfile.ZipFile(out / (label + ".zip"), "w", zipfile.ZIP_DEFLATED) as archive:
        for path in sorted(folder.rglob("*")):
            if path.is_file():
                archive.write(path, path.relative_to(folder))
print(out)
