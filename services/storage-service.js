(function() {
	'use strict';

	angular.module('github')
		.factory('StorageService', StorageService);

	function StorageService($q) {
		return {
			set: set,
			get: get
		};

		function set(data) {
			return $q(function(resolve) {
				chrome.storage.sync.set(data, resolve);
			});
		}

		function get(data) {
			return $q(function(resolve) {
				chrome.storage.sync.get(data, function(storageData) {
					if(angular.isUndefined(data)) {
						resolve(storageData);
					} else {
						resolve(storageData[data]);
					}
				});
			});
		}
	}
})();