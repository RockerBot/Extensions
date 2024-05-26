const waitTime = 1000;

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

browser.runtime.onMessage.addListener(message => {
    if (message.action === "pesuTab") {
        const elem1 = message.subj - 0x0;
        const elem2 = message.unit - 0x0;
        const elem3 = message.type - 0x0;
        const ndx   = message.ndx  - 0x0 || 0;
        if (ndx >= message.topic_count)
            return;

        browser.tabs.create({ url: "https://www.pesuacademy.com/Academy/s/studentProfilePESU", active: false }).then((tab) => {
            const codeToExecute = `
            function removeFluff(){
                for (i of document.getElementsByClassName("menu-left")) {
                    i.parentNode.removeChild(i);
                }
            
                anElem = document.getElementById("pge_menu");
                if(anElem) anElem.parentNode.removeChild(anElem);
            
                anElem = document.getElementsByClassName("content-wrapper")[0];
                if(anElem) anElem.style.padding="0px";
            
                anElem = document.getElementById("StudentProfilePESUContent");
                if(anElem) anElem.className='';
            }
            
            function expandView(){
                lnks = document.getElementsByClassName("link-preview");
                for(lnk of lnks)
                    lnk.children[0].click();
            
                frames = document.getElementsByTagName("iframe");
                for (frame of frames)
                    frame.height = window.screen.height;

                document.title="${ndx + 1} ";
                if (lnks.length > 1){
                    document.title += "(" + lnks.length + " SlideShows)"
                }
            }
            
            function goToTopic(){
                e3 = document.getElementById("CourseContentId")
                if(!e3||!e3.children[0]||!e3.children[0].children[1])return;
                clearInterval(i2);
            
                e3.children[0].children[1]
                .children[0].children[1]
                .children[${ndx}].children[${elem3}].children[0].click();


                browser.runtime.sendMessage({
                    action: "pesuTab",
                    subj: "${message.subj}",
                    unit: "${message.unit}",
                    topic_count: "${message.topic_count}",
                    type: "${message.type}",
                    ndx: "${ndx + 1}",
                });

                removeFluff();
                setTimeout( () => { expandView() }, 2000 );
            }
            
            function goToUnit(){
                document.body.innerHTML += "<a id='tidbits_clicker2' onclick=\\"handleclassUnit('${elem2}')\\"></a>";
                e2 = document.getElementById("tidbits_clicker2");
                clearInterval(i1);
                e2.click();
            
                //while(!document.getElementsByClassName('cmc_breadcrum').length);
                i2 = setInterval( goToTopic, 2000 );
            }
            
            function startUp(){
                clearTimeout(t1);
                if (document.getElementsByClassName("blockUI blockOverlay").length) {
                    t1 = setTimeout(startUp, 1000);
                    return;
                }
                document.body.innerHTML += "<a id='tidbits_clicker1' onclick=\\"courseContentinfo('${elem1}')\\"></a>";
                e1 = document.getElementById("tidbits_clicker1");
                e1.click();
                
                i1 = setInterval( goToUnit, 2000 );
            }
            var t1 = setTimeout(startUp, 1000);
            `;
            setTimeout(()=>{
                browser.tabs.executeScript(tab.id, { code: codeToExecute }).then(() => {
                    console.log("Code successfully executed in the new tab");
                });
            },waitTime);
        });
    }else if(message.action === ""){
        
    }
});

browser.omnibox.setDefaultSuggestion({
    description: "about:debugging#/runtime/this-firefox"
});

browser.omnibox.onInputStarted.addListener(() => {
    console.log("User has started interacting with me.");
});

browser.omnibox.onInputEntered.addListener((text, disposition) => {
    switch(text.toLowerCase()){
        default:;
        case "debug":
            navigator.clipboard
            .writeText("about:debugging#/runtime/this-firefox")
            .then(function(){})
            .catch(function (error){ console.error("Error copying text to clipboard: " + error); });
            break;
    }
    console.log(text,disposition);
});

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