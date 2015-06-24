
scratchApp.leaderController = function($scope, $routeParams, $firebaseObject, SessionName) {
	this.scope = $scope;
	this.routeParams = $routeParams;
	this.firebaseObject = $firebaseObject;
	this.scope.SessionName = SessionName;
	// Draws sessID down from the page to make it available to the template
	var sessID = this.SessionName.sessID;
	var	thisRef = sessRef.child(sessID),
			usersRef = thisRef.child('users'),
			questRef = thisRef.child('questions'),
			redoRef = thisRef.child('noRedo');
	// Removes the session object from Firebase when the leader navigates away
	thisRef = sessRef.child(sessID);
	thisRef.onDisconnect().remove();
	// Variables to track questions and participants
	this.asked = 0;
	// For use in layout changes when session leader closes a user's window
	this.answersShown = 0;
	// This is the "show a window for every user" variable
	this.clean = false;
	this.attendance = 0;
	this.allQuestions = {0: 'Reload a previous question'};
	this.history = false;
	// Binds the noRedo checkbox back to the Firebase
	this.firebaseObject(thisRef).$bindTo(this.scope, 'thisRef');
	// Binds a new participant's Firebase object to a div in the display area
	this.firebaseObject(usersRef).$bindTo(this.scope, 'participants');
	// Keeps count of total participants
	usersRef.on('child_added', function(snapshot) {
		this.attendance++;
		this.answersShown++;
		this.scope.$apply(); // Angular scope cleanup
	});
};
var leaderController = scratchApp.leaderController;
var sessRef = ref.child('sessions');

scratchApp.leaderController.prototype.pushQuestion = function() {
	this.asked++;
	this.clean = true; // Setting clean to true brings back all user windows that were closed/hidden during debrief of the previous set of answers
	this.currentQ = this.question;
	this.answersShown = this.attendance;
	// Assigns question content to a numbered key, and adds it to Firebase
	var questObj = {};
	questObj[this.asked] = this.currentQ;
	questRef.update(questObj);
	this.allQuestions[this.asked] = this.currentQ;
	// Allows for storing/viewing/reloading of previous questions
	// questRef.on('child_added', function(snapshot) {
	// 	var updated = snapshot.val();
	// 	this.allQuestions[this.asked] = updated;
	// }.bind(this));
}

scratchApp.leaderController.prototype.resubmit = function() {
	this.question = this.history;
}

scratchApp.leaderController.prototype.closeUserWindow = function(key) {
	this.clean = false;
	usersRef.child(key).child('response').set('');
	this.answersShown--;
}

scratchApp.ngModule.controller('leaderController', scratchApp.leaderController);