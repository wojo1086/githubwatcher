(function () {
	'use strict';

	angular.module('github')
	.factory('TransactService', TransactService);

	function TransactService($http,
	                         TokenService) {

		return {
			transactPost: transactPost,
			transactGet: transactGet
		}

		function transactPost(data) {
			return $http.post(data.url).then(function(data) {
				return data.data;
			});
		}

		function transactGet(data) {
			var headers = {};
			var payload = {
				url: data.url,
				config: {}
			};
			if(data.use_token) {
				headers.Authorization = 'token ' + TokenService.getToken();
			}

			payload.config.headers = headers;
			return $http.get(payload.url, payload.config).then(function (data) {
				return data.data;
			});
		}
	}
})();