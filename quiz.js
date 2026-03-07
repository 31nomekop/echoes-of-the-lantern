function buildStoryButton(label, onClick, primary = false){
  const btn = document.createElement("button");
  btn.className = "story-btn" + (primary ? " primary" : "");
  btn.textContent = label;
  btn.onclick = onClick;
  return btn;
}
