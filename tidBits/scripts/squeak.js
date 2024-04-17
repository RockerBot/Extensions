
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request)
    console.log(sender)
    console.log(sendResponse)
    if (request.action === "tidbits_speakText") {
        window.speechSynthesis.cancel();
        var utterance = new SpeechSynthesisUtterance(request.selectedText);
        window.speechSynthesis.speak(utterance);
    }else if(request.action === "tidbits_stopSpeaking"){
        window.speechSynthesis.cancel();
    }
});
