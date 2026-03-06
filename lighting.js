
function drawLighting(ctx, camera, player){
  const px = player.x - camera.x;
  const py = player.y - camera.y;

  const radius = 320; // increased lantern radius

  ctx.save();

  // lighter darkness so environment is visible
  ctx.fillStyle = "rgba(4, 7, 10, .35)";
  ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);

  ctx.globalCompositeOperation = "destination-out";

  const grad = ctx.createRadialGradient(px, py, 40, px, py, radius);
  grad.addColorStop(0, "rgba(0,0,0,.95)");
  grad.addColorStop(.6, "rgba(0,0,0,.55)");
  grad.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(px, py, radius, 0, Math.PI*2);
  ctx.fill();

  ctx.restore();
}
