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
			$scope.sysMsg = "Please create an alphanumeric session code.";
		};
		$scope.joinSess = function() {
			$scope.startButtons = false;
			$scope.joinOptions = true;
			$scope.sysMsg = "Please enter the session code and a username."
		};

		//Functionality for starting a new session
		$scope.saveSession = function() {
			sessID = $scope.sessID;
			function makeSessID(sessID, unique) {
				if (!unique) {
					$scope.sysMsg = "Sorry, a session with that code is already in progress. Please enter a different code."
				} else {
					//Creates default object for a new session with the chosen name, and adds it to Firebase
					var initObj = {};
					initObj[sessID] = {
						users: true,
						questions: true,
						checkboxes: {noAnon: false, noRedo: false, noShow: false}
					};
					sessRef.update(initObj);
					$location.path('/leader'); //Routes to leader page
				}
				$scope.$apply(); //Angular scope cleanup
			}
			//Confirms that there is no data stored at the path corresponding to the entered session code
			sessRef.child(sessID).once('value', function(snapshot) {
				var unique = (snapshot.val() === null);
				makeSessID(sessID, unique);
			});
		}

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
					userObj[userID] = {response: 'New user!'};
					sessRef.child(entryID).child('users').update(userObj);
					$location.path('/partic'); //Routes to participant page
				}
				$scope.$apply(); //Angular scope cleanup
			}
			//Confirms that there is no data stored at the path corresponding to the entered username
			sessRef.child(entryID)
						 .child('users')
						 .child(userID)
						 .once('value', function(snapshot) {
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
		$scope.allQuestions = {0: 'Reload a previous question'};
		$scope.history = false;
		//Binds the checkboxes back to the Firebase
		$firebaseObject(checkRef).$bindTo($scope, 'checkboxes');
		//Keeps count of total participants
		usersRef.on('child_added', function(snapshot) {
			$scope.attendance++;
			$scope.$apply(); //Angular scope cleanup.
		});
		usersRef.on('child_removed', function(snapshot) {
			$scope.attendance--;
			$scope.$apply(); //Angular scope cleanup.
		});
		//Binds a new participant's Firebase object to a div in the display area
		$firebaseObject(usersRef).$bindTo($scope, 'participants');
		//Pushes new questions up to Firebase
		$scope.pushQuestion = function() {
			$scope.asked++;
			$scope.currentQ = $scope.question;
			//Assigns question content to a numbered key, and adds it to Firebase
			var questObj = {};
			questObj[$scope.asked] = $scope.currentQ;
			questRef.update(questObj);
		}
		//Allows for storing/viewing/reloading of previous questions
		questRef.on('child_added', function(snapshot) {
			var updated = snapshot.val();
			$scope.allQuestions[$scope.asked] = updated;
		})
		$scope.resubmit = function() {
			$scope.question = $scope.history;
		}
		$scope.closeWindow = function() {
			alert("clicked");
			$parent.visible = false;
			$scope.$apply();
		}
	}]);

scratchControllers.controller('ParticControl', [
	'$scope',
	'$routeParams',
	'$firebaseObject',
	function($scope, $routeParams, $firebaseObject) {
		//Creates quick references for the questions and checkboxes within the session
		var questRef = sessRef.child(entryID).child('questions');
		var checkRef = sessRef.child(entryID).child('checkboxes');
		var meRef = sessRef.child(entryID).child('users').child(userID);
		//Ensures that Firebase empties when the participant disconnects
		meRef.onDisconnect().remove();
		//Initializes variables to track questions and participants
		$scope.userID = userID;
		$scope.entryID = entryID;
		$scope.prompt = "You have joined session " + entryID + ".\n\nPlease wait for your session leader to submit a prompt."
		$scope.allAnswers = ['Reload a previous answer'];
		//Pulls questions down from Firebase
		questRef.on('child_added', function(snapshot) {
			var updated = snapshot.val();
			console.log(updated);
			$scope.prompt = updated;
			$scope.$apply(); //Angular scope cleanup.
		});
		//Sets the current answer equal to the participant's entry on the page
		$scope.pushAnswer = function() {
			$scope.currentA = $scope.myAnswer;
			meRef.child('response').set($scope.currentA);
			$scope.allAnswers.push($scope.currentA);
		}
		$scope.resubmit = function() {
			$scope.myAnswer = $scope.history;
		}


	}]);


