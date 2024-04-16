document.addEventListener("click", e => {
    if (!e.target.classList.contains("sve"))return;
    obj ={
        u:document.getElementById("uname").value,
        p:document.getElementById("pword").value
    };
    chrome.storage.local.set({ tidBits_stacks: obj});
    window.close();
});