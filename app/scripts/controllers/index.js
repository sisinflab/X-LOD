'use strict';

angular.module('lodeditApp')
  .controller('IndexCtrl', function ($window,$rootScope,$scope, $location,Index) {
	
	$scope.search = function(){
		Index.query({search:$scope.searchVal}).$promise.then(function(res){
	      $scope.bricks = [];
	      angular.forEach(res, function(item){
	      	item.uri = item.uri.split('/lod/')[1];
	      	item.label= item.label.split("@")[0];
	        $scope.bricks.push(item);
	      });
	      return $scope.bricks;
	    });
	}
	
   
  });

