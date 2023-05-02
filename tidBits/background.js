enabled = true
browser.storage.local.set({ tidBits_enabled: true });
window.addEventListener('load', function() {
    browser.browserAction.onClicked.addListener(function() {
        enabled=!enabled;
        browser.browserAction.setIcon({ path: { "48": `icons/burn${(enabled?"":"Grey")}.png` } });
        browser.storage.local.set({ tidBits_enabled: enabled });
    });
});