(function() {
	'use strict';

	angular.module('github').controller('LoginController', LoginController);

	function LoginController(landing,
	                         $location) {
		var vm = this;

		if(landing) {
			$location.path('home');
		}

		vm.handleLogin = handleLogin;

		function handleLogin() {
			$location.path('home');
		}
	}
})();