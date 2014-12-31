'use strict';

angular.module('lodeditApp')
.service('Photo', function Photo($resource, $rootScope) {
	return  $resource($rootScope.serverPath+$rootScope.apiPath+'secure/photo',{
	},
		{ 
		savePhotos: { 
		    method: 'POST',
		    params: {file:'@file'},
		    transformRequest: angular.identity,
		    //Note the headers property
		    headers: {'Content-Type': undefined},
		}
	});
});