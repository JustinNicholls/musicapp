angular.module('Musicapp')
        .controller('AddCtrl', ['$scope', '$alert', '$rootScope', 'Band', function($scope, $alert, $rootScope, Band) {
    $scope.addartist = function() {
      Band.save({ artistname: $scope.artistname,
			user: $rootScope.currentUser._id
	  },
        function() {
          $scope.artistname = '';
          $scope.addform.$setPristine();
          $alert({
            content: 'Artist has been added.',
            placement: 'top-right',
            type: 'success',
            duration: 3
          });
        },
        function(response) {
          $scope.artistname = '';
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