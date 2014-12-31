'use strict';

angular.module('lodeditApp')
.service('Index', function New($resource,$rootScope) {
	return  $resource($rootScope.serverPath+$rootScope.apiPath+'owl/search',
			{
				search:'@search'
			},
			{ 
				perform: { 
				    method: 'GET',
				    isArray: true,
				    url: $rootScope.serverPath+$rootScope.apiPath+'owl/perform',
				    params: {search:'@search'}
				}
			});
});
