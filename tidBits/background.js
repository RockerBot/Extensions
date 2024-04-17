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
    if (message.action === "openNewTab") {
        console.log(message)
        const waitTime = 1000;
        const elem1 = message.subj-0x0;
        const elem2 = message.unit-0x0;
        const elem3 = message.type-0x0;
        function openClass(ndx){
            clearTimeout(timer);
            if(++ndx > message.topic_count)return;
        
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
                    lnks = document.getElementsByClassName("link-preview");console.log(lnks)
                    for(lnk of lnks)
                        lnk.children[0].click();
                
                    frames = document.getElementsByTagName("iframe");console.log(frames)
                    for (frame of frames)
                        frame.height = window.screen.height;
                    return lnks.length;
                }
                
                function goToTopic(){
                    e3 = document.getElementById("CourseContentId")
                    if(!e3||!e3.children[0]||!e3.children[0].children[1])return;
                    clearInterval(i2);
                
                    e3.children[0].children[1]
                    .children[0].children[1]
                    .children[${ndx-1}].children[${elem3}].children[0].click();
                    
                    removeFluff();
                    
                    var n_links = 0;
                    setTimeout( () => { n_links = expandView() }, 2000 );
                
                    document.title="${ndx} " + (n_links?n_links:'');
                    console.log("Insertion script!!!!!!");
                }
                
                function goToUnit(){
                    document.body.innerHTML += "<a id='tidbits_clicker2' onclick=\\"handleclassUnit('${elem2}')\\"></a>";
                    e2 = document.getElementById("tidbits_clicker2");
                    console.log(". ...")
                    console.log(e2)
                    clearInterval(i1);
                    e2.click();
                
                    //while(!document.getElementsByClassName('cmc_breadcrum').length);
                    i2 = setInterval( goToTopic, 2000 );
                }
                
                while(document.getElementsByClassName("blockUI blockOverlay").length)console.log(":");
                document.body.innerHTML += "<a id='tidbits_clicker1' onclick=\\"courseContentinfo('${elem1}')\\"></a>";
                e1 = document.getElementById("tidbits_clicker1");
                console.log("..")
                console.log(e1)
                e1.click();
                
                i1 = setInterval( goToUnit, 2000 );
                `;
                setTimeout(()=>{
                    browser.tabs.executeScript(tab.id, { code: codeToExecute }).then(() => {
                        console.log("Code successfully executed in the new tab");
                        timer = setTimeout(openClass, waitTime, ndx);
                    });
                },3*1000);
            });
        }
        var timer = setTimeout(openClass, waitTime, 0);
    }else if(message.action === ""){
        
    }
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