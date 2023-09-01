document.addEventListener("click", e => {
    if (!e.target.className.includes("sve"))return;
    obj ={u:document.getElementById("uname").value, p:document.getElementById("pword").value};
    browser.storage.local.set({ tidBits_stacks: obj});
    window.close();
});