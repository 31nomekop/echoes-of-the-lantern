const SAVE_KEY = "echoes-save-v03";
const scene = document.getElementById("scene");
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

function createFireflies(count = 18){
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

function hasSave(){
  try{
    return !!localStorage.getItem(SAVE_KEY);
  }catch{
    return false;
  }
}

function updateContinueState(){
  const saved = hasSave();
  continueBtn.disabled = !saved;
  continueBtn.classList.toggle("disabled", !saved);
}

function showPanel(target){
  [intro, menu, settings, archive, credits].forEach(p => p.classList.add("hidden"));
  target.classList.remove("hidden");
}

function startIntro(){
  showPanel(intro);
  line1.classList.remove("hidden");
  setTimeout(() => line1.classList.add("show"), 250);

  setTimeout(() => {
    line2.classList.remove("hidden");
    line2.classList.add("show");
  }, 1700);

  setTimeout(() => {
    tapPrompt.classList.remove("hidden");
    tapPrompt.classList.add("show");
  }, 3200);
}

function awakenLantern(){
  const glow = document.getElementById("lanternGlow");
  glow.style.transition = "transform 1.25s ease, opacity 1.25s ease";
  glow.style.transform = "scale(1.55)";
  glow.style.opacity = "1";

  scene.animate([
    { transform: "scale(1) translateY(0)", filter: "brightness(1)" },
    { transform: "scale(1.02) translateY(-4px)", filter: "brightness(1.08)" },
    { transform: "scale(1) translateY(0)", filter: "brightness(1)" }
  ], { duration: 1800, easing: "ease-in-out" });

  setTimeout(() => showPanel(menu), 1450);
}

lanternButton.addEventListener("click", awakenLantern);

document.getElementById("newGameBtn").addEventListener("click", () => {
  alert("Chunk 2 will add the first playable forest transition.\n\nThis first chunk locks the correct intro, menu, navigation, PWA base, and upload workflow.");
});

document.getElementById("archiveBtn").addEventListener("click", () => showPanel(archive));
document.getElementById("settingsBtn").addEventListener("click", () => showPanel(settings));
document.getElementById("creditsBtn").addEventListener("click", () => showPanel(credits));
continueBtn.addEventListener("click", () => {
  alert("Continue is wired correctly and stays visible but greyed out until a save exists. Actual save resume arrives when the playable world chunk is added.");
});

document.querySelectorAll("[data-back='menu']").forEach(btn => {
  btn.addEventListener("click", () => showPanel(menu));
});

document.getElementById("devToggle").addEventListener("change", (e) => {
  try{
    const current = JSON.parse(localStorage.getItem(SAVE_KEY) || "{}");
    current.devMode = !!e.target.checked;
    localStorage.setItem(SAVE_KEY, JSON.stringify(current));
  }catch{}
});

scene.addEventListener("pointerdown", () => {
  if(menu.classList.contains("hidden")) return;
  const glow = document.getElementById("lanternGlow");
  glow.animate([
    { transform: "scale(1)", opacity: .72 },
    { transform: "scale(1.1)", opacity: .92 },
    { transform: "scale(1)", opacity: .72 }
  ], { duration: 750, easing: "ease-out" });
});

createFireflies();
updateContinueState();
startIntro();

if("serviceWorker" in navigator){
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}
