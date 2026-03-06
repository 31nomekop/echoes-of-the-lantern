const ECHOES = [
  { id: "glow-wisp", name: "Glow Wisp", type: "wisp", discovered: false, x: 1100, y: 780 }
];

function resetEchoes(){
  ECHOES.forEach(e => e.discovered = false);
}

function drawEchoes(ctx, camera, tick = 0){
  ECHOES.forEach(e => {
    if(e.discovered) return;
    const x = e.x - camera.x;
    const y = e.y - camera.y + Math.sin(tick * 0.05) * 4;
    const pulse = 8 + Math.sin(tick * 0.07) * 2;

    ctx.fillStyle = "rgba(244, 210, 132, .18)";
    ctx.beginPath();
    ctx.arc(x, y, pulse + 10, 0, Math.PI*2);
    ctx.fill();

    ctx.fillStyle = "rgba(244, 210, 132, .92)";
    ctx.beginPath();
    ctx.arc(x, y, pulse, 0, Math.PI*2);
    ctx.fill();
  });
}

function checkEchoDiscovery(player, onDiscover){
  ECHOES.forEach(e => {
    if(e.discovered) return;
    const d = Math.hypot(player.x - e.x, player.y - e.y);
    if(d < 28){
      e.discovered = true;
      if(onDiscover) onDiscover(e);
    }
  });
}
