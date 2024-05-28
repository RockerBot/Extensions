const ACTION_STARTSPEAK = 'tidbits_speakText';
const ACTION_STOPSPEAK = 'tidbits_stopSpeaking';

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request)
    console.log(sender)
    console.log(sendResponse)
    if (request.action === ACTION_STARTSPEAK) {
        window.speechSynthesis.cancel();
        var utterance = new SpeechSynthesisUtterance(request.selectedText);
        window.speechSynthesis.speak(utterance);
    }else if(request.action === ACTION_STOPSPEAK){
        window.speechSynthesis.cancel();
    }
});
