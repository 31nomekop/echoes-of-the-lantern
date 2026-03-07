
const COMPANION={active:false,x:0,y:0};

function spawnCompanion(x,y){
COMPANION.active=true;
COMPANION.x=x;
COMPANION.y=y;
}

function updateCompanion(player){
if(!COMPANION.active) return;

const dx=player.x-COMPANION.x;
const dy=player.y-COMPANION.y;
const dist=Math.hypot(dx,dy);

if(dist>50){
COMPANION.x+=dx/dist*1.8;
COMPANION.y+=dy/dist*1.8;
}
}

function drawCompanion(ctx,camera){
if(!COMPANION.active) return;

ctx.fillStyle="rgba(244,210,132,.8)";
ctx.beginPath();
ctx.arc(COMPANION.x-camera.x,COMPANION.y-camera.y,8,0,Math.PI*2);
ctx.fill();
}
