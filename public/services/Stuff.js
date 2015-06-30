angular.module('Musicapp')
	.factory('Stuff', ['$resource', function($resource) {
	
		return $resource('/users/comments/:id');
	}]);