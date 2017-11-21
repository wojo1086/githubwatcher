// Called when the user clicks on the browser action.
//chrome.browserAction.onClicked.addListener(function (tab) {
//
//});

var token;
var repos = {};
var selectedRepos = {};
var comments = {};
var reviewComments = {};
var lastCheck = new Date();;

chrome.storage.sync.get('landing', function (data) {
	if(data) {
		login()
			.then(function(data) {
				if (Object.keys(data).length === 0) {
					continueLogin();
				} else {
					token = data.token;
				}
			})
		.then(getRepos);
	}
});

//window.setInterval(function() {
//	getRepos()
//		.then(function(data) {
//			data.forEach(getPullRequests);
//		});
//}, 10000);


//chrome.tabs.query({}, function (tabs) {
//	tabs.forEach(function (tab) {
//		if(tab.active) {
//			chrome.tabs.executeScript(tab.id, {file: "alert.js"});
//		}
//	});
//});


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	var actions = {
		getReposWrapper: getReposWrapper,
		getPullRequestsWrapper: getPullRequestsWrapper,
		getPullRequestCommentsWrapper: getPullRequestCommentsWrapper,
		getPullRequestReviewCommentsWrapper: getPullRequestReviewCommentsWrapper
	}

	actions[request.type](request, sendResponse);

	function getReposWrapper() {
		getRepos().then(sendResponse);
	}

	function getPullRequestsWrapper() {
		//var repo = {
		//	id: request.data.repoId,
		//	owner: request.data.owner,
		//	name: request.data.repoName
		//};
		getPullRequests().then(sendResponse);
	}

	function getPullRequestCommentsWrapper() {
		getPullRequestComments().then(sendResponse);
	}

	function getPullRequestReviewCommentsWrapper() {
		getPullRequestReviewComments(request, sendResponse);
	}

	return true;
});

function login() {

	return new Promise(function (resolve) {
		chrome.storage.sync.get('token', resolve);
	});

}


function continueLogin() {
	var client_id = '09205adb746bc22a4e50';
	var callback_url = 'https://' + chrome.runtime.id + '.chromiumapp.org/';
	var auth_url = 'https://github.com/login/oauth/authorize/?client_id=' + client_id + '&redirect_uri=' + callback_url + '&state=AEBF2C3987&scope=repo';
	var authData = {
		url: auth_url,
		interactive: true
	};
	chrome.identity.launchWebAuthFlow(authData, function (data) {
		var q = data.substring(data.indexOf('?') + 1);
		var tempCode = q.split('=')[1];
		var token_url = 'https://github.com/login/oauth/access_token/?client_id=' + client_id
			+ '&client_secret=47f27ee8a3b28975e3fd1bfb3e13848d8e38f884'
			+ '&code=' + tempCode
			+ '&redirect_uri=' + callback_url
			+ '&state=AEBF2C3987';

		$.post({
			url: token_url,
			success: function (data) {
				var tokenPre = data.split('=')[1];
				var token = tokenPre.split('&')[0];
				chrome.storage.sync.set({token: token});
			}
		});
	});
}

function getRepos() {
	return new Promise(function(resolve) {
		var url = 'https://api.github.com/user/repos';
		return transact(url).then(function(data) {
			data.forEach(function(repo) {
				repos[repo.id] = repo;
			});
			console.log(repos);
			resolve(repos);
		});
	});
}

function getPullRequests() {
	return new Promise(function(resolve) {
		getStorage().then(function (storageData) {
			selectedRepos = {};
			for(var key in repos) {
				if (storageData.hasOwnProperty(key) && storageData[key].selected) {
					var url = 'https://api.github.com/repos/' + repos[key].owner.login + '/' + repos[key].name + '/pulls';
					transact(url).then(function (data) {
						console.log(data);
						selectedRepos[key] = {};
						selectedRepos[key].gw_pull_reqs = data;
						resolve(selectedRepos[key].gw_pull_reqs);
					});
				}
			}
		});
	});
}

function getPullRequestReviewComments(request, callback) {
	$.get({
		url: request.data.reviewCommentsUrl,
		headers: {
			'Authorization': 'token ' + token
		},
		success: function (data) {
			console.log(data);
			reviewComments[request.data.reviewCommentsUrl] = data;

			//if (typeof lastCheck !== 'undefined') {
			//	data.forEach(function (comment) {
			//		var commentCreatedDate = new Date(comment.created_at);
			//		var commentUpdateDate = new Date(comment.updated_at);
			//		if (commentCreatedDate === commentUpdateDate && commentCreatedDate > lastCheck) {
			//			var commentCreated = buildCommentCreate(comment);
			//			notify(commentCreated);
			//		} else if (commentUpdateDate > lastCheck) {
			//			var commentUpdate = buildCommentUpdate(comment);
			//			notify(commentUpdate);
			//		}
			//	});
			//}
			//
			//lastCheck = new Date();

			callback(reviewComments[request.data.reviewCommentsUrl]);
		}
	});
}

function getPullRequestComments() {
	return new Promise(function(resolve) {
		for(var key in selectedRepos) {
			for(var i = 0, k = selectedRepos[key].gw_pull_reqs.length; i < k; i++) {
				var current = selectedRepos[key].gw_pull_reqs[i];
				transact(current.commentsUrl).then(function (data) {
					console.log(data);
					current.gw_pull_req_comments = data;

					data.forEach(function (item) {
						checkTimes(item, request);
					});

					lastCheck = new Date();

					resolve(current.gw_pull_req_comments);
				});
			}
		}
	});
}

function checkTimes(comment, request) {
	var commentCreatedDate = new Date(comment.created_at).getTime();
	var commentUpdateDate = new Date(comment.updated_at).getTime();
	var lastCheckTime = lastCheck.getTime();
	if (commentCreatedDate > lastCheckTime) {
		var note = {
			type: 'basic',
			iconUrl: comment.user.avatar_url,
			title: comment.user.login,
			message: comment.body
		};
		if(commentCreatedDate === commentUpdateDate) {
			note.title += ' made a comment.';
		} else {
			note.title += ' updated a comment.';
		}

		notify(note, request.data.commentsUrl, assignIdToComment);
	}
}

function assignIdToComment(id, url) {
	comments[url].noticeId = id
}

function notify(note, url, callback) {
	chrome.notifications.create(undefined, note, function (data) {
		callback(data, url);
	});
}