enabled = true
browser.storage.local.set({ skipAlong_enabled: true });
window.addEventListener('load', function() {
    browser.browserAction.onClicked.addListener(function() {
        enabled=!enabled;
        browser.browserAction.setIcon({ path: { "48": `icons/speedButton${(enabled?"":"Grey")}.png` } });
        browser.storage.local.set({ skipAlong_enabled: enabled });
    });
});