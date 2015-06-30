angular.module('Musicapp')
	.factory('Event', ['$resource', function($resource) {
	
		return $resource('/users/events/:id');
	}]);