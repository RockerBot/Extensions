
if(
    window.location.href==="https://192.168.254.1:8090/"||
    window.location.href==="https://192.168.254.1:8090/httpclient.html"||
    window.location.href==="http://192.168.254.1:8090/"||
    window.location.href==="http://192.168.254.1:8090/httpclient.html"
){
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