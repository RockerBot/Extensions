console.log("Login Hello")

browser.storage.local.get(['pesuAcademy_enabled'], (result) => {
    if(!result.pesuAcademy_enabled)return;
    const elem = document.getElementById("postloginform#/Academy/j_spring_security_check");
    if (elem) elem.click();
});