angular.module('Musicapp')
	.factory('Band', ['$resource', function($resource) {
	
		return $resource('/users/artists/:_id');
	}]);