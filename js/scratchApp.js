scratchApp = {};

scratchApp.ngModule = angular.module('scratchApp', [
	'firebase',
	'ngRoute'
]);

scratchApp.ngModule.config(function($routeProvider) {
	$routeProvider
		.when('/start', {
			templateUrl: 'partials/start.html',
			controller: 'startController',
			controllerAs: 'startController'
		}).when('/leader', {
			templateUrl: 'partials/leader.html',
			controller: 'leaderController',
			controllerAs: 'leaderController'
		}).when('/partic', {
			templateUrl: 'partials/partic.html',
			controller: 'particController',
			controllerAs: 'particController'
		}).otherwise({
			redirectTo: '/start'
		});
});