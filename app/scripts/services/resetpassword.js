'use strict';

/**
 * @ngdoc service
 * @name lodeditApp.Resetpassword
 * @description
 * # Resetpassword
 * Service in the lodeditApp.
 */
angular.module('lodeditApp')
  .service('Resetpassword', function Resetpassword($resource,$rootScope) {
    return $resource($rootScope.serverPath+$rootScope.apiPath+'user/resetpassword/:code', {code: '@code'},
                                {
                        save: {
                                method: 'POST',
                                headers : {'Content-Type': 'application/x-www-form-urlencoded'}
                        }
                });
  });
