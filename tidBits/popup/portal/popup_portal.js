const STORAGE_PORTAL_URLS = 'tidBits_portal_urls';

document.addEventListener("click", e => {
    if (e.target.className.includes("sve")){
        obj ={u:document.getElementById("uname").value, p:document.getElementById("pword").value};
        browser.storage.local.set({ tidBits_stacks: obj});
        window.close();
    }else if (e.target.className.includes("url")){        
        browser.storage.local.get([STORAGE_PORTAL_URLS], (result) => {
            var urls = result[STORAGE_PORTAL_URLS] ? result[STORAGE_PORTAL_URLS] : [];
            var url = document.getElementById("url").value
            if(url) urls.push(document.getElementById("url").value);
            const obj = {};
            obj[STORAGE_PORTAL_URLS] = urls;
            browser.storage.local.set(obj);
        });
    }
});