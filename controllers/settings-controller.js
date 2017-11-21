(function() {
	'use strict';

	angular.module('github').controller('SettingsController', SettingsController);

	function SettingsController($q,
	                            $rootScope,
	                            StorageService) {
		var vm = this;

		var sourceRepos;

		vm.changesMade = false;

		vm.repos = [];

		vm.cancelChanges = cancelChanges;
		vm.saveChanges = saveChanges;

		Initialize();

		function Initialize() {
			getRepos()
				.then(StorageService.get)
				.then(function (data) {
					console.log(data);
					for(var key in sourceRepos){
						sourceRepos[key].selected = (data.hasOwnProperty(sourceRepos[key].id)) ? data[sourceRepos[key].id].selected : true;
					};
					vm.repos = JSON.parse(angular.toJson(sourceRepos));
				});
		}

		function getRepos() {
			return $q(function(resolve) {
				chrome.runtime.sendMessage({type: 'getReposWrapper'}, function (data) {
					$rootScope.$applyAsync(function () {
						console.log(data);
						sourceRepos = data;
						resolve();
					});
				});
			});
		}

		function cancelChanges() {
			vm.changesMade = false;
			vm.repos = JSON.parse(angular.toJson(sourceRepos));
		}

		function saveChanges() {
			vm.changesMade = false;
			var setting = {};
			for(var key in vm.repos) {
				setting[key] = {
					'selected': vm.repos[key].selected
				}
			};
			StorageService.set(setting)
				.then(getPullRequests)
				.then(getPullRequestComments);
				//if (repo.selected) {
				//	var message = {
				//		type: 'getPullRequestsWrapper',
				//		data: {
				//			owner: repo.owner,
				//			repoName: repo.name,
				//			repoId: repo.id
				//		}
				//	};
				//	chrome.runtime.sendMessage(message, function (data) {
				//		console.log(data);
				//
				//		data.forEach(function(pr) {
				//			var comments = {
				//				type: 'getPullRequestCommentsWrapper',
				//				data: {
				//					commentsUrl: pr.comments_url,
				//					title: pr.title
				//				}
				//			};
				//
				//			var reviewComments = {
				//				type: 'getPullRequestReviewCommentsWrapper',
				//				data: {
				//					reviewCommentsUrl: pr.review_comments_url
				//				}
				//			};
				//
				//			chrome.runtime.sendMessage(comments, function (data) {
				//				console.log(data);
				//			});
				//
				//			//chrome.runtime.sendMessage(reviewComments, function (data) {
				//			//	console.log(data);
				//			//});
				//		});
				//	});
				//}
		}

		function getPullRequests() {
			var message = {
				type: 'getPullRequestsWrapper',
			};

			return $q(function(resolve) {
				chrome.runtime.sendMessage(message, resolve);
			});
		}

		function getPullRequestComments() {
			var message = {
				type: 'getPullRequestCommentsWrapper',
			};

			return $q(function (resolve) {
				chrome.runtime.sendMessage(message, resolve);
			});
		}
	}
})();