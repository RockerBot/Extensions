const STORAGE_PESU = 'tidBits_pesu_enabled';

browser.storage.local.get([STORAGE_PESU], (result) => {
    if(!result.tidBits_pesu_enabled)return;
    const elem = document.getElementById("postloginform#/Academy/j_spring_security_check");
    if (elem) elem.click();
});