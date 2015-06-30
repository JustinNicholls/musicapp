angular.module('Musicapp')
        .controller('HomeCtrl', ['$scope', '$rootScope', 'Band', 'Event', function($scope, $rootScope , Band, Event){

      
            $scope.Title = 'User List';
			$scope.List = 'User Events';
			$scope.Added = 'Previously Added Artists';

            $scope.artists = Band.query({user: $rootScope.currentUser._id });
			$scope.lists = Band.query();
			$scope.events = Event.query({ user: $rootScope.currentUser._id});


}]);