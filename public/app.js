angular.module('Musicapp', ['ngCookies','ngResource', 'ngMessages', 'ngRoute', 'ngAnimate', 'mgcrea.ngStrap'])
    .config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
			$locationProvider.html5Mode(true);
			
			$routeProvider
					.when('/', {
						templateUrl: 'views/home.html',
						controller: 'HomeCtrl'
					})
					.when('/add', {
						templateUrl: 'views/add.html',
						controller: 'AddCtrl'
					})
					.when('/artists/:name', {
						templateUrl: 'views/details.html',
						controller: 'DetailCtrl'
					})
					.when('/comments', {
						templateUrl: 'views/comments.html',
						controller: 'CommentCtrl'
					})
					.when('/events', {
						templateUrl: 'views/events.html',
						controller: 'EventsCtrl'
					})
					.when('/login', {
						templateUrl: 'views/login.html',
						controller: 'LoginCtrl'
					})
					.when('/signup', {
						templateUrl: 'views/signup.html',
						controller: 'SignupCtrl'
					})
					.otherwise({
						redirectTo: '/'
					});
    }]);
