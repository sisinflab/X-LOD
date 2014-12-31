'use strict';

/**
 * @ngdoc function
 * @name scoitClientApp.controller:ConfirmemailCtrl
 * @description
 * # ConfirmemailCtrl
 * Controller of the scoitClientApp
 */
angular.module('lodeditApp')
  .controller('ConfirmemailCtrl', function ($scope, $rootScope, $http, $location, userLogin) {
   
	var prom = userLogin.confirmemail($.param({code:location.hash.split('#/confirmemail/')[1]}));
	prom.success(function(user){
			$rootScope.user = user;
			$http.defaults.headers.common['X-Auth-Token'] = user.token;		
			$scope.confermato = 'confermato';
			userLogin.setUser(user.token,user.name);
		});
	prom.error(function(){
			$scope.confermato = 'error';
			console.log('Error to confirm email');
		});

	

	$scope.isConfirmed = function(){
		if($scope.confermato === null || angular.isUndefined($scope.confermato)){
			return false;
		}else{
			if($scope.confermato === 'confermato'){
				return true;
			}else{
				return false;
			}
		}
	};
	
	$scope.isError = function(){
		if($scope.confermato === null || angular.isUndefined($scope.confermato)){
			return false;
		}else{
			if($scope.confermato === 'error'){
				return true;
			}else{
				return false;
			}
		}
	};
  });