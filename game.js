
const canvas=document.getElementById("c")
const ctx=canvas.getContext("2d")

let player={x:180,y:320,tx:180,ty:320}
let echoes=[]
let found=[]
const types=["Glow Slime","Lantern Moth","Rune Rabbit","Moss Turtle","Whisper Cat"]

function startGame(){
menu.style.display="none"
game.style.display="block"
}

function back(){
menu.style.display="block"
game.style.display="none"
archive.style.display="none"
settings.style.display="none"
credits.style.display="none"
}

function openArchive(){
menu.style.display="none"
archive.style.display="block"
renderArchive()
}

function openSettings(){
menu.style.display="none"
settings.style.display="block"
}

function openCredits(){
menu.style.display="none"
credits.style.display="block"
}

function spawn(){
let t=types[Math.floor(Math.random()*types.length)]
echoes.push({x:Math.random()*340+10,y:Math.random()*620+10,type:t})
}

for(let i=0;i<5;i++)spawn()

canvas.addEventListener("click",e=>{
const r=canvas.getBoundingClientRect()
let x=e.clientX-r.left
let y=e.clientY-r.top
player.tx=x
player.ty=y

echoes.forEach((e,i)=>{
let dx=x-e.x
let dy=y-e.y
if(Math.sqrt(dx*dx+dy*dy)<20){
if(!found.includes(e.type)){
found.push(e.type)
alert("Discovered "+e.type)
}
echoes.splice(i,1)
spawn()
}
})
})

function renderArchive(){
list.innerHTML=""
types.forEach(t=>{
let d=document.createElement("div")
d.textContent=found.includes(t)?t:"Unknown Echo"
list.appendChild(d)
})
}

function update(){
player.x+=(player.tx-player.x)*0.08
player.y+=(player.ty-player.y)*0.08
}

function draw(){
ctx.clearRect(0,0,canvas.width,canvas.height)
ctx.fillStyle="#7cf3a0"
ctx.beginPath()
ctx.arc(player.x,player.y,10,0,Math.PI*2)
ctx.fill()

echoes.forEach(e=>{
ctx.fillStyle="#ffd86b"
ctx.beginPath()
ctx.arc(e.x,e.y,8,0,Math.PI*2)
ctx.fill()
})
}

function loop(){
update()
draw()
requestAnimationFrame(loop)
}
loop()
