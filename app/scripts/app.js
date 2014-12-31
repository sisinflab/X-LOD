'use strict';

var app=angular.module('lodeditApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'wu.masonry',
  'file-model',
  'ngResource',
  'pascalprecht.translate',
  'ngStorage',
  'ui.bootstrap',
  'leaflet-directive',
  'ui.select',
  'angular-capitalize-filter',
  'angularSpinkit',
  'ngAnimate'
]);


app.config(['$httpProvider', function ($httpProvider) {
		// $httpProvider.defaults.useXDomain = true;
		$httpProvider.defaults.cache = true;
		delete $httpProvider.defaults.headers.common['X-Requested-With'];
	}
]);


app.config(['$locationProvider',function ($locationProvider) {
    
    // $locationProvider.html5Mode(true);
    
}]);


app.config(['$translateProvider',function ($translateProvider) {
    
    
    
    $translateProvider.useStaticFilesLoader({
		prefix: 'lang/',
		suffix: '.json'
	});
	$translateProvider.preferredLanguage('it-IT');
  
}]);
 
app.config(function ($routeProvider) {
    $routeProvider
      .when('/view/:id', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        access: {
			isFree: false
		},
		role: '2',
		resolve : {
			entity:function($q,$route,Data){
				var deferred=$q.defer();
				var id=$route.current.params.id;
				var successCB=function(result){
					//uncomment this for loading properties 
					// schema before loading the page
					
					// var promise=Data.getClassPropertiesC(result.class);
					// promise.then(function(nestedRes){
					// 	result.props=nestedRes.data;
					// },
					// function(nestedRes){
					// 	result.props=[];
					// });
					deferred.resolve(result);
				}
				var failCB=function(result){
					deferred.reject(result.status);
				}
				Data.getEntity(id,successCB,failCB);
				return deferred.promise;
			},
			classes: function(Data) {
				return Data.getClasses();
			},
			translations: function(Data){
				return Data.getTranslations();
			}
		}
      })
      .when('/', {
        templateUrl: 'views/index.html',
        controller: 'IndexCtrl',
        access: {
			isFree: false
		},
		role: '2'
      })
      .when('/new', {
        templateUrl: 'views/new_entity.html',
        controller: 'NewCtrl',
        access: {
			isFree: false
		},
		role: '2',
		resolve: {
			classes: function(Data) {
				return Data.getClasses();
		}
	}
      }) 
      .when('/bulk', {
        templateUrl: 'views/bulk.html',
        controller: 'BulkCtrl',
        access: {
			isFree: false
		},
		role: '2'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        access: {
			isFree: true
		},
		role: '1'
      })
      .when('/resetpassword/:id', {
        templateUrl: 'views/resetpassword.html',
        controller: 'ResetpasswordCtrl',
        access: {
			isFree: true
		},
		role: '1'
      })
      .when('/register', {
        templateUrl: 'views/registration.html',
        controller: 'RegisterCtrl',
        access: {
			isFree: true
		},
		role: '1'
      })
      .when('/admin/dashboard', {
        templateUrl: 'views/dashboard.html',
        controller: '',
        access: {
        	//false
			isFree: true
		},
		role: '1'
      })
      .when('/admin/notifications', {
        templateUrl: 'views/notifications.html',
        controller: '',
        access: {
        	//false
			isFree: true
		},
		role: '1'
      })
      .when('/admin/login', {
        templateUrl: 'views/admin_login.html',
        controller: 'AdminLoginCtrl',
        access: {
			isFree: true
		},
		role: '1'
	  })
	  .when('/confirmemail/:code', {
            templateUrl: 'views/confirmemail.html',
            controller: 'ConfirmemailCtrl',
            access: {
				isFree: true
			},
			role: '1'	
        })
	  .when('/user/:username', {
        templateUrl: 'views/profile.html',
        controller: 'ProfileCtrl',
        access: {
			isFree: false
		},
		role: '2'
	  })
	  .when('/map', {
        templateUrl: 'views/map.html',
        controller: 'MapCtrl',
        access: {
			isFree: true
		},
		role: '1'
	  })
      // .otherwise({
      //    redirectTo: '/404'
      //  })
      ;
  });







app.run(function ($window,$rootScope, $location, userLogin) {
    $rootScope.$on('$routeChangeStart', function (event,currRoute, prevRoute) {
		$rootScope.pageLoading=true;
	    if (!userLogin.loggedIn) {
			//not logged in 
			if(typeof prevRoute != 'undefined'){
				//comes from inside the app
					if(prevRoute.originalPath.indexOf('view')!=-1 || prevRoute.originalPath.indexOf('new')!=-1){
						//main pages
						var path=prevRoute.originalPath;
						for(var param in prevRoute.pathParams){
							path=path.replace(":"+param,prevRoute.pathParams[param]);
						}
						userLogin.lastPage=path;
					}else{
						//make it jump to lod page
						if (prevRoute.originalPath!="/login") {
							userLogin.lastPage='none';
						};
						
					}
			}else{
				//comes from outside the app
					userLogin.lastPage='none';
			}
	        if(typeof currRoute != 'undefined'){
					if(!currRoute.access.isFree){
						//not allowed - redirect to login
						console.log('DENY');
						event.preventDefault();
						$location.path('/login');
					}else{
						//allowed
						console.log('ALLOW');

					}
			}else{
					$location.path('');
			}
	    }else {
			//logged in
			if(typeof currRoute != 'undefined'){
					//not admin
					if(currRoute.role=='4' && userLogin.role!=currRoute.role){
						//not allowed - redirect to admin login
						console.log('DENY');
						event.preventDefault();
						$location.path('/admin/login');
					}else{
						//allowed
						console.log('ALLOW');
					}
			}

			if(typeof prevRoute != 'undefined' && prevRoute.originalPath=='/login' && currRoute.originalPath=='/login'){
					$location.path('');
			}
	        
	    }
    });
	$rootScope.$on('$routeChangeSuccess', function (event,currRoute, prevRoute) {
		$rootScope.pageLoading=false;
	});
	$rootScope.$on('$routeChangeError', function (event,currRoute, prevRoute) {
		$rootScope.pageLoading=false;
		// $location.path('/404');
	});
	$rootScope.serverPath='http://localhost:8080/';
	$rootScope.apiPath='linkedopendatamatera/api/';
});
