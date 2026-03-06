const SAVE_KEY = "echoes-of-the-lantern-save-v1";

const starterEchoes = [
  { id: "glow-slime", name: "Glow Slime", rarity: "Common", vibe: "cute", desc: "A soft little echo that brightens near lantern light." },
  { id: "lantern-moth", name: "Lantern Moth", rarity: "Common", vibe: "beautiful", desc: "Drawn to warm light and calm paths." },
  { id: "rune-rabbit", name: "Rune Rabbit", rarity: "Uncommon", vibe: "weird", desc: "A restless echo marked with ancient symbols." },
  { id: "whisper-cat", name: "Whisper Cat", rarity: "Rare", vibe: "eerie", desc: "Quiet, playful, and always half-hidden." },
  { id: "moss-turtle", name: "Moss Turtle", rarity: "Common", vibe: "cozy", desc: "Slow, dependable, and fond of sanctuary corners." },
  { id: "static-sprite", name: "Static Sprite", rarity: "Rare", vibe: "glitch", desc: "A flickering echo that feels slightly out of place." }
];

const discoveryPool = [
  { id: "mist-owl", name: "Mist Owl", rarity: "Uncommon", quote: "It watches from the fog." },
  { id: "hollow-hound", name: "Hollow Hound", rarity: "Rare", quote: "Its footsteps arrive before it does." },
  { id: "clock-beetle", name: "Clock Beetle", rarity: "Uncommon", quote: "Tiny legs. Ancient timing." },
  { id: "mirror-serpent", name: "Mirror Serpent", rarity: "Mythic", quote: "Seen twice. Never from the same angle." },
  { id: "ember-fox", name: "Ember Fox", rarity: "Rare", quote: "Warm, bright, and faster than thought." }
];

const timeCycle = ["Day", "Evening", "Night", "Dawn"];
const weatherCycle = ["Clear", "Fog", "Rain", "Clear"];

const state = {
  playerName: "",
  companion: null,
  discovered: [],
  tripCount: 0,
  saveHintSeen: false,
  lanternState: "Amber Flame"
};

const $ = (id) => document.getElementById(id);
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

function loadState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;
    Object.assign(state, JSON.parse(raw));
    return true;
  } catch {
    return false;
  }
}

function persistState(showFlash = true) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  if (showFlash) flashSave();
}

function flashSave() {
  const el = $("saveFlash");
  el.classList.remove("hidden");
  clearTimeout(flashSave._timer);
  flashSave._timer = setTimeout(() => el.classList.add("hidden"), 1400);
}

function show(screenId) {
  document.querySelectorAll(".screen").forEach((el) => el.classList.remove("active"));
  document.querySelectorAll(".active-grid").forEach((el) => el.classList.add("hidden"));
  const target = $(screenId);
  if (target.classList.contains("active-grid")) target.classList.remove("hidden");
  else target.classList.add("active");
}

function setupManualChoices() {
  const wrap = $("manualChoices");
  wrap.innerHTML = "";
  starterEchoes.forEach((echo) => {
    const card = document.createElement("div");
    card.className = "choice-card";
    card.innerHTML = `
      <h4>${echo.name}</h4>
      <p>${echo.desc}</p>
      <button class="primary">Choose ${echo.name}</button>
    `;
    card.querySelector("button").addEventListener("click", () => {
      chooseCompanion(echo);
    });
    wrap.appendChild(card);
  });
}

function chooseCompanion(echo) {
  state.companion = echo;
  $("companionName").textContent = echo.name;
  $("companionDesc").textContent = `A ${echo.vibe} companion for ${state.playerName}, lantern keeper.`;
  persistState();
  show("companionScreen");
}

