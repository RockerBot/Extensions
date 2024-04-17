document.addEventListener("click", e => {
    if (e.target.className.includes("sve")){
        obj ={u:document.getElementById("uname").value, p:document.getElementById("pword").value};
        browser.storage.local.set({ tidBits_stacks: obj});
        window.close();
    }else if (e.target.className.includes("url")){        
        browser.storage.local.get(['tidBits_portal_urls'], (result) => {
            var urls = result.tidBits_portal_urls ? result.tidBits_portal_urls : [];
            var url = document.getElementById("url").value
            if(url) urls.push(document.getElementById("url").value);
            browser.storage.local.set({ tidBits_portal_urls: urls});
        });
    }
});