'use strict';

angular.module('lodeditApp')
  .controller('NavCtrl', function ($window,$rootScope,$location,language,$route,$scope,userLogin,$translate,User) {
	$scope.windowWidth=$window.screen.availWidth;
    if ($scope.windowWidth<800) {
      $rootScope.mobileView=true;
    }else{
      $rootScope.mobileView=false;
    }

	$scope.setLang=function(langId, $event){
		User.setLang($scope.languages[langId].code);
		$scope.toggleDropdown($event);
	}
	$scope.logout=function(){
		userLogin.logout();
		$location.path('/login');
	}
	$scope.languages=new Array();
	
	
	$scope.getLanguages=function(){
		language.getLangs().then(function(response){
			$scope.languages=response.data;
		},function(){

		});
	}
	$scope.getLanguages();
	$scope.$on('$routeChangeStart',function(){
		if (/*userLogin.role==userLogin.userRoles.admin &&*/ $location.path().indexOf('admin')!=-1) {
			$scope.admin=true;
		}else{

			//false
			$scope.admin=false;
		}
	});

	 $scope.status = {
    	isopen: false
  	};


  	 $scope.toggleDropdown = function($event) {
    	$event.preventDefault();
    	$event.stopPropagation();
    	$scope.status.isopen = !$scope.status.isopen;
  	};

});

  
  


