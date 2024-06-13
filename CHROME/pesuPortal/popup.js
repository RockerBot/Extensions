document.addEventListener("click", e => {
    if (e.target.classList.contains("sve")){
        obj ={
            u:document.getElementById("uname").value,
            p:document.getElementById("pword").value
        };
        chrome.storage.local.set({ tidBits_portal_credentials: obj});
        window.close();
    }else if (e.target.className.includes("url")){        
        chrome.storage.local.get(['tidBits_portal_urls'], (result) => {
            var urls = result.tidBits_portal_urls ? result.tidBits_portal_urls : [];
            var url = document.getElementById("url").value
            if(url) urls.push(document.getElementById("url").value);
            chrome.storage.local.set({ tidBits_portal_urls: urls});
        });
    }
});