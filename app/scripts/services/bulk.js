'use strict';

/**
 * @ngdoc service
 * @name lodeditApp.BulkController
 * @description
 * # BulkController
 * Service in the lodeditApp.
 */
angular.module('lodeditApp')
  .service('Bulk', function Bulk($resource,$rootScope) {
  	return  $resource($rootScope.serverPath+$rootScope.apiPath+'secure/owl/bulk',{
			},
			{
				saveBulk: {
					method: 'POST',
		    		params: {file:'@file'},
		    		transformRequest: angular.identity,
		    		//Note the headers property
		    		headers: {'Content-Type': undefined},
				}
			});
});
