const observer = new MutationObserver(function(mutations) {
    chrome.storage.local.get(['skipAlong_enabled'], (result) => {
        if(!result.skipAlong_enabled)return;
        handleID("player-ads")
        handleID("masthead-ad")
        handleTagName("ytd-ad-slot-renderer")
        for (let mutation of mutations) {
            if ( (typeof(mutation.target.className) == "string") && mutation.target.className.includes("ad") ){
                const elements = document.getElementsByClassName("ytp-ad-skip-button ytp-button");
                if (elements.length !==0) {
                    elements[0].click();
                    break;
                }
            }
        }
    });
});  
observer.observe(document.body, { childList: true, subtree: true, attributes: true });
function handleID(id){
    elm = document.getElementById(id)
    if(elm !== null) elm.remove();
}
function handleTagName(tagname){
    for(elem of document.getElementsByTagName(tagname))elem.remove();
}