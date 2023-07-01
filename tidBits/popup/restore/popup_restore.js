browser.storage.local.get(["tidBits_restore_enabled"], (result) => {
    if(!result.tidBits_restore_enabled)return;
    let obj = {};
    // obj[key] = !result[key];
    // browser.storage.local.set(obj);
});
browser.storage.local.get(['tidBits_tabs'], (res) => {
    var obj = (res.tidBits_tabs !== undefined)?res.tidBits_tabs : {};
    for(var i in obj){
        btn = document.createElement('div');
        btn.id = i;
        link = obj[i];
        strt = link.indexOf(":")
        if(strt>=0){
            end = link.slice(strt+3).indexOf("/");
            if(end>=0){
                link = "<span a>"+link.slice(0,strt+3)+"</span><span b>"+link.slice(strt+3,strt+3+end)+"</span>"+link.slice(strt+3+end);
            }
        }
        btn.innerHTML = link;
        btn.onclick = e=> e.target.classList.toggle("click");
        document.body.appendChild(btn);
    }
});
window.addEventListener('blur', function() {
    browser.storage.local.get(['tidBits_tabs'], (res) => {
        var obj = (res.tidBits_tabs !== undefined)?res.tidBits_tabs : {};
        for(elem of this.document.body.children){
            if (elem.className.includes("click") || elem.innerHTML.includes("/popup/restore/popup_restore.html"))
                delete obj[elem.id];
        }
        browser.storage.local.set({ tidBits_tabs: obj});
    });
    window.close();
});