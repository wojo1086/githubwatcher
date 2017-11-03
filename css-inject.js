var style = document.createElement('link');
style.rel = 'stylesheet';
style.type = 'text/css';
style.href = chrome.extension.getURL('styles/main.css');
document.getElementsByTagName("head")[0].appendChild(style);