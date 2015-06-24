scratchApp.startController = function($scope, $routeParams, $firebaseObject, $location, SessionName, $q) {
	this.scope = $scope;
	this.routeParams = $routeParams;
	this.firebaseObject = $firebaseObject;
	this.location = $location;
	this.getSessionName = function() {
		return SessionName.getSessionName();
	};
	this.setSessionName = function(val) {
		return SessionName.setSessionName(val);
	};
	this.q = $q;
	this.userState = "untouched";
	this.sysMsg = '';
};
var startController = scratchApp.startController;

scratchApp.startController.prototype.goToStartSession = function() {
	this.userState = "startingSession";
	this.sysMsg = "Please create an alphanumeric session code.";
};

scratchApp.startController.prototype.goToJoinSession = function() {
	this.userState = "joiningSession";
	this.sysMsg = "Please enter the session code and a username.";
};

scratchApp.startController.prototype.startSession = function() {
	var entered = this.desiredSessID;
	var sessIDIsUnique;
	/* Checks whether there is data in Firebase corresponding to the entered
	session code, then responds accordingly. Asynchronous since execution based
	on unique-or-not-unique needs to wait until Firebase has responded. */
	var check = function() {
		/* The variable deferred contains a 'this' call that would ordinarily do
		something terrible/confusing. It gets bound to the startController instead
		in the call on line 52 and the bind on line 72. */
		var deferred = this.q.defer();
		/* Sets up the promise object for the Firebase response */
		sessRef.child(entered).once('value', function(snapshot) {
			sessIDIsUnique = (snapshot.val() === null);
			if (sessIDIsUnique) {
				deferred.resolve(true);
			} else {
				deferred.resolve(false);
			}
		});
		return deferred.promise;
	}
	/* Once Firebase responds, the entered session code will either be rejected,
	or the unique session will be added to Firebase */
	check.apply(this).then(function(result) {
		if (!result) {
			this.sysMsg = "Sorry, a session with that code is already in progress. \
			Please enter a different code.";
		} else {
			/* Sets sessID in the service so that it can be accessed by other
			controllers and in other views */
			this.setSessionName(entered);
			/* Creates default object for a new session with the chosen name and adds
			it to Firebase */
			var initObj = {};
			initObj[entered] = {
				users: true,
				questions: true,
				noRedo: false
			};
			sessRef.update(initObj);
			// Navigates to leader page
			this.location.path('/leader');
		}
	}.bind(this));
}

scratchApp.startController.prototype.joinSession = function() {
	var key = this.entryID;
	var entered = this.desiredUserID;
	var sessionExists;
	var userIDIsUnique;
	/* Confirms that there is a session corresponding to key, then checks whether
	there is data in Firebase corresponding to the entered username, then responds
	accordingly. Asynchronous since execution based on exists-or-doesn't and
	unique-or-not-unique needs to wait until Firebase has responded. */
	var check = function() {
		/* The variable deferred contains a 'this' call that would ordinarily do
		something terrible/confusing. It gets bound to the startController instead
		in the call on line **** and the bind on line ****. */
		var deferred = this.q.defer();
		/* Sets up the promise object for the Firebase response */
		sessRef.child(key).once('value', function(snapshot) {
			var sessionData = snapshot.val();
			sessionExists = (sessionData !== null);
			if (!sessionExists) {
				deferred.resolve("Session not found");
				return deferred.promise;
			} else {
				userIDIsUnique = !(sessionData['users'][entered]);
				if (!userIDIsUnique) {
				deferred.resolve("Username not unique");
				} else {
				deferred.resolve("Allow login");
				}
			}
		});
		return deferred.promise;
	}
	/* Once Firebase responds, the user will either be prompted to try a different
	session code or username, or have their data added to Firebase */
	check.apply(this).then(function(result) {
		if (result === "Session not found") {
			this.sysMsg = "Sorry, we can't find a session with that code. Please \
			try again, or contact your session leader for help.";
		} else if (result === "Username not unique") {
			this.sysMsg = "Sorry, that username has already been taken for this \
			session. Please choose another.";
		} else {
			/* Creates default object for a new user with the chosen username, and
			adds it to Firebase */
			var userObj = {};
			var loggedIn = entered + ' has joined session ' + key + '.';
			userObj[entered] = {response: loggedIn};
			sessRef.child(key).child('users').update(userObj);
			/* Navigates to participant page */
			this.location.path('/partic');
		}
	}.bind(this));
}

scratchApp.ngModule.controller('startController', scratchApp.startController);