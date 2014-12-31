'use strict';

/**
 * @ngdoc function
 * @name lodeditApp.controller:ResetpasswordCtrl
 * @description
 * # ResetpasswordCtrl
 * Controller of the lodeditApp
 */
angular.module('lodeditApp')
  .controller('ResetpasswordCtrl', function ($scope,Resetpassword,$location) {
     	$scope.init = function(){
	        Resetpassword.get({code:location.hash.split('#/resetpassword/')[1]}).$promise.then( function(user) {
	                        if(user == null){
	                                $location.path('/');
	                        }else{
	                                $scope.user = user;
	                        }
	                });
        };

        $scope.resetpassword = function() {
            Resetpassword.save({code:location.hash.split('#/resetpassword/')[1]}, $.param({password: $('#password').val()}), function() {
                    $location.path('/');
            });
        };
  });
