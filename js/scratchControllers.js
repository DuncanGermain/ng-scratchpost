var scratchControllers = angular.module('scratchControllers', []);
var ref = new Firebase('https://resplendent-fire-4150.firebaseio.com');
var sessRef = ref.child('sessions');
var sessID,
		entryID,
		userID;

scratchControllers.controller('StartControl', [
	'$scope',
	'$routeParams',
	'$firebaseObject',
	'$location',
	function($scope, $routeParams, $firebaseObject, $location) {
		//Allows for in-view navigation of Start and Join
		$scope.startButtons = true;
		$scope.startOptions = false;
		$scope.joinOptions = false;
		$scope.msg = '';
		$scope.newSess = function() {
			$scope.startButtons = false;
			$scope.startOptions = true;
			$scope.msg = "Please create a session code.";
		};
		$scope.joinSess = function() {
			$scope.startButtons = false;
			$scope.joinOptions = true;
			$scope.msg = "Please enter the session code and a username."
		};

		//Functionality for starting a new session
		$scope.saveSession = function() {
			sessID = $scope.sessID;
			//Creates default object for a new session with the chosen name
			var initObj = {};
			initObj[sessID] = {
				users: true,
				questions: true,
				checkboxes: {noAnon: false, noRedo: false, noShow: false}
			};
			sessRef.update(initObj);
		};

		//Functionality for joining an existing session
		$scope.joinSession = function() {
			entryID = $scope.entryID;
			userID = $scope.userID;
			var unique;
			function checkSessID(entryID, exists, unique) {
				if (exists && unique) {
					//Creates default object for a new user with the chosen name
					var userObj = {};
					userObj[userID] = {data: 'New user!'};
					sessRef.child(entryID).child('users').update(userObj);
					$location.path('/partic');
				} else if (exists && !unique) {
					$scope.msg = "Sorry, that username has already been taken for this session. Please choose another."
				} else {
					$scope.msg = "Sorry, we can't find a session with that code. Please try again, or contact your session leader for help."
				}
			}
			//Confirms that there is no data stored at the path corresponding to the entered username
			sessRef.child(entryID).child('users').child(userID).once('value', function(snapshot) {
				unique = (snapshot.val() === null);
			});
			//Confirms that there IS data stored at the path corresponding to the entered session code
			sessRef.child(entryID).once('value', function(snapshot) {
				var exists = (snapshot.val() !== null);
				checkSessID(entryID, exists, unique);
			});
		}
	}]);


scratchControllers.controller('LeaderControl', [
	'$scope',
	'$routeParams',
	'$firebaseObject',
	function($scope, $routeParams, $firebaseObject) {
		$scope.sessID = sessID;
			var disconnectMe = sessRef.child(sessID);
			disconnectMe.onDisconnect().remove();
			var usersRef = sessRef.child(sessID).child('users');
			var questRef = sessRef.child(sessID).child('questions');
			var checkRef = sessRef.child(sessID).child('checkboxes');
			$firebaseObject(checkRef).$bindTo($scope, 'checkboxes');

		// $scope.pushQuestion = function() {
		// 	$scope.pushed = $scope.question;
		// 	var obj = {
		// 		question: $scope.pushed
		// 	};
		// 	console.log(obj);
		// 	console.log(sessRef);
		// 	console.log(sessRef.child($scope.saved));
		// }
	}]);


scratchControllers.controller('ParticControl', [
	'$scope',
	'$routeParams',
	'$firebaseObject',
	function($scope, $routeParams, $firebaseObject) {
		var disconnectMe = sessRef.child(entryID).child('users').child(userID);
		disconnectMe.onDisconnect().remove();
		$scope.userID = userID;
		$scope.entryID = entryID;



	}]);


