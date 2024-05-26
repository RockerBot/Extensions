browser.omnibox.setDefaultSuggestion({
    description: "about:debugging#/runtime/this-firefox"
});

browser.omnibox.onInputStarted.addListener(() => {
    console.log("User has started interacting with me.");
});

browser.omnibox.onInputEntered.addListener((text, disposition) => {
    switch(text.toLowerCase()){
        default:;
        case "debug":
            navigator.clipboard
            .writeText("about:debugging#/runtime/this-firefox")
            .then(function(){})
            .catch(function (error){ console.error("Error copying text to clipboard: " + error); });
            break;
    }
    console.log(text,disposition);
});