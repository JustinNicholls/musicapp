angular.module('Musicapp')
    .controller('SignupCtrl', ['$scope', 'Auth', function($scope, Auth) {

        $scope.signup = function() {

            Auth.signup({
				first: $scope.first,
				last: $scope.last,
                email: $scope.email,
                password: $scope.password
            });
        };

    }]);
