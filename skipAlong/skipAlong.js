const observer = new MutationObserver(function(mutations) {
    browser.storage.local.get(['skipAlong_enabled'], (result) => {
        if(!result.skipAlong_enabled)return;
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