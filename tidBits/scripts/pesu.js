const STORAGE_PESU = 'tidBits_pesu_enabled';
const MESSAGE_PESUTAB = "pesuTab";

const URL_PESU = 'https://www.pesuacademy.com/';

const CLS_SLIDER = 'tidbits_slider';
const ID_CONTENT = 'CourseContentId';

const ICON_AV = 'icons/av.png';
const ICON_PPT = 'icons/ppt.png';
const ICON_NOTE = 'icons/note.png';
const ICON_MCQ = 'icons/mcq.png';

subj_uuid = 0
function registerElem(SRC, ALT, i){
    newElem = document.createElement("div");
    newImg = document.createElement('img');
    newImg.src = browser.runtime.getURL(SRC);
    newImg.alt = ALT;    
    newImg.width="24";
    newElem.appendChild(newImg);
    newElem.className = CLS_SLIDER;
    newElem.addEventListener("click", e => {
        anchor_elem = e.target.parentElement.parentElement.parentElement;
        anchor_elem.click();
        console.log(e.target, anchor_elem)
        setTimeout(()=>{
            const tabler = document.getElementById(ID_CONTENT);
            if(!tabler)return;
            browser.runtime.sendMessage({
                action: MESSAGE_PESUTAB,
                subj: subj_uuid,
                unit: anchor_elem.href.split("_")[1] ,
                topic_count: tabler.getElementsByTagName('tbody')[0].children.length,
                type: i
            });
        },1000);
    });
    return newElem;
}
function handleSeqSlides(){
    //selecting the subject
    const subj_list = document.getElementById("getStudentSubjectsBasedOnSemesters");
    if(subj_list){
        setTimeout(() => {
            try{ 
                for( tr of subj_list.children[1].children[0].children[0].children[1].children)
                    tr.addEventListener("click", e=>{ subj_uuid = e.target.parentElement.id.split("_")[1] });
            }catch (e){ console.log(e) }
        }, 1000);        
        return;
    }

    //selecting the unit
    const unit_list = document.getElementById("courselistunit");
    if(unit_list){
        for (li of unit_list.children){
            child = li.children[0];
            if(child.children.length > 0)continue;
            wrapElem = document.createElement("div");
            wrapElem.appendChild(registerElem(ICON_AV, "AV", 1));
            wrapElem.appendChild(registerElem(ICON_PPT, "PPT", 3));
            wrapElem.appendChild(registerElem(ICON_NOTE, "NOTE", 4));
            wrapElem.appendChild(registerElem(ICON_MCQ, "MCQ", 8));
            wrapElem.className ="tidbits_btn";
            child.appendChild(wrapElem);
            child.className +="tidbits_unit";
        }

        // numbering the rows
        const courseContnet = document.getElementById(ID_CONTENT);
        if (courseContnet) {
            const tbody = courseContnet.getElementsByTagName('tbody')[0];
            if (!tbody) return;

            let i = 1;
            const rowCount = tbody.children.length
            for (const row of tbody.children) {
                const cell = row.children[0];
                if( cell.children.length > 1 )
                    continue;
                const topicNdx = document.createElement('span');
                topicNdx.innerText = `${i++}`.padStart(`${rowCount}`.length,'0');
                topicNdx.style.paddingRight = "10px";
                topicNdx.className = cell.firstChild.className;
                cell.insertBefore(topicNdx, cell.firstChild);
            }
        }
    }
}

function handleRelog(){
    elem = document.getElementById("j_scriptusername");
    if(!elem)return false;
    window.location = URL_PESU;
    return true;
}
function handleMCQ(){
    elem = document.getElementById("smC");
    if(elem&&elem["onclick"].toString().includes("submitMCQ"))elem.click();
}

const utube_observer = new MutationObserver(function(mutations) {
    browser.storage.local.get([STORAGE_PESU], (result) => {
        if(!result[STORAGE_PESU])return;
        if(handleRelog())return;
        handleSeqSlides();
        handleMCQ();
    });
});  
utube_observer.observe(document.body, { childList: true, subtree: true, attributes: true });