(function() {
'use strict';

	angular.module('github', ['ngRoute'])
		.config(function($routeProvider) {

			$routeProvider
				.when('/', {
					templateUrl: 'views/login.html',
					controller: 'LoginController',
					controllerAs: 'vm',
					resolve: {
						landing: function(StorageService) {
							return StorageService.get('landing');
						}
					}
				})
				.when('/initialSetup', {
					url: '/initialSetup',
					templateUrl: 'views/initial-setup.html',
					controller: 'InitialSetupController',
					controllerAs: 'vm'
				})
				.when('/home', {
					url: '/home',
					templateUrl: 'views/home.html',
					controller: 'HomeController',
					controllerAs: 'vm'
				})
				.when('/about', {
					url: '/about',
					templateUrl: 'views/about.html',
					controller: 'AboutController',
					controllerAs: 'vm'
				});
		});
})();