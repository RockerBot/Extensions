aabb = {}
const utube_observer = new MutationObserver(function(mutations) {
    browser.storage.local.get(['tidBits_shorts_enabled'], (result) => {
        if(!result.tidBits_shorts_enabled)return;        
        dropSelection('[title="Shorts"]');
        dropSelection('[is-shorts=""]');
        dropTagName("ytd-reel-shelf-renderer");
    });
    addInteractions();
    handleSeenVids();
    searchSubBar();
});  
utube_observer.observe(document.body, { childList: true, subtree: true, attributes: true });
var seenVidsHidden = true;

function dropSelection(selection){
    el = document.querySelector(selection)
    if(el !==null)el.remove();
}
function dropTagName(tagname){
    for (let elem of document.getElementsByTagName(tagname)) elem.remove();
}
function handleSeenVids(){
    browser.storage.local.get(['tidBits_utube_hideseen_enabled'], (result) => {
        seenVidsHidden = result.tidBits_utube_hideseen_enabled;
        for( elem of document.getElementsByTagName("ytd-thumbnail") ){
            if (elem.className.includes("tidbits_seen")) continue;

            var line = elem.getElementsByTagName("ytd-thumbnail-overlay-resume-playback-renderer");
            if (!line[0]) continue;
            
            if(line[0].children[0].style.width.replace("%","")-0x0 > 90){
                console.log(line[0].children[0].style.width, elem);
                elem.className +=" tidbits_seen ";
                elem.className += seenVidsHidden?" tidbits_enable ":"";
            }
        }
    });
}
function hideAsub(sub, pattern){
    sub.classList.remove("tidbits_hide");
    const subNames = sub.getElementsByTagName('yt-formatted-string');
    if(!subNames.length) return 0;
    if(!subNames[0].innerText) return 0;
    if(!subNames[0].innerText.length) return 0;
    var cond = true;
    for (const ptrn of pattern.split(" ")) {
        cond = (
            subNames[0]
            .innerText
            .toLowerCase()
            .includes(ptrn)
            && 
            cond
        );
    }
    if(cond) return 1;
    sub.className += " tidbits_hide ";
    return 0;
}
function searchSubBar(){    
    const sideTabs = document.getElementsByTagName('ytd-guide-section-renderer');
    for (const sideTab of sideTabs) {
        // var srch = sideTab.getElementById('guide-section-title');//:( i wish
        var srch = sideTab.children[0].children[0];
        if(!srch || !srch.parentElement) continue;
        if(!srch.innerText.includes('Subscriptions')) continue;
        searchSubBar = () => {} //* makes the function single use
        
        var elem = document.getElementById('expander-item');
        if(elem) elem.click();

        var inputElem = document.createElement("input");
        var inputLabelElem = document.createElement("label");

        inputElem.setAttribute("placeholder", "Subscriptions");
        inputElem.setAttribute("name", "Subscriptions");
        inputLabelElem.setAttribute("for", "Subscriptions")
        
        var t1 = null;
        inputElem.addEventListener("input", ()=>{
            let nSubs = 0;
            if(t1)clearTimeout(t1);
            var index = 0;
            function handleNextSub() {
                for(let i=0;i<30;i++){
                    const sub = sublist[index];
                    nSubs += hideAsub(sub, inputElem.value.toLowerCase());
                    if (++index >= sublist.length) {
                        inputLabelElem.innerText = `${nSubs}`;
                        return;
                    }
                }
                
                if (++index < sublist.length){
                    index--;
                    t1 = setTimeout(handleNextSub);
                }else{
                    inputLabelElem.innerText = `${nSubs}`;
                }
            }
            handleNextSub();
        });

        var srchParent = srch.parentElement;
        for (const child of srchParent.children) {
            srchParent.removeChild(child);
        }
        srchParent.appendChild(inputElem);
        srchParent.appendChild(inputLabelElem);

        var expndedList = document.getElementById('expanded');
        var sublist = expndedList.parentElement.parentElement.getElementsByTagName('ytd-guide-entry-renderer');
        sublist = Object.values(sublist)

        inputLabelElem.innerText = `${sublist.length-2}`
        return;
    }
}

function addInteractions(){
    const topBar = document.getElementsByTagName('ytd-masthead')[0];
    if (!topBar) return;

    const interactionList = topBar.querySelector("#buttons");
    if (!interactionList || !interactionList.children[1]) return;

    const modelInteraction = interactionList.children[1];
    if (modelInteraction.tagName.toLowerCase().includes('div')) return;
    if (!modelInteraction.getElementsByTagName('tp-yt-paper-tooltip')[0]) return;

    const modelTooltip = modelInteraction.getElementsByTagName('tp-yt-paper-tooltip')[0];
    
    function createInteraction(id, imgUrl, tooltip, click){
        const interaction = document.createElement('div');
        interaction.className = "tidbits_interactions ";
        interaction.id = id;

        if (imgUrl){
            const interactionImg = document.createElement('img');
            interactionImg.src = browser.runtime.getURL(imgUrl);
            interaction.appendChild(interactionImg);
        }
        const interactionTooltip = modelTooltip.cloneNode(false);
        interaction.appendChild(interactionTooltip);

        const interactionTooltipText = document.createElement('span');
        interactionTooltipText.innerText = tooltip;
        interactionTooltip.appendChild(interactionTooltipText);

        interaction.onclick = click;

        return interaction;
    }

    function seenVidfunc(){
        const senVids = document.getElementsByClassName('tidbits_seen');
        for (const vid of senVids) {
            vid.classList.toggle('tidbits_enable');
        }
        seenVidDiv.classList.toggle('tidbits_interactions_hidden');

        const isHidden = seenVidDiv.className.includes('tidbits_interactions_hidden');

        let imgurl = '../icons/';
        imgurl +=  isHidden? '':'un';
        imgurl += 'hide.png';

        const seenVidImg = seenVidDiv.getElementsByTagName('img')[0];
        seenVidImg.src = browser.runtime.getURL(imgurl);
        
        browser.storage.local.set({ tidBits_utube_hideseen_enabled: isHidden });
    }
    function spotlightfunc(){        
        const thumbnails = document.getElementsByClassName('ytd-thumbnail');
        for (const thumb of thumbnails) {
            thumb.classList.toggle('tidbits_spotlight');
        }
        spotlightDiv.classList.toggle('tidbits_interactions_hidden');

        const isHidden = spotlightDiv.className.includes('tidbits_interactions_hidden');

        let imgurl = '../icons/spotlight';
        imgurl +=  isHidden? 'ON':'';
        imgurl += '.png';

        const spotlightImg = spotlightDiv.getElementsByTagName('img')[0];
        spotlightImg.src = browser.runtime.getURL(imgurl);
    }
    
    const spotlightDiv = createInteraction(
        'tidbits_spotlight_btn', 
        '../icons/spotlight.png', 
        'spotlight cursor', 
        spotlightfunc
    );
    const seenVidDiv = createInteraction(
        'tidbits_seenvid_btn',
        seenVidsHidden ? '../icons/unhide.png' : '../icons/hide.png',
        'hide seen vids', 
        seenVidfunc
    );

    interactionList.insertBefore(spotlightDiv, interactionList.firstChild);
    interactionList.insertBefore(seenVidDiv, interactionList.firstChild);
}

//guide-section-title
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