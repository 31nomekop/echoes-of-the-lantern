
const PLAYER={x:1000,y:1100,tx:1000,ty:1100,speed:2.2};

function updatePlayer(){
const dx=PLAYER.tx-PLAYER.x;
const dy=PLAYER.ty-PLAYER.y;
const dist=Math.hypot(dx,dy);
if(dist>1){
PLAYER.x+=dx/dist*PLAYER.speed;
PLAYER.y+=dy/dist*PLAYER.speed;
}
}

function drawPlayer(ctx,camera){
const x=PLAYER.x-camera.x;
const y=PLAYER.y-camera.y;

ctx.fillStyle="rgba(245,198,110,.35)";
ctx.beginPath();
ctx.arc(x+10,y,28,0,Math.PI*2);
ctx.fill();

ctx.fillStyle="#000";
ctx.beginPath();
ctx.arc(x,y-10,9,0,Math.PI*2);
ctx.fill();
ctx.fillRect(x-8,y-3,16,28);

ctx.fillStyle="#f3c56f";
ctx.beginPath();
ctx.arc(x+10,y,6,0,Math.PI*2);
ctx.fill();
}
