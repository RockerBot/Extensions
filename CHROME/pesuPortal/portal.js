URLs = [
    "https://192.168.254.1:8090/", 
    "https://192.168.254.1:8090/httpclient.html", 
    "https://192.168.10.1:8090/", 
    "https://192.168.10.1:8090/httpclient.html", 
    "http://192.168.254.1:8090/", 
    "http://192.168.254.1:8090/httpclient.html", 
    "http://192.168.10.1:8090/", 
    "http://192.168.10.1:8090/httpclient.html",
]
function display(SRN){
    document.getElementById('signin-caption').innerText = "Signed-In as " + SRN;
    document.getElementById('credentials').style.display = "none"
    document.getElementById('loginbutton').style.display = "none"
}
function login(SRN, pword){
	var query=`mode=191&username=${SRN}&password=${pword}&a=${(new Date()).getTime()}&producttype=0`;
	var obj= new XMLHttpRequest();
	var message;
	obj.addEventListener("error",e=>console.log(e));
	obj.onreadystatechange=()=>{
		if(obj.readyState != 4)return;
		if(obj.status != 200) return;
		var doc = obj.responseXML.documentElement;
		console.log(doc)
		elems = doc.getElementsByTagName("status")
		message = doc.getElementsByTagName("message")
		out = (elems && elems.length)? elems[0].firstChild.nodeValue:"huh"
		switch(out){
			case "LIVE": console.log("You are in!! YAY!!");display(SRN);break
			case "LOGIN": console.log("Asking You to login");break
			case "CHALLENGE":
				console.log("Maybe")
				elems = doc.getElementsByTagName("state")
				if (elems && elems.length)
				console.log(elems[0].firstChild.nodeValue)
			else
			console.log("somthing wne wrong, looks like u did not get a 'state'")
		break
		default:
			console.log("Something went wrong, looks like u did not get a 'status'")
		}
	}
	try{
		obj.open("POST","login.xml",true);
		obj.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		obj.send(query)
	}catch(e){ console.log(e) }
	
}

if( URLs.includes(window.location.href) ){
    setTimeout(()=>{
        const elem = document.getElementById("loginbutton");
        if (elem && elem.innerHTML.includes("Login")) {
            console.log("yes", elem)
            chrome.storage.local.get(['tidBits_stacks'], (res) => {
                login(res.tidBits_stacks.u, res.tidBits_stacks.p);
            });
            
        }
    },1_000);
}