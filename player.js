const PLAYER = {
  x: 1100,
  y: 1120,
  tx: 1100,
  ty: 1120,
  speed: 2.2
};

function resetPlayer(){
  PLAYER.x = 1100;
  PLAYER.y = 1120;
  PLAYER.tx = 1100;
  PLAYER.ty = 1120;
}

function updatePlayer(lockMovement = false){
  if(lockMovement) return;
  const dx = PLAYER.tx - PLAYER.x;
  const dy = PLAYER.ty - PLAYER.y;
  const dist = Math.hypot(dx, dy);

  if(dist > 1){
    PLAYER.x += dx / dist * PLAYER.speed;
    PLAYER.y += dy / dist * PLAYER.speed;
  }
}

function drawPlayer(ctx, camera, walkTick = 0){
  const x = PLAYER.x - camera.x;
  const y = PLAYER.y - camera.y;
  const sway = Math.sin(walkTick * 0.18) * 1.5;

  ctx.fillStyle = "rgba(245,198,110,.32)";
  ctx.beginPath();
  ctx.arc(x + 10, y + sway, 30, 0, Math.PI*2);
  ctx.fill();

  ctx.strokeStyle = "rgba(245,198,110,.22)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x + 10, y + sway, 18, 0, Math.PI*2);
  ctx.stroke();

  ctx.fillStyle = "rgba(3,3,3,.94)";
  ctx.beginPath();
  ctx.arc(x, y - 10, 9, 0, Math.PI*2);
  ctx.fill();
  ctx.fillRect(x - 8, y - 3, 16, 28);

  ctx.fillStyle = "#f3c56f";
  ctx.beginPath();
  ctx.arc(x + 10, y + sway, 6, 0, Math.PI*2);
  ctx.fill();
}
