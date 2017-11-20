//var elem = document.createElement('div');
//elem.innerHTML = "Tim";
//elem.style.fontSize = '13px';
//elem.style.position = 'fixed';
//elem.style.bottom = '10px';
//elem.style.right = '10px';
//elem.style.padding = '10px';
//elem.style.backgroundColor = "#FFFFFF";
//elem.style.borderRadius = '3px';
//elem.style.borderBottom = '1px solid rgba(0, 0, 0, 0.2)';
//elem.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.15)';
//document.body.appendChild(elem);
//window.setTimeout(function() {
//	document.body.removeChild(elem);
//}, 3000);

chrome.extension.onMessage.addListener(function (msg, sender, sendResponse) {

	var elem = document.createElement('div');
	elem.innerHTML = msg.data;
	elem.style.fontSize = '13px';
	elem.style.position = 'fixed';
	elem.style.bottom = '10px';
	elem.style.right = '10px';
	elem.style.padding = '10px';
	elem.style.backgroundColor = "#FFFFFF";
	elem.style.borderRadius = '3px';
	elem.style.borderBottom = '1px solid rgba(0, 0, 0, 0.2)';
	elem.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.15)';
	document.body.appendChild(elem);
	window.setTimeout(function() {
		document.body.removeChild(elem);
	}, 3000);
});