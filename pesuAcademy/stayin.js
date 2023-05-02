console.log("Stayin Hello", new Date())
var ticker
function keepAlive(){
    // sessionStorage.setItem("pesuAcademy_running", true);
    browser.storage.local.get(['pesuAcademy_running'], (result)=>{
        if(!result.pesuAcademy_running)
            browser.storage.local.set({ pesuAcademy_running: true });
    });
    elems = document.getElementsByClassName("user-info")
    if (elems.length !== 0){
        elems = elems[0].getElementsByClassName("dropdown-toggle")
        if(elems.length !== 0 ){
            elems[0].click()
            setTimeout(()=>elems[0].click(),50)
        }
    }
}
function runPesuCode(){
    browser.storage.local.get(['pesuAcademy_running'], (result)=>{
        if(!result.pesuAcademy_running){
            browser.storage.local.set({ pesuAcademy_running: true });
            if (ticker !== null)clearInterval(ticker);
            ticker = setInterval(keepAlive,30_000)
        }
    });
}
window.onbeforeunload = function() {
    browser.storage.local.set({pesuAcademy_running: false});
}
browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(request.reload === true) runPesuCode();
    else if(request.reload === false) {
        clearInterval(ticker);
        ticker = null
    }
});
runPesuCode();