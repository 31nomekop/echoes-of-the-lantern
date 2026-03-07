const COMPANION = {
  active: false,
  x: 0,
  y: 0,
  tx: 0,
  ty: 0
};

function resetCompanion(){
  COMPANION.active = false;
  COMPANION.x = 0;
  COMPANION.y = 0;
  COMPANION.tx = 0;
  COMPANION.ty = 0;
}

function spawnCompanion(x, y){
  COMPANION.active = true;
  COMPANION.x = x;
  COMPANION.y = y;
  COMPANION.tx = x;
  COMPANION.ty = y;
}

function updateCompanion(player){
  if(!COMPANION.active) return;

  const desiredX = player.x - 38;
  const desiredY = player.y + 6;
  const dx = desiredX - COMPANION.x;
  const dy = desiredY - COMPANION.y;
  const dist = Math.hypot(dx, dy);

  if(dist > 2){
    COMPANION.x += dx / dist * 1.7;
    COMPANION.y += dy / dist * 1.7;
  }
}

function drawCompanion(ctx, camera, tick = 0){
  if(!COMPANION.active) return;
  const x = COMPANION.x - camera.x;
  const y = COMPANION.y - camera.y + Math.sin(tick * 0.08) * 4;

  ctx.fillStyle = "rgba(244, 210, 132, .18)";
  ctx.beginPath();
  ctx.arc(x, y, 16, 0, Math.PI*2);
  ctx.fill();

  ctx.fillStyle = "rgba(244, 210, 132, .88)";
  ctx.beginPath();
  ctx.arc(x, y, 7, 0, Math.PI*2);
  ctx.fill();
}
