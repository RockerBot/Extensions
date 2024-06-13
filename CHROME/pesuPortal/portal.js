URLs = [
    "https://192.168.254.1:8090/", 
    "https://192.168.254.1:8090/httpclient.html", 
    "https://192.168.10.1:8090/", 
    "https://192.168.10.1:8090/httpclient.html",
	"https://10.0.0.1:8090/",
	"https://10.0.0.1:8090/httpclient.html",
    "http://192.168.254.1:8090/", 
    "http://192.168.254.1:8090/httpclient.html", 
    "http://192.168.10.1:8090/", 
    "http://192.168.10.1:8090/httpclient.html",
	"http://10.0.0.1:8090/",
	"http://10.0.0.1:8090/httpclient.html",
]
var USERNAME = ""
var PASSWORD = ""
const liveReqTimeInJS = 180;
const SIGNED_IN = "signed_in";
const SIGNED_OUT = "signed_out";
const WAITING = "waiting";
const REJECTED = "rejected";
const ACK = "ack";
const NACK = "nack";
const OFF = "live_off";
const AGAIN = "login_again";
var loginstate = null;
var timer = "";
window.onbeforeunload = function() {
    if (getState() === SIGNED_IN) {
        var msg = `mode=193&username=${encodeURIComponent(USERNAME)}&a=${(new Date()).getTime()}`;
        if (/Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)) {
            try {
                navigator.sendBeacon("logout.xml", new Blob(
                    [msg], { type: "application/x-www-form-urlencoded" }
                ));
                for (let timestamp = new Date().getTime(); new Date().getTime()-timestamp < 650;) {}
            } catch (err) {
                ViewRender.init(SIGNED_IN).render();
            }
        } else {
            makeAjaxRequest("POST", msg, "logout.xml", null, false);
        }
    }
}
;
var ViewRender = (function() {
    function b() {
        const signInCaptionHeader = document.getElementById("signin-caption");
        const credentialsElem = document.getElementById("credentials");
        const logedInMsg = document.getElementById("loggedin-message");
        const statusMessageElem = document.getElementById("statusmessage");
        const loginButton = document.getElementById("loginbutton");
        
        document.getElementById("loggedin-view").style.display = "block";
        document.getElementById("spinner-view").style.display = "none";

        signInCaptionHeader.innerText = "Internet Captive Portal Login";
        statusMessageElem.className = "unshown";
        statusMessageElem.innerHTML = this.message;
        credentialsElem.className = "loggedin";
        logedInMsg.className = "loggedin";
        loginButton.innerText = "Login";

        switch (this.state) {
        case SIGNED_IN:
            loginButton.innerText = "Logout";

            const signInCaptionText = this.message.replace(/{username}/g, USERNAME);
            signInCaptionHeader.innerText = signInCaptionText;
            document.title = signInCaptionText;

            break;
        case REJECTED:
            statusMessageElem.className = "red";
            credentialsElem.className = "loggedout shake";
            
            setTimeout(function() {
                if (credentialsElem.className === "loggedout shake") {
                    credentialsElem.className = "loggedout"
                }
            }, 500);
            break;
        case SIGNED_OUT:
            credentialsElem.className = "loggedout";
            logedInMsg.className = "loggedout";
            statusMessageElem.className = "green";
            document.title = "Internet Captive Portal Login";
            document.getElementById("password").value = "";
            break;
        case WAITING:            
            signInCaptionHeader.innerText = "Signing you in...";            
            document.getElementById("loggedin-view").style.display = "none";
            document.getElementById("spinner-view").style.display = "block";
            break;
        default: break
        }
    }
    return {
        init: function(state, msg="") {
            this.state = state;
            this.message = msg;
            this.render = b;
            return this
        }
    }
}
)();

