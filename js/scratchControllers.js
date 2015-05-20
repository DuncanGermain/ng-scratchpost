var scratchControllers = angular.module('scratchControllers', []);
var ref = new Firebase('https://resplendent-fire-4150.firebaseio.com');
var sessRef = ref.child('sessions');
var sessID, //Session code as created by the leader
		entryID, //Session code as entered by a participant
		userID; //Username as entered by a participant

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
		$scope.sysMsg = '';
		$scope.newSess = function() {
			$scope.startButtons = false;
			$scope.startOptions = true;
			$scope.sysMsg = "Please create a session code.";
		};
		$scope.joinSess = function() {
			$scope.startButtons = false;
			$scope.joinOptions = true;
			$scope.sysMsg = "Please enter the session code and a username."
		};

		//Functionality for starting a new session
		$scope.saveSession = function() {
			sessID = $scope.sessID;
			//Creates default object for a new session with the chosen name, and adds it to Firebase
			var initObj = {};
			initObj[sessID] = {
				users: true,
				questions: true,
				checkboxes: {noAnon: false, noRedo: false, noShow: false}
			};
			sessRef.update(initObj);
			$location.path('/leader'); //Routes to leader page
		};

		//Functionality for joining an existing session
		$scope.joinSession = function() {
			entryID = $scope.entryID;
			userID = $scope.userID;
			var unique; //To be assigned below when checking for username uniqueness
			function checkSessID(entryID, exists, unique) {
				if (!exists) {
					$scope.sysMsg = "Sorry, we can't find a session with that code. Please try again, or contact your session leader for help."
				} else if (exists && !unique) {
					$scope.sysMsg = "Sorry, that username has already been taken for this session. Please choose another."
				} else {
					//Creates default object for a new user with the chosen username, and adds it to Firebase
					var userObj = {};
					userObj[userID] = {data: 'New user!'};
					sessRef.child(entryID).child('users').update(userObj);
					$location.path('/partic'); //Routes to participant page
				}
				$scope.$apply(); //Angular scope cleanup; patch for bug where updating sysMsg and navigating to /partic required a double click, even though data was being sent to Firebase on the first click.
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
		//Draws the session code down from the global scope to make it available within the view
		$scope.sessID = sessID;
		//Ensures that Firebase empties when the session leader disconnects
		var disconnectMe = sessRef.child(sessID);
		disconnectMe.onDisconnect().remove();
		//Creates quick references for the users, questions, and checkboxes within the session
		var usersRef = sessRef.child(sessID).child('users');
		var questRef = sessRef.child(sessID).child('questions');
		var checkRef = sessRef.child(sessID).child('checkboxes');
		//Initializes variables to track questions and participants
		$scope.asked = 0;
		$scope.attendance = 0;
		//Binds the checkboxes back to the Firebase
		$firebaseObject(checkRef).$bindTo($scope, 'checkboxes');
		//Pushes new questions up to Firebase
		$scope.pushQuestion = function() {
			$scope.asked++;
			$scope.currentQ = $scope.question;
			//Assigns question content to a numbered key, and adds it to Firebase
			var questObj = {};
			questObj[$scope.asked] = $scope.currentQ;
			questRef.update(questObj);

		}



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


