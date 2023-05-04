// console.log("shorts", new Date())
const shorts_observer = new MutationObserver(function(mutations) {
    browser.storage.local.get(['tidBits_shorts_enabled'], (result) => {
        if(!result.tidBits_shorts_enabled)return;    
        for (elem of document.getElementsByClassName("tidBits-float"))
        elem.classList.toggle("tidBits-hidden")
    });
});  
shorts_observer.observe(document.body, { childList: true});
document.addEventListener("keydown", e=>{
    browser.storage.local.get(['tidBits_shorts_enabled'], (result) => {
        if(!result.tidBits_shorts_enabled)return;    
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
browser.storage.local.get(['tidBits_shorts_enabled'], (result) => {
    if(!result.tidBits_shorts_enabled)return;    
    content = document.getElementById("content")
    warn = document.createElement("div")
    warn.id = "tidBits-warn";
    warn.innerHTML = '<div class="tidBits-float tidBits-hidden"> GO BACK TO NORMAL YOUTUBE</div><div class="tidBits-float"> STOP SHORTS</div>'
    content.insertBefore(warn,content.children[0])
});