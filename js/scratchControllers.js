var scratchControllers = angular.module('scratchControllers', []);
var ref = new Firebase('https://resplendent-fire-4150.firebaseio.com');
var sessRef = ref.child('sessions');
var sessID;



scratchControllers.controller('StartControl', [
	'$scope',
	'$routeParams',
	'$firebaseObject',
	function($scope, $routeParams, $firebaseObject) {
		//Allows for printout of whole Firebase JSON object
		$scope.data = $firebaseObject(ref);
		//Allows for in-view navigation of Start and Join
		$scope.startButtons = true;
		$scope.startOptions = false;
		$scope.joinOptions = false;
		$scope.newSess = function() {
			$scope.startButtons = false;
			$scope.startOptions = true;
		};
		$scope.joinSess = function() {
			$scope.startButtons = false;
			$scope.joinOptions = true;
		};
		//Functionality for starting a new session
		$scope.saveSession = function() {
			sessID = $scope.sessID;
			//Can't sessRef.update({$scope.saved:true}). Lines below are a workaround.
			var obj = {};
			obj[sessID] = {
				users: true,
				questions: true,
				checkboxes: {
					noAnon: false,
					noRedo: false,
					noShow: false
				}
			};
			sessRef.update(obj);
		};
	}]);


scratchControllers.controller('LeaderControl', [
	'$scope',
	'$routeParams',
	'$firebaseObject',
	function($scope, $routeParams, $firebaseObject) {
		$scope.sessID = sessID;
			var disconnectMe = sessRef.child(sessID);
			disconnectMe.onDisconnect().remove();
			var usersRef = sessRef.child(sessID).child('users');
			var questRef = sessRef.child(sessID).child('questions');
			var checkRef = sessRef.child(sessID).child('checkboxes');
			$firebaseObject(checkRef).$bindTo($scope, 'checkboxes');
			usersRef.push({user:'test'});





		sessRef.update({
			"steve": {
				nickname: "elmo",
				age: "37",
				profession: "snowshoveler"
			}
		});
		var steveObj = sessRef.child("steve");
		$firebaseObject(steveObj).$bindTo($scope, "stevestuff");




		// $scope.pushQuestion = function() {
		// 	$scope.pushed = $scope.question;
		// 	var obj = {
		// 		question: $scope.pushed
		// 	};
		// 	console.log(obj);
		// 	console.log(sessRef);
		// 	console.log(sessRef.child($scope.saved));
		// }
	}]);






// var app = angular.module("sampleApp", ["firebase"]);

// // a factory to create a re-usable Profile object
// // we pass in a username and get back their synchronized data as an object
// app.factory("Profile", ["$firebaseObject",
//   function($firebaseObject) {
//     return function(username) {
//       // create a reference to the Firebase where we will store our data
//       var randomRoomId = Math.round(Math.random() * 100000000);
//       var ref = new Firebase("https://docs-sandbox.firebaseio.com/af/obj/bindto/" + randomRoomId);
//       var profileRef = ref.child(username);

//       // return it as a synchronized object
//       return $firebaseObject(profileRef);
//     }
//   }
// ]);

// app.controller("ProfileCtrl", ["$scope", "Profile",
//   function($scope, Profile) {
//     // create a three-way binding to our Profile as $scope.profile
//     Profile("physicsmarie").$bindTo($scope, "profile");
//   }
// ]);







// var ref = new Firebase(URL); // assume value here is { foo: "bar" }
// var obj = $firebaseObject(ref);

// obj.$bindTo($scope, "data").then(function() {
//   console.log($scope.data); // { foo: "bar" }
//   $scope.data.foo = "baz";  // will be saved to Firebase
//   ref.set({ foo: "baz" });  // this would update Firebase and $scope.data
// });
// We can now bind to any property on our object directly in the HTML, and have it saved instantly to Firebase. Security and Firebase Rules can be used for validation to ensure data is formatted correctly at the server.
// <!--
//   This input field has three-way data binding to Firebase
//   (changing value updates remote data; remote changes are applied here)
// -->
// <input type="text" ng-model="data.foo" />










scratchControllers.controller('ParticControl', [
	'$scope',
	'$routeParams',
	'$firebaseObject',
	function($scope, $routeParams, $firebaseObject) {
		$scope.joinSession = function() {

		}


	}]);