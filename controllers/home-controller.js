(function () {
	'use strict';

	angular.module('github').controller('HomeController', HomeController);

	function HomeController($location,
	                        StorageService) {
		var vm = this;

		Initialize();

		function Initialize() {
			StorageService.set({landing: true});
			$location.path('settings');
		}
	}
})();