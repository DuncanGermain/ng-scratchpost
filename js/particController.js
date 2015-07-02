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
	/* Binds the noRedo scope value back to the checkbox on the leader page */
	this.noRedo = this.firebaseObject(redoRef);
	/* Removes the user object from Firebase when the user navigates away */
	meRef.onDisconnect().remove();
	/* Initializes variables to track answers */
	this.prompt = "You have joined session " + this.sessID +
	".\n\nPlease wait for your session leader to submit a prompt.";
	this.hasAnswered = false;
	this.closedByLeader = false;
	this.allAnswers = ['Reload a previous answer'];
	this.history = this.allAnswers[0];
	/* Pulls questions down from Firebase */
	questRef.on('child_added', function(snapshot) {
		var updated = snapshot.val();
		this.prompt = updated;
		this.hasAnswered = false;
		this.closedByLeader = false;
		this.scope.$apply();
	}.bind(this));
	/* Notices if the leader has closed the user's window on the leader page */
	meRef.on('child_changed', function(snapshot) {
		var data = snapshot.val();
		if (data==="cLoSeDbYlEaDeR") {
			this.closedByLeader = true;
		}
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
	this.hasAnswered = true;
}

scratchApp.particController.prototype.resubmit = function() {
	this.myAnswer = this.history;
}
