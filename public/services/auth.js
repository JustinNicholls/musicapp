angular.module('Musicapp')
  .factory('Auth', ['$http', '$location', '$rootScope', '$cookieStore', '$alert',
    function($http, $location, $rootScope, $cookieStore, $alert) {
      $rootScope.currentUser = $cookieStore.get('user');
      $cookieStore.remove('user');

      return {
        login: function(user) {
          return $http.post('/users/signin', user)
            .success(function(data) {
              $rootScope.currentUser = data;
              $location.path('/');

              $alert({
                title: 'Yes',
                content: 'Login Successful',
                placement: 'top-right',
                type: 'success',
                duration: 3
              });
            })
            .error(function() {
              $alert({
                title: 'O No',
                content: 'Something went wrong',
                placement: 'top-right',
                type: 'danger',
                duration: 3
              });
            });
        },
        signup: function(user) {
          return $http.post('/users/signup', user)
            .success(function() {
              $location.path('/login');

              $alert({
                title: 'Yes',
                content: 'Account creation successful',
                placement: 'top-right',
                type: 'success',
                duration: 3
              });
            })
            .error(function(response) {
              $alert({
                title: 'Error!',
                content: response.data,
                placement: 'top-right',
                type: 'danger',
                duration: 3
              });
            });
        },
        logout: function() {
          return $http.get('/users/logout').success(function() {
            $rootScope.currentUser = null;
            $cookieStore.remove('user');
            $alert({
              content: 'Goodbye',
              placement: 'top-right',
              type: 'info',
              duration: 3
            });
          });
        },
		add: function(user) {
          return $http.post('/users/artists', user)
            .success(function() {
			
              $alert({
                title: 'Yes',
                content: 'Band added',
                placement: 'top-right',
                type: 'success',
                duration: 3
              });
            })
            .error(function() {
              $alert({
                title: 'O No',
                content: 'Something went wrong',
                placement: 'top-right',
                type: 'danger',
                duration: 3
              });
            });
        }
      };
    }]);