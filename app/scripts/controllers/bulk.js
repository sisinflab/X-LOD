'use strict';

/**
 * @ngdoc function
 * @name lodeditApp.controller:BulkcontrollerCtrl
 * @description
 * # BulkcontrollerCtrl
 * Controller of the lodeditApp
 */
angular.module('lodeditApp')
  .controller('BulkCtrl', function ($scope,Bulk) {
    
    $scope.loaded=false;

  	$scope.upload = function(){
  		var file = new FormData();
		file.append("request",$scope.fileModel);
  		Bulk.saveBulk(file,function(response){
  			$scope.loaded=true;
  		},function(response){
			console.log(response);
		});
  	};

  });
