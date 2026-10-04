(function () {
  "use strict";
  const BUILD = 32;
  const PLAY_KEY = "dumpling-play-v1";
  const HIST_KEY = "dumpling-chat-v1";
  const HIST_MAX = 300;
  const STREAK_KEY = "dumpling-streak-v1";
  const NOTES_KEY = "dumpling-notes-v1";
  const NOTES_MAX = 40;
  const LIST_KEY = "dumpling-list-v1";
  const LIST_MAX = 100;
  const FB_QUEUE_KEY = "dumpling-fb-queue-v1";
  const FB_TOKEN_KEY = "dumpling-fb-token";
  const FB_GIST_KEY = "dumpling-fb-gist";
  const FB_FILE = "dumpling-feedback.json";
  const FB_MAX_SEC = 90;
  const SEEN_KEY = "dumpling-seen-v1";
  // What's new card: add one entry per update she'd notice. Each step is two short lines, no paragraphs.
  // She sees the newest entry she hasn't seen yet, once. `show: "menu"` makes the last button open the menu.
  const NEWS = [
    { v: 31, show: "menu", steps: [
      ["I got a little makeover!", "Tap ☰ for our chats, garden & feedback."],
      ["I can keep your list now 📝", "Say “add milk to my list”."],
      ["And I'll remind you ⏰", "Say “remind me to call mom at 5”."]
    ] }
  ];
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
    garden: document.getElementById("garden-art"),
    mic: document.getElementById("mic"),
    menuBtn: document.getElementById("menu-btn"),
    drawer: document.getElementById("drawer"),
    scrim: document.getElementById("scrim"),
    drSkinLabel: document.getElementById("dr-skin-label"),
    starsFar: document.getElementById("stars-far"),
    said: document.getElementById("said"),
    speech: document.getElementById("speech"),
    speechText: document.getElementById("speech-text"),
    speechDots: document.getElementById("speech-dots"),
    wave: document.getElementById("wave"),
    chatsList: document.getElementById("chats-list"),
    segSkin: document.getElementById("seg-skin"),
    segNight: document.getElementById("seg-night"),
    moonRow: document.getElementById("moon-row"),
    moonSwatches: document.getElementById("moon-swatches"),
    streak: document.getElementById("streak"),
    streakN: document.getElementById("streak-n"),
    fbText: document.getElementById("fb-text"),
    fbRec: document.getElementById("fb-rec"),
    fbRecLabel: document.getElementById("fb-rec-label"),
    fbSend: document.getElementById("fb-send"),
    fbStatus: document.getElementById("fb-status"),
    listItems: document.getElementById("list-items"),
    listEmpty: document.getElementById("list-empty"),
    listClear: document.getElementById("list-clear"),
    listAdd: document.getElementById("list-add"),
    listInput: document.getElementById("list-input"),
    drListN: document.getElementById("dr-list-n"),
    newsDots: document.getElementById("news-dots"),
    news: document.getElementById("news"),
    newsText: document.getElementById("news-text"),
    newsGo: document.getElementById("news-go"),
    newsOk: document.getElementById("news-ok")
  };

  if (!els.log || !els.box || !els.form || !els.buddy || !els.stage || !els.sky) return;

  const play = loadPlay();
  savePlay();
  const history = loadHistory();
  let busy = false;
  let playing = false;
  let caught = 0;
  let thoughtTimer = 0;
  let idleTimer = 0;
  let fbFlushing = false, fbFlushAgain = false;
  let holdUntil = 0; // keep a reminder on screen; idle chatter waits
  let newsItem = null, newsStep = 0;

  applyPlay();
  spawnStars();
  spawnFireflies(false);
  hello();
  renderChips();
  buildMoonSwatches();
  renderSettings();
  armIdle();
  registerWorker();
  fitViewport();
  bumpStreak();
  flushFeedbackQueue();
  showNews();
  renderMenuCount();
  setTimeout(checkReminders, 1600);
  setInterval(checkReminders, 20000);
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") setTimeout(checkReminders, 600);
  });

  els.form.addEventListener("submit", onSubmit);
  els.buddy.addEventListener("click", boop);
  els.stage.addEventListener("click", onStage);
  els.hudDone.addEventListener("click", function () { if (playing) endGame("Okay, pausing. The glows will wait."); });
  els.chips.addEventListener("click", onChip);
  if (els.menuBtn) els.menuBtn.addEventListener("click", function (e) { e.stopPropagation(); openMenu(); });
  if (els.scrim) els.scrim.addEventListener("click", closeMenu);
  if (els.drawer) els.drawer.addEventListener("click", onMenuPick);
  document.addEventListener("click", function (e) {
    const b = e.target.closest(".back[data-go]");
    if (b) go(b.getAttribute("data-go"));
  });
  armSwipeClose();
  if (els.mic) els.mic.addEventListener("click", onMic);
  if (els.segSkin) els.segSkin.addEventListener("click", function (e) {
    const b = e.target.closest("button[data-skin]");
    if (b) setSkin(b.getAttribute("data-skin"));
  });
  if (els.segNight) els.segNight.addEventListener("click", function (e) {
    const b = e.target.closest("button[data-night]");
    if (b) setNight(b.getAttribute("data-night") === "1");
  });
  if (els.moonSwatches) els.moonSwatches.addEventListener("click", function (e) {
    const b = e.target.closest("button[data-moon]");
    if (b) setMoon(b.getAttribute("data-moon"));
  });
  if (els.fbRec) els.fbRec.addEventListener("click", onFbRec);
  if (els.fbSend) els.fbSend.addEventListener("click", onFbSend);
  if (els.fbText) els.fbText.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onFbSend(); }
  });
  if (els.newsOk) els.newsOk.addEventListener("click", closeNews);
  if (els.newsGo) els.newsGo.addEventListener("click", function () {
    if (newsStep < newsItem.steps.length - 1) { newsStep++; renderNewsStep(); return; }
    closeNews();
    if (newsItem.show === "menu") openMenu();
  });
  if (els.listAdd) els.listAdd.addEventListener("submit", function (e) {
    e.preventDefault();
    const v = (els.listInput.value || "").trim();
    if (!v) return;
    const w = parseWhen(v);
    addListItem(cleanTask(w.rest) || v, w.due);
    els.listInput.value = "";
    renderList();
  });
  if (els.listItems) els.listItems.addEventListener("click", function (e) {
    const row = e.target.closest(".li");
    if (!row) return;
    const list = loadList();
    const it = list.find(function (i) { return i.id === row.getAttribute("data-id"); });
    if (!it) return;
    it.done = !it.done;
    saveList(list);
    renderList();
    try { navigator.vibrate && navigator.vibrate(8); } catch (err) {}
  });
  if (els.listClear) els.listClear.addEventListener("click", function () {
    saveList(loadList().filter(function (i) { return !i.done; }));
    renderList();
  });
  if (els.news) els.news.addEventListener("click", function (e) { if (e.target === els.news) closeNews(); });
  if (els.fbText) els.fbText.addEventListener("focus", function () {
    // Keep the idea box above the keyboard: lift it to the top of Settings.
    setTimeout(function () {
      const box = document.getElementById("ideas");
      if (box) box.scrollIntoView({ block: "start", behavior: "smooth" });
    }, 250);
  });
  if (els.speech) els.speech.addEventListener("click", function (e) { e.stopPropagation(); hideSpeech(); });
  if (els.said) els.said.addEventListener("click", function (e) { e.stopPropagation(); els.said.hidden = true; clearTimeout(els.said._t); });
  if (els.thought) els.thought.addEventListener("click", function (e) { e.stopPropagation(); hideThought(); });
  els.box.addEventListener("focus", function () { document.body.classList.add("chatting"); });
  els.box.addEventListener("blur", function () {
    setTimeout(function () {
      if (document.activeElement !== els.box) document.body.classList.remove("chatting");
    }, 180);
  });
  document.addEventListener("gesturestart", function (e) { e.preventDefault(); }, { passive: false });
  document.addEventListener("gesturechange", function (e) { e.preventDefault(); }, { passive: false });
  document.addEventListener("touchmove", function (e) { if (e.touches.length > 1) e.preventDefault(); }, { passive: false });
  let fitQueued = false;
  function fitViewportThrottled() {
    if (fitQueued) return;
    fitQueued = true;
    requestAnimationFrame(function () { fitQueued = false; fitViewport(); });
  }
  window.addEventListener("resize", fitViewportThrottled);
  window.addEventListener("orientationchange", fitViewportThrottled);
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", fitViewportThrottled);
    window.visualViewport.addEventListener("scroll", fitViewportThrottled);
  }

  function loadPlay() {
    try {
      const raw = JSON.parse(localStorage.getItem(PLAY_KEY) || "{}");
      return {
        moon: COLORS[raw.moon] ? raw.moon : "pink",
        sky: COLORS[raw.sky] ? raw.sky : "",
        night: !!raw.night,
        // Pink garden is home (v32). First open after that ships lands on pink once; after that her pick sticks.
        skin: (raw.homePink && raw.skin === "blue") ? "blue" : "pink",
        homePink: true
      };
    } catch (e) {
      return { moon: "pink", sky: "", night: false, skin: "pink", homePink: true };
    }
  }
  function savePlay() {
    try { localStorage.setItem(PLAY_KEY, JSON.stringify(play)); } catch (e) {}
  }
  function loadHistory() {
    try {
      const raw = JSON.parse(localStorage.getItem(HIST_KEY) || "[]");
      return Array.isArray(raw) ? raw : [];
    } catch (e) { return []; }
  }
  function saveHistory() {
    try { localStorage.setItem(HIST_KEY, JSON.stringify(history)); } catch (e) {}
  }
  function pushHistory(who, text) {
    history.push({ who: who, text: text, t: Date.now() });
    if (history.length > HIST_MAX) history.splice(0, history.length - HIST_MAX);
    saveHistory();
  }
  function renderChats() {
    if (!els.chatsList) return;
    els.chatsList.innerHTML = "";
    if (!history.length) {
      const p = document.createElement("div");
      p.className = "empty";
      p.textContent = "Nothing yet. Say hi.";
      els.chatsList.appendChild(p);
      return;
    }
    for (let i = 0; i < history.length; i++) {
      const h = history[i];
      const d = document.createElement("div");
      d.className = "bubble " + (h.who === "me" ? "me" : "bot");
      d.textContent = h.text;
      els.chatsList.appendChild(d);
    }
    els.chatsList.scrollTop = els.chatsList.scrollHeight;
  }
  function buildMoonSwatches() {
    if (!els.moonSwatches) return;
    const keys = Object.keys(COLORS);
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      const b = document.createElement("button");
      b.type = "button";
      b.className = "swatch";
      b.setAttribute("data-moon", k);
      b.setAttribute("aria-label", k);
      b.style.background = COLORS[k][1];
      els.moonSwatches.appendChild(b);
    }
  }
  function renderSettings() {
    if (els.segSkin) {
      els.segSkin.querySelectorAll("button").forEach(function (b) {
        b.classList.toggle("on", b.getAttribute("data-skin") === play.skin);
      });
    }
    if (els.segNight) {
      els.segNight.querySelectorAll("button").forEach(function (b) {
        b.classList.toggle("on", (b.getAttribute("data-night") === "1") === play.night);
      });
    }
    if (els.moonRow) els.moonRow.hidden = play.skin !== "pink";
    if (els.drSkinLabel) {
      els.drSkinLabel.textContent = play.skin === "blue" ? "Pink garden" : "Blue night";
      els.drSkinLabel.previousElementSibling.textContent = play.skin === "blue" ? "🌸" : "🌙";
    }
    if (els.moonSwatches) {
      els.moonSwatches.querySelectorAll("button").forEach(function (b) {
        b.classList.toggle("sel", b.getAttribute("data-moon") === play.moon);
      });
    }
  }
  function setSkin(skin) {
    play.skin = skin; savePlay(); applyPlay(); renderChips(); renderSettings();
  }
  function setNight(on) {
    play.night = on; savePlay(); applyPlay(); renderChips(); renderSettings();
  }
  function setMoon(color) {
    if (!COLORS[color]) return;
    play.moon = color; savePlay(); applyPlay(); renderSettings();
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
    if (extra !== "typing" && text) pushHistory(who, text);
    if (play.skin === "blue") {
      if (extra === "typing") {
        showSpeech("", true);
        return { remove: function () { hideSpeech(); } };
      }
      if (who === "me") showSaid(text);
      else showSpeech(text, false, 9000);
      return { remove: function () {} };
    }
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
    while (els.log.children.length > 80) els.log.removeChild(els.log.firstChild);
  }
  function hello() {
    if (play.skin === "blue") showSpeech("hi, i'm dumpling", false, 4500);
    else showThought("hi, i'm dumpling", false, 4500);
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
    thoughtTimer = setTimeout(hideThought, ms || (dots ? 8000 : 9000));
  }
  function hideThought() {
    els.thought.hidden = true;
    els.thoughtDots.hidden = true;
    els.thoughtText.textContent = "";
  }
  function showSpeech(text, dots, ms) {
    if (!els.speech) return;
    clearTimeout(thoughtTimer);
    els.speech.hidden = false;
    if (dots) {
      els.speechText.textContent = "";
      els.speechDots.hidden = false;
    } else {
      els.speechDots.hidden = true;
      els.speechText.textContent = text || "";
    }
    thoughtTimer = setTimeout(hideSpeech, ms || (dots ? 8000 : 9000));
  }
  function hideSpeech() {
    if (!els.speech) return;
    els.speech.hidden = true;
    els.speechDots.hidden = true;
    els.speechText.textContent = "";
  }
  function showSaid(text) {
    if (!els.said) return;
    els.said.hidden = false;
    els.said.textContent = text;
    clearTimeout(els.said._t);
    els.said._t = setTimeout(function () { els.said.hidden = true; }, 8000);
  }
  function armIdle() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(function () {
      if (!busy && !playing && Date.now() > holdUntil && document.activeElement !== els.box) {
        if (play.skin === "blue") showSpeech(pick(IDLE_THOUGHTS), false);
        else showThought(pick(IDLE_THOUGHTS), false);
      }
      armIdle();
    }, 9000 + Math.random() * 4000);
  }

  function boop() {
    els.buddy.classList.remove("boop");
    void els.buddy.offsetWidth;
    els.buddy.classList.add("boop");
    if (!playing) {
      if (play.skin === "blue") showSpeech("boop", false);
      else showThought("boop", false);
    }
    try { navigator.vibrate && navigator.vibrate(8); } catch (e) {}
  }

  function colorOf(s) {
    const keys = Object.keys(COLORS);
    for (let i = 0; i < keys.length; i++) {
      // Whole words only: "tired", "bored", "scared" all contain "red".
      if (new RegExp("\\b" + keys[i] + "\\b").test(s)) return keys[i];
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
    const remind = t.match(/^(?:hey[,!]?\s+)?(?:can you\s+|could you\s+|please\s+|dumpling[,!]?\s+)*(?:remind me(?!\s+what\b)|set a reminder)\b[\s,:]*(.*)$/i);
    const rememberTo = !remind && t.match(/^(?:please\s+)?remember to\s+(.+)$/i);
    if (remind || (rememberTo && parseWhen(rememberTo[1]).due)) {
      return addReminder(remind ? remind[1] : rememberTo[1]);
    }
    const addM = t.match(/^(?:please\s+|can you\s+|could you\s+)*(?:add|put|stick|throw)\s+(.+?)\s+(?:to|on|onto|in)\s+(?:my|the)\s+(?:shopping\s+|grocery\s+|to-?do\s+)?list\b/i);
    if (addM) return addToList(addM[1]);
    if (/\b(what'?s|whats|what is) on (my|the) list\b|^(show|read|check)( me)? (my|the) list\b|^(my|the) list[?!.]*$|\bwhat do i need\b/i.test(t)) return readList();
    if (/^(clear|empty|wipe) (my |the )?list\b/i.test(t)) { saveList([]); return "Fresh list ✨"; }
    const doneM = t.match(/^(?:i\s+)?(?:done with|got|bought|finished|did|picked up|remove|cross off|check off|delete|take off)\s+(.+?)(?:\s+(?:from|off)\s+(?:my|the)\s+list)?[.!]*$/i);
    if (doneM) { const r = checkOffByName(doneM[1]); if (r) return r; }
    if (/what did i (tell|say)|remind me what|any notes|what do you remember|remember anything|remember something|do you remember/.test(s)) {
      return recallNote();
    }
    const noteMatch = t.match(/^(remember|note to self|don'?t forget|keep this|save this)[:,]?\s+(.+)/i);
    if (noteMatch) {
      saveNote(noteMatch[2].trim());
      return pick(["Got it. Tucked away safe.", "Saved. I'll remember that.", "Kept, right in my little garden pocket."]);
    }
    if (/^(remember|note to self|don'?t forget)[.!?]?$/i.test(t.trim())) {
      return "Remember what? Tell me and I'll keep it.";
    }
    if (/blue garden|night garden|starry|blue skin/.test(s)) {
      setSkin("blue");
      return "Blue night garden. Tap around. Say pink garden anytime.";
    }
    if (/pink garden|default garden|regular garden/.test(s)) {
      setSkin("pink");
      return "Pink garden's back. I can paint the moon here.";
    }
    if (/catch|firefl|\bplay\b|\bgames?\b/.test(s)) {
      startGame();
      return "Tap the little glows. I'll cheer.";
    }
    if (/\bnight\b|goodnight|bedtime|\bdark\b|sleepy/.test(s)) {
      setNight(true);
      return "Lights down. Cozy.";
    }
    if (/morning|daytime|make it day|\bwake|sunrise/.test(s)) {
      setNight(false);
      return "Good morning, garden.";
    }
    if (/reset|default|original|undo/.test(s)) {
      play.moon = "pink"; play.sky = ""; play.night = false; play.skin = "pink";
      savePlay(); applyPlay(); renderSettings();
      return "Pink moon, fresh garden.";
    }
    if (col && /sky|background/.test(s)) {
      play.sky = col; savePlay(); applyPlay();
      return "Sky's wearing " + col + " now.";
    }
    if (col) {
      setMoon(col);
      if (play.skin === "blue") return "Moon's " + col + " now. You'll see it in the pink garden.";
      return "Moon's " + col + " now. Cute.";
    }
    if (/\b(hello+|hi+|hey+|hiya|yo+)\b/.test(s)) {
      return "Hey you. Want a green moon, or a firefly hunt?";
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
    if (/\b(boop|poke|hugs?|pats?)\b/.test(s)) {
      boop();
      return "Boop.";
    }
    return pick([
      "Hmm. Try making the moon teal, or catch fireflies.",
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
            [play.night ? "Make it morning" : "Make it night", play.night ? "make it morning" : "make it night"],
            ["My list", "what's on my list"],
            ["What did I tell you?", "what did i tell you"]
          ]
        : [
            ["Moon " + next, "make the moon " + next],
            ["Catch fireflies", "catch fireflies"],
            [play.night ? "Make it morning" : "Make it night", play.night ? "make it morning" : "make it night"],
            ["Blue garden", "blue garden"],
            ["My list", "what's on my list"],
            ["What did I tell you?", "what did i tell you"]
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
    if (e.target.closest("#buddy") || e.target.closest("#hud") || e.target.closest("#menu-btn")) return;
    if (e.target.classList && e.target.classList.contains("firefly")) return;
    if (document.activeElement === els.box) els.box.blur();
    if (play.skin === "blue" && !playing) showSpeech("boop", false);
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
    if (els.starsFar) els.starsFar.innerHTML = "";
    for (let i = 0; i < 18; i++) {
      const s = document.createElement("div");
      s.className = "star far";
      s.style.left = Math.random() * 100 + "%";
      s.style.top = Math.random() * 58 + "%";
      s.style.animationDelay = Math.random() * 6 + "s";
      if (els.starsFar) els.starsFar.appendChild(s);
    }
    for (let i = 0; i < 28; i++) {
      const s = document.createElement("div");
      s.className = "star";
      s.style.left = Math.random() * 100 + "%";
      s.style.top = Math.random() * 48 + "%";
      s.style.width = (2 + Math.random() * 4) + "px";
      s.style.height = s.style.width;
      s.style.animationDelay = Math.random() * 5 + "s";
      s.style.animationDuration = (4.5 + Math.random() * 5) + "s";
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
      f.style.bottom = (playMode ? 28 : 24) + Math.random() * (playMode ? 36 : 40) + "%";
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
    if (play.skin === "blue") showSpeech("tap the glows", false);
    else showThought("tap the glows", false);
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

  /* ============ side menu + screens ============ */
  function go(screen) {
    closeMenu();
    document.body.setAttribute("data-tab", screen);
    if (screen !== "home" && playing) endGame("");
    if (screen === "chats") renderChats();
    if (screen === "list") renderList();
    if (screen === "home") setTimeout(checkReminders, 400);
    if (screen === "settings") { renderSettings(); flushFeedbackQueue(); }
    const sc = document.getElementById(screen + "-screen");
    if (sc) sc.scrollTop = screen === "chats" ? sc.scrollHeight : 0;
  }
  function openMenu() {
    if (document.activeElement === els.box) els.box.blur();
    document.body.classList.add("menu-open");
    els.drawer.removeAttribute("inert");
    els.drawer.setAttribute("aria-hidden", "false");
    els.menuBtn.setAttribute("aria-expanded", "true");
  }
  function closeMenu() {
    if (!document.body.classList.contains("menu-open")) return;
    document.body.classList.remove("menu-open");
    els.drawer.setAttribute("inert", "");
    els.drawer.setAttribute("aria-hidden", "true");
    els.menuBtn.setAttribute("aria-expanded", "false");
  }
  function onMenuPick(e) {
    const b = e.target.closest("button[data-go]");
    if (!b) return;
    const dest = b.getAttribute("data-go");
    if (dest === "skin") { setSkin(play.skin === "blue" ? "pink" : "blue"); closeMenu(); return; }
    if (dest === "catch") { go("home"); startGame(); return; }
    go(dest);
  }
  function armSwipeClose() {
    let x0 = null, y0 = 0;
    [els.drawer, els.scrim].forEach(function (el) {
      if (!el) return;
      el.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
      el.addEventListener("touchend", function (e) {
        if (x0 === null) return;
        const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
        x0 = null;
        if (dx < -50 && Math.abs(dx) > Math.abs(dy)) closeMenu();
      }, { passive: true });
    });
  }
  let rec = null;
  let listening = false;
  let heard = "";
  function setListen(on) {
    listening = on;
    els.form.classList.toggle("listening", on);
    els.mic.classList.toggle("live", on);
    if (els.wave) els.wave.hidden = !on;
    if (!on) heard = "";
  }
  function stopListen() {
    setListen(false);
    try { if (rec) rec.stop(); } catch (e) {}
    rec = null;
  }
  function finishVoice() {
    const t = (heard || "").trim();
    stopListen();
    if (t) sendText(t);
  }
  function onMic(e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    if (listening) { finishVoice(); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    heard = "";
    setListen(true);
    if (!SR) {
      setTimeout(function () {
        stopListen();
        if (play.skin === "blue") showSpeech("keyboard mic, then send", false);
        else showThought("keyboard mic, then send", false);
        els.box.focus();
      }, 900);
      return;
    }
    try {
      rec = new SR();
      rec.lang = "en-US";
      rec.interimResults = true;
      rec.continuous = false;
      rec.maxAlternatives = 1;
      rec.onresult = function (ev) {
        let said = "";
        for (let i = 0; i < ev.results.length; i++) {
          said += ev.results[i][0].transcript || "";
        }
        heard = said;
        if (ev.results[ev.results.length - 1].isFinal) finishVoice();
      };
      rec.onerror = function () { stopListen(); };
      rec.onend = function () {
        if (listening) finishVoice();
      };
      rec.start();
    } catch (err) {
      stopListen();
      els.box.focus();
    }
  }

  function fitViewport() {

    const vv = window.visualViewport;
    const inner = window.innerHeight;
    const vis = vv ? vv.height : inner;
    const offset = vv ? (vv.offsetTop || 0) : 0;
    const focused = document.activeElement === els.box;
    const kb = focused ? Math.max(0, Math.round(inner - vis - offset)) : 0;
    const h = inner;
    try { window.scrollTo(0, 0); } catch (e) {}
    document.documentElement.style.setProperty("--app-h", h + "px");
    document.documentElement.style.setProperty("--kb", kb + "px");
    document.body.classList.toggle("kb", focused && kb > 80);
  }

  /* ============ streak ============ */
  function todayStr() {
    const d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function bumpStreak() {
    let s;
    try { s = JSON.parse(localStorage.getItem(STREAK_KEY) || "null"); } catch (e) { s = null; }
    if (!s || typeof s.count !== "number") s = { count: 0, lastDate: "" };
    const today = todayStr();
    if (s.lastDate !== today) {
      const y = new Date(); y.setDate(y.getDate() - 1);
      const yStr = y.getFullYear() + "-" + String(y.getMonth() + 1).padStart(2, "0") + "-" + String(y.getDate()).padStart(2, "0");
      s.count = (s.lastDate === yStr) ? s.count + 1 : 1;
      s.lastDate = today;
      try { localStorage.setItem(STREAK_KEY, JSON.stringify(s)); } catch (e) {}
    }
    renderStreak(s.count);
  }
  function renderStreak(count) {
    if (!els.streak || !els.streakN) return;
    if (count >= 1) {
      els.streakN.textContent = "🔥 " + count + (count === 1 ? " day" : " days");
      els.streak.hidden = false;
    } else {
      els.streak.hidden = true;
    }
  }

  /* ============ notes she leaves for Dumpling to recall ============ */
  function loadNotes() {
    try {
      const raw = JSON.parse(localStorage.getItem(NOTES_KEY) || "[]");
      return Array.isArray(raw) ? raw : [];
    } catch (e) { return []; }
  }
  function saveNote(text) {
    const notes = loadNotes();
    notes.push({ text: text, ts: Date.now() });
    if (notes.length > NOTES_MAX) notes.splice(0, notes.length - NOTES_MAX);
    try { localStorage.setItem(NOTES_KEY, JSON.stringify(notes)); } catch (e) {}
  }
  function agoStr(ts) {
    const s = Math.floor((Date.now() - ts) / 1000);
    if (s < 90) return "just now";
    const m = Math.floor(s / 60);
    if (m < 60) return m + " min ago";
    const h = Math.floor(m / 60);
    if (h < 24) return h + (h === 1 ? " hour ago" : " hours ago");
    const d = Math.floor(h / 24);
    return d === 1 ? "yesterday" : d + " days ago";
  }
  let notesCursor = 0;
  function recallNote() {
    const notes = loadNotes();
    if (!notes.length) return "You haven't told me anything to remember yet. Say \"remember...\" and I'll keep it.";
    notesCursor = (notesCursor + 1) % notes.length;
    const n = notes[notes.length - 1 - notesCursor];
    return "You told me (" + agoStr(n.ts) + "): “" + n.text + "”";
  }

  /* ============ feedback: type it or say it ============ */
  let fbRecorder = null, fbChunks = [], fbRecording = false, fbRecTimer = null, fbRecStart = 0, fbStatusTimer = 0;
  function loadFbQueue() {
    try {
      const raw = JSON.parse(localStorage.getItem(FB_QUEUE_KEY) || "[]");
      return Array.isArray(raw) ? raw : [];
    } catch (e) { return []; }
  }
  function saveFbQueue(q) {
    try { localStorage.setItem(FB_QUEUE_KEY, JSON.stringify(q)); } catch (e) {}
  }
  function fbStatus(msg) {
    if (!els.fbStatus) return;
    clearTimeout(fbStatusTimer);
    els.fbStatus.textContent = msg;
    els.fbStatus.hidden = false;
    fbStatusTimer = setTimeout(function () { els.fbStatus.hidden = true; }, 2600);
  }
  function fbRecLabel(text) { if (els.fbRecLabel) els.fbRecLabel.textContent = text; }
  function queueFeedback(text, audio) {
    const q = loadFbQueue();
    q.push({ id: Date.now() + "-" + Math.random().toString(36).slice(2, 8), ts: Date.now(), text: text, audio: audio || null });
    saveFbQueue(q);
    // Saved on her phone either way; it goes to Braedon now or on the next try.
    fbStatus("Got it 💌");
    flushFeedbackQueue();
  }
  function onFbSend() {
    const text = (els.fbText && els.fbText.value ? els.fbText.value : "").trim();
    if (!text) { if (els.fbText) els.fbText.focus(); return; }
    els.fbText.value = "";
    els.fbText.blur();
    queueFeedback(text, null);
  }
  async function onFbRec() {
    // Tap to start, tap again to stop and send. No extra steps.
    if (fbRecording) { try { fbRecorder.stop(); } catch (e) {} return; }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder) {
      fbStatus("Mic isn't available here. Type it instead.");
      return;
    }
    let stream;
    try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); }
    catch (e) { fbStatus("Mic is off for Dumpling. Type it instead."); return; }
    fbChunks = [];
    try { fbRecorder = new MediaRecorder(stream); } catch (e) { stream.getTracks().forEach(function (t) { t.stop(); }); fbStatus("Mic isn't available here. Type it instead."); return; }
    fbRecorder.ondataavailable = function (ev) { if (ev.data && ev.data.size) fbChunks.push(ev.data); };
    fbRecorder.onstop = function () {
      stream.getTracks().forEach(function (t) { t.stop(); });
      fbRecording = false;
      clearInterval(fbRecTimer);
      if (els.fbRec) els.fbRec.classList.remove("on");
      fbRecLabel("Say it");
      const ms = Date.now() - fbRecStart;
      if (!fbChunks.length || ms < 1000) return; // an accidental tap, not a memo
      const reader = new FileReader();
      reader.onload = function () { queueFeedback("", reader.result); };
      reader.readAsDataURL(new Blob(fbChunks, { type: fbRecorder.mimeType || "audio/webm" }));
    };
    fbRecorder.start();
    fbRecording = true;
    fbRecStart = Date.now();
    if (els.fbRec) els.fbRec.classList.add("on");
    fbRecLabel("0:00 · tap to send");
    fbRecTimer = setInterval(function () {
      const sec = Math.floor((Date.now() - fbRecStart) / 1000);
      fbRecLabel(Math.floor(sec / 60) + ":" + String(sec % 60).padStart(2, "0") + " · tap to send");
      if (sec >= FB_MAX_SEC) { try { fbRecorder.stop(); } catch (e) {} }
    }, 500);
  }
  async function fbGistFetch(method, body) {
    const token = localStorage.getItem(FB_TOKEN_KEY), id = localStorage.getItem(FB_GIST_KEY);
    if (!token || !id) throw new Error("not configured");
    const res = await fetch("https://api.github.com/gists/" + id, {
      method: method,
      headers: { Authorization: "Bearer " + token, Accept: "application/vnd.github+json", "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined
    });
    if (!res.ok) throw new Error("GitHub said " + res.status);
    return res.json();
  }
  async function flushFeedbackQueue() {
    if (fbFlushing) { fbFlushAgain = true; return; }
    const q = loadFbQueue();
    if (!q.length) return;
    const token = localStorage.getItem(FB_TOKEN_KEY), gist = localStorage.getItem(FB_GIST_KEY);
    if (!token || !gist) return;
    fbFlushing = true;
    try {
      const g = await fbGistFetch("GET");
      const f = g.files && g.files[FB_FILE];
      let existing = { entries: [] };
      if (f) {
        try {
          const raw = f.truncated ? await (await fetch(f.raw_url)).text() : f.content;
          existing = JSON.parse(raw) || { entries: [] };
        } catch (e) { existing = { entries: [] }; }
      }
      if (!Array.isArray(existing.entries)) existing.entries = [];
      const haveIds = {};
      existing.entries.forEach(function (e) { haveIds[e.id] = true; });
      q.forEach(function (e) { if (!haveIds[e.id]) existing.entries.push(e); });
      existing.updated = Date.now();
      const patchFiles = {};
      patchFiles[FB_FILE] = { content: JSON.stringify(existing, null, 1) };
      await fbGistFetch("PATCH", { files: patchFiles });
      // Only drop what was sent; anything queued mid-send stays for the next round.
      const sent = {};
      q.forEach(function (e) { sent[e.id] = true; });
      saveFbQueue(loadFbQueue().filter(function (e) { return !sent[e.id]; }));
    } catch (e) {
      // Stays queued on her phone; retried next open or next send.
    } finally {
      fbFlushing = false;
      if (fbFlushAgain) { fbFlushAgain = false; flushFeedbackQueue(); }
    }
  }

  /* ============ what's new: one cute card per update ============ */
  function showNews() {
    if (!els.news) return;
    let seen = 0;
    try { seen = parseInt(localStorage.getItem(SEEN_KEY) || "0", 10) || 0; } catch (e) {}
    const unseen = NEWS.filter(function (n) { return n.v > seen; });
    if (!unseen.length) return;
    newsItem = unseen[unseen.length - 1];
    newsStep = 0;
    renderNewsStep();
    els.news.hidden = false;
  }
  function renderNewsStep() {
    const steps = newsItem.steps, last = newsStep === steps.length - 1;
    els.newsText.innerHTML = '<span class="tag">NEW ✨</span>';
    steps[newsStep].forEach(function (line) {
      const p = document.createElement("p");
      p.textContent = line;
      els.newsText.appendChild(p);
    });
    els.newsGo.textContent = last ? (newsItem.show ? "Show me" : "Yay!") : "Next";
    els.newsDots.hidden = steps.length < 2;
    els.newsDots.innerHTML = steps.map(function (_, i) { return i === newsStep ? '<i class="on"></i>' : "<i></i>"; }).join("");
  }
  function closeNews() {
    els.news.hidden = true;
    try { localStorage.setItem(SEEN_KEY, String(BUILD)); } catch (e) {}
    setTimeout(checkReminders, 500);
  }

  /* ============ my list + reminders (no server: Dumpling reminds her in the app) ============ */
  function loadList() {
    try {
      const raw = JSON.parse(localStorage.getItem(LIST_KEY) || "[]");
      return Array.isArray(raw) ? raw : [];
    } catch (e) { return []; }
  }
  function saveList(list) {
    if (list.length > LIST_MAX) list.splice(0, list.length - LIST_MAX);
    try { localStorage.setItem(LIST_KEY, JSON.stringify(list)); } catch (e) {}
    renderMenuCount();
  }
  function addListItem(text, due) {
    const list = loadList();
    const it = { id: Date.now() + "-" + Math.random().toString(36).slice(2, 7), text: text, done: false, t: Date.now() };
    if (due) { it.due = due; it.reminded = false; }
    list.push(it);
    saveList(list);
  }
  function tidyItem(x) {
    return x.replace(/^(and|or)\s+/i, "").replace(/^(some|a|an|the)\s+/i, "").replace(/[.!?]+$/, "").trim();
  }
  function addToList(raw) {
    const items = raw.split(/\s*,\s*/).map(tidyItem).filter(Boolean);
    if (!items.length) return "Add what? Try “add milk to my list”.";
    items.forEach(function (x) { addListItem(x); });
    return items.length === 1 ? "Added “" + items[0] + "” 📝" : "Added " + items.length + " things 📝";
  }
  function readList() {
    const open = loadList().filter(function (i) { return !i.done; });
    if (!open.length) return "Your list is empty ✨ Say “add milk to my list”.";
    const names = open.slice(0, 4).map(function (i) { return i.text; });
    return "📝 " + names.join(" · ") + (open.length > 4 ? " · +" + (open.length - 4) + " more" : "");
  }
  function checkOffByName(q) {
    const want = tidyItem(q.toLowerCase().replace(/^my\s+/, ""));
    if (want.length < 2) return null;
    const list = loadList();
    const open = list.filter(function (i) { return !i.done; });
    const it = open.find(function (i) { return i.text.toLowerCase() === want; }) ||
      open.find(function (i) { const x = i.text.toLowerCase(); return x.indexOf(want) !== -1 || want.indexOf(x) !== -1; });
    if (!it) return null; // not on her list: let the rest of chat handle it ("got it", etc.)
    it.done = true;
    saveList(list);
    return "Checked off “" + it.text + "” ✓";
  }
  function cleanTask(x) {
    return x.replace(/\s+/g, " ").trim()
      .replace(/^(to|that|about|i need to|i have to|me to)\s+/i, "")
      .replace(/\s+(please|pls)$/i, "")
      .replace(/^(at|on|in)\s+|\s+(at|on|in|to)$/i, "")
      .replace(/[.!?,]+$/, "").trim();
  }
  function addReminder(rest) {
    const w = parseWhen(rest);
    const task = cleanTask(w.rest);
    if (!task) return "Remind you of what? Try “remind me to call mom at 5”.";
    addListItem(task, w.due);
    if (!w.due) return "On your list 📝 Add a time and I'll remind you too.";
    return "Got it ⏰ Come see me " + whenSentence(w.due) + " and I'll remind you.";
  }
  // Finds a time in plain words ("at 5", "5:30pm", "in 20 minutes", "tomorrow", "tonight", "friday")
  // and returns it with the rest of the sentence.
  function parseWhen(str) {
    let s = " " + str + " ";
    const now = new Date();
    let m, day = null, hh = null, mm = 0, ampm = null, partHint = null;
    function cut(re) { const r = s.match(re); if (r) s = s.replace(r[0], " "); return r; }
    if ((m = cut(/\s(?:in|within)\s+(an?|half an?|\d+(?:\.\d+)?)\s*(m|mins?|minutes?|h|hrs?|hours?)\b/i))) {
      const n = /^half/i.test(m[1]) ? 0.5 : /^an?$/i.test(m[1]) ? 1 : parseFloat(m[1]);
      const unit = /^h/i.test(m[2]) ? 3600000 : 60000;
      return { due: Date.now() + n * unit, rest: s };
    }
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (cut(/\stomorrow\b/i)) day = new Date(today.getTime() + 864e5);
    if ((m = cut(/\s(?:on\s+)?(sun|mon|tues|wednes|thurs|fri|satur)day\b/i))) {
      const target = ["sun", "mon", "tues", "wednes", "thurs", "fri", "satur"].indexOf(m[1].toLowerCase());
      const ahead = ((target - today.getDay() + 7) % 7) || 7;
      day = new Date(today.getTime() + ahead * 864e5);
    }
    if (cut(/\stonight\b/i)) { day = day || today; partHint = 20; }
    if ((m = cut(/\s(?:this\s+)?(morning|afternoon|evening|night)\b/i))) {
      day = day || today;
      partHint = { morning: 9, afternoon: 15, evening: 18, night: 20 }[m[1].toLowerCase()];
    }
    if (cut(/\s(?:at\s+)?noon\b/i)) { hh = 12; }
    else if (cut(/\s(?:at\s+)?midnight\b/i)) { hh = 0; if (!day) day = new Date(today.getTime() + 864e5); }
    else if ((m = cut(/\s(?:at\s+)?(\d{1,2})(?::(\d{2}))?\s*(a\.?m\.?|p\.?m\.?)(?=\s|[.,!?]|$)/i))) {
      hh = parseInt(m[1], 10) % 12; mm = parseInt(m[2] || "0", 10); ampm = /^p/i.test(m[3]) ? "pm" : "am";
      if (ampm === "pm") hh += 12;
    } else if ((m = cut(/\sat\s+(\d{1,2})(?::(\d{2}))?\b/i))) {
      hh = parseInt(m[1], 10); mm = parseInt(m[2] || "0", 10);
    }
    if (hh === null && day === null) return { due: null, rest: str };
    if (hh !== null && hh > 23) return { due: null, rest: str };
    if (hh === null) { hh = partHint || 9; mm = 0; }
    else if (!ampm && hh >= 1 && hh <= 11) {
      // "at 5" with no am/pm: evening words mean pm; otherwise pick the next 5 o'clock coming up.
      if (partHint && partHint >= 15) hh += 12;
      else if (partHint === 9) { /* morning: keep am */ }
      else if (day) { if (hh < 7) hh += 12; }
      else {
        const am = new Date(today.getTime()); am.setHours(hh, mm, 0, 0);
        if (am.getTime() <= now.getTime()) hh += 12;
      }
    }
    const base = day || today;
    const when = new Date(base.getFullYear(), base.getMonth(), base.getDate(), hh, mm, 0, 0);
    if (!day && when.getTime() <= now.getTime()) when.setDate(when.getDate() + 1);
    return { due: when.getTime(), rest: s };
  }
  function whenStr(ts) {
    const d = new Date(ts), now = new Date();
    const time = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    const days = Math.round((new Date(d.getFullYear(), d.getMonth(), d.getDate()) - new Date(now.getFullYear(), now.getMonth(), now.getDate())) / 864e5);
    if (days === 0) return time;
    if (days === 1) return "tomorrow " + time;
    if (days > 1 && days < 7) return d.toLocaleDateString([], { weekday: "short" }) + " " + time;
    return d.toLocaleDateString([], { month: "short", day: "numeric" }) + " " + time;
  }
  function whenSentence(ts) {
    // "after 5:00 PM", "tomorrow after 9:00 AM", "Monday after 5:00 PM"
    const d = new Date(ts), now = new Date();
    const time = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    const days = Math.round((new Date(d.getFullYear(), d.getMonth(), d.getDate()) - new Date(now.getFullYear(), now.getMonth(), now.getDate())) / 864e5);
    if (days === 0) return "after " + time;
    if (days === 1) return "tomorrow after " + time;
    if (days > 1 && days < 7) return d.toLocaleDateString([], { weekday: "long" }) + " after " + time;
    return d.toLocaleDateString([], { month: "short", day: "numeric" }) + " after " + time;
  }
  function checkReminders() {
    if (els.news && !els.news.hidden) return;
    if (document.body.getAttribute("data-tab") !== "home" || document.visibilityState === "hidden") return;
    const list = loadList(), now = Date.now();
    const due = list.filter(function (i) { return !i.done && i.due && i.due <= now && !i.reminded; });
    if (!due.length) return;
    due.forEach(function (i) { i.reminded = true; });
    saveList(list);
    const msg = "⏰ Don't forget: " + due[0].text + (due.length > 1 ? " (+" + (due.length - 1) + " more on your list)" : "");
    holdUntil = now + 15000;
    if (play.skin === "blue") { pushHistory("bot", msg); showSpeech(msg, false, 15000); }
    else add("bot", msg);
    try { navigator.vibrate && navigator.vibrate([20, 60, 20]); } catch (e) {}
  }
  function renderList() {
    if (!els.listItems) return;
    const list = loadList(), now = Date.now();
    const sorted = list.slice().sort(function (a, b) {
      return (a.done - b.done) || ((a.due || 9e15) - (b.due || 9e15)) || (a.t - b.t);
    });
    els.listItems.innerHTML = "";
    sorted.forEach(function (i) {
      const row = document.createElement("div");
      row.className = "li" + (i.done ? " done" : "");
      row.setAttribute("data-id", i.id);
      const btn = document.createElement("button");
      btn.type = "button"; btn.className = "li-check";
      btn.setAttribute("aria-label", i.done ? "Not done" : "Done");
      btn.innerHTML = "<i>" + (i.done ? "✓" : "") + "</i>";
      const tx = document.createElement("span");
      tx.className = "li-text"; tx.textContent = i.text;
      row.appendChild(btn); row.appendChild(tx);
      if (i.due) {
        const w = document.createElement("span");
        w.className = "li-when" + (i.due <= now ? " due" : "");
        w.textContent = "⏰ " + whenStr(i.due);
        row.appendChild(w);
      }
      els.listItems.appendChild(row);
    });
    els.listEmpty.hidden = list.length > 0;
    els.listClear.hidden = !list.some(function (i) { return i.done; });
  }
  function renderMenuCount() {
    if (!els.drListN) return;
    const n = loadList().filter(function (i) { return !i.done; }).length;
    els.drListN.textContent = String(n);
    els.drListN.hidden = n === 0;
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
