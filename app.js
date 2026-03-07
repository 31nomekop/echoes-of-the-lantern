const SAVE_KEY = "echoes-save-v03";
const intro = document.getElementById("intro");
const menu = document.getElementById("menu");
const settings = document.getElementById("settings");
const archive = document.getElementById("archive");
const credits = document.getElementById("credits");
const line1 = document.getElementById("line1");
const line2 = document.getElementById("line2");
const tapPrompt = document.getElementById("tapPrompt");
const lanternButton = document.getElementById("lanternButton");
const continueBtn = document.getElementById("continueBtn");
const gameWrap = document.getElementById("gameWrap");
const backToMenuBtn = document.getElementById("backToMenuBtn");
const devBadge = document.getElementById("devBadge");
const archiveList = document.getElementById("archiveList");
const discoverToast = document.getElementById("discoverToast");
const storyModal = document.getElementById("storyModal");
const storyText = document.getElementById("storyText");
const storyActions = document.getElementById("storyActions");
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let running = false;
let tick = 0;
let camera = {x: 0, y: 0};
let timeOfDay = 0.35;
let discovered = [];
let storyLocked = false;

function createFireflies(count = 20){
  const wrap = document.getElementById("fireflies");
  wrap.innerHTML = "";
  for(let i=0;i<count;i++){
    const ff = document.createElement("span");
    ff.className = "firefly";
    ff.style.left = `${Math.random()*100}%`;
    ff.style.top = `${Math.random()*100}%`;
    ff.style.setProperty("--dx", `${(Math.random()*34-17).toFixed(1)}px`);
    ff.style.setProperty("--dy", `${(Math.random()*26-13).toFixed(1)}px`);
    ff.style.setProperty("--dur", `${(7+Math.random()*9).toFixed(2)}s`);
    wrap.appendChild(ff);
  }
}

function fitCanvas(){
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}
window.addEventListener("resize", fitCanvas);

function hasSave(){
  try{return !!localStorage.getItem(SAVE_KEY);}catch{return false;}
}

function loadSave(){
  try{
    const raw = localStorage.getItem(SAVE_KEY);
    const data = raw ? JSON.parse(raw) : {};
    discovered = Array.isArray(data.discovered) ? data.discovered : [];
    SHRINE.activated = !!data.shrineActivated;
    const dev = !!data.devMode;
    const toggle = document.getElementById("devToggle");
    toggle.checked = dev;
    devBadge.classList.toggle("hidden", !dev);

    if(data.companionJoined){
      spawnCompanion(PLAYER.x - 38, PLAYER.y + 6);
    }
    if(Array.isArray(data.echoStates)){
      ECHOES.forEach((e, i) => { if(data.echoStates[i]) e.discovered = !!data.echoStates[i].discovered; });
    }
  }catch{}
}

function persistSave(extra = {}){
  const current = hasSave() ? JSON.parse(localStorage.getItem(SAVE_KEY)) : {};
  const next = {
    ...current,
    discovered,
    shrineActivated: SHRINE.activated,
    companionJoined: COMPANION.active,
    echoStates: ECHOES.map(e => ({ discovered: e.discovered })),
    ...extra
  };
  localStorage.setItem(SAVE_KEY, JSON.stringify(next));
  updateContinueState();
}

function updateContinueState(){
  const saved = hasSave();
  continueBtn.disabled = !saved;
  continueBtn.classList.toggle("disabled", !saved);
}

function showPanel(target){
  [intro, menu, settings, archive, credits, gameWrap].forEach(p => p.classList.add("hidden"));
  target.classList.remove("hidden");
}

function startIntro(){
  showPanel(intro);
  line1.classList.remove("hidden");
  setTimeout(() => line1.classList.add("show"), 250);
  setTimeout(() => { line2.classList.remove("hidden"); line2.classList.add("show"); }, 1700);
  setTimeout(() => { tapPrompt.classList.remove("hidden"); tapPrompt.classList.add("show"); }, 3200);
}

function awakenLantern(){
  const glow = document.getElementById("lanternGlow");
  glow.style.transition = "transform 1.25s ease, opacity 1.25s ease";
  glow.style.transform = "scale(1.55)";
  glow.style.opacity = "1";
  setTimeout(() => showPanel(menu), 1450);
}

function renderArchive(){
  archiveList.innerHTML = "";
  ["Glow Wisp"].forEach(name => {
    const item = document.createElement("div");
    item.className = "archive-entry " + (discovered.includes(name) ? "unlocked" : "");
    item.textContent = discovered.includes(name) ? name : "Unknown Echo";
    archiveList.appendChild(item);
  });
}

function resetWorldStateForNewGame(){
  resetPlayer();
  resetEchoes();
  resetShrine();
  resetCompanion();
  discovered = [];
  persistSave({});
}

