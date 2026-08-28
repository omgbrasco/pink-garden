(function () {
  "use strict";
  const BUILD = 14;
  const PLAY_KEY = "dumpling-play-v1";
  const COLORS = {
    green: ["#d9ffd6", "#7dff8a", "#1fbf4a"],
    purple: ["#f0d4ff", "#c58cff", "#9b5cff"],
    pink: ["#ffe6f5", "#ff8fc5", "#ff4fbf"],
    blue: ["#d6f0ff", "#7ecbff", "#3a8dff"],
    yellow: ["#fff7c2", "#ffe45c", "#f5c400"],
    orange: ["#ffe0c2", "#ffb347", "#ff7a1a"],
    white: ["#ffffff", "#f2f2f2", "#d9d9d9"],
    red: ["#ffd6d6", "#ff6b6b", "#e03131"],
    teal: ["#d6fff8", "#5ef0d0", "#12b89a"]
  };
  const IDLE_THOUGHTS = ["...", "warm", "boop?", "moon", "zzz"];
  const NEED = 8;

  const els = {
    log: document.getElementById("log"),
    box: document.getElementById("box"),
    form: document.getElementById("form"),
    moon: document.getElementById("moon-art"),
    buddy: document.getElementById("buddy"),
    thought: document.getElementById("thought"),
    thoughtText: document.getElementById("thought-text"),
    thoughtDots: document.getElementById("thought-dots"),
    chips: document.getElementById("chips"),
    hud: document.getElementById("hud"),
    hudScore: document.getElementById("hud-score"),
    hudDone: document.getElementById("hud-done"),
    stage: document.getElementById("stage"),
    sky: document.getElementById("sky"),
    garden: document.getElementById("garden-art")
  };

  if (!els.log || !els.box || !els.form || !els.buddy || !els.stage || !els.sky) return;

  const play = loadPlay();
  let busy = false;
  let playing = false;
  let caught = 0;
  let thoughtTimer = 0;
  let idleTimer = 0;

  applyPlay();
  spawnStars();
  spawnFireflies(false);
  hello();
  renderChips();
  armIdle();
  registerWorker();
  fitViewport();

  els.form.addEventListener("submit", onSubmit);
  els.buddy.addEventListener("click", boop);
  els.stage.addEventListener("click", onStage);
  els.hudDone.addEventListener("click", function () { if (playing) endGame("Okay, pausing. The glows will wait."); });
  els.chips.addEventListener("click", onChip);
  els.box.addEventListener("focus", function () { document.body.classList.add("chatting"); });
  els.box.addEventListener("blur", function () {
    setTimeout(function () {
      if (document.activeElement !== els.box) document.body.classList.remove("chatting");
    }, 180);
  });
  window.addEventListener("resize", fitViewport);
  window.addEventListener("orientationchange", fitViewport);
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", fitViewport);
    window.visualViewport.addEventListener("scroll", fitViewport);
  }

  function loadPlay() {
    try {
      const raw = JSON.parse(localStorage.getItem(PLAY_KEY) || "{}");
      return {
        moon: COLORS[raw.moon] ? raw.moon : "pink",
        sky: COLORS[raw.sky] ? raw.sky : "",
        night: !!raw.night,
        skin: raw.skin === "blue" ? "blue" : "pink"
      };
    } catch (e) {
      return { moon: "pink", sky: "", night: false, skin: "pink" };
    }
  }
  function savePlay() {
    try { localStorage.setItem(PLAY_KEY, JSON.stringify(play)); } catch (e) {}
  }
  function applyPlay() {
    const r = document.documentElement.style;
    const MOON_FILTER = {
      pink: "none",
      green: "hue-rotate(100deg) saturate(1.4)",
      blue: "hue-rotate(185deg) saturate(1.25)",
      purple: "hue-rotate(-25deg) saturate(1.3)",
      yellow: "hue-rotate(38deg) saturate(1.35) brightness(1.05)",
      orange: "hue-rotate(18deg) saturate(1.4)",
      white: "saturate(0) brightness(1.28)",
      red: "hue-rotate(-12deg) saturate(1.55)",
      teal: "hue-rotate(145deg) saturate(1.3)"
    };
    const blue = play.skin === "blue";
    if (els.garden) {
      els.garden.src = blue ? ("assets/skin-blue.webp?v=" + BUILD) : ("assets/garden.webp?v=" + BUILD);
    }
    if (els.moon) {
      els.moon.style.display = blue ? "none" : "";
      els.moon.style.filter = blue ? "none" : (MOON_FILTER[play.moon] || "none");
    }
    document.body.classList.toggle("skin-blue", blue);
    if (play.sky && COLORS[play.sky]) {
      const sky = COLORS[play.sky];
      r.setProperty("--sky1", sky[0]);
      r.setProperty("--sky2", sky[1]);
      r.setProperty("--sky3", sky[1]);
      r.setProperty("--sky4", sky[2]);
      r.setProperty("--wash", sky[1] + "55");
    } else {
      r.setProperty("--sky1", "#f3e0ff");
      r.setProperty("--sky2", "#ffb3d9");
      r.setProperty("--sky3", "#ff7eb6");
      r.setProperty("--sky4", "#b06bff");
      r.setProperty("--wash", "#ff9ec830");
    }
    document.body.classList.toggle("night", play.night);
  }

  function add(who, text, extra) {
    const d = document.createElement("div");
    d.className = "bubble " + who + (extra ? " " + extra : "");
    if (extra === "typing") {
      d.innerHTML = '<span class="dots"><i></i><i></i><i></i></span>';
    } else {
      d.textContent = text;
    }
    els.log.appendChild(d);
    trimLog();
    els.log.scrollTop = els.log.scrollHeight;
    return d;
  }
  function trimLog() {
    while (els.log.children.length > 5) els.log.removeChild(els.log.firstChild);
  }
  function hello() {
    showThought("hi, i'm dumpling", false, 4500);
  }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

  function showThought(text, dots, ms) {
    clearTimeout(thoughtTimer);
    els.thought.hidden = false;
    if (dots) {
      els.thoughtText.textContent = "";
      els.thoughtDots.hidden = false;
    } else {
      els.thoughtDots.hidden = true;
      els.thoughtText.textContent = text || "";
    }
    thoughtTimer = setTimeout(hideThought, ms || (dots ? 8000 : 2200));
  }
  function hideThought() {
    els.thought.hidden = true;
    els.thoughtDots.hidden = true;
    els.thoughtText.textContent = "";
  }
  function armIdle() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(function () {
      if (!busy && !playing && document.activeElement !== els.box) {
        showThought(pick(IDLE_THOUGHTS), false);
      }
      armIdle();
    }, 9000 + Math.random() * 4000);
  }

  function boop() {
    els.buddy.classList.remove("boop");
    void els.buddy.offsetWidth;
    els.buddy.classList.add("boop");
    if (!playing) showThought("boop", false);
    try { navigator.vibrate && navigator.vibrate(8); } catch (e) {}
  }

  function colorOf(s) {
    const keys = Object.keys(COLORS);
    for (let i = 0; i < keys.length; i++) {
      if (s.indexOf(keys[i]) !== -1) return keys[i];
    }
    if (/\bgold\b|\bsun\b/.test(s)) return "yellow";
    return null;
  }

  function reply(t) {
    const s = t.toLowerCase();
    const col = colorOf(s);

    if (playing && (/stop|done|quit|enough/.test(s))) {
      endGame("Okay, pausing. The glows will wait.");
      return null;
    }
    if (/blue garden|night garden|starry|blue skin/.test(s)) {
      play.skin = "blue"; savePlay(); applyPlay();
      return "Blue night garden. Tap around. Say pink garden anytime.";
    }
    if (/pink garden|default garden|regular garden/.test(s)) {
      play.skin = "pink"; savePlay(); applyPlay();
      return "Pink garden's back. I can paint the moon here.";
    }
    if (/catch|firefl|play|game/.test(s)) {
      startGame();
      return "Tap the little glows. I'll cheer.";
    }
    if (/night|goodnight|bedtime|dark|sleepy/.test(s)) {
      play.night = true; savePlay(); applyPlay();
      return "Lights down. Cozy.";
    }
    if (/morning|daytime|\bday\b|wake|sunrise/.test(s)) {
      play.night = false; savePlay(); applyPlay();
      return "Good morning, garden.";
    }
    if (/reset|default|original|undo/.test(s)) {
      play.moon = "pink"; play.sky = ""; play.night = false; play.skin = "pink";
      savePlay(); applyPlay();
      return "Pink moon, fresh garden.";
    }
    if (col && /sky|background/.test(s)) {
      play.sky = col; savePlay(); applyPlay();
      return "Sky's wearing " + col + " now.";
    }
    if (col) {
      play.moon = col; savePlay(); applyPlay();
      return "Moon's " + col + " now. Cute.";
    }
    if (/hello|hi\b|hey|yo\b/.test(s)) {
      return "Hey you. Want a green moon, or a firefly hunt?";
    }
    if (/penis|dick|egg|waldo|hidden|find|secret|joke/.test(s)) {
      return "Tiny purple secret, left bushes. Where's-waldo. Comedy only.";
    }
    if (/help|what can|how do|commands?/.test(s)) {
      return "I can recolor the moon or sky, dim the lights, or play catch-the-fireflies.";
    }
    if (/who are you|what are you/.test(s)) {
      return "Just Dumpling. Tiny garden guy. I live on this phone.";
    }
    if (/thank|thanks|love you|cute|adorable/.test(s)) {
      return pick(["Aww. Right back at you.", "You're sweet. The garden likes you.", "Soft glow, soft vibes."]);
    }
    if (/boop|poke|hug|pat/.test(s)) {
      boop();
      return "Boop.";
    }
    return pick([
      "Hmm. Try make the moon teal, or catch fireflies.",
      "I'm mostly a garden guy. Say a color for the moon.",
      "Poke me, tap the glows, or paint the moon. That's the fun."
    ]);
  }

  function onSubmit(e) {
    e.preventDefault();
    const t = (els.box.value || "").trim();
    if (!t || busy) return false;
    els.box.value = "";
    sendText(t);
    return false;
  }
  function onChip(e) {
    const btn = e.target.closest("button");
    if (!btn || busy) return;
    sendText(btn.getAttribute("data-say") || btn.textContent);
  }
  function sendText(t) {
    busy = true;
    add("me", t);
    showThought("", true);
    const typing = add("bot", "", "typing");
    const wait = 480 + Math.floor(Math.random() * 420);
    setTimeout(function () {
      const msg = reply(t);
      typing.remove();
      hideThought();
      if (msg) add("bot", msg);
      if (playing) showThought("tap the glows", false);
      busy = false;
      renderChips();
      els.log.scrollTop = els.log.scrollHeight;
    }, wait);
  }

  function renderChips() {
    const moonColors = ["green", "teal", "blue", "yellow", "purple"];
    let next = "green";
    for (let i = 0; i < moonColors.length; i++) {
      if (moonColors[i] === play.moon) {
        next = moonColors[(i + 1) % moonColors.length];
        break;
      }
    }
    const items = playing
      ? [["I'm done", "done"]]
      : (play.skin === "blue"
        ? [
            ["Pink garden", "pink garden"],
            ["Catch fireflies", "catch fireflies"],
            [play.night ? "Make it morning" : "Make it night", play.night ? "make it morning" : "make it night"]
          ]
        : [
            ["Moon " + next, "make the moon " + next],
            ["Catch fireflies", "catch fireflies"],
            [play.night ? "Make it morning" : "Make it night", play.night ? "make it morning" : "make it night"],
            ["Blue garden", "blue garden"]
          ]);
    els.chips.innerHTML = "";
    for (let i = 0; i < items.length; i++) {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = items[i][0];
      b.setAttribute("data-say", items[i][1]);
      b.tabIndex = -1;
      els.chips.appendChild(b);
    }
  }


  function onStage(e) {
    if (e.target.closest("#buddy") || e.target.closest("#hud")) return;
    if (e.target.classList && e.target.classList.contains("firefly")) return;
    if (document.activeElement === els.box) els.box.blur();
    sparkleAt(e.clientX, e.clientY);
  }
  function sparkleAt(x, y) {
    for (let i = 0; i < 5; i++) {
      const s = document.createElement("div");
      s.className = "sparkle";
      s.style.left = (x + (Math.random() * 28 - 14)) + "px";
      s.style.top = (y + (Math.random() * 20 - 10)) + "px";
      s.style.animationDelay = (i * 0.04) + "s";
      document.body.appendChild(s);
      setTimeout(function () { if (s.parentNode) s.parentNode.removeChild(s); }, 700);
    }
  }
  function spawnStars() {
    els.sky.querySelectorAll(".star").forEach(function (n) { n.remove(); });
    for (let i = 0; i < 22; i++) {
      const s = document.createElement("div");
      s.className = "star";
      s.style.left = Math.random() * 100 + "%";
      s.style.top = Math.random() * 36 + "%";
      s.style.animationDelay = Math.random() * 2 + "s";
      els.sky.appendChild(s);
    }
  }
  function spawnFireflies(playMode) {
    els.stage.querySelectorAll(".firefly").forEach(function (n) { n.remove(); });
    const n = playMode ? NEED : 8;
    for (let i = 0; i < n; i++) {
      const f = document.createElement("button");
      f.type = "button";
      f.className = "firefly" + (playMode ? " play" : "");
      f.setAttribute("aria-label", "firefly");
      f.style.left = 8 + Math.random() * 84 + "%";
      f.style.bottom = (playMode ? 38 : 32) + Math.random() * (playMode ? 28 : 34) + "%";
      f.style.animationDelay = Math.random() * 4 + "s";
      if (playMode) f.addEventListener("click", onCatch);
      els.stage.appendChild(f);
    }
  }
  function startGame() {
    playing = true;
    caught = 0;
    els.hud.hidden = false;
    els.hudScore.textContent = "0/" + NEED;
    spawnFireflies(true);
    renderChips();
    showThought("tap the glows", false);
  }
  function onCatch(e) {
    if (!playing) return;
    const f = e.currentTarget;
    f.disabled = true;
    f.classList.add("pop");
    caught += 1;
    els.hudScore.textContent = caught + "/" + NEED;
    try { navigator.vibrate && navigator.vibrate(10); } catch (err) {}
    setTimeout(function () { if (f.parentNode) f.parentNode.removeChild(f); }, 240);
    if (caught >= NEED) {
      endGame("You got them all. The garden's buzzing.");
    }
  }
  function endGame(msg) {
    if (!playing) return;
    playing = false;
    els.hud.hidden = true;
    spawnFireflies(false);
    renderChips();
    hideThought();
    if (msg) add("bot", msg);
  }

  function fitViewport() {
    const vv = window.visualViewport;
    const vis = vv ? vv.height : window.innerHeight;
    const offset = vv ? (vv.offsetTop || 0) : 0;
    const full = (window.screen && screen.height) ? screen.height : window.innerHeight;
    const kb = Math.max(0, Math.round(full - vis - offset));
    try { window.scrollTo(0, 0); } catch (e) {}
    document.documentElement.style.setProperty("--app-h", full + "px");
    document.documentElement.style.setProperty("--kb", kb + "px");
    document.body.classList.toggle("kb", kb > 48);
  }

  function registerWorker() {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("./sw.js?v=" + BUILD).then(function (reg) {
      reg.update();
    }).catch(function () {});
    navigator.serviceWorker.addEventListener("controllerchange", function () {
      if (sessionStorage.getItem("dumpling-reloaded-" + BUILD)) return;
      sessionStorage.setItem("dumpling-reloaded-" + BUILD, "1");
      location.reload();
    });
  }
})();
