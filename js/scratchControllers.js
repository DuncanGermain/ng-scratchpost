var scratchControllers = angular.module('scratchControllers', []);
var ref = new Firebase('https://resplendent-fire-4150.firebaseio.com');
var sessRef = ref.child('sessions');


scratchControllers.controller('StartControl', [
	'$scope',
	'$routeParams',
	'$firebaseObject',
	function($scope, $routeParams, $firebaseObject) {
		$scope.data = $firebaseObject(ref);

	}]);


scratchControllers.controller('LeaderControl', [
	'$scope',
	'$routeParams',
	'$firebaseObject',
	function($scope, $routeParams, $firebaseObject) {
		$scope.saveSession = function() {
			$scope.saved = $scope.sessID;
			//Can't sessRef.update({$scope.saved:true}). Lines below are a workaround.
			var obj = {};
			obj[$scope.saved] = {
				users: true,
				questions: true,
				checkboxes: true
			};
			sessRef.update(obj);
			var disconnectMe = sessRef.child($scope.saved);
			disconnectMe.onDisconnect().remove();
		}

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