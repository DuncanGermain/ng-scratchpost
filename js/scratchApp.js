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

scratchApp.ngModule.service('SessionInfo', function() {
	var sessID;
	var userID;
	var newest;
	return {
		setSessionName: function(value) {
			sessID = value;
		},
		getSessionName: function() {
			return sessID;
		},
		setUserName: function(value) {
			userID = value;
		},
		getUserName: function() {
			return userID;
		},
		setNewest: function(value) {
			newest = value;
		},
		getNewest: function() {
			return newest;
		}
	};
});

/* Turns nested Firebase users object into an array of users, with each element
in the array being a user object. This is to allow for randomization and
reordering of user windows in the main display, which is much simpler when done
with an array than when iterating over an object. */
scratchApp.ngModule.filter('toArray', function() {
	return function(obj) {
		var result = [];
		var isALegalName = /^(?!forEach)[ A-Za-z0-9]*$/;
		angular.forEach(obj, function(val, key) {
			if (isALegalName.test(key)) {
				result.push(val);
			}
		});
		return result;
	};
});

var ref = new Firebase('https://resplendent-fire-4150.firebaseio.com');
var sessRef = ref.child('sessions');
/* Shortcuts for navigating Firebase */
var thisRef,
		usersRef,
		questRef,
		redoRef;