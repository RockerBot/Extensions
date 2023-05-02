// enabled = true
// browser.storage.local.set({ skipAlong_enabled: true });
// window.addEventListener('load', function() {
//     browser.browserAction.onClicked.addListener(function() {
//         enabled=!enabled;
//         browser.browserAction.setIcon({ path: { "48": `icons/addX10sion${(enabled?"":"Grey")}.png` } });
//         browser.storage.local.set({ skipAlong_enabled: enabled });
//     });
// });

function handleErr(error) {
    console.log(`Error: ${error}`);
}

// x10sion_enabled = true



// let creating = browser.tabs.create({
//     url:"about:debugging#/runtime/this-firefox"
// });
// creating.then(
//     tab=> {
//         console.log(`Created new tab: ${tab.id}`);
//         alert(`Created new tab: ${tab.id}`);
//         elem = document.getElementsByClassName("undefined default-button qa-temporary-extension-install-button")[0];
//         elem.click();
//     },
//     err=> {
//         console.log(`Error: ${err}`);
//         alert(`Error: ${err}`);
//     }
// )


// function tiggle(){
//     browser.storage.local.set({ x10sion_enabled: true });
//     alert(x10sion_enabled)
// }
console.log("YOOOOOOOOOOOOOOOOO");
/*qa-debug-target-pane
document.getElementsByClassName("default-button default-button--micro qa-temporary-extension-reload-button")
//default-button default-button--micro qa-temporary-extension-reload-button
var xtensions = []
document.addEventListener('click', e=>{
    if(xtensions.length === 0)xtensions = getDemExtensions()
    browser.tabs.query({currentWindow: true});
    browser.storage.local.set({ x10sion_xtensions: xtensions });
    // document.querySelector("#myButton").addEventListener("click", function() {
    //     browser.tabs.create({url: "https://www.example.com"});
    // });
});

function getDemExtensions(){
    let querying = browser.tabs.query({title:"Debugging - Runtime / this-firefox"});
    querying.then(pgs=>{
        pgs[0]
        temp_extension_list = document.getElementsByClassName("qa-debug-target-pane")[0];
        temp_extensions = temp_extension_list.getElementsByClassName("card debug-target-item qa-debug-target-item");
    },handleErr)
    x = []
    for (let extens of temp_extensions){
        obj = {
            name: extens.getElementsByClassName("debug-target-item__name ellipsis-text").innerText,

        }
    }
}*/