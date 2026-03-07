
const SHRINE={x:1000,y:900,activated:false};

function drawShrine(ctx,camera){
const x=SHRINE.x-camera.x;
const y=SHRINE.y-camera.y;

ctx.fillStyle="rgba(180,160,110,.7)";
ctx.beginPath();
ctx.arc(x,y,18,0,Math.PI*2);
ctx.fill();

ctx.strokeStyle="rgba(245,198,110,.6)";
ctx.beginPath();
ctx.arc(x,y,30,0,Math.PI*2);
ctx.stroke();
}

function checkShrine(player){
if(SHRINE.activated) return;
const d=Math.hypot(player.x-SHRINE.x,player.y-SHRINE.y);

if(d<40){
if(confirm("Awaken the lantern shrine?")){
SHRINE.activated=true;
startQuiz();
}
}
}
