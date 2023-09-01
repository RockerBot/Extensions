browser.tabs.onUpdated.addListener((tabId, changeInfo, tabInfo)=>{
    if (changeInfo.url === undefined)return;
    browser.storage.local.get(['tidBits_tabs'], (res) => {
        var obj = (res.tidBits_tabs !== undefined)?res.tidBits_tabs : {};
        obj[tabId] = changeInfo.url;
        browser.storage.local.set({ tidBits_tabs: obj})
    });
});
browser.tabs.onRemoved.addListener((tabId, removeInfo)=>{
    if(removeInfo.isWindowClosing)return;
    browser.storage.local.get(['tidBits_tabs'], (res) => {
        if(!res.tidBits_tabs)return;
        var obj = res.tidBits_tabs;
        delete obj[tabId];
        browser.storage.local.set({ tidBits_tabs: obj})
    });
});