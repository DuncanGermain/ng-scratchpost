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
			controllerAs: 'start'
		}).when('/leader', {
			templateUrl: 'partials/leader.html',
			controller: 'leaderController',
			controllerAs: 'lead'
		}).when('/partic', {
			templateUrl: 'partials/partic.html',
			controller: 'particController',
			controllerAs: 'part'
		}).otherwise({
			redirectTo: '/start'
		});
});

scratchApp.ngModule.service('SessionName', function() {
	var sessID;
	return {
		getSessionName: function() {
			return sessID;
		},
		setSessionName: function(value) {
			sessID = value;
		}
	};
});

var ref = new Firebase('https://resplendent-fire-4150.firebaseio.com');
var sessRef = ref.child('sessions');
