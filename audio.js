
const AudioSystem={
menu:new Audio("menu-theme.wav"),
forest:new Audio("forest-ambience.wav"),
hum:new Audio("lantern-hum.wav"),
chime:new Audio("glow-wisp-chime.wav"),
started:false,
init(){
this.menu.loop=true;
this.forest.loop=true;
this.hum.loop=true;
this.menu.volume=.4;
this.forest.volume=.5;
this.hum.volume=.25;
document.addEventListener("DOMContentLoaded",()=>{
setTimeout(()=>this.playMenu(),500);
this.watchGameStart();
});
},
playMenu(){
try{this.menu.play()}catch(e){}
},
startForest(){
this.menu.pause();
try{this.forest.play();this.hum.play()}catch(e){}
},
playChime(){
try{this.chime.currentTime=0;this.chime.play()}catch(e){}
},
watchGameStart(){
const observer=new MutationObserver(()=>{
const game=document.getElementById("gameWrap");
if(game && !game.classList.contains("hidden") && !this.started){
this.started=true;
this.startForest();
}
});
observer.observe(document.body,{subtree:true,attributes:true});
}
};
AudioSystem.init();
