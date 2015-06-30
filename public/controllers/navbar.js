angular.module('Musicapp')
  .controller('NavbarCtrl', ['$scope', 'Auth', function($scope, Auth) {
    $scope.logout = function() {
      Auth.logout();
    };
  }]);