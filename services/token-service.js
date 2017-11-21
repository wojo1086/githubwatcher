(function() {
	'use strict';

	angular.module('github')
		.factory('TokenService', TokenService);

	function TokenService() {

		return {
			getToken: getToken
		}

		function getToken() {
			var message = {
				type: 'getToken',
				data: token
			};
			return chrome.runtime.sendMessage(message);;
		}
	}
})();