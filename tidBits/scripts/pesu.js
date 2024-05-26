subj_uuid = 0
function registerElem(SRC, ALT, i){
    newElem = document.createElement("div");
    newImg = document.createElement('img');
    newImg.src = browser.runtime.getURL(SRC);
    newImg.alt = ALT;    
    newImg.width="24";
    newElem.appendChild(newImg);
    newElem.className = "tidbits_slider";
    newElem.addEventListener("click", e => {
        anchor_elem = e.target.parentElement.parentElement.parentElement
        anchor_elem.click();
        console.log(e.target, anchor_elem)
        setTimeout(()=>{
            const tabler = document.getElementById("CourseContentId");
            if(!tabler)return;
            browser.runtime.sendMessage({
                action: "pesuTab",
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
            wrapElem.appendChild(registerElem("icons/av.png", "AV", 1));
            wrapElem.appendChild(registerElem("icons/ppt.png", "PPT", 3));
            wrapElem.appendChild(registerElem("icons/note.png", "NOTE", 4));
            wrapElem.appendChild(registerElem("icons/mcq.png", "MCQ", 8));
            wrapElem.className ="tidbits_btn";
            child.appendChild(wrapElem);
            child.className +="tidbits_unit";
        }

        // numbering the rows
        const courseContnet = document.getElementById('CourseContentId');
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
    window.location="https://www.pesuacademy.com/";
    return true;
}
function handleMCQ(){
    elem = document.getElementById("smC");
    if(elem&&elem["onclick"].toString().includes("submitMCQ"))elem.click();
}

const utube_observer = new MutationObserver(function(mutations) {
    browser.storage.local.get(['tidBits_pesu_enabled'], (result) => {
        if(!result.tidBits_pesu_enabled)return;
        if(handleRelog())return;
        handleSeqSlides();
        handleMCQ();
    });
});  
utube_observer.observe(document.body, { childList: true, subtree: true, attributes: true });