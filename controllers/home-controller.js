(function () {
	'use strict';

	angular.module('github').controller('HomeController', HomeController);

	function HomeController($location,
	                        StorageService,
	                        TransactService) {
		var vm = this;

		Initialize();

		function Initialize() {
			var client_id = '09205adb746bc22a4e50';
			var callback_url = 'https://'+ chrome.runtime.id + '.chromiumapp.org/';
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
				var request = {
					url: token_url
				};

				TransactService.transactPost(request).then(function (data) {

					StorageService.set({landing: true});
					var tokenPre = data.split('=')[1];
					var token = tokenPre.split('&')[0];
					var message = {
						type: 'setToken',
						data: {
							token: token
						}
					};
					chrome.runtime.sendMessage(message);
					$location.path('settings');
				});
			});

		}
	}
})();