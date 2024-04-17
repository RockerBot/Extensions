function toggleBg(){
    var imgs = document
    .getElementById("Sva75c")
    .getElementsByTagName('img')
    
    for(let img of imgs){
        let imgc = img.className;
        if(imgc.includes("sFlh5c")&&imgc.includes("iPVvYb")){
            img.classList.toggle("tidBits_bg")
            var pic = document.getElementById("tidbits_clr")
            if(img.className.includes("tidBits_bg")){
                img.style.backgroundImage=null;
                pic.src = browser.runtime.getURL("icons/invisbg.png");
            }else{
                img.style.backgroundImage="none";
                pic.src = browser.runtime.getURL("icons/invisbgGrey.png");
            }
        }
    }
}

function setup(){
    const elem = document.getElementById("Sva75c");
    if(!elem)return;
    const subelem = elem.getElementsByClassName("tvh9oe BIB1wf hVa2Fd")[0];
    if(!subelem)return;
    const buttons = subelem.getElementsByTagName("button");
    if(buttons.length<5)return;
    const button = buttons[4];
    if(button.className.includes("hmm"))return;

    bgbtn = document.createElement("button");
    bgbtn.id="tidbits_bg_btn";
    bgbtn.addEventListener("click",toggleBg);

    var pic=document.createElement("img");
    pic.src = browser.runtime.getURL("icons/invisbgGrey.png");
    pic.id = "tidbits_clr";
    bgbtn.appendChild(pic);

    button.parentElement.parentElement.parentElement.parentElement.appendChild(bgbtn);
    button.classList.toggle("hmm");
}


const utube_observer = new MutationObserver(function(mutations) {
    try{ setup() }
    catch (e){ console.log(e) }
});  
utube_observer.observe(document.body, { childList: true, subtree: true });