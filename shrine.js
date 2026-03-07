const SHRINE = {
  x: 1100,
  y: 900,
  activated: false
};

function resetShrine(){
  SHRINE.activated = false;
}

function drawShrine(ctx, camera, tick = 0){
  const x = SHRINE.x - camera.x;
  const y = SHRINE.y - camera.y;
  const pulse = 24 + Math.sin(tick * 0.06) * 2;

  ctx.fillStyle = "rgba(92,75,45,.78)";
  ctx.beginPath();
  ctx.arc(x, y + 6, 28, 0, Math.PI*2);
  ctx.fill();

  ctx.strokeStyle = "rgba(164,133,72,.42)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(x, y + 2, pulse, 0, Math.PI*2);
  ctx.stroke();

  ctx.fillStyle = SHRINE.activated ? "rgba(244,210,132,.95)" : "rgba(196,174,126,.72)";
  ctx.beginPath();
  ctx.arc(x, y - 2, 10, 0, Math.PI*2);
  ctx.fill();
}

function canInteractWithShrine(player){
  return !SHRINE.activated && Math.hypot(player.x - SHRINE.x, player.y - SHRINE.y) < 58;
}
