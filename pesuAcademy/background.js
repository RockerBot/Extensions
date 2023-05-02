enabled = true
browser.storage.local.set({ pesuAcademy_enabled: true });
reloadKeepAliveTimers(true);
window.addEventListener('load', function() {
    browser.browserAction.onClicked.addListener(function() {
        enabled=!enabled;
        browser.browserAction.setIcon({ path: { "48": `icons/GlobeTrotter${(enabled?"":"Grey")}.png` } });
        browser.storage.local.set({ pesuAcademy_enabled: enabled });
        reloadKeepAliveTimers(enabled);
    });
    browser.storage.local.onChanged.addListener(result=>{
        console.log(result);//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        if(result.pesuAcademy_running === undefined){console.log("Fail1", "not defined", result.pesuAcademy_running);return;}
        if(result.pesuAcademy_running.newValue){console.log("Fail2", "not defined", result.pesuAcademy_running.newValue);return;}
        reloadKeepAliveTimers(true);
    });
});
function reloadKeepAliveTimers(shouldReload){
    console.log("reload? ", shouldReload);//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    browser.tabs.query({ url: "*://*.pesuacademy.com/*" }).then(x=>{
        for (tab of x) browser.tabs.sendMessage(tab.id, {reload: shouldReload})
        console.log("TABS ", x);//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    }, x=>console.log("ERR", x));
}