(function() {
	'use strict';

	angular.module('github').component('settingsDropdown', {
		templateUrl: 'partials/settings-dropdown.html',
		controller: SettingsDropdown
	});

	function SettingsDropdown($rootScope,
	                          $document,
	                          $element,
	                          $location,
	                          StorageService) {
		var ctrl  = this;

		// Whether or not to show dropdown
		ctrl.showDropdown = false;

		// Array of links for the dropdown
		ctrl.links = [
			{
				name: 'Home',
				value: '/'
			},
			{
				name: 'About',
				value: 'about'
			}
		];

		ctrl.toggleDropdown = toggleDropdown;
		ctrl.go = go;

		Initialize();

		function Initialize() {
			StorageService.get('landing').then(function (data) {
				if(!!data) {
					ctrl.links.splice(1, 0,
						{
							name: 'Settings',
							value: 'settings'
						}
					);
				}
			});
		}

		$document.bind('click', onClick);

		function toggleDropdown() {
			ctrl.showDropdown = !ctrl.showDropdown;
		}

		function go(route) {
			ctrl.showDropdown = false;
			$location.path(route);
		}

		function onClick(event) {
			var isChild = $($element[0]).has(event.target).length > 0;
			var isSelf = $element[0] == event.target;
			var isInside = isChild || isSelf;
			if(!isInside) {
				$rootScope.$applyAsync(function() {
					ctrl.showDropdown = false;
				});
			}
		}

	}
})();