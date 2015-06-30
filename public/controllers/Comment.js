angular.module('Musicapp')
		.controller('CommentCtrl', ['$scope', '$alert', '$rootScope', 'Stuff', 'Band', function($scope, $alert, $rootScope, Stuff, Band) {  
  
		$scope.comments = [
		{name: 'private'},
		{name: 'public'}
		];
		
		$scope.artists = Band.query({user: $rootScope.currentUser._id });
		
		
				
			
		
		var art = $scope.one;
		var moo = $scope.two;
		
		$scope.addcomment = function() {
      Stuff.save({ 
		user: $rootScope.currentUser._id,
		user_first: $rootScope.currentUser.first,
		artist: $scope.one.name,
		type: $scope.two.name,
		comment: $scope.comment
	  
	  },
        function() {
          $scope.comment = '';
          $scope.commentform.$setPristine();
          $alert({
            content: 'Comment Added',
            placement: 'top-right',
            type: 'success',
            duration: 3
          });
        },
        function(response) {
          $scope.comment = '';
          $scope.commentform.$setPristine();
          $alert({
            content: response.data.message,
            placement: 'top-right',
            type: 'danger',
            duration: 3
          });
        });
    };
		
  }]);
  
  
  