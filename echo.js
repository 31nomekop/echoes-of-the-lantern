
const ECHO={x:1000,y:700,found:false};

function drawEcho(ctx,camera){
if(ECHO.found) return;
ctx.fillStyle="rgba(244,210,132,.9)";
ctx.beginPath();
ctx.arc(ECHO.x-camera.x,ECHO.y-camera.y,10,0,Math.PI*2);
ctx.fill();
}

function checkEcho(player){
const d=Math.hypot(player.x-ECHO.x,player.y-ECHO.y);
if(d<30 && !ECHO.found){
ECHO.found=true;
alert("Echo discovered: Glow Wisp");
}
}
