URLs = [
    "https://192.168.254.1:8090/", 
    "https://192.168.254.1:8090/httpclient.html", 
    "https://192.168.10.1:8090/", 
    "https://192.168.10.1:8090/httpclient.html", 
    "http://192.168.254.1:8090/", 
    "http://192.168.254.1:8090/httpclient.html", 
    "http://192.168.10.1:8090/", 
    "http://192.168.10.1:8090/httpclient.html",
]
if( URLs.includes(window.location.href) ){
    browser.storage.local.get(['tidBits_portal_enabled'], (result) => {
        if(!result.tidBits_portal_enabled)return;
        const elem = document.getElementById("loginbutton");
        if (elem && elem.innerHTML.includes("Login")) {
            browser.storage.local.get(['tidBits_stacks'], (res) => {
                document.getElementById("username").value = res.tidBits_stacks.u;
                document.getElementById("password").value = res.tidBits_stacks.p;
            });
            elem.click();
        }
    });
}