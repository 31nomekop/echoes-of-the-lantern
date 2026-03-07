
const canvas=document.getElementById("game");
const ctx=canvas.getContext("2d");

canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

let camera={x:0,y:0};

generateWorld();

canvas.addEventListener("click",e=>{
PLAYER.tx=e.clientX+camera.x;
PLAYER.ty=e.clientY+camera.y;
});

function loop(){

updatePlayer();
updateCompanion(PLAYER);

checkEcho(PLAYER);
checkShrine(PLAYER);

camera.x=PLAYER.x-canvas.width/2;
camera.y=PLAYER.y-canvas.height/2;

drawWorld(ctx,camera);
drawShrine(ctx,camera);
drawEcho(ctx,camera);
drawCompanion(ctx,camera);
drawPlayer(ctx,camera);
drawLighting(ctx,camera,PLAYER);

requestAnimationFrame(loop);
}

loop();
