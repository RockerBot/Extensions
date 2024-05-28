const ICON_INVIS_ON = 'icons/invisbg.png';
const ICON_INVIS_OFF = 'icons/invisbgGrey.png';

const ID_IMGVIEWER = 'Sva75c';
const ID_CLR = 'tidbits_clr';
const ID_BG_BTN = 'tidbits_bg_btn';
const CLS_BG = 'tidBits_bg';

function toggleBg(){
    var imgs = document
    .getElementById(ID_IMGVIEWER)
    .getElementsByTagName('img')
    
    for(let img of imgs){
        let imgc = img.className;
        if(imgc.includes("sFlh5c")&&imgc.includes("iPVvYb")){
            img.classList.toggle(CLS_BG)
            var pic = document.getElementById(ID_CLR)
            if(img.className.includes(CLS_BG)){
                img.style.backgroundImage=null;
                pic.src = browser.runtime.getURL(ICON_INVIS_ON);
            }else{
                img.style.backgroundImage="none";
                pic.src = browser.runtime.getURL(ICON_INVIS_OFF);
            }
        }
    }
}

function setup(){
    const elem = document.getElementById(ID_IMGVIEWER);
    if(!elem)return;
    const subelem = elem.getElementsByClassName("tvh9oe BIB1wf")[0];
    if(!subelem)return;
    const buttons = subelem.getElementsByTagName("button");
    if(buttons.length<5)return;
    const button = buttons[4];
    if(button.className.includes("hmm"))return;

    bgbtn = document.createElement("button");
    bgbtn.id = ID_BG_BTN;
    bgbtn.addEventListener("click",toggleBg);

    var pic=document.createElement("img");
    pic.src = browser.runtime.getURL(ICON_INVIS_OFF);
    pic.id = ID_CLR;
    bgbtn.appendChild(pic);

    button.parentElement.parentElement.parentElement.parentElement.appendChild(bgbtn);
    button.classList.toggle("hmm");
}


const utube_observer = new MutationObserver(function(mutations) {
    try{ setup() }
    catch (e){ console.log(e) }
});  
utube_observer.observe(document.body, { childList: true, subtree: true });