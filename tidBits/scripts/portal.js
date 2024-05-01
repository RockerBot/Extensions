function login(){
    const elem = document.getElementById("loginbutton");
    if (elem && elem.innerHTML.includes("Login")) {
        browser.storage.local.get(['tidBits_stacks'], (res) => {
            document.getElementById("username").value = res.tidBits_stacks.u;
            document.getElementById("password").value = res.tidBits_stacks.p;
        });
        elem.click();
    }
}

browser.storage.local.get(['tidBits_portal_enabled'], (result) => {
    if(!result.tidBits_portal_enabled)return;
    browser.storage.local.get(['tidBits_portal_urls'], (result) => {
        if(!result.tidBits_portal_urls.includes(window.location.href))return;
        login()
    });
});