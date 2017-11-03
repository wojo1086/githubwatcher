(function() {
	'use strict';

	angular.module('github').factory('BackService', BackService);

	function BackService() {
		var showBack = false;

		return {
			get: function() {
				return showBack;
			},
			set: function(value) {
				showBack = value;
			}
		}
	}
})();