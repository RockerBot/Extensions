// document.body.style.backgroundColor="green";
console.log("WE IN!");
// // console.log(" WE IN!");
// // console.log("  WE IN!");
// // console.log("   WE IN!");
// // console.log("    WE IN!");
// // console.log("     WE IN!");
// // console.log("      WE IN!");
// // console.log("       WE IN!");
// // console.log("        WE IN!");
// // console.log("         WE IN!");
// // console.log("          WE IN!");
// // console.log("           WE IN!");
// // alert("WE IN!");
// function skipAlip (){
//     let btn = document.getElementsByClassName("ytp-ad-skip-button ytp-button");
//     if(btn.length === 0)return;
//     console.log("detected skop man!");
//     btn[0].click();
// }
// setInterval(skipAlip,2000);


// function checkElement() {
//     const elements = document.getElementsByClassName("ytp-ad-skip-button ytp-button");
//     if (elements.length !==0) {
//       // The element is present, call your function here
//       myFunction();
//     }
//   }
  
//   function myFunction() {
//     console.log("Element found!");
//     alert("Element found!");
//   }
count=0;
const observer = new MutationObserver(function(mutations) {
    console.log("ping", count++);
    for (let mutation of mutations) {
        console.log(mutation);
        
        if (mutation.type === 'childList') {
            for (let node of mutation.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE && node.className === 'ytp-ad-skip-button ytp-button') {
                    // The element was added to the page, call checkElement
                    node.click();
                    break;
                }
            }
        }
    }
});
  
observer.observe(document.body, { childList: true, subtree: true });
p = document.createElement("p");

p.