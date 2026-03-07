
function drawLighting(ctx,camera,player){
const px=player.x-camera.x;
const py=player.y-camera.y;
const radius=360;

ctx.save();
ctx.fillStyle="rgba(0,0,0,.18)";
ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);

ctx.globalCompositeOperation="destination-out";

const grad=ctx.createRadialGradient(px,py,40,px,py,radius);
grad.addColorStop(0,"rgba(0,0,0,.9)");
grad.addColorStop(.6,"rgba(0,0,0,.4)");
grad.addColorStop(1,"rgba(0,0,0,0)");

ctx.fillStyle=grad;
ctx.beginPath();
ctx.arc(px,py,radius,0,Math.PI*2);
ctx.fill();

ctx.restore();
}
