var enabled = true;
chrome.storage.local.set({ skipAlong_enabled: true });
chrome.action.onClicked.addListener(function() {
    enabled=!enabled;
    chrome.action.setIcon({ path: { "48": `icons/speedButton${(enabled?"":"Grey")}.png` } });
    chrome.storage.local.set({ skipAlong_enabled: enabled });
});