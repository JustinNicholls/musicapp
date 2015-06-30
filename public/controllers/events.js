angular.module('Musicapp')
        .controller('EventsCtrl', ['$scope', '$rootScope', '$alert', 'Band', 'Event', function($scope, $rootScope, $alert, Band, Event) {
  
		$scope.artists = Band.query({user: $rootScope.currentUser._id });
		
		
		
		
		$scope.addevent = function() {
      Event.save({ 
		user: $rootScope.currentUser._id,
		artist: $scope.selectedsource.name,
		date: $scope.selectedItem.date,
		location: $scope.secondselect.location,
		Stadium: $scope.eventname
	  
	  },
        function() {
          $scope.eventname = '';
          $scope.addform.$setPristine();
          $alert({
            content: 'Event Added',
            placement: 'top-right',
            type: 'success',
            duration: 3
          });
        },
        function(response) {
          $scope.eventname = '';
          $scope.addform.$setPristine();
          $alert({
            content: response.data.message,
            placement: 'top-right',
            type: 'danger',
            duration: 3
          });
        });
		};
  }]);