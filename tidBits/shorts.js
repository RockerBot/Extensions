console.log("running", new Date())
const shorts_observer = new MutationObserver(function(mutations) {
    browser.storage.local.get(['tidBits_enabled'], (result) => {
        for (elem of document.getElementsByClassName("tidBits-float"))
        elem.classList.toggle("tidBits-hidden")
    });
});  
shorts_observer.observe(document.body, { childList: true});
document.addEventListener("keydown", e=>{
    console.log(e.key)
    browser.storage.local.get(['tidBits_enabled'], (result) => {
        if(e.key=="ArrowDown" || e.key=="ArrowUp"){
            if(window.confirm('click yes to leave')){
                e.preventDefault()
                el = document.querySelector('[title="Subscriptions"]')
                console.log("HMMMMMMMMM", el)
                if(el !==null){
                    window.location = el.getAttribute("href");
                }
            }
        }
    });
});
browser.storage.local.get(['tidBits_enabled'], (result) => {
    content = document.getElementById("content")
    warn = document.createElement("div")
    warn.id = "tidBits-warn";
    warn.innerHTML = '<div class="tidBits-float tidBits-hidden"> GO BACK TO NORMAL YOUTUBE</div><div class="tidBits-float"> STOP SHORTS</div>'
    content.insertBefore(warn,content.children[0])
});