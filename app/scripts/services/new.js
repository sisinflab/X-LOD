'use strict';

angular.module('lodeditApp')
.service('New', function New($resource,$rootScope) {
	return  $resource($rootScope.serverPath+$rootScope.apiPath+'secure/owl/class/',
			{
				entityModel:'@entityModel',
			});
});
