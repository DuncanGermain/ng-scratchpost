
var scratchControllers = angular.module('scratchControllers', []);
var ref = new Firebase('https://resplendent-fire-4150.firebaseio.com');
var sessRef = ref.child('sessions');

scratchControllers.controller('StartControl', [
	'$scope',
	'$routeParams',
	'$firebaseObject',
	function($scope, $routeParams, $firebaseObject) {
		$scope.data = $firebaseObject(ref);

	}]);


scratchControllers.controller('LeaderControl', [
	'$scope',
	'$routeParams',
	'$firebaseObject',
	function($scope, $routeParams, $firebaseObject) {
		$scope.saveSession = function() {
			$scope.saved = $scope.sessID;
			//Can't sessRef.update({$scope.saved:true}). Lines below are a workaround.
			var obj = {};
			obj[$scope.saved] = true;
			sessRef.update(obj);
		}
	}]);


scratchControllers.controller('ParticControl', [
	'$scope',
	'$routeParams',
	'$firebaseObject',
	function($scope, $routeParams, $firebaseObject) {
	}]);