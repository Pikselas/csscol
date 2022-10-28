
//injects all the necessary elements in the "AnimatedButton RotatingBorder" class

let ButtonWithRotatingBorder =  document.getElementsByClassName("AnimatedButton RotatingBorder")
for (let i = 0 ; i < ButtonWithRotatingBorder.length ; ++i)
{
    let InnerElem = ButtonWithRotatingBorder[i].innerHTML;
    ButtonWithRotatingBorder[i].innerHTML = "";
    let Anm = document.createElement("div");
    let ContentPanel = document.createElement("div");
    Anm.className = "bg-animation";
    ContentPanel.className = "content-panel"
    ContentPanel.innerHTML = InnerElem;
    ButtonWithRotatingBorder[i].appendChild(Anm);
    ButtonWithRotatingBorder[i].appendChild(ContentPanel);
}