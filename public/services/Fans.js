angular.module('Musicapp')
  .factory('Fans', ['$http', function($http) {
    return {
      add: function(Band, user) {
        return $http.post('/users/add', { bandid: Band._id });
      },
      remove: function(Band, user) {
        return $http.post('/users/remove', { bandid: Band._id });
      }
    };
  }]);