const WORLD = {
  width: 2200,
  height: 1600,
  clearings: [
    { x: 1100, y: 900, r: 260 },
    { x: 700, y: 680, r: 170 },
    { x: 1500, y: 700, r: 180 },
    { x: 1120, y: 430, r: 150 }
  ],
  trees: [],
  plants: []
};

function generateWorld(){
  WORLD.trees = [];
  WORLD.plants = [];
  for(let i=0;i<80;i++){
    const x = Math.random() * WORLD.width;
    const y = Math.random() * WORLD.height;
    if(isInsideClearing(x, y, 60)) continue;
    WORLD.trees.push({ x, y, r: 28 + Math.random()*24 });
  }
  for(let i=0;i<42;i++){
    const c = WORLD.clearings[Math.floor(Math.random()*WORLD.clearings.length)];
    const a = Math.random() * Math.PI * 2;
    const d = Math.random() * (c.r - 22);
    WORLD.plants.push({
      x: c.x + Math.cos(a)*d,
      y: c.y + Math.sin(a)*d,
      glow: 0.2 + Math.random()*0.5
    });
  }
}

function isInsideClearing(x, y, pad = 0){
  return WORLD.clearings.some(c => Math.hypot(x-c.x, y-c.y) < c.r - pad);
}

function drawWorld(ctx, camera, timeOfDay = 0){
  const g = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
  g.addColorStop(0, "#18313c");
  g.addColorStop(1, "#102129");
  ctx.fillStyle = g;
  ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);

  WORLD.clearings.forEach((c, i) => {
    const x = c.x - camera.x;
    const y = c.y - camera.y;
    const rg = ctx.createRadialGradient(x, y, 20, x, y, c.r);
    rg.addColorStop(0, i===0 ? "rgba(60,108,84,.82)" : "rgba(43,89,70,.72)");
    rg.addColorStop(1, "rgba(22,48,39,.16)");
    ctx.fillStyle = rg;
    ctx.beginPath();
    ctx.arc(x, y, c.r, 0, Math.PI*2);
    ctx.fill();
  });

  ctx.strokeStyle = "rgba(74,110,89,.28)";
  ctx.lineWidth = 54;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(1100 - camera.x, 900 - camera.y);
  ctx.lineTo(700 - camera.x, 680 - camera.y);
  ctx.moveTo(1100 - camera.x, 900 - camera.y);
  ctx.lineTo(1500 - camera.x, 700 - camera.y);
  ctx.moveTo(1100 - camera.x, 900 - camera.y);
  ctx.lineTo(1120 - camera.x, 430 - camera.y);
  ctx.stroke();

  WORLD.plants.forEach(p => {
    const x = p.x - camera.x;
    const y = p.y - camera.y;
    ctx.fillStyle = `rgba(126, 205, 140, ${0.22 + p.glow*0.38})`;
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = `rgba(230, 246, 188, ${0.08 + p.glow*0.16})`;
    ctx.beginPath();
    ctx.arc(x, y, 16, 0, Math.PI*2);
    ctx.fill();
  });

  WORLD.trees.forEach(t => {
    const x = t.x - camera.x;
    const y = t.y - camera.y;
    ctx.fillStyle = "rgba(12,33,27,.9)";
    ctx.beginPath();
    ctx.arc(x, y, t.r, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = "rgba(24,61,48,.65)";
    ctx.beginPath();
    ctx.arc(x - t.r*0.12, y - t.r*0.18, t.r*0.72, 0, Math.PI*2);
    ctx.fill();
  });

  const alpha = 0.10 + 0.08 * timeOfDay;
  ctx.fillStyle = `rgba(9, 16, 22, ${alpha})`;
  ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
}
