'use strict';

angular.module('lodeditApp')
  .controller('RegisterCtrl', function ($window,$routeParams,$scope, $location,userRegistration,userLogin) {
		$scope.submitForm = function(isValid) {
			// check to make sure the form is completely valid
			if (isValid) {
				
				var prom=userRegistration.register($scope.user);
				prom.success(function(data, status, headers, config){
								console.log('success');
								console.log(status);
								if(typeof userLogin.lastPage!='undefined' && userLogin.lastPage.length > 0 && userLogin.lastPage!='none' ){
									$location.path(userLogin.lastPage);
								}else{
									$location.path('/');
								}
				}
				);
				prom.error(function(data, status, headers, config){
					console.log('fail');
					console.log(status);
					if (status==409) {
						//gestione account ripetuti 
					};
					$scope.loginFail=true;
					userLogin.loggedIn=true;
					userLogin.role=userLogin.userRoles.public;
						
				}
				);
					}

				};
   
  });
