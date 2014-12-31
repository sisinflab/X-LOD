'use strict';

angular.module('lodeditApp')
  .controller('AdminLoginCtrl', function ($window,$rootScope,$scope, $location,userLogin,$translate,User) {
	  $scope.loginFail=false;
		$scope.login=function(){
		console.log('Username: '+$scope.username);
		console.log('Password: '+$scope.password);
		var prom=userLogin.login($scope.username,$scope.password);
		prom.success(function(data, status, headers, config){
			if (typeof data.roles.ROLE_ADMIN != 'undefined' && data.role.ROLE_ADMIN==true ) {
						console.log('success');
						console.log(status);
						$scope.loginFail=false;
						userLogin.setUser(data.token,data.name,userLogin.userRoles.admin);
						$location.path('/admin/dashboard');
						$rootScope.admin=true;
			}else{
				// console.log('fail');
				// console.log(status);
				// $scope.loginFail=true;
				console.log('success');
						console.log(status);
						$scope.loginFail=false;
						userLogin.setUser(data.token,data.name,userLogin.userRoles.admin);
						$location.path('/admin/dashboard');
						$rootScope.admin=true;

			}
		}
		);
		prom.error(function(data, status, headers, config){
			console.log('fail');
			console.log(status);
			$scope.loginFail=true;				
		}
		);
	}
   
  });

