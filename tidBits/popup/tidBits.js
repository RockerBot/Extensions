const IDs = ['shorts', 'pesu']
function id2key(id){ return "tidBits_" + id + "_enabled"; }
function handleStartup(result, id){
    document.getElementById(id).className = (!!result[id2key(id)])?"":"disabled";
}
for(let id of IDs) {
    key = id2key(id);
    browser.storage.local.get( [key], res => handleStartup(res, id) );
}

document.addEventListener("click", (e) => {
    const targ = e.target
    const ID = targ.id;
    if(ID !== 'shorts' && ID !== 'pesu' )return;
    targ.classList.toggle("disabled")
    key = id2key(ID);
    browser.storage.local.get([key], (result) => {
        let obj = {};
        obj[key] = !result[key];
        browser.storage.local.set(obj);
    });
});
