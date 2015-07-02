scratchApp.startController = function($scope, $routeParams, $firebaseObject, $location, SessionInfo, $q) {
	this.scope = $scope;
	this.routeParams = $routeParams;
	this.firebaseObject = $firebaseObject;
	this.location = $location;
	/* Tools for interacting with the SessionInfo service */
	this.setSessionName = function(val) {
		return SessionInfo.setSessionName(val);
	};
	this.setUserName = function(val) {
		return SessionInfo.setUserName(val);
	};
	this.setNewest = function(val) {
		return SessionInfo.setNewest(val);
	};
	/* $q is the Angular asynchronous service */
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
	this.sysMsg = "Please enter the session code and an alphanumeric username.";
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
		in the call on line 54 and the bind on line 74. */
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
		in the call on line 114 and the bind on line 158. */
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
		var isALegalName = /^(?!forEach)[ A-Za-z0-9]*$/;
		if (result === "Session not found") {
			this.sysMsg = "Sorry, we can't find a session with that code. Please \
			try again, or contact your session leader for help.";
		} else if (!isALegalName.test(result)) {
			this.sysMsg = "Sorry, that username contains illegal characters. Please \
			use only letters, numbers, and spaces."
		} else if (result === "Username not unique") {
			this.sysMsg = "Sorry, that username has already been taken for this \
			session. Please choose another.";
		} else {
			/* Sets sessID and userID in the service so that they can be accessed by
			other controllers and in other views, and marks this user as the newest
			user */
			this.setSessionName(key);
			this.setUserName(entered);
			this.setNewest(entered);
			/* Creates default object for a new user with the chosen username, and
			adds it to Firebase */
			var userObj = {};
			/* When transforming the nested Firebase user object into an array that
			can be used and sorted by the ng-repeat directive, the key for each user
			(which is the entered username) gets lost; hence, here it's added as a
			redundant property on the object itself. A more experienced coder may be
			able to help me reduce the need for this redundancy. FIX IN V.4! */
			userObj['name'] = entered;
			var loggedInMsg = entered + ' has joined session ' + key + '.';
			userObj['response'] = loggedInMsg;
			/* When attempting to make the order of the participant windows sortable
			and randomizable, I found that I needed some numerical attribute on each
			user that could be manipulated. The easiest way was to put the attribute
			directly on the user object, as below. This allows it to be updated along
			with (and in response to) questions and responses. However, it seems to
			me that there should be a more elegant way that does not require pushing
			information up to Firebase, since this data is only relevant to the DOM
			of the leader page. FIX IN V.4! */
			var displayOrder = Math.floor(Math.random()*10000000);
			userObj['rank'] = displayOrder;
			/* Adds the new userObj to Firebase */
			sessRef.child(key).child('users').child(entered).set(userObj);
			/* Navigates to participant page */
			this.location.path('/partic');
		}
	}.bind(this));
}

scratchApp.ngModule.controller('startController', scratchApp.startController);