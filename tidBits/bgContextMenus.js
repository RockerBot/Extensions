browser.contextMenus.create({
    id: "tidbits_contextmenu_speak",
    title: "Talk to me",
    contexts: ["selection"],
    icons: {
        48: "/icons/megaphone.png"
    }
});
browser.contextMenus.create({
    id: "tidbits_contextmenu_chup",
    title: "Please stop talking",
    contexts: ["all"],
    icons: {
        48: "/icons/megaphoneOutline.png"
    }
});

browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "tidbits_contextmenu_speak") {
        browser.tabs.sendMessage(tab.id, { 
            action: "tidbits_speakText", 
            selectedText: info.selectionText, 
            menuItemId: info.menuItemId 
        });
        // browser.contextMenus.update(info.menuItemId, {title: "Please stop talking" });
    }else if(info.menuItemId === "tidbits_contextmenu_chup"){
        browser.tabs.sendMessage(tab.id, { 
            action: "tidbits_stopSpeaking", 
            selectedText: info.selectionText, 
            menuItemId: info.menuItemId 
        });
        
    }
});