function startGame(newGame = true){
  showPanel(gameWrap);
  fitCanvas();
  generateWorld();
  if(newGame){
    resetWorldStateForNewGame();
  }else{
    resetPlayer();
    resetCompanion();
    resetEchoes();
    resetShrine();
    loadSave();
  }
  running = true;
  loop();
}

function stopGame(){
  running = false;
  storyLocked = false;
  hideStory();
  showPanel(menu);
}

function showToast(text){
  discoverToast.textContent = text;
  discoverToast.classList.remove("hidden");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => discoverToast.classList.add("hidden"), 1800);
}

function showStory(text, buttons){
  storyLocked = true;
  storyText.textContent = text;
  storyActions.innerHTML = "";
  buttons.forEach(btn => storyActions.appendChild(btn));
  storyModal.classList.remove("hidden");
}

function hideStory(){
  storyLocked = false;
  storyModal.classList.add("hidden");
}

function startShrineSequence(){
  showStory("Awaken the lantern shrine?", [
    buildStoryButton("Not yet", () => hideStory()),
    buildStoryButton("Awaken", () => {
      hideStory();
      showStory("The lantern remembers...", [
        buildStoryButton("Continue", () => {
          hideStory();
          showStory("Something answers its call.", [
            buildStoryButton("Continue", () => {
              SHRINE.activated = true;
              spawnCompanion(SHRINE.x + 44, SHRINE.y + 2);
              persistSave({});
              hideStory();
              showStory("Glow Wisp has joined you.", [
                buildStoryButton("Begin journey", () => hideStory(), true)
              ]);
            }, true)
          ]);
        }, true)
      ]);
    }, true)
  ]);
}

canvas.addEventListener("pointerdown", (e) => {
  if(!running || storyLocked) return;

  const rect = canvas.getBoundingClientRect();
  const worldX = e.clientX + camera.x;
  const worldY = e.clientY + camera.y;

  // shrine interaction first
  if(canInteractWithShrine(PLAYER)){
    const sx = SHRINE.x - camera.x;
    const sy = SHRINE.y - camera.y;
    const clickDist = Math.hypot(e.clientX - sx, e.clientY - sy);
    if(clickDist < 70){
      startShrineSequence();
      return;
    }
  }

  PLAYER.tx = worldX;
  PLAYER.ty = worldY;
});

function update(){
  tick += 1;
  updatePlayer(storyLocked);
  updateCompanion(PLAYER);

  camera.x = PLAYER.x - (window.innerWidth / 2);
  camera.y = PLAYER.y - (window.innerHeight / 2);
  camera.x = Math.max(0, Math.min(camera.x, WORLD.width - window.innerWidth));
  camera.y = Math.max(0, Math.min(camera.y, WORLD.height - window.innerHeight));

  checkEchoDiscovery(PLAYER, SHRINE.activated, (echo) => {
    if(!discovered.includes(echo.name)){
      discovered.push(echo.name);
      persistSave({});
      renderArchive();
    }
    showToast(`Discovered: ${echo.name}`);
  });
}

function draw(){
  drawWorld(ctx, camera, timeOfDay);
  drawShrine(ctx, camera, tick);
  drawEchoes(ctx, camera, tick, SHRINE.activated);
  drawCompanion(ctx, camera, tick);
  drawPlayer(ctx, camera, tick);
  drawLighting(ctx, camera, PLAYER);
}

function loop(){
  if(!running) return;
  update();
  draw();
  requestAnimationFrame(loop);
}

lanternButton.addEventListener("click", awakenLantern);
document.getElementById("newGameBtn").addEventListener("click", () => startGame(true));
continueBtn.addEventListener("click", () => startGame(false));
document.getElementById("archiveBtn").addEventListener("click", () => { renderArchive(); showPanel(archive); });
document.getElementById("settingsBtn").addEventListener("click", () => showPanel(settings));
document.getElementById("creditsBtn").addEventListener("click", () => showPanel(credits));
document.querySelectorAll("[data-back='menu']").forEach(btn => btn.addEventListener("click", () => showPanel(menu)));
backToMenuBtn.addEventListener("click", stopGame);

document.getElementById("devToggle").addEventListener("change", (e) => {
  devBadge.classList.toggle("hidden", !e.target.checked);
  persistSave({ devMode: !!e.target.checked });
});

createFireflies();
loadSave();
updateContinueState();
startIntro();

if("serviceWorker" in navigator){
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
}



document.addEventListener("DOMContentLoaded", () => {
  const audio = document.getElementById("menuThemeAudio");
  const lanternBtn = document.getElementById("lanternButton");
  const newGameBtn = document.getElementById("newGameBtn");

  if(audio && lanternBtn){
    lanternBtn.addEventListener("click", () => {
      audio.volume = 0.5;
      audio.play().catch(()=>{});
    });
  }

  if(audio && newGameBtn){
    newGameBtn.addEventListener("click", () => {
      audio.pause();
    });
  }
});
