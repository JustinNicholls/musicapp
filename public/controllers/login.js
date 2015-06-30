angular.module('Musicapp')
    .controller('LoginCtrl', ['$scope', 'Auth', function($scope, Auth) {

        $scope.login = function() {

            Auth.login({

                email: $scope.email,
                password: $scope.password
            });
        };

}]);


