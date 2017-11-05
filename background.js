// Called when the user clicks on the browser action.
//chrome.browserAction.onClicked.addListener(function (tab) {
//
//});

var token;
var repos;
var pullRequests = {};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	var actions = {
		setToken: setToken,
		getToken: getToken,
		getRepos: getRepos,
		getPullRequests: getPullRequests
	}

	actions[request.type]();

	function setToken() {
		token = request.data.token;
	}

	function getToken() {
		return token;
	}

	function getRepos() {

		if(typeof repos === 'undefined') {
			$.get({
				url: 'https://api.github.com/user/repos',
				headers: {
					'Authorization': 'token ' + token
				},
				success: function (data) {
					repos = data;
					sendResponse(repos);
				}
			});
		} else {
			sendResponse(repos);
		}
	}

	function getPullRequests() {
		if (!pullRequests.hasOwnProperty(request.data.repo)) {
			$.get({
				url: 'https://api.github.com/repos/' + request.data.owner + '/' + request.data.repo + '/pulls',
				headers: {
					'Authorization': 'token ' + token
				},
				success: function (data) {
					console.log(data);
					pullRequests[request.data.repo] = data;
					sendResponse(pullRequests[request.data.repo]);
				}
			});
		} else {
			sendResponse(pullRequests[request.data.repo]);
		}
	}

	return true;
});