if( URLs.includes(window.location.href) ){
    login();
}else{
	chrome.storage.local.get(['tidBits_portal_urls'], (result) => {
		if(!result.tidBits_portal_urls.includes(window.location.href))return;
		login();
	});
}
function login(){
	chrome.storage.local.get(['tidBits_portal_credentials'], (res) => {
		USERNAME = res.tidBits_portal_credentials.u;
		PASSWORD = res.tidBits_portal_credentials.p;
		document.getElementById("username").value = USERNAME;
		document.getElementById("password").value = PASSWORD;

		submitRequest();
	});
}
function submitRequest() {
	if (getState() == SIGNED_IN){
		makeAjaxRequest(
			"POST",
			`mode=193&username=${encodeURIComponent(USERNAME)}&a=${(new Date()).getTime()}&producttype=0`,
			"logout.xml",
			logoutResponseHandler
		);
		return;
	}
	ViewRender.init(WAITING).render();
	makeAjaxRequest(
		"POST",
		`mode=191&username=${encodeURIComponent(USERNAME)}&password=${encodeURIComponent(PASSWORD)}&a=${(new Date()).getTime()}&producttype=0${(loginstate?"&state="+loginstate:"")}`,
		"login.xml",
		loginResponseHandler
	)
}
function getState() {
    if (document.getElementById("statusmessage").className.indexOf("red") != -1) {
        return REJECTED
    }
    if (document.getElementById("credentials").className.indexOf("loggedout") != -1) {
        return SIGNED_OUT
    }
    if (document.getElementById("spinner-view").style.display === "block") {
        return WAITING
    }
    return SIGNED_IN
}
function getTagValue(doc, tagName) {
    var elems = doc.getElementsByTagName(tagName);
    return elems && elems.length > 0 ? elems[0].firstChild.nodeValue : undefined
}
function loginResponseHandler(doc) {
    var c = "";
    loginstate = null;
	var stateTagValue = getTagValue(doc, "status")
    switch (stateTagValue) {
        case "LIVE":
            c = SIGNED_IN;
            break;
        case "LOGIN":
            c = REJECTED;
            break;
        case "CHALLENGE":
            loginstate = stateTagValue
        default: break;
    }
    ViewRender.init(c, getTagValue(doc, "message")).render();
    setTimeForLiveRequest()
}
function logoutResponseHandler(doc) {
    var stateTagValue = getTagValue(doc, "status");
    if (stateTagValue === "LOGIN") {
        clearTimeout(timer);
        ViewRender.init(SIGNED_OUT, getTagValue(doc, "message")).render()
    }
}
function setTimeForLiveRequest() {
    clearTimeout(timer);
    timer = setTimeout(()=>{
        try { 
            const ajaxObject = new XMLHttpRequest();
            ajaxObject.open(
                "get",
                `live?mode=192&username=${encodeURIComponent(USERNAME)}&a=${(new Date()).getTime()}&producttype=0`, 
                true
            );
            ajaxObject.onreadystatechange = ()=>{
                try{
                    if(ajaxObject.readyState == 4)
                        parseXML(ajaxObject.responseXML);
                }catch(err){ parseXML(null); }
            } 
            ajaxObject.send('');
        }catch(err){
            console.log("Problem in sending request to Cyberoam Server:" + err)
        }
    },liveReqTimeInJS * 1000);
}
function parseXML(xml) {
    if (!xml) return setTimeForLiveRequest();
    try {
        switch (getTagValue(xml.documentElement, "ack")) {
            case NACK:
            case AGAIN:
                clearTimeout(timer);
                ViewRender.init(SIGNED_OUT).render()
                break;
            case OFF:
            default: break;
			case ACK: setTimeForLiveRequest()
        }
    } catch (err) {}
}
function makeAjaxRequest(HTTPmethod, msg, XMLfile, responseXmlHandler, isAsync=true) {
	function xmlErrHandler(){
		ViewRender.init(XMLfile === "logout.xml" ? SIGNED_IN : SIGNED_OUT).render()
	}
    var xmlreq = new XMLHttpRequest();
    xmlreq.addEventListener("error", xmlErrHandler);
    if (responseXmlHandler) {
        xmlreq.onreadystatechange = ()=>{
            if (xmlreq.readyState != 4) return;
			if (xmlreq.status == 200) responseXmlHandler(xmlreq.responseXML.documentElement);
			else console.log("Connection to the Authentication Server is lost.");
        }
    }
    try {
        xmlreq.open(HTTPmethod, XMLfile, isAsync);
        xmlreq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xmlreq.send(msg)
    } catch (err) { xmlErrHandler() }
}
;