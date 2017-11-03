(function () {
	'use strict';

	angular.module('github').controller('HeaderController', HeaderController);

	function HeaderController(StorageService) {
		var vm = this;

		vm.isLanding = true;

		Initialize();

		function Initialize() {
			StorageService.get('landing').then(function (data) {
				vm.isLanding = !!data;
			});
		}
	}
})();