(function(){
  const SAVE_KEY = "echoes_of_the_lantern_save_v02";
  const SETTINGS_KEY = "echoes_of_the_lantern_settings_v02";

  const BASE_ECHOES = [
    { id:"glow-slime", name:"Glow Slime", rarity:"Common", type:"Light Echo", vibe:"cute", color:"#f7d66c", desc:"A cheerful spirit that glows brighter near lantern light.", symbol:"✦" },
    { id:"lantern-moth", name:"Lantern Moth", rarity:"Common", type:"Light Echo", vibe:"beautiful", color:"#ffe3a9", desc:"A drifting Echo drawn to warm light and quiet clearings.", symbol:"🦋" },
    { id:"rune-rabbit", name:"Rune Rabbit", rarity:"Common", type:"Nature Echo", vibe:"weird", color:"#cde7af", desc:"Quick-footed and curious, it leaves strange patterns where it rests.", symbol:"ᚱ" },
    { id:"moss-turtle", name:"Moss Turtle", rarity:"Uncommon", type:"Nature Echo", vibe:"cozy", color:"#93bf8d", desc:"A patient forest Echo that carries bits of the trail on its shell.", symbol:"◔" },
    { id:"whisper-cat", name:"Whisper Cat", rarity:"Rare", type:"Shadow Echo", vibe:"eerie", color:"#8ca7ff", desc:"It appears where lantern light fades, then vanishes without sound.", symbol:"☾" },
    { id:"static-sprite", name:"Static Sprite", rarity:"Uncommon", type:"Glitch Echo", vibe:"glitch", color:"#77d4f4", desc:"A restless spark that flickers like a broken signal in the woods.", symbol:"⌁" },
    { id:"mist-owl", name:"Mist Owl", rarity:"Uncommon", type:"Spirit Echo", vibe:"watchful", color:"#bfd7ff", desc:"Seen in dim places where the air turns cool and still.", symbol:"◉" },
    { id:"hollow-hound", name:"Hollow Hound", rarity:"Rare", type:"Shadow Echo", vibe:"dark", color:"#9aa3b8", desc:"Its footsteps arrive before it does.", symbol:"✧" },
    { id:"clock-beetle", name:"Clock Beetle", rarity:"Uncommon", type:"Ancient Echo", vibe:"odd", color:"#dfc78a", desc:"Tiny legs. Ancient timing.", symbol:"⌛" },
    { id:"mirror-serpent", name:"Mirror Serpent", rarity:"Mythic", type:"Ancient Echo", vibe:"strange", color:"#c7c2ff", desc:"Seen twice. Never from the same angle.", symbol:"∞" }
  ];

  const ARCHIVE_ORDER = [
    "glow-slime","lantern-moth","rune-rabbit","moss-turtle","whisper-cat","static-sprite",
    "mist-owl","hollow-hound","clock-beetle","mirror-serpent"
  ];

  const COMPANION_POOL = ["glow-slime","lantern-moth","rune-rabbit","moss-turtle","whisper-cat","static-sprite"];

  const BOND_QUESTIONS = [
    {
      text:"You hear something moving in the forest.",
      answers:[
        { text:"Investigate immediately", tags:["brave","weird"] },
        { text:"Observe quietly", tags:["calm","shadow"] },
        { text:"Call out softly", tags:["light","social"] },
        { text:"Wait and listen", tags:["nature","calm"] }
      ]
    },
    {
      text:"Which place feels most welcoming?",
      answers:[
        { text:"Forest path", tags:["nature","calm"] },
        { text:"Ruined stones", tags:["ancient","weird"] },
        { text:"Water at dawn", tags:["light","spirit"] },
        { text:"Strange lights in the distance", tags:["glitch","shadow"] }
      ]
    },
    {
      text:"What matters more to you in a companion?",
      answers:[
        { text:"Warmth", tags:["light"] },
        { text:"Curiosity", tags:["weird","glitch"] },
        { text:"Loyal calm", tags:["nature","calm"] },
        { text:"Mystery", tags:["shadow","ancient"] }
      ]
    }
  ];

  const TAG_TO_COMPANION = {
    light:["lantern-moth","glow-slime"],
    calm:["moss-turtle","rune-rabbit"],
    nature:["moss-turtle","rune-rabbit"],
    shadow:["whisper-cat"],
    glitch:["static-sprite"],
    ancient:["rune-rabbit"],
    brave:["glow-slime"],
    weird:["static-sprite","rune-rabbit"],
    social:["lantern-moth"],
    spirit:["lantern-moth"]
  };

  const world = {
    w: 420,
    h: 760,
    clearings: [
      {x:210,y:180,r:90},
      {x:140,y:425,r:84},
      {x:280,y:585,r:94}
    ],
    paths: [
      {x1:210,y1:40,x2:210,y2:230,w:42},
      {x1:210,y1:230,x2:140,y2:425,w:44},
      {x1:140,y1:425,x2:280,y2:585,w:44},
      {x1:280,y1:585,x2:300,y2:720,w:46}
    ]
  };

  const screens = {
    title: document.getElementById("titleScreen"),
    name: document.getElementById("nameScreen"),
    bond: document.getElementById("bondScreen"),
    companion: document.getElementById("companionScreen"),
    manualCompanion: document.getElementById("manualCompanionScreen"),
    location: document.getElementById("locationScreen"),
    game: document.getElementById("gameScreen"),
    archive: document.getElementById("archiveScreen"),
    settings: document.getElementById("settingsScreen"),
    credits: document.getElementById("creditsScreen"),
  };

  const el = {
    continueBtn: document.getElementById("continueBtn"),
    newGameBtn: document.getElementById("newGameBtn"),
    archiveBtn: document.getElementById("archiveBtn"),
    settingsBtn: document.getElementById("settingsBtn"),
    creditsBtn: document.getElementById("creditsBtn"),
    nameInput: document.getElementById("playerNameInput"),
    gameTitle: document.getElementById("gameTitle"),
    devBuildTag: document.getElementById("devBuildTag"),
    bondQuestionWrap: document.getElementById("bondQuestionWrap"),
    bondAnswers: document.getElementById("bondAnswers"),
    bondProgressText: document.getElementById("bondProgressText"),
    bondProgressFill: document.getElementById("bondProgressFill"),
    companionRevealCard: document.getElementById("companionRevealCard"),
    manualCompanionGrid: document.getElementById("manualCompanionGrid"),
    locationTitle: document.getElementById("locationTitle"),
    canvas: document.getElementById("gameCanvas"),
    floatingHint: document.getElementById("floatingHint"),
    autosaveIndicator: document.getElementById("autosaveIndicator"),
    lanternStateBadge: document.getElementById("lanternStateBadge"),
    journalBtn: document.getElementById("journalBtn"),
    titleBtn: document.getElementById("titleBtn"),
    archiveList: document.getElementById("archiveList"),
    archiveCount: document.getElementById("archiveCount"),
    archiveBookGlow: document.getElementById("archiveBookGlow"),
    soundToggle: document.getElementById("soundToggle"),
    motionToggle: document.getElementById("motionToggle"),
    saveHintToggle: document.getElementById("saveHintToggle"),
    devOpenBtn: document.getElementById("devOpenBtn"),
    gameStageWrap: document.getElementById("gameStageWrap"),
    discoveryModal: document.getElementById("discoveryModal"),
    discoveryName: document.getElementById("discoveryName"),
    discoveryMeta: document.getElementById("discoveryMeta"),
    discoveryDesc: document.getElementById("discoveryDesc"),
    confirmModal: document.getElementById("confirmModal"),
    confirmTitle: document.getElementById("confirmTitle"),
    confirmBody: document.getElementById("confirmBody"),
    confirmCancelBtn: document.getElementById("confirmCancelBtn"),
    confirmOkBtn: document.getElementById("confirmOkBtn"),
    devModal: document.getElementById("devModal")
  };

  const ctx = el.canvas.getContext("2d");
  let state = {
    version:"v0.2",
    playerName:"",
    companionId:null,
    discovered:[],
    currentScreen:"title",
    devMode:false,
    saveExists:false,
    firstRun:true,
    archiveSeen:false,
    lanternState:"amber",
    bondIndex:0,
    bondTags:[],
    lastSuggestedCompanion:null,
    showSaveHint:true,
    subtleMotion:true,
    soundEnabled:true,
    timeOfDay:"day",
    firstEncounterDone:false,
    gameStarted:false,
    resonanceVisual:0,
    moveTarget:null,
    firstEntryShown:false,
    saveCount:0
  };

  const gameState = {
    player:{x:210,y:95,speed:2.3,idle:0,step:0},
    companion:{x:188,y:130,vx:0,vy:0,bob:0},
    echoes:[],
    pollen:[],
    plants:[],
    moths:[],
    trailParticles:[],
    moveKeys:{up:false,down:false,left:false,right:false},
    pointerTarget:null,
    hintTimer:null,
    lastFrame:performance.now(),
    atmosphereTimer:0,
    resonanceTimer:0,
    clearingView:false
  };

  let titleTapCount = 0;
  let titleTapTimer = null;
  let confirmAction = null;
  let rafHandle = null;
  let audioCtx = null;

  function loadSettings(){
    try{
      const s = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
      state.soundEnabled = s.soundEnabled !== false;
      state.subtleMotion = s.subtleMotion !== false;
      state.showSaveHint = s.showSaveHint !== false;
    }catch(err){}
    el.soundToggle.checked = state.soundEnabled;
    el.motionToggle.checked = state.subtleMotion;
    el.saveHintToggle.checked = state.showSaveHint;
  }

  function saveSettings(){
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({
      soundEnabled: state.soundEnabled,
      subtleMotion: state.subtleMotion,
      showSaveHint: state.showSaveHint
    }));
  }

  function makeDefaultSave(){
    return {
      version:"v0.2",
      playerName:"",
      companionId:null,
      discovered:[],
      devMode:false,
      firstRun:true,
      archiveSeen:false,
      lanternState:"amber",
      timeOfDay:"day",
      firstEncounterDone:false,
      gameStarted:false,
      saveCount:0
    };
  }

  function loadSave(){
    const raw = localStorage.getItem(SAVE_KEY);
    if(!raw){
      state.saveExists = false;
      updateContinue();
      return;
    }
    try{
      const parsed = JSON.parse(raw);
      Object.assign(state, makeDefaultSave(), parsed);
      state.saveExists = true;
    }catch(err){
      state.saveExists = false;
    }
    updateContinue();
    refreshDevUI();
  }

  function writeSave(){
    const payload = {
      version: state.version,
      playerName: state.playerName,
      companionId: state.companionId,
      discovered: state.discovered,
      devMode: state.devMode,
      firstRun: state.firstRun,
      archiveSeen: state.archiveSeen,
      lanternState: state.lanternState,
      timeOfDay: state.timeOfDay,
      firstEncounterDone: state.firstEncounterDone,
      gameStarted: state.gameStarted,
      saveCount: (state.saveCount||0)+1
    };
    state.saveCount = payload.saveCount;
    localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
    state.saveExists = true;
    updateContinue();
    flashAutosave();
  }

  function resetSave(){
    localStorage.removeItem(SAVE_KEY);
    state = Object.assign(state, makeDefaultSave(), {
      soundEnabled: state.soundEnabled,
      subtleMotion: state.subtleMotion,
      showSaveHint: state.showSaveHint
    });
    state.saveExists = false;
    buildManualCompanionGrid();
    updateContinue();
    refreshDevUI();
  }

  function updateContinue(){
    el.continueBtn.disabled = !state.saveExists;
  }

  function showScreen(name){
    Object.keys(screens).forEach(k => screens[k].classList.remove("active"));
    if(screens[name]) screens[name].classList.add("active");
    state.currentScreen = name;
  }

  function showHint(text, ms=1800){
    el.floatingHint.textContent = text;
    el.floatingHint.classList.remove("hidden");
    el.floatingHint.classList.add("show");
    clearTimeout(gameState.hintTimer);
    gameState.hintTimer = setTimeout(()=>{
      el.floatingHint.classList.add("hidden");
      el.floatingHint.classList.remove("show");
    }, ms);
  }

  function flashAutosave(){
    if(!state.showSaveHint) return;
    el.autosaveIndicator.classList.add("show");
    setTimeout(()=>el.autosaveIndicator.classList.remove("show"), 1300);
  }

  function echoById(id){
    return BASE_ECHOES.find(e=>e.id===id);
  }

  function randFrom(arr){
    return arr[Math.floor(Math.random()*arr.length)];
  }

  function weightedCompanionFromTags(tags){
    const scores = {};
    COMPANION_POOL.forEach(id => scores[id] = 1);
    tags.forEach(tag => {
      (TAG_TO_COMPANION[tag] || []).forEach(id => scores[id] = (scores[id]||1)+2);
    });
    let best = null, bestScore = -1;
    Object.keys(scores).forEach(id=>{
      if(scores[id] > bestScore){
        best = id;
        bestScore = scores[id];
      }else if(scores[id] === bestScore && Math.random() > 0.5){
        best = id;
      }
    });
    return best || randFrom(COMPANION_POOL);
  }

  function renderBondQuestion(){
    const q = BOND_QUESTIONS[state.bondIndex];
    el.bondQuestionWrap.innerHTML = `<h3>${q.text}</h3>`;
    el.bondAnswers.innerHTML = "";
    q.answers.forEach(ans=>{
      const btn = document.createElement("button");
      btn.className = "answer-btn";
      btn.textContent = ans.text;
      btn.addEventListener("click", ()=>{
        state.bondTags.push(...ans.tags);
        state.bondIndex++;
        if(state.bondIndex >= BOND_QUESTIONS.length){
          suggestCompanion();
        }else{
          renderBondQuestion();
        }
      });
      el.bondAnswers.appendChild(btn);
    });
    el.bondProgressText.textContent = `Question ${state.bondIndex+1} / ${BOND_QUESTIONS.length}`;
    el.bondProgressFill.style.width = `${((state.bondIndex+1)/BOND_QUESTIONS.length)*100}%`;
  }

  function suggestCompanion(manualId){
    const id = manualId || weightedCompanionFromTags(state.bondTags);
    state.lastSuggestedCompanion = id;
    const e = echoById(id);
    el.companionRevealCard.innerHTML = `
      <div class="companion-spark">${e.symbol}</div>
      <div class="companion-name">${e.name}</div>
      <div class="companion-meta">${e.rarity} • ${e.type} • ${e.vibe}</div>
      <p class="small-copy" style="margin-top:10px">${e.desc}</p>
    `;
    showScreen("companion");
    softChime(540, 0.05, 0.18);
  }

  function buildManualCompanionGrid(){
    el.manualCompanionGrid.innerHTML = "";
    COMPANION_POOL.forEach(id=>{
      const e = echoById(id);
      const card = document.createElement("button");
      card.className = "companion-card";
      card.innerHTML = `<div class="companion-spark">${e.symbol}</div><div class="companion-name" style="font-size:20px">${e.name}</div><div class="companion-meta">${e.type}</div>`;
      card.addEventListener("click", ()=>suggestCompanion(id));
      el.manualCompanionGrid.appendChild(card);
    });
  }

  function applyCompanion(id){
    state.companionId = id;
    state.gameStarted = true;
    state.firstRun = false;
    writeSave();
    enterMosswoodTrail(true);
  }

  function startNewGameFlow(){
    showScreen("name");
    el.nameInput.value = state.playerName || "";
  }

  function confirmNewGame(){
    showConfirm("Start a new journey?","Your current progress will be replaced.", ()=>{
      resetSave();
      startNewGameFlow();
    });
  }

  function showConfirm(title, body, fn){
    confirmAction = fn;
    el.confirmTitle.textContent = title;
    el.confirmBody.textContent = body;
    el.confirmModal.classList.remove("hidden");
  }

  function hideConfirm(){
    el.confirmModal.classList.add("hidden");
    confirmAction = null;
  }

  function showDiscovery(echo){
    el.discoveryName.textContent = echo.name;
    el.discoveryMeta.textContent = `${echo.rarity} • ${echo.type}`;
    el.discoveryDesc.textContent = echo.desc;
    el.discoveryModal.classList.remove("hidden");
    const lanternColor = echo.id === "mirror-serpent" ? "gold" :
      echo.type.includes("Shadow") ? "blue" :
      echo.type.includes("Glitch") ? "blue" :
      "amber";
    setLanternState(lanternColor);
    discoverySound(echo);
  }

  function hideDiscovery(){
    el.discoveryModal.classList.add("hidden");
  }

  function setLanternState(kind){
    state.lanternState = kind;
    el.lanternStateBadge.className = "badge " + kind;
    const text = {
      amber:"Amber Flame",
      blue:"Blue Flame",
      red:"Red Flame",
      gold:"White/Gold Flame"
    }[kind] || "Amber Flame";
    el.lanternStateBadge.textContent = text;
  }

  function archiveEntries(){
    return ARCHIVE_ORDER.map(id=>{
      if(id === "ava-spirit") return null;
      const discovered = state.discovered.includes(id);
      const echo = echoById(id);
      return { id, discovered, echo };
    }).filter(Boolean);
  }

  function renderArchive(){
    el.archiveList.innerHTML = "";
    const entries = archiveEntries();
    const count = state.discovered.filter(id=>id !== "ava-spirit").length;
    el.archiveCount.textContent = `${count} / 60 Echoes Discovered`;
    entries.forEach(entry=>{
      const wrap = document.createElement("div");
      wrap.className = "archive-entry";
      if(entry.id === "ava-spirit") wrap.classList.add("archive-secret");
      if(entry.discovered){
        wrap.innerHTML = `
          <div class="archive-thumb" style="color:${entry.echo.color}">${entry.echo.symbol}</div>
          <div>
            <h3>${entry.echo.name}</h3>
            <p><strong>${entry.echo.type}</strong> • ${entry.echo.rarity}</p>
            <p>${entry.echo.desc}</p>
          </div>
        `;
      }else{
        wrap.innerHTML = `
          <div class="archive-silhouette">?</div>
          <div>
            <h3>Unknown Echo</h3>
            <p>The lantern senses this Echo somewhere in the world.</p>
          </div>
        `;
      }
      el.archiveList.appendChild(wrap);
    });
  }

  function enterMosswoodTrail(fromNewGame){
    showScreen("location");
    el.locationTitle.textContent = "🌲 Mosswood Trail";
    if(fromNewGame){
      setTimeout(()=>{
        showScreen("game");
        if(!state.firstEntryShown){
          state.firstEntryShown = true;
        }
        setupWorld();
      }, 2100);
    }else{
      setTimeout(()=>{
        showScreen("game");
        setupWorld();
      }, 1100);
    }
  }

  function setupWorld(){
    gameState.player.x = 210;
    gameState.player.y = 95;
    gameState.player.step = 0;
    gameState.player.idle = 0;
    gameState.companion.x = 184;
    gameState.companion.y = 128;
    gameState.echoes = [];
    gameState.pollen = [];
    gameState.plants = [];
    gameState.moths = [];
    gameState.trailParticles = [];
    gameState.pointerTarget = null;
    setLanternState("amber");
    buildPlants();
    buildPollen();
    buildCreatures();
    buildMoths();
    refreshDevUI();
    showHint("Move through Mosswood Trail. Approach Echoes to discover them.", 2200);
    if(!state.firstEncounterDone){
      setTimeout(triggerFirstEncounter, 1600);
    }
    if(!rafHandle){
      gameState.lastFrame = performance.now();
      rafHandle = requestAnimationFrame(loop);
    }
  }

  function buildPlants(){
    for(let i=0;i<44;i++){
      gameState.plants.push({
        x: 30 + Math.random()*360,
        y: 34 + Math.random()*690,
        sway: Math.random()*Math.PI*2,
        bend: 0
      });
    }
  }

  function buildPollen(){
    for(let i=0;i<32;i++){
      gameState.pollen.push({
        x: Math.random()*world.w,
        y: Math.random()*world.h,
        vy: .16 + Math.random()*.25,
        vx: -.18 + Math.random()*.36,
        r: 1 + Math.random()*2,
        alpha: .18 + Math.random()*.4
      });
    }
  }

  function spawnEcho(id, x, y){
    const e = echoById(id);
    gameState.echoes.push({
      id:e.id, x, y, baseX:x, baseY:y, r:14, t:Math.random()*100,
      vx:(Math.random()-.5)*.28, vy:(Math.random()-.5)*.28,
      rarity:e.rarity, type:e.type, name:e.name, symbol:e.symbol, color:e.color
    });
  }

  function buildCreatures(){
    const starter = ["glow-slime","lantern-moth","rune-rabbit","moss-turtle","whisper-cat","static-sprite"];
    const placements = [
      [178,170],[248,180],[148,404],[192,442],[286,576],[262,608]
    ];
    starter.forEach((id, idx)=>spawnEcho(id, placements[idx][0], placements[idx][1]));
    // ambient extras
    spawnEcho("glow-slime", 120, 190);
    spawnEcho("lantern-moth", 245, 148);
    spawnEcho("rune-rabbit", 118, 452);
  }

  function buildMoths(){
    for(let i=0;i<4;i++){
      gameState.moths.push({
        x: 120 + Math.random()*170,
        y: 130 + Math.random()*510,
        angle: Math.random()*Math.PI*2,
        orbit: 24 + Math.random()*16,
        speed: .008 + Math.random()*.012,
        attached:false
      });
    }
  }

  function isInClearing(x,y){
    return world.clearings.some(c=>{
      const dx = x-c.x, dy=y-c.y;
      return Math.sqrt(dx*dx+dy*dy) <= c.r;
    });
  }

  function triggerFirstEncounter(){
    state.firstEncounterDone = true;
    const firstPool = ["glow-slime","lantern-moth","rune-rabbit","moss-turtle","whisper-cat","static-sprite"];
    const id = randFrom(firstPool);
    setLanternState("blue");
    showHint("The lantern senses something nearby…", 2200);
    softChime(680, 0.06, 0.15);
    setTimeout(()=>{
      const e = gameState.echoes.find(v=>v.id === id) || (function(){spawnEcho(id, 210, 215); return gameState.echoes[gameState.echoes.length-1];})();
      e.x = 210; e.y = 215;
      writeSave();
    }, 700);
  }

  function toggleDevMode(){
    state.devMode = !state.devMode;
    refreshDevUI();
    if(state.devMode){
      softChime(820, 0.05, 0.12);
      setTimeout(()=>softChime(1040,0.04,0.1),90);
      showHint("Developer Mode Enabled", 1200);
    }else{
      softChime(480, 0.05, 0.12);
      showHint("Developer Mode Disabled", 1200);
    }
    if(state.saveExists) writeSave();
  }

  function refreshDevUI(){
    el.devBuildTag.classList.toggle("hidden", !state.devMode);
    el.devOpenBtn.classList.toggle("hidden", !state.devMode || state.currentScreen !== "game");
  }

  function revealAllEchoes(){
    state.discovered = ARCHIVE_ORDER.slice();
    renderArchive();
    writeSave();
    showHint("All archive entries revealed.", 1500);
  }

  function triggerResonance(){
    gameState.resonanceTimer = 260;
    state.resonanceVisual = 1;
    showHint("Lantern resonance hums through the trail…", 1600);
    softChime(730, 0.05, 0.18);
    setTimeout(()=>softChime(930, 0.04, 0.16), 110);
  }

  function toggleTime(){
    state.timeOfDay = state.timeOfDay === "day" ? "night" : "day";
    showHint(`Time changed to ${state.timeOfDay}.`, 1300);
  }

  function movePlayerTowardTarget(){
    const p = gameState.player;
    const target = gameState.pointerTarget;
    if(!target) return;
    const dx = target.x - p.x;
    const dy = target.y - p.y;
    const dist = Math.hypot(dx,dy);
    if(dist < 4){
      gameState.pointerTarget = null;
      return;
    }
    p.x += (dx/dist) * p.speed;
    p.y += (dy/dist) * p.speed;
  }

  function stepInput(){
    const p = gameState.player;
    let moved = false;
    if(gameState.moveKeys.up){ p.y -= p.speed; moved=true; }
    if(gameState.moveKeys.down){ p.y += p.speed; moved=true; }
    if(gameState.moveKeys.left){ p.x -= p.speed; moved=true; }
    if(gameState.moveKeys.right){ p.x += p.speed; moved=true; }
    if(!moved) movePlayerTowardTarget();
    p.x = Math.max(24, Math.min(world.w-24, p.x));
    p.y = Math.max(34, Math.min(world.h-24, p.y));
    if(moved || gameState.pointerTarget){
      p.step += 0.14;
      p.idle = 0;
      if(Math.random() < 0.02) stepSound();
    }else{
      p.idle += 0.025;
    }
  }

  function updateCompanion(){
    const c = gameState.companion;
    const p = gameState.player;
    c.bob += .05;
    // dynamic offset: sometimes ahead, sometimes side
    const offsetX = Math.sin(performance.now()/900)*18;
    const offsetY = -24 + Math.cos(performance.now()/1100)*14;
    const targetX = p.x + offsetX;
    const targetY = p.y + offsetY;
    c.x += (targetX - c.x) * 0.06;
    c.y += (targetY - c.y) * 0.06;
  }

  function updateEchoes(){
    gameState.echoes.forEach(e=>{
      e.t += 0.02;
      if(e.id === "glow-slime"){
        e.y += Math.sin(e.t*5) * 0.38;
        if(Math.random() < 0.08){
          gameState.trailParticles.push({x:e.x,y:e.y+4,r:3,life:24,color:"rgba(247,214,108,.28)"});
        }
      }else if(e.id === "lantern-moth"){
        const dx = (gameState.player.x - e.x);
        const dy = (gameState.player.y - e.y);
        const dist = Math.hypot(dx,dy);
        if(dist < 80 && Math.random() < 0.006){
          e.vx += dx/dist * 0.04;
          e.vy += dy/dist * 0.04;
        }
        e.x += Math.sin(e.t*2.4)*0.8 + e.vx;
        e.y += Math.cos(e.t*2.6)*0.7 + e.vy;
      }else if(e.id === "rune-rabbit"){
        e.x += Math.sin(e.t*3.2)*0.5;
        e.y += Math.cos(e.t*2.1)*0.35;
      }else if(e.id === "whisper-cat"){
        e.x += Math.sin(e.t*1.6)*0.3;
        e.y += Math.cos(e.t*1.4)*0.2;
        if(Math.random() < 0.0018){
          e.x += -12 + Math.random()*24;
          e.y += -8 + Math.random()*16;
        }
      }else{
        e.x += Math.sin(e.t*2.2) * 0.22 + e.vx;
        e.y += Math.cos(e.t*1.9) * 0.18 + e.vy;
      }
      e.x = Math.max(24, Math.min(world.w-24, e.x));
      e.y = Math.max(34, Math.min(world.h-24, e.y));

      const dx = gameState.player.x - e.x;
      const dy = gameState.player.y - e.y;
      const dist = Math.hypot(dx,dy);
      if(dist < 22){
        discoverEcho(e.id);
      }
    });
  }

  function discoverEcho(id){
    if(state.discovered.includes(id)) return;
    const echo = echoById(id);
    state.discovered.push(id);
    writeSave();
    showDiscovery(echo);
    renderArchive();
    // remove from world only once discovered, then respawn a common echo elsewhere
    gameState.echoes = gameState.echoes.filter(e=>e.id !== id || Math.hypot(gameState.player.x-e.x, gameState.player.y-e.y) > 22);
    const respawnCommon = randFrom(["glow-slime","lantern-moth","rune-rabbit"]);
    spawnEcho(respawnCommon, 80 + Math.random()*250, 120 + Math.random()*540);
  }

  function updatePollen(){
    gameState.pollen.forEach(p=>{
      p.x += p.vx;
      p.y += p.vy;
      if(p.x < -8) p.x = world.w+8;
      if(p.x > world.w+8) p.x = -8;
      if(p.y > world.h+8){ p.y = -8; p.x = Math.random()*world.w; }
    });
  }

  function updatePlants(){
    gameState.plants.forEach(pl=>{
      pl.sway += .03;
      const dx = gameState.player.x - pl.x;
      const dy = gameState.player.y - pl.y;
      const dist = Math.hypot(dx,dy);
      if(dist < 24){
        pl.bend = Math.min(1, pl.bend + 0.12);
        if(Math.random() < 0.06){
          gameState.trailParticles.push({x:pl.x,y:pl.y,r:2+Math.random()*2,life:22,color:"rgba(213,244,183,.22)"});
        }
      }else{
        pl.bend *= 0.92;
      }
    });
  }

  function updateTrailParticles(){
    gameState.trailParticles.forEach(p=>{
      p.life -= 1;
      p.r *= .985;
    });
    gameState.trailParticles = gameState.trailParticles.filter(p=>p.life>0);
  }

  function updateAtmosphere(){
    gameState.atmosphereTimer++;
    if(Math.random() < 0.0009){
      triggerAmbientResonance();
    }
  }

  function triggerAmbientResonance(){
    showHint("Lantern Moths gather around the flame…", 1500);
    triggerResonance();
  }

  function drawBackground(){
    const grd = ctx.createLinearGradient(0,0,0,world.h);
    if(state.timeOfDay === "day"){
      grd.addColorStop(0,"#204833");
      grd.addColorStop(.5,"#1d3e2f");
      grd.addColorStop(1,"#13291f");
    }else{
      grd.addColorStop(0,"#11243d");
      grd.addColorStop(.5,"#0e1d2d");
      grd.addColorStop(1,"#08131d");
    }
    ctx.fillStyle = grd;
    ctx.fillRect(0,0,world.w,world.h);

    // path ribbons
    world.paths.forEach(path=>{
      ctx.strokeStyle = "rgba(177,138,86,0.48)";
      ctx.lineWidth = path.w;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(path.x1,path.y1);
      ctx.lineTo(path.x2,path.y2);
      ctx.stroke();
      ctx.strokeStyle = "rgba(214,177,117,0.15)";
      ctx.lineWidth = path.w - 16;
      ctx.stroke();
    });

    // clearings
    world.clearings.forEach(c=>{
      const cg = ctx.createRadialGradient(c.x,c.y,10,c.x,c.y,c.r);
      cg.addColorStop(0,"rgba(104,169,109,0.34)");
      cg.addColorStop(.68,"rgba(89,135,79,0.18)");
      cg.addColorStop(1,"rgba(89,135,79,0)");
      ctx.fillStyle = cg;
      ctx.beginPath();
      ctx.arc(c.x,c.y,c.r,0,Math.PI*2);
      ctx.fill();
    });
  }

  function drawPlants(){
    gameState.plants.forEach(pl=>{
      const sway = Math.sin(pl.sway)*3;
      ctx.save();
      ctx.translate(pl.x, pl.y);
      ctx.rotate((sway + pl.bend*8) * Math.PI/180);
      ctx.strokeStyle = "rgba(84,142,89,.72)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0,10);
      ctx.lineTo(0,-10);
      ctx.stroke();
      ctx.fillStyle = "rgba(116,178,112,.55)";
      ctx.beginPath();
      ctx.ellipse(-4,-5,6,3, -0.5, 0, Math.PI*2);
      ctx.ellipse(4,0,6,3, 0.5, 0, Math.PI*2);
      ctx.fill();
      ctx.restore();
    });
  }

  function drawPollen(){
    gameState.pollen.forEach(p=>{
      ctx.fillStyle = `rgba(245,235,186,${p.alpha})`;
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fill();
    });
  }

  function drawParticles(){
    gameState.trailParticles.forEach(p=>{
      ctx.fillStyle = p.color.replace(")", `,${Math.max(.06,p.life/24*0.25)})`).replace("rgba(","rgba(");
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fill();
    });
  }

  function drawEchoes(){
    gameState.echoes.forEach(e=>{
      ctx.save();
      ctx.translate(e.x,e.y);
      if(e.id === "glow-slime"){
        ctx.fillStyle = "rgba(247,214,108,.18)";
        ctx.beginPath(); ctx.arc(0,0,20,0,Math.PI*2); ctx.fill();
        ctx.fillStyle = e.color;
        ctx.beginPath(); ctx.ellipse(0,3,13,10,0,0,Math.PI*2); ctx.fill();
        ctx.fillStyle = "#3a2c06";
        ctx.beginPath(); ctx.arc(-4,1,1.2,0,Math.PI*2); ctx.arc(4,1,1.2,0,Math.PI*2); ctx.fill();
      } else if(e.id === "lantern-moth"){
        ctx.fillStyle = "rgba(255,227,169,.22)";
        ctx.beginPath(); ctx.arc(0,0,18,0,Math.PI*2); ctx.fill();
        ctx.fillStyle = e.color;
        ctx.beginPath(); ctx.ellipse(-5,0,8,5,-.6,0,Math.PI*2); ctx.ellipse(5,0,8,5,.6,0,Math.PI*2); ctx.fill();
        ctx.fillStyle = "#503d15"; ctx.fillRect(-1,-2,2,7);
      } else if(e.id === "rune-rabbit"){
        ctx.fillStyle = e.color; ctx.beginPath(); ctx.ellipse(0,2,12,9,0,0,Math.PI*2); ctx.fill();
        ctx.fillRect(-6,-15,4,10); ctx.fillRect(2,-15,4,10);
      } else if(e.id === "moss-turtle"){
        ctx.fillStyle = "#537f50"; ctx.beginPath(); ctx.ellipse(0,0,15,11,0,0,Math.PI*2); ctx.fill();
        ctx.fillStyle = "#8fc68a"; ctx.beginPath(); ctx.arc(0,0,8,0,Math.PI*2); ctx.fill();
      } else if(e.id === "whisper-cat"){
        ctx.fillStyle = "rgba(140,167,255,.18)"; ctx.beginPath(); ctx.arc(0,0,18,0,Math.PI*2); ctx.fill();
        ctx.fillStyle = "#92a7ff"; ctx.beginPath(); ctx.ellipse(0,0,12,9,0,0,Math.PI*2); ctx.fill();
        ctx.fillRect(-7,-10,4,6); ctx.fillRect(3,-10,4,6);
      } else if(e.id === "static-sprite"){
        ctx.fillStyle = "#7de0f5"; ctx.fillRect(-8,-8,16,16);
        ctx.fillStyle = "#baf6ff"; ctx.fillRect(-3,-3,6,6);
      } else {
        ctx.fillStyle = e.color; ctx.beginPath(); ctx.arc(0,0,10,0,Math.PI*2); ctx.fill();
      }
      ctx.restore();
    });
  }

  function drawPlayer(){
    const p = gameState.player;
    // lantern light cone / glow
    const rg = ctx.createRadialGradient(p.x+10,p.y-20,10,p.x+10,p.y-20,88);
    let c1 = "rgba(255,221,138,.28)";
    let c2 = "rgba(255,221,138,.1)";
    if(state.lanternState === "blue"){ c1 = "rgba(147,206,255,.28)"; c2 = "rgba(147,206,255,.09)"; }
    if(state.lanternState === "gold"){ c1 = "rgba(255,240,190,.32)"; c2 = "rgba(255,240,190,.11)"; }
    ctx.fillStyle = rg;
    rg.addColorStop(0,c1); rg.addColorStop(.55,c2); rg.addColorStop(1,"rgba(255,255,255,0)");
    ctx.beginPath(); ctx.arc(p.x+10,p.y-10,90,0,Math.PI*2); ctx.fill();

    // player
    const bob = Math.sin(p.step)*1.5;
    ctx.fillStyle = "#25343d";
    ctx.fillRect(p.x-8,p.y-18+bob,16,26); // coat
    ctx.fillStyle = "#4f6878";
    ctx.fillRect(p.x-4,p.y-8+bob,8,16);
    ctx.fillStyle = "#d2c3ac";
    ctx.beginPath(); ctx.arc(p.x,p.y-24+bob,8,0,Math.PI*2); ctx.fill();

    // backpack
    ctx.fillStyle = "#59642d";
    ctx.fillRect(p.x-13,p.y-14+bob,6,12);

    // lantern
    ctx.fillStyle = "#d7c495";
    ctx.fillRect(p.x+8,p.y-10+bob,5,12);
    ctx.fillStyle = state.lanternState === "blue" ? "#b8deff" : (state.lanternState === "gold" ? "#fff0c2" : "#f6cf6d");
    ctx.beginPath(); ctx.arc(p.x+10.5,p.y-6+bob,5,0,Math.PI*2); ctx.fill();
  }

  function drawCompanion(){
    const c = gameState.companion;
    const echo = echoById(state.companionId || "lantern-moth");
    ctx.save();
    ctx.translate(c.x, c.y + Math.sin(c.bob)*2);
    ctx.fillStyle = "rgba(255,255,255,.08)";
    ctx.beginPath(); ctx.arc(0,10,14,0,Math.PI*2); ctx.fill();
    ctx.fillStyle = echo.color;
    if(echo.id === "lantern-moth"){
      ctx.beginPath(); ctx.ellipse(-5,0,8,5,-.7,0,Math.PI*2); ctx.ellipse(5,0,8,5,.7,0,Math.PI*2); ctx.fill();
    } else if(echo.id === "glow-slime"){
      ctx.beginPath(); ctx.ellipse(0,2,12,9,0,0,Math.PI*2); ctx.fill();
    } else if(echo.id === "rune-rabbit"){
      ctx.beginPath(); ctx.ellipse(0,2,12,9,0,0,Math.PI*2); ctx.fill();
      ctx.fillRect(-6,-14,4,10); ctx.fillRect(2,-14,4,10);
    } else if(echo.id === "moss-turtle"){
      ctx.beginPath(); ctx.ellipse(0,0,14,10,0,0,Math.PI*2); ctx.fill();
    } else if(echo.id === "whisper-cat"){
      ctx.beginPath(); ctx.ellipse(0,0,12,9,0,0,Math.PI*2); ctx.fill();
      ctx.fillRect(-7,-10,4,6); ctx.fillRect(3,-10,4,6);
    } else {
      ctx.fillRect(-8,-8,16,16);
    }
    ctx.restore();
  }

  function drawMoths(){
    gameState.moths.forEach((m, idx)=>{
      let tx = m.x, ty = m.y;
      if(gameState.resonanceTimer > 0 && idx < 3){
        const ang = (performance.now()/400)+(idx*2);
        tx = gameState.player.x + Math.cos(ang)*(22+idx*6);
        ty = gameState.player.y - 26 + Math.sin(ang)*(10+idx*5);
      } else {
        m.angle += m.speed;
        tx = m.x + Math.cos(m.angle) * 8;
        ty = m.y + Math.sin(m.angle) * 4;
      }
      ctx.fillStyle = "rgba(255,235,186,.55)";
      ctx.beginPath(); ctx.arc(tx,ty,2.4,0,Math.PI*2); ctx.fill();
      ctx.fillStyle = "rgba(255,235,186,.23)";
      ctx.beginPath(); ctx.arc(tx,ty,8,0,Math.PI*2); ctx.fill();
    });
  }

  function drawNightOverlay(){
    if(state.timeOfDay !== "night") return;
    ctx.fillStyle = "rgba(6,11,22,.22)";
    ctx.fillRect(0,0,world.w,world.h);
  }

  function updateViewMode(){
    const clearing = isInClearing(gameState.player.x, gameState.player.y);
    if(clearing !== gameState.clearingView){
      gameState.clearingView = clearing;
      el.gameStageWrap.classList.toggle("clearing-view", clearing);
      el.gameStageWrap.classList.toggle("path-view", !clearing);
    }
  }

  function loop(ts){
    const dt = Math.min(32, ts - gameState.lastFrame);
    gameState.lastFrame = ts;
    if(state.currentScreen === "game"){
      stepInput();
      updateCompanion();
      updateEchoes();
      updatePollen();
      updatePlants();
      updateTrailParticles();
      updateAtmosphere();
      updateViewMode();
      if(gameState.resonanceTimer > 0) gameState.resonanceTimer--;
      draw();
    }
    rafHandle = requestAnimationFrame(loop);
  }

  function draw(){
    ctx.clearRect(0,0,world.w,world.h);
    drawBackground();
    drawPlants();
    drawPollen();
    drawMoths();
    drawParticles();
    drawEchoes();
    drawPlayer();
    drawCompanion();
    drawNightOverlay();
  }

  function bindMovementButtons(){
    document.querySelectorAll(".move-btn").forEach(btn=>{
      const dir = btn.dataset.move;
      const down = ()=>{ gameState.moveKeys[dir] = true; };
      const up = ()=>{ gameState.moveKeys[dir] = false; };
      btn.addEventListener("touchstart", e=>{ e.preventDefault(); down(); });
      btn.addEventListener("touchend", e=>{ e.preventDefault(); up(); });
      btn.addEventListener("mousedown", down);
      btn.addEventListener("mouseup", up);
      btn.addEventListener("mouseleave", up);
    });
    window.addEventListener("keydown", e=>{
      const map = {ArrowUp:"up",ArrowDown:"down",ArrowLeft:"left",ArrowRight:"right",w:"up",s:"down",a:"left",d:"right"};
      if(map[e.key]) gameState.moveKeys[map[e.key]] = true;
    });
    window.addEventListener("keyup", e=>{
      const map = {ArrowUp:"up",ArrowDown:"down",ArrowLeft:"left",ArrowRight:"right",w:"up",s:"down",a:"left",d:"right"};
      if(map[e.key]) gameState.moveKeys[map[e.key]] = false;
    });

    function setPointerTargetFromEvent(ev){
      const rect = el.canvas.getBoundingClientRect();
      const x = (ev.clientX - rect.left) * (el.canvas.width / rect.width);
      const y = (ev.clientY - rect.top) * (el.canvas.height / rect.height);
      gameState.pointerTarget = {x,y};
    }
    el.canvas.addEventListener("click", setPointerTargetFromEvent);
    el.canvas.addEventListener("touchstart", e=>{
      const t = e.touches[0];
      if(t) setPointerTargetFromEvent(t);
    });
  }

  function softChime(freq, gain, dur){
    if(!state.soundEnabled) return;
    ensureAudio();
    const now = audioCtx.currentTime;
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = "sine";
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(gain, now + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    o.connect(g).connect(audioCtx.destination);
    o.start(now);
    o.stop(now + dur + 0.03);
  }

  function stepSound(){
    if(!state.soundEnabled || Math.random() < 0.75) return;
    ensureAudio();
    const now = audioCtx.currentTime;
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = "triangle";
    o.frequency.value = 130 + Math.random()*30;
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.02, now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
    o.connect(g).connect(audioCtx.destination);
    o.start(now); o.stop(now + 0.08);
  }

  function discoverySound(echo){
    if(echo.id === "ava-spirit"){
      softChime(740, 0.06, 0.2);
      setTimeout(()=>softChime(940,0.045,0.18), 80);
      return;
    }
    if(echo.id === "whisper-cat"){
      softChime(510, 0.04, 0.16);
    }else if(echo.id === "lantern-moth"){
      softChime(760, 0.045, 0.16);
    }else{
      softChime(620, 0.04, 0.14);
    }
  }

  function ensureAudio(){
    if(!audioCtx){
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if(audioCtx.state === "suspended") audioCtx.resume();
  }

  function bindUI(){
    el.newGameBtn.addEventListener("click", ()=>{
      if(state.saveExists) confirmNewGame();
      else startNewGameFlow();
    });
    el.continueBtn.addEventListener("click", ()=>{
      if(!state.saveExists) return;
      enterMosswoodTrail(false);
    });
    el.archiveBtn.addEventListener("click", ()=>{
      renderArchive();
      showScreen("archive");
      softChime(680, 0.03, 0.14);
    });
    el.settingsBtn.addEventListener("click", ()=>showScreen("settings"));
    el.creditsBtn.addEventListener("click", ()=>showScreen("credits"));

    document.getElementById("nameBackBtn").addEventListener("click", ()=>showScreen("title"));
    document.getElementById("nameNextBtn").addEventListener("click", ()=>{
      const val = el.nameInput.value.trim();
      if(!val){ showHint("Enter a name first.", 1100); return; }
      state.playerName = val;
      state.bondIndex = 0;
      state.bondTags = [];
      renderBondQuestion();
      showScreen("bond");
    });

    document.getElementById("bondBackBtn").addEventListener("click", ()=>showScreen("name"));

    document.getElementById("acceptCompanionBtn").addEventListener("click", ()=>{
      applyCompanion(state.lastSuggestedCompanion);
    });
    document.getElementById("rerollCompanionBtn").addEventListener("click", ()=>{
      suggestCompanion();
    });
    document.getElementById("chooseCompanionBtn").addEventListener("click", ()=>showScreen("manualCompanion"));
    document.getElementById("manualBackBtn").addEventListener("click", ()=>showScreen("companion"));

    document.getElementById("archiveBackBtn").addEventListener("click", ()=>{
      showScreen(state.gameStarted ? "game" : "title");
    });
    document.getElementById("settingsBackBtn").addEventListener("click", ()=>showScreen("title"));
    document.getElementById("creditsBackBtn").addEventListener("click", ()=>showScreen("title"));

    el.journalBtn.addEventListener("click", ()=>{
      renderArchive();
      showScreen("archive");
      softChime(680, 0.03, 0.14);
    });
    el.titleBtn.addEventListener("click", ()=>{
      showScreen("title");
      refreshDevUI();
      writeSave();
    });

    el.soundToggle.addEventListener("change", ()=>{
      state.soundEnabled = el.soundToggle.checked;
      saveSettings();
    });
    el.motionToggle.addEventListener("change", ()=>{
      state.subtleMotion = el.motionToggle.checked;
      saveSettings();
    });
    el.saveHintToggle.addEventListener("change", ()=>{
      state.showSaveHint = el.saveHintToggle.checked;
      saveSettings();
    });

    el.discoveryCloseBtn.addEventListener("click", hideDiscovery);

    el.confirmCancelBtn.addEventListener("click", hideConfirm);
    el.confirmOkBtn.addEventListener("click", ()=>{
      if(confirmAction) confirmAction();
      hideConfirm();
    });

    el.gameTitle.addEventListener("click", ()=>{
      titleTapCount++;
      clearTimeout(titleTapTimer);
      titleTapTimer = setTimeout(()=>titleTapCount = 0, 1500);
      if(titleTapCount >= 5){
        titleTapCount = 0;
        toggleDevMode();
      }
    });

    el.devOpenBtn.addEventListener("click", ()=>{
      el.devModal.classList.remove("hidden");
    });
    document.getElementById("devCloseBtn").addEventListener("click", ()=>{
      el.devModal.classList.add("hidden");
    });
    el.devModal.querySelectorAll("[data-dev]").forEach(btn=>{
      btn.addEventListener("click", ()=>{
        const action = btn.dataset.dev;
        if(action === "spawn"){
          spawnEcho(randFrom(COMPANION_POOL), 80+Math.random()*260, 130+Math.random()*520);
          showHint("Echo spawned.", 1000);
        }else if(action === "reveal"){
          revealAllEchoes();
        }else if(action === "toggleTime"){
          toggleTime();
        }else if(action === "resonance"){
          triggerResonance();
        }else if(action === "resetSave"){
          showConfirm("Reset save?","This will erase current progress.", ()=>{
            resetSave();
            showScreen("title");
          });
        }
      });
    });

    window.addEventListener("pointermove", e=>{
      if(!state.subtleMotion || state.currentScreen !== "title") return;
      const x = (e.clientX / window.innerWidth - 0.5) * 8;
      const y = (e.clientY / window.innerHeight - 0.5) * 8;
      document.querySelector(".title-card").style.transform = `translate(${x}px, ${y}px)`;
    });

    document.addEventListener("visibilitychange", ()=>{
      if(document.visibilityState === "hidden" && state.saveExists){
        writeSave();
      }
    });
  }

  function initServiceWorker(){
    if("serviceWorker" in navigator){
      navigator.serviceWorker.register("./sw.js").catch(()=>{});
    }
  }

  function init(){
    loadSettings();
    loadSave();
    buildManualCompanionGrid();
    bindUI();
    bindMovementButtons();
    initServiceWorker();
    showScreen("title");
  }

  init();
})();
