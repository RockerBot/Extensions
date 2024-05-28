const STORAGE_PORTAL = 'tidBits_portal_enabled';
const STORAGE_PORTAL_URLS = 'tidBits_portal_urls';
const STORAGE_STACKS = 'tidBits_stacks';

browser.storage.local.get([STORAGE_PORTAL], (result) => {
    if(!result[STORAGE_PORTAL])return;
    browser.storage.local.get([STORAGE_PORTAL_URLS], (result) => {
        if(!result[STORAGE_PORTAL_URLS].includes(window.location.href))return;
        login();
    });
});

function login(){
    const elem = document.getElementById("loginbutton");
    if (elem && elem.innerHTML.includes("Login")) {
        browser.storage.local.get([STORAGE_STACKS], (res) => {
            document.getElementById("username").value = res[STORAGE_STACKS].u;
            document.getElementById("password").value = res[STORAGE_STACKS].p;
        });
        elem.click();
    }
}