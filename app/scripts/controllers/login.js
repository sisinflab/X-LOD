'use strict';

angular.module('lodeditApp')
  .controller('LoginCtrl', function ($window,$rootScope,$scope, $location,userLogin,$translate,User) {
	  $scope.loginFail=false;
	  $scope.forgot = false;
		$scope.login=function(){
		console.log('Username: '+$scope.username);
		console.log('Password: '+$scope.password);
		var prom=userLogin.login($scope.username,$scope.password);
		prom.success(function(data, status, headers, config){
						console.log('success');
						console.log(status);
						$scope.loginFail=false;
						userLogin.setUser(data.token,data.name);
						if(typeof userLogin.lastPage!='undefined' && userLogin.lastPage.length > 0 && userLogin.lastPage!='none' ){
							$location.path(userLogin.lastPage);
						}else{
							//$location.path('user/'+User.username);
							$location.path('/');
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

	$scope.forgotPass = function(){
		$scope.forgot=true;
	}
   
   	$scope.forgotPassword = function(){
   		var pro = userLogin.forgotPassword($.param({email:$scope.email}));
   		pro.success(function(data, status, headers, config){
			$location.path('/');			
		});
		pro.error(function(data, status, headers, config){
			console.log('fail');
			console.log(status);
			$scope.loginFail=true;
				
		});
   	}

  });

