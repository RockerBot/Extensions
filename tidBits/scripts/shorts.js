const STORAGE_SHORTS = 'tidBits_shorts_enabled';
const ID_WARN = 'tidBits-warn';
const CLS_FLOAT = 'tidBits-float';
const CLS_HIDDEN = 'tidBits-float';

const shorts_observer = new MutationObserver(function(mutations) {
    browser.storage.local.get([STORAGE_SHORTS], (result) => {
        if(!result[STORAGE_SHORTS])return;    
        for (elem of document.getElementsByClassName(CLS_FLOAT))
        elem.classList.toggle(CLS_HIDDEN)
    });
});  
shorts_observer.observe(document.body, { childList: true});
document.addEventListener("keydown", e=>{
    browser.storage.local.get([STORAGE_SHORTS], (result) => {
        if(!result[STORAGE_SHORTS])return;    
        if(e.key=="ArrowDown" || e.key=="ArrowUp"){
            if(window.confirm('click yes to leave')){
                e.preventDefault()
                el = document.querySelector('[title="Subscriptions"]')
                if(el !==null){
                    window.location = el.getAttribute("href");
                }
            }
        }
    });
});
browser.storage.local.get([STORAGE_SHORTS], (result) => {
    if(!result[STORAGE_SHORTS])return;    
    content = document.getElementById("content")
    warn = document.createElement("div")
    warn.id = ID_WARN;
    warn.innerHTML = `
    <div class="${CLS_FLOAT} ${CLS_HIDDEN}">
        GO BACK TO NORMAL YOUTUBE
    </div>
    <div class="${CLS_FLOAT}">
        STOP SHORTS
    </div>`
    content.insertBefore(warn,content.children[0])
});