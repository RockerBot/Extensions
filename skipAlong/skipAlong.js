const SKIPABLES = ["ytp-ad-skip-button ytp-button", "ytp-ad-skip-button-modern ytp-button"];
var stalled = false;

const observer = new MutationObserver(function(mutations) {
    browser.storage.local.get(['skipAlong_enabled'], (result) => {
        if(!result.skipAlong_enabled) return;
        
        handleID("player-ads");
        handleID("masthead-ad");
        handleTagName("ytd-ad-slot-renderer");
        for (let mutation of mutations) {
            const mutated_class = mutation.target.className;
            if ( (typeof(mutated_class) != "string") || !mutated_class.includes("ad") ) continue;

            for (const skip_class_name of SKIPABLES) {
                const elements = document.getElementsByClassName(skip_class_name);
                if (elements.length === 0) continue;
                elements[0].click();
                return;
            }
            if(
                mutated_class.includes("ytp-ad-persistent-progress-bar") && 
                !mutated_class.includes("ytp-ad-persistent-progress-bar-container") &&
                mutation.target.style &&
                mutation.target.style.width.replace("%", "") - 0 < 80
            ){
                for (const vid of document.getElementsByTagName("video")) {
                    if(!vid.className.includes("video-stream") || !vid.className.includes("html5-main-video")) continue;
                    if(!vid.duration) continue;
                    if(stalled) return;

                    stalled = true;

                    new_play_rate = vid.duration * 0.1; // max two seconds of ad time, (1-vid.duration*0.8)/2
                    if(new_play_rate > 1) vid.playbackRate = new_play_rate 
                    vid.currentTime = vid.duration //* 0.8; //80% skip
                    
                    setTimeout(()=>stalled = false, 3000);
                    return;
                }
            }
        }
    });
});

observer.observe(document.body, { childList: true, subtree: true, attributes: true });

function handleID(id){
    elm = document.getElementById(id);
    if(elm !== null) elm.remove();
}
function handleTagName(tagname){
    for(elem of document.getElementsByTagName(tagname))
        elem.remove();
}