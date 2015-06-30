angular.module('Musicapp')
  .controller('DetailCtrl', ['$scope', '$rootScope', '$routeParams', 'Band', 'Fans', 'Stuff', 'Event', function($scope, $rootScope, $routeParams, Band, Fans, Stuff, Event) {
		  Band.get({ _id: $routeParams.name }, function(band) {
        $scope.band = band;

      var artist = $scope.band.name;
	  
		
		$scope.publiccomments = Stuff.query({type: "public", artist: $scope.band.name});
		$scope.privatecomments = Stuff.query({ type: "private", artist: $scope.band.name, user: $rootScope.currentUser._id});
		$scope.events = Event.query({ user: $rootScope.currentUser._id, artist: $scope.band.name});
		
		$scope.isfan = function() {
          return $scope.band.list.indexOf($rootScope.currentUser._id) !== -1;
        };
		
		
		  $scope.addtolist = function() {
          Fans.add(band).success(function() {
            $scope.band.list.push($rootScope.currentUser._id);
          });
        };

        $scope.removefromlist = function() {
          Fans.remove(band).success(function() {
            var index = $scope.band.list.indexOf($rootScope.currentUser._id);
            $scope.band.list.splice(index, 1);
          });
        };
		
      });
    }]);