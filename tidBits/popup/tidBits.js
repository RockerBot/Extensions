const STORAGE_TABS = 'tidBits_tabs';
const URL_CS = "https://www.youtube.com/@CaptainSparklez2/videos";
const URL_GPT = "https://chatgpt.com/";
const URL_DISC = "https://discord.com/channels/";

const IDs_toglable = ['shorts', 'pesu', 'qstk', 'portal'];
//IDS are shorts pesu restore cs2
function id2key(id){ return "tidBits_" + id + "_enabled"; }
function handleStartup(res, id){
    document.getElementById(id).className += (!!res[id2key(id)])?"":"disabled";
}

for(let id of IDs_toglable) {
    key = id2key(id);
    browser.storage.local.get( [key], res => handleStartup(res, id) );
}

document.addEventListener("click", e => {
    const classNames = e.target.className
    if(!classNames.includes("Clickable") )return;
    if(classNames.includes("Toglable") )handleToglable(e.target);
    else handleOtherClickable(e.target);
});

document.addEventListener("contextmenu", e => {
    console.log(window.innerWidth)
    const classNames = e.target.className;
    if(!classNames.includes("Clickable") )return;
    var obj = { type: 'popup' };
    switch(e.target.id){
        case "shorts":return;break;
        case "pesu":return;break;
        case "restore":
            obj.width = 400;
            obj.height = 600;
            obj.url = "restore/popup_restore.html"
            break;
        case "cs2":return;break;
        case "chatty":return;break;
        case "disc":return;break;
        case "debug":return;break;
        case "portal":
            obj.width = 220;
            obj.height = 180;
            obj.url = "portal/popup_portal.html"
            break;
        default: console.log(e, "ERR");return;
    }
    console.log("T and C", e);
    browser.windows.create(obj);
});

function handleToglable(targ){
    targ.classList.toggle("disabled")
    key = id2key(targ.id);
    browser.storage.local.get([key], (result) => {
        let obj = {};
        obj[key] = !result[key];
        browser.storage.local.set(obj);
    });
}
function handleOtherClickable(targ){
    if( targ.id === 'restore'){
        browser.storage.local.get([STORAGE_TABS], (result) => {
            if(!result[STORAGE_TABS])return;
            const obj = {};
            obj[STORAGE_TABS] = undefined;
            browser.storage.local.set(obj)
            for (tabId in result[STORAGE_TABS]){
                tabUrl = result[STORAGE_TABS][tabId]
                browser.tabs.create({ url: tabUrl }).catch(e=>console.log('ErR',e))
            }
        });
    }else if(targ.id === 'cs2'){
        browser.tabs.query({ url: URL_CS })
        .then(tabList=>{
            if (tabList.length > 0) browser.tabs.update( tabList[0].id,{active: true})
            else browser.tabs.create({
                active: true,
                url: URL_CS,
            });
        });
    }else if(targ.id === 'chatty'){
        browser.tabs.query({ url:`${URL_GPT}*`})// ({ url:"https://chat.openai.com/" })
        .then(tabList=>{
            if (tabList.length > 0) browser.tabs.update( tabList[0].id,{active: true})
            else browser.tabs.create({
                active: true,
                url: URL_GPT, // "https://chat.openai.com/",
            });
        });
    }else if(targ.id === 'disc'){
        browser.tabs.query({ url: `${URL_DISC}*` })
        .then(tabList=>{
            if (tabList.length > 0) browser.tabs.update( tabList[0].id,{active: true})
            else browser.tabs.create({
                active: true,
                url: `${URL_DISC}@me`,
            });
        });
    }else if(targ.id === 'debug'){
        browser.tabs.query({ title:"Debugging - Runtime / this-firefox" })
        .then(tabList=>{
            if (tabList.length >0) browser.tabs.update( tabList[0].id,{active: true})
            else {
                browser.tabs.create({
                    active: true,
                    url:"about:blank",
                });
                navigator.clipboard.writeText("about:debugging#/runtime/this-firefox").then(function(){})
                .catch(function (error){ console.error("Error copying text to clipboard: " + error); });
            }
        });
    }
}