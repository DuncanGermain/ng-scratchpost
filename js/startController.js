var ref = new Firebase('https://resplendent-fire-4150.firebaseio.com');
var sessRef = ref.child('sessions');

scratchApp.startController = function($scope, $routeParams, $firebaseObject, $location) {
	this.scope = $scope;
	this.routeParams = $routeParams;
	this.firebaseObject = $firebaseObject;
	this.location = $location;
	this.userState = "untouched";
	this.sysMsg = '';
};
var startController = scratchApp.startController;

scratchApp.startController.prototype.goToStartSession() = {
	this.userState = "startingSession";
	this.sysMsg = "Please create an alphanumeric session code.";
};

scratchApp.startController.prototype.goToJoinSession() = {
	this.userState = "joiningSession";
	this.sysMsg = "Please enter the session code and a username.";
};

scratchApp.startController.prototype.startSession() = {
	var sessID = this.sessID;
	function makeSessID(sessID, unique) {
		if (!unique) {
			this.sysMsg = "Sorry, a session with that code is already in progress. Please enter a different code.";
		} else {
			// Creates default object for a new session with the chosen name, and adds it to Firebase
			var initObj = {};
			initObj[sessID] = {
				users: true,
				questions: true,
				noRedo: false
			};
			sessRef.update(initObj);
			this.location.path('/leader'); // Navigates to leader page
		}
		this.scope.$apply(); // Angular scope cleanup
	}
	// Confirms that there is no data stored at the path corresponding to the entered session code
	sessRef.child(sessID).once('value', function(snapshot) {
		var unique = (snapshot.val() === null);
		makeSessID(sessID, unique);
	});
};

scratchApp.startController.prototype.joinSession() = {
	var entryID = this.entryID;
	var userID = this.userID;
	var unique; // To be assigned below when checking for username uniqueness
	function checkSessID(entryID, exists, unique) {
		if (!exists) {
			this.sysMsg = "Sorry, we can't find a session with that code. Please try again, or contact your session leader for help.";
		} else if (exists && !unique) {
			this.sysMsg = "Sorry, that username has already been taken for this session. Please choose another.";
		} else {
			// Creates default object for a new user with the chosen username, and adds it to Firebase
			var userObj = {};
			var loggedIn = userID + ' has joined session ' + entryID + '.';
			userObj[userID] = {response: loggedIn};
			sessRef.child(entryID).child('users').update(userObj);
			this.location.path('/partic'); // Navigates to participant page
		}
		this.scope.$apply(); // Angular scope cleanup
	}
	// Confirms that there is no data stored at the path corresponding to the entered username
	sessRef.child(entryID)
				 .child('users')
				 .child(userID)
				 .once('value', function(snapshot) {
				 	unique = (snapshot.val() === null);
	});
	// Confirms that there IS data stored at the path corresponding to the entered session code
	sessRef.child(entryID).once('value', function(snapshot) {
    var exists = (snapshot.val() !== null);
    checkSessID(entryID, exists, unique);
	});
};