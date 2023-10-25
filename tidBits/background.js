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
browser.runtime.onMessage.addListener((message) => {
    if (message.action === "openNewTab") {
        console.log(message)
        const elem1 = message.subj-0x0
        const elem2 = message.unit-0x0
        const elem3 = message.type-0x0
        i=0;
        timer = setInterval(()=>{
            if(i>=message.topic_count){
                clearInterval(timer);
                return;
            }
            browser.tabs.create({ url: "https://www.pesuacademy.com/Academy/s/studentProfilePESU", active: false }).then((tab) => {
                const codeToExecute = `
                document.body.innerHTML += "<a id='tidbits_clicker1' onclick=\\"courseContentinfo('${elem1}')\\"></a>";
                document.getElementById("tidbits_clicker1").click();
                i1 = setInterval(()=>{
                    document.body.innerHTML += "<a id='tidbits_clicker2' onclick=\\"handleclassUnit('${elem2}')\\"></a>";
                    e1 = document.getElementById("tidbits_clicker2")
                    if(!e1)return;
                    clearInterval(i1);
                    e1.click();
                    i2 = setInterval(()=>{
                        e2 = document.getElementById("CourseContentId")
                        if(!e2||!e2.children[0]||!e2.children[0].children[1])return;
                        clearInterval(i2);
                        e2.children[0].children[1].children[0].children[1].children[${i-1}].children[${elem3}].children[0].click();
                        
                        for (i of document.getElementsByClassName("menu-left")) i.parentNode.removeChild(i);
                        anElem = document.getElementById("pge_menu");
                        if(anElem) anElem.parentNode.removeChild(anElem);

                        anElem = document.getElementsByClassName("content-wrapper")[0];
                        if(anElem) anElem.style.padding="0px";

                        anElem = document.getElementById("StudentProfilePESUContent");
                        if(anElem) anElem.className='';

                        if(document.getElementsByClassName("link-preview")[0]) document.title="Download SLIDE${i}";
                        else document.title="${i}";
                        console.log("Insertion script!!!!!!");
                    },2000)
                },2000);
                `;
                setTimeout(()=>{
                    browser.tabs.executeScript(tab.id, { code: codeToExecute }).then(() => {
                        console.log("Code successfully executed in the new tab");
                    });
                },7*1000);
            });
            i+=1;
        },20*1000)
    }
  });