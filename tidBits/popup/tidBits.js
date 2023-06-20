const IDs_toglable = ['shorts', 'pesu', 'portal']
function id2key(id){ return "tidBits_" + id + "_enabled"; }
function handleStartup(res, id){
    document.getElementById(id).className += (!!res[id2key(id)])?"":"disabled";
    console.log(res,document.getElementById(id))
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
        browser.storage.local.get(['tidBits_tabs'], (result) => {
            if(!result.tidBits_tabs)return;
            browser.storage.local.set({ tidBits_tabs: undefined})
            for (tabId in result.tidBits_tabs){
                tabUrl = result.tidBits_tabs[tabId]
                // console.log("tabs  -URL", tabUrl);
                browser.tabs.create({ url:tabUrl }).catch(e=>console.log('ErR',e))
            }
        });
    }
    else if(targ.id === 'cs2'){
        browser.tabs.query({ url:"https://www.youtube.com/@CaptainSparklez2/videos" })
        .then(tabList=>{
            if (tabList.length >0) browser.tabs.update( tabList[0].id,{active: true})
            else browser.tabs.create({
                active: true,
                url:"https://www.youtube.com/@CaptainSparklez2/videos",
            });
        });
    }
}