var scratchApp = angular.module('scratchApp', [
	'firebase',
	'ngRoute',
	'scratchControllers'
	]);

scratchApp.config(function($routeProvider) {
		$routeProvider
			.when('/start', {
				templateUrl: 'partials/start.html',
				controller: 'StartControl'
			}).when('/leader', {
				templateUrl: 'partials/leader.html',
				controller: 'LeaderControl'
			}).when('/partic', {
				templateUrl: 'partials/partic.html',
				controller: 'ParticControl'
			}).otherwise({
				redirectTo: '/start'
			});
});