function updateSanctuary() {
  $("keeperNameDisplay").textContent = state.playerName || "Keeper";
  $("sanctuaryCompanion").textContent = state.companion ? state.companion.name : "Unchosen";
  $("lanternStateBadge").textContent = state.lanternState;
  const harmony = Math.min(100, 22 + state.discovered.length * 12);
  $("harmonyValue").textContent = `${harmony}%`;
  $("harmonyBar").style.width = `${harmony}%`;
  $("tripCount").textContent = state.tripCount;
  $("timeOfDay").textContent = timeCycle[state.tripCount % timeCycle.length];
  $("weatherState").textContent = weatherCycle[state.tripCount % weatherCycle.length];
  $("orientationPill").textContent = window.innerWidth > window.innerHeight ? "landscape" : "portrait";
  $("saveKeyCard").classList.toggle("hidden", state.saveHintSeen);
  renderArchive();
}

function renderArchive() {
  const list = $("archiveList");
  if (!state.discovered.length) {
    list.innerHTML = `<p class="muted">No Echoes discovered yet. Step into Mosswood Trail.</p>`;
    return;
  }
  list.innerHTML = "";
  state.discovered.forEach((echo) => {
    const entry = document.createElement("div");
    entry.className = "archive-entry";
    entry.innerHTML = `<strong>${echo.name}</strong><span class="muted">${echo.rarity}</span>`;
    list.appendChild(entry);
  });
}

function discoverEcho() {
  const found = randomItem(discoveryPool);
  if (!state.discovered.some((e) => e.id === found.id)) state.discovered.push(found);
  state.tripCount += 1;
  state.lanternState = found.rarity === "Mythic" ? "White/Gold Resonance" : found.rarity === "Rare" ? "Blue Echo Flame" : "Amber Flame";
  state.saveHintSeen = true;
  persistState();
  updateSanctuary();

  $("discoveryName").textContent = found.name;
  $("discoveryRarity").textContent = found.rarity;
  $("discoveryQuote").textContent = `“${found.quote}”`;
  $("discoveryModal").classList.remove("hidden");
}

function initMotion() {
  const orb = $("lanternOrb");
  const move = (x, y) => {
    orb.style.transform = `translateX(calc(-50% + ${x}px)) translateY(${y}px)`;
  };
  window.addEventListener("pointermove", (e) => {
    const x = ((e.clientX / window.innerWidth) - 0.5) * 10;
    const y = ((e.clientY / window.innerHeight) - 0.5) * 8;
    move(x, y);
  });
  if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", (e) => {
      const x = Math.max(-8, Math.min(8, (e.gamma || 0) / 6));
      const y = Math.max(-6, Math.min(6, (e.beta || 0) / 12));
      move(x, y);
    });
  }
}

function registerSW() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  }
}

window.addEventListener("resize", updateSanctuary);
window.addEventListener("DOMContentLoaded", () => {
  setupManualChoices();
  initMotion();
  registerSW();

  const hasSave = loadState();
  if (hasSave && state.playerName && state.companion) {
    updateSanctuary();
    show("sanctuaryScreen");
  } else {
    show("introScreen");
  }

  $("startBtn").addEventListener("click", () => {
    const name = $("playerName").value.trim();
    if (!name) return;
    state.playerName = name;
    persistState(false);
    show("bondScreen");
  });

  $("bondRevealBtn").addEventListener("click", () => chooseCompanion(randomItem(starterEchoes)));
  $("bondManualBtn").addEventListener("click", () => show("manualScreen"));
  $("backToBondBtn").addEventListener("click", () => show("bondScreen"));
  $("rerollCompanionBtn").addEventListener("click", () => chooseCompanion(randomItem(starterEchoes)));
  $("acceptCompanionBtn").addEventListener("click", () => {
    state.saveHintSeen = false;
    persistState(false);
    updateSanctuary();
    show("sanctuaryScreen");
  });

  $("exploreBtn").addEventListener("click", discoverEcho);
  $("saveBtn").addEventListener("click", () => {
    state.saveHintSeen = true;
    persistState();
    updateSanctuary();
  });
  $("archiveBtn").addEventListener("click", () => {
    document.querySelector('.side-column').scrollIntoView({behavior:'smooth', block:'start'});
  });
  $("closeDiscoveryBtn").addEventListener("click", () => $("discoveryModal").classList.add("hidden"));
});
