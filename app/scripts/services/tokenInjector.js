'use strict';


app.factory('tokenInjector',function(userLogin) {
    var tokenInjector = {
        request: function(config) {
            if (userLogin.isLoggedIn ) {
                // config.headers['x-session-token'] = SessionService.token;
                console.log(config);
            }
            return config;
        }
    };
    return tokenInjector;
});


app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('tokenInjector');
}]);
