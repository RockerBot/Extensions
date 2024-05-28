const STARTSPEAK_ID = 'tidbits_contextmenu_speak';
const ACTION_STARTSPEAK = 'tidbits_speakText';
const STOPSPEAK_ID = 'tidbits_contextmenu_chup';
const ACTION_STOPSPEAK = 'tidbits_stopSpeaking';
const ICON_SPEAK_ON = "/icons/megaphone.png";
const ICON_SPEAK_OFF = "/icons/megaphoneOutline.png";

browser.contextMenus.create({
    id: STARTSPEAK_ID,
    title: "Talk to me",
    contexts: ["selection"],
    icons: {
        48: ICON_SPEAK_ON
    }
});
browser.contextMenus.create({
    id: STOPSPEAK_ID,
    title: "Please stop talking",
    contexts: ["all"],
    icons: {
        48: ICON_SPEAK_OFF
    }
});

browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === STARTSPEAK_ID) {
        browser.tabs.sendMessage(tab.id, { 
            action: ACTION_STARTSPEAK, 
            selectedText: info.selectionText, 
            menuItemId: info.menuItemId 
        });
        // browser.contextMenus.update(info.menuItemId, {title: "Please stop talking" });
    }else if(info.menuItemId === STOPSPEAK_ID){
        browser.tabs.sendMessage(tab.id, { 
            action: ACTION_STOPSPEAK, 
            selectedText: info.selectionText, 
            menuItemId: info.menuItemId 
        });
        
    }
});
