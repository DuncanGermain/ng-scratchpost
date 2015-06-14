var scratchControllers = angular.module('scratchControllers', []);
var ref = new Firebase('https://resplendent-fire-4150.firebaseio.com');
var sessRef = ref.child('sessions');
var sessID, //Session code as created by the leader
		entryID, //Session code as entered by a participant
		userID; //Username as entered by a participant

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
		var thisRef = sessRef.child(sessID);
		var usersRef = thisRef.child('users');
		var questRef = thisRef.child('questions');
		var redoRef = thisRef.child('noRedo');
		//Initializes variables to track questions and participants
		$scope.asked = 0;
		$scope.answersShown = 0; //Changes layout when session leader closes a user's window
		$scope.clean = false //This is the "show a window for every user" variable
		$scope.attendance = 0;
		$scope.allQuestions = {0: 'Reload a previous question'};
		$scope.history = false;
		//Binds the noRedo checkbox back to the Firebase
		$firebaseObject(thisRef).$bindTo($scope, 'thisRef');
		//Keeps count of total participants
		usersRef.on('child_added', function(snapshot) {
			$scope.attendance++;
			$scope.answersShown++;
			$scope.$apply(); //Angular scope cleanup.
		});
		usersRef.on('child_removed', function(snapshot) {
			$scope.attendance--;
			$scope.answersShown--;
			$scope.$apply(); //Angular scope cleanup.
		});
		//Binds a new participant's Firebase object to a div in the display area
		$firebaseObject(usersRef).$bindTo($scope, 'participants');
		//Pushes new questions up to Firebase
		$scope.pushQuestion = function() {
			$scope.asked++;
			$scope.clean = true; //Setting clean to true brings back all user windows that were closed/hidden during debrief of the previous set of answers
			$scope.currentQ = $scope.question;
			$scope.answersShown = $scope.attendance;
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
		$scope.closeWindow = function(key) {
			$scope.clean = false;
			usersRef.child(key).child('response').set('');
			$scope.answersShown--;
		}
	}]);