scratchApp.leaderController = function($scope, $routeParams, $firebaseObject, SessionInfo, $q) {
	this.scope = $scope;
	this.routeParams = $routeParams;
	this.firebaseObject = $firebaseObject;
	this.sessID = SessionInfo.getSessionName();
	/* $q is the Angular asynchronous service */
	this.q = $q;
	/* Shortcuts for navigating the Firebase */
	thisRef = sessRef.child(this.sessID);
	usersRef = thisRef.child('users');
	questRef = thisRef.child('questions');
	redoRef = thisRef.child('noRedo');
	/* Removes the session object from Firebase when the leader navigates away */
	thisRef.onDisconnect().remove();
	/* Binds the noRedo checkbox back to the Firebase */
	this.firebaseObject(thisRef).$bindTo(this.scope, 'thisRef');
	/* Binds a new participant's Firebase object to a div in the display area */
  this.participants = this.firebaseObject(usersRef);
	/* Initializes variables to track questions and participants */
	this.asked = 0; // Tracks total number of questions pushed
	this.attendance = 0; // Tracks total number of participants
	this.answersShown = 0; // Tracks participant windows currently being displayed
	this.showAll = false; // Allows leader to close/hide participant windows
	this.allQuestions = {0: 'Reload a previous question'}; // History dropdown
	/* Keeps count of total participants */
	usersRef.on('child_added', function(snapshot) {
		this.attendance++;
		this.answersShown++;
		this.newest = snapshot.val()['name'];
	}.bind(this));
	usersRef.on('child_removed', function(snapshot) {
		this.attendance--;
		this.answersShown--;
	}.bind(this));
	/* Variable allowing for the zoom of individual windows in the scratchpost */
	this.zoomIndex = 999;
};
var leaderController = scratchApp.leaderController;

scratchApp.leaderController.prototype.pushQuestion = function() {
	/* RegEx that will find Firebase properties which are users, based on the fact
	that every user is automatically assigned a unique key beginning with a
	hyphen. This is necessary to avoid accidental fiddling with hidden properties
	of the Firebase such as $id and forEach. */
	this.isALegalName = /^(?!forEach)[ A-Za-z0-9]*$/;
	for (var user in this.participants) {
		if (this.isALegalName.test(user)) {
			/* Clears participant responses so that all user windows show blank */
			usersRef.child(user).child('response').set('');
			/* Randomizes ranking so that user windows appear in a new random order */
			var displayOrder = Math.floor(Math.random()*10000000);
			usersRef.child(user).child('rank').set(displayOrder);
		}
	}
	/* Locks in current input in the leader textarea */
	this.currentQ = this.question;
	this.asked++;
	/* Assigns question content to a numbered key, and adds it to Firebase */
	var questObj = {};
	questObj[this.asked] = this.currentQ;
	questRef.update(questObj);
	/* Updates in-page record of questions for dropdown */
	this.allQuestions[this.asked] = this.currentQ;
	/* Brings back all user windows that were closed/hidden during debrief of the
	previous set of answers */
	this.showAll = true;
	this.answersShown = this.attendance;
}

scratchApp.leaderController.prototype.resubmit = function() {
	this.question = this.history;
}

scratchApp.leaderController.prototype.closeUserWindow = function(name) {
	this.showAll = false;
	usersRef.child(name).child('response').set('cLoSeDbYlEaDeR');
	this.answersShown--;
}

scratchApp.leaderController.prototype.zoomUserWindow = function(val) {
	if (this.zoomIndex !== val) {
		this.zoomIndex = val;
	} else {
		this.zoomIndex = 999;
	}
}

scratchApp.leaderController.prototype.moveUserWindow = function(val) {
	alert("You have attempted to use the 'move' feature, which has not yet been implemented.");
}

scratchApp.ngModule.controller('leaderController', scratchApp.leaderController);