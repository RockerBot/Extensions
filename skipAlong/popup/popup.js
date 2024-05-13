const IDs = ['skip', 'unskip'];
var unskipContainer = document.getElementById('container');
function id2key(id){ return "skipAlong_" + id + "_enabled"; }
function handleStartup(res, id){
    document.getElementById(id).className += (!!res[id2key(id)])?"":"disabled";
}
function toggle(targ){
    targ.classList.toggle("disabled")
    key = id2key(targ.id);
    browser.storage.local.get([key], (result) => {
        let obj = {};
        obj[key] = !result[key];
        browser.storage.local.set(obj);
        if(key == 'skipAlong_unskip_enabled'){
            unskipContainer.className = !result.skipAlong_unskip_enabled ? "" : "hide";
        }else{
            browser.storage.local.get(['skipAlong_unskip_enabled'], (result) => {
                unskipContainer.className = result.skipAlong_unskip_enabled ? "" : "hide";
            });
        }
    });
}

for(let id of IDs) {
    key = id2key(id);
    browser.storage.local.get( [key], res => handleStartup(res, id) );
}
browser.storage.local.get([key], (result) => {
    unskipContainer.className = result.skipAlong_unskip_enabled ? "" : "hide";
});

document.addEventListener("click", e => {
    const classNames = e.target.className
    if(!classNames.includes("Clickable") )return;
    toggle(e.target);
});

var airTime = document.getElementById("airTime");
var slider = document.getElementById("jump");
var label = document.getElementById("jmpLbl");

browser.storage.local.get(['skipAlong_skip_percent'], (result) => {
    slider.value = result.skipAlong_skip_percent;
    label.innerText = "FastFoward: " + slider.value + "%";
});
browser.storage.local.get(['skipAlong_ad_time'], (result) => {
    airTime.value = result.skipAlong_ad_time;
});

slider.oninput = function() {
    label.innerText = "FastFoward: " + slider.value + "%";
    browser.storage.local.set({
        skipAlong_skip_percent: slider.value
    });
}
airTime.oninput = function() {
    browser.storage.local.set({
        skipAlong_ad_time: Math.min(10, Math.max(1, airTime.value))
    });
}
