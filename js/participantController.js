


var scratchControllers = angular.module('scratchControllers', []);
var ref = new Firebase('https://resplendent-fire-4150.firebaseio.com');
var sessRef = ref.child('sessions');
var sessID, //Session code as created by the leader
		entryID, //Session code as entered by a participant
		userID; //Username as entered by a participant

scratchControllers.controller('ParticControl', [
	'$scope',
	'$routeParams',
	'$firebaseObject',
	function($scope, $routeParams, $firebaseObject) {
		//Creates quick references for the questions and checkboxes within the session
		var thisRef = sessRef.child(entryID);
		var questRef = thisRef.child('questions');
		var redoRef = thisRef.child('noRedo');
		var meRef = thisRef.child('users').child(userID);
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


