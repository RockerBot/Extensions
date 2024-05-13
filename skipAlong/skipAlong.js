const SKIPABLES = ["ytp-ad-skip-button ytp-button", "ytp-ad-skip-button-modern ytp-button", "ytp-skip-ad-button"];
var stalled = false;
var percentage = 80;
var airtime = 2;
const observer = new MutationObserver(function(mutations) {
        handleID("player-ads");
        handleID("masthead-ad");
        handleTagName("ytd-ad-slot-renderer");
        for (let mutation of mutations) {
            const mutated_class = mutation.target.className;
            if ( (typeof(mutated_class) != "string") || !mutated_class.includes("ad") ) continue;

            browser.storage.local.get(['skipAlong_skip_enabled'], (result) => {
                if(!result.skipAlong_skip_enabled) return;
                handleSkipable();
            });

            if(
                mutated_class.includes("ytp-ad-persistent-progress-bar") && 
                !mutated_class.includes("ytp-ad-persistent-progress-bar-container") &&
                mutation.target.style &&
                mutation.target.style.width.replace("%", "") - 0 < percentage
            ){
                browser.storage.local.get(['skipAlong_unskip_enabled'], (result) => {
                    if(!result.skipAlong_unskip_enabled) return;
                    browser.storage.local.get(['skipAlong_skip_percent'], (res1) => {
                        percentage = res1.skipAlong_skip_percent;
                    });
                    browser.storage.local.get(['skipAlong_ad_time'], (res2) => {
                        airtime = res2.skipAlong_ad_time;
                    });
                    handleUnSkipable();
                });
            }
        }
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

function handleSkipable(){
    for (const skip_class_name of SKIPABLES) {
        const elements = document.getElementsByClassName(skip_class_name);
        if (elements.length === 0) continue;
        elements[0].click();
        return;
    }
    for (const btn of document.getElementsByTagName('button')){
        if (btn.innerText == 'Skip' && (btn.className + " " + btn.id).includes('ad')){
            btn.click();
            return;
        }
    }
}

function handleUnSkipable(){
    for (const vid of document.getElementsByTagName("video")) {
        if(!vid.className.includes("video-stream") || !vid.className.includes("html5-main-video")) continue;
        if(!vid.duration) continue;
        if(stalled) return;

        stalled = true;
        
        new_play_rate = vid.duration * (1-percentage/100)/airtime; // max two seconds of ad time,vid.duration * (1-0.8)/2 =  0.1
        if(new_play_rate > 1) vid.playbackRate = new_play_rate 
        vid.currentTime = vid.duration * percentage/100; //* 0.8; //80% skip
        
        setTimeout(()=>stalled = false, 3000);
        return;
    }
}