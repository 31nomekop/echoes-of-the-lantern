
const WORLD={width:2000,height:1600,trees:[]};

function generateWorld(){
WORLD.trees=[];
for(let i=0;i<70;i++){
WORLD.trees.push({x:Math.random()*WORLD.width,y:Math.random()*WORLD.height,r:20+Math.random()*20});
}
}

function drawWorld(ctx,camera){
ctx.fillStyle="#18313c";
ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);

WORLD.trees.forEach(t=>{
ctx.fillStyle="rgba(15,45,38,.9)";
ctx.beginPath();
ctx.arc(t.x-camera.x,t.y-camera.y,t.r,0,Math.PI*2);
ctx.fill();
});
}
