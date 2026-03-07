function drawLighting(ctx, camera, player){
  const px = player.x - camera.x;
  const py = player.y - camera.y;
  const radius = 360;

  ctx.save();
  ctx.fillStyle = "rgba(4, 7, 10, .18)";
  ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);

  const bloom = ctx.createRadialGradient(px, py, 12, px, py, radius * 0.9);
  bloom.addColorStop(0, "rgba(245, 198, 110, .16)");
  bloom.addColorStop(0.45, "rgba(245, 198, 110, .08)");
  bloom.addColorStop(1, "rgba(245, 198, 110, 0)");
  ctx.fillStyle = bloom;
  ctx.beginPath();
  ctx.arc(px, py, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalCompositeOperation = "destination-out";
  const grad = ctx.createRadialGradient(px, py, 36, px, py, radius);
  grad.addColorStop(0, "rgba(0,0,0,.88)");
  grad.addColorStop(.65, "rgba(0,0,0,.34)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(px, py, radius, 0, Math.PI*2);
  ctx.fill();

  ctx.restore();
}
