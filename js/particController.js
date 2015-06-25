scratchApp.particController = function($scope, $routeParams, $firebaseObject, SessionInfo) {
	this.scope = $scope;
	this.routeParams = $routeParams;
	this.firebaseObject = $firebaseObject;
	this.sessID = SessionInfo.getSessionName();
	this.userID = SessionInfo.getUserName();
	/* Shortcuts for navigating the Firebase */
	thisRef = sessRef.child(this.sessID);
	questRef = thisRef.child('questions');
	redoRef = thisRef.child('noRedo');
	meRef = thisRef.child('users').child(this.userID);
	/* Removes the user object from Firebase when the user navigates away */
	meRef.onDisconnect().remove();
	/* Initializes variables to track answers */
	this.prompt = "You have joined session " + this.sessID +
	".\n\nPlease wait for your session leader to submit a prompt.";
	this.allAnswers = ['Reload a previous answer'];
	this.history = this.allAnswers[0];
	/* Pulls questions down from Firebase */
	questRef.on('child_added', function(snapshot) {
		var updated = snapshot.val();
		this.prompt = updated;
		this.scope.$apply();
	}.bind(this));
}
scratchApp.ngModule.controller('particController', scratchApp.particController);

scratchApp.particController.prototype.pushAnswer = function() {
	this.currentA = this.myAnswer;
	/* Pushes current answer up to Firebase */
	meRef.child('response').set(this.currentA);
	/* Updates in-page record of answers for dropdown */
	this.allAnswers.push(this.currentA);
}

scratchApp.particController.prototype.resubmit = function() {
	this.myAnswer = this.history;
}
