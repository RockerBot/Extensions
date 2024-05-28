const STORAGE_RESTORE = 'tidBits_restore_enabled';
const STORAGE_TABS = 'tidBits_tabs';

browser.storage.local.get([STORAGE_RESTORE], (result) => {
    if(!result[STORAGE_RESTORE])return;
    let obj = {};
    // obj[key] = !result[key];
    // browser.storage.local.set(obj);
});
browser.storage.local.get([STORAGE_TABS], (res) => {
    var obj = (res[STORAGE_TABS] !== undefined)?res[STORAGE_TABS] : {};
    for(var i in obj){
        btn = document.createElement('div');
        btn.id = i;
        link = obj[i];
        strt = link.indexOf(":")
        if(strt>=0){
            end = link.slice(strt+3).indexOf("/");
            if(end>=0){
                link = `
                <span a> ${link.slice(0, strt + 3)} </span>
                <span b> ${link.slice(strt + 3, strt + 3 + end)} </span>
                ${link.slice(strt+3+end)}
                `;
            }
        }
        btn.innerHTML = link;
        btn.onclick = e=> e.target.classList.toggle("click");
        document.body.appendChild(btn);
    }
});
window.addEventListener('blur', function() {
    browser.storage.local.get([STORAGE_TABS], (res) => {
        var obj = (res[STORAGE_TABS] !== undefined)?res[STORAGE_TABS] : {};
        for(elem of this.document.body.children){
            if (elem.className.includes("click") || elem.innerHTML.includes("/popup/restore/popup_restore.html"))
                delete obj[elem.id];
        }
        const setObj = {};
        setObj[STORAGE_TABS] = obj;
        browser.storage.local.set(setObj);
    });
    window.close();
});