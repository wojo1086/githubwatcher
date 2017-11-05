(function() {
	'use strict';

	angular.module('github').controller('SettingsController', SettingsController);

	function SettingsController($rootScope) {
		var vm = this;

		var sourceRepos;

		vm.changesMade = false;

		vm.repos = [];

		vm.cancelChanges = cancelChanges;
		vm.saveChanges = saveChanges;

		Initialize();

		function Initialize() {

			chrome.runtime.sendMessage({type: 'getRepos'}, function (data) {
				$rootScope.$applyAsync(function() {
					console.log(data);
					sourceRepos = data;
					sourceRepos.forEach(function(repo) {
						repo.selected = true;
						return repo;
					});
					vm.repos = JSON.parse(angular.toJson(sourceRepos));
				});
			});
		}

		function cancelChanges() {
			vm.changesMade = false;
			vm.repos = JSON.parse(angular.toJson(sourceRepos));
		}

		function saveChanges() {
			vm.changesMade = false;
			vm.repos.forEach(function(repo) {
				if(repo.selected) {
					var message = {
						type: 'getPullRequests',
						data: {
							owner: repo.owner.login,
							repo: repo.name
						}
					};
					chrome.runtime.sendMessage(message, function (data) {
						console.log(data);
					});
				}
			});
		}
	}
})();