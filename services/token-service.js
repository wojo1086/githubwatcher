(function() {
	'use strict';

	angular.module('github')
		.factory('TokenService', TokenService);

	function TokenService() {
		var token;

		return {
			getToken: getToken,
			setToken: setToken
		}

		function getToken() {
			return token;
		}

		function setToken(data) {
			token = data;
		}
	}
})();