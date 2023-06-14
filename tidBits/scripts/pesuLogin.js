browser.storage.local.get(['tidBits_pesu_enabled'], (result) => {
    if(!result.tidBits_pesu_enabled)return;
    const elem = document.getElementById("postloginform#/Academy/j_spring_security_check");
    if (elem) elem.click();
});