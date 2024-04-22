aabb = {}
const utube_observer = new MutationObserver(function(mutations) {
    browser.storage.local.get(['tidBits_shorts_enabled'], (result) => {
        if(!result.tidBits_shorts_enabled)return;        
        dropSelection('[title="Shorts"]');
        dropSelection('[is-shorts=""]');
        dropTagName("ytd-reel-shelf-renderer");
        handleSeenVids();
        searchSubBar();
    });
});  
utube_observer.observe(document.body, { childList: true, subtree: true, attributes: true });


function dropSelection(selection){
    el = document.querySelector(selection)
    if(el !==null)el.remove();
}
function dropTagName(tagname){
    for (let elem of document.getElementsByTagName(tagname)) elem.remove();
}
function handleSeenVids(){
    for( elem of document.getElementsByTagName("ytd-thumbnail") ){
        if (elem.className.includes("tidbits_seen")) continue;

        var line = elem.getElementsByTagName("ytd-thumbnail-overlay-resume-playback-renderer");
        if (!line[0]) continue;
        
        if(line[0].children[0].style.width.replace("%","")-0x0 > 90){
            console.log(line[0].children[0].style.width, elem);
            elem.className +=" tidbits_seen ";
        }
    }
}
function hideAsub(sub, inputElem){
    sub.classList.remove("tidbits_hide");
    if(!sub
        .getElementsByTagName('yt-formatted-string')[0]
        .innerText
        .toLowerCase()
        .includes(inputElem.value.toLowerCase()
    )){
        sub.className += " tidbits_hide ";
    }
}
function searchSubBar(){
    var srch = document.getElementById('guide-section-title');
    if(!srch || !srch.parentElement)
        return;
    var elem = document.getElementById('expander-item');
    if(elem)
        elem.click();


    srch.parentElement.removeChild(srch.parentElement.firstChild);
    var inputElem = document.createElement("input");
    inputElem.setAttribute("placeholder", "Subscriptions");
    inputElem.addEventListener("input", ()=>{
        if(inputElem.value=="")
            return;
        
        for (const sub of sublist) { hideAsub(sub, inputElem); }
        for (const sub of qsublist) { hideAsub(sub, inputElem); }
    });
    srch.parentElement.appendChild(inputElem);
    var expndedList = document.getElementById('expanded');
    var sublist = expndedList.getElementsByTagName('ytd-guide-entry-renderer');
    var qsublist = expndedList.parentElement.parentElement.getElementsByTagName('ytd-guide-entry-renderer');
}

// for (elem of document.getElementsByTagName("video")){
//     aabb[elem.src] = 1;
// }
// console.log(aabb)
// obj ={ "": 1,
//  "blob:https://www.youtube.com/214374c1-d5bc-4577-bb21-939c7b91db10": 1,
//  "blob:https://www.youtube.com/21efee93-af26-49b3-b3ed-02410d13ffab": 1,
//  "blob:https://www.youtube.com/f937b475-a37f-4471-9838-0bc34c4d4553": 1,
//  "blob:https://www.youtube.com/e56a72a8-0b20-45e6-909b-7c3002f40e4f": 1,
//  "blob:https://www.youtube.com/7108baa1-22c5-42c5-82b0-ce4b0f481ca3": 1,
//  "blob:https://www.youtube.com/5bcd0b3d-f32e-496f-9fe0-9679b45a427a": 1,
//  "blob:https://www.youtube.com/af3b1285-1a47-4390-a94b-42e604d2642b": 1,
//  "blob:https://www.youtube.com/c8f944a2-8bd5-4e76-bf2f-e60a7c7da51d": 1
// };