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
  for(let i=0;i<36;i++){
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
  g.addColorStop(0, "#10212a");
  g.addColorStop(1, "#0a141a");
  ctx.fillStyle = g;
  ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);

  WORLD.clearings.forEach((c, i) => {
    const x = c.x - camera.x;
    const y = c.y - camera.y;
    const rg = ctx.createRadialGradient(x, y, 20, x, y, c.r);
    rg.addColorStop(0, i===0 ? "rgba(31,58,49,.85)" : "rgba(24,49,41,.72)");
    rg.addColorStop(1, "rgba(15,29,25,.08)");
    ctx.fillStyle = rg;
    ctx.beginPath();
    ctx.arc(x, y, c.r, 0, Math.PI*2);
    ctx.fill();
  });

  WORLD.plants.forEach(p => {
    const x = p.x - camera.x;
    const y = p.y - camera.y;
    ctx.fillStyle = `rgba(118, 191, 137, ${0.18 + p.glow*0.35})`;
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = `rgba(219, 238, 174, ${0.08 + p.glow*0.14})`;
    ctx.beginPath();
    ctx.arc(x, y, 14, 0, Math.PI*2);
    ctx.fill();
  });

  WORLD.trees.forEach(t => {
    const x = t.x - camera.x;
    const y = t.y - camera.y;
    ctx.fillStyle = "rgba(11,26,23,.94)";
    ctx.beginPath();
    ctx.arc(x, y, t.r, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = "rgba(19,42,35,.78)";
    ctx.beginPath();
    ctx.arc(x - t.r*0.12, y - t.r*0.18, t.r*0.72, 0, Math.PI*2);
    ctx.fill();
  });

  const alpha = 0.18 + 0.22 * timeOfDay;
  ctx.fillStyle = `rgba(7, 12, 18, ${alpha})`;
  ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
}
