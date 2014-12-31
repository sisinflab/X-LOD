'use strict';

var app=angular.module('lodeditApp').factory('language',function ($resource,$rootScope,$http,User){
		//initialization section for language service
		

	
		var languageAPI=$resource($rootScope.serverPath+$rootScope.apiPath+'language/');
		
		//return session service object
		return{
			
			getLangs: function(){
				return $http.get($rootScope.serverPath+$rootScope.apiPath+'language/');
			}	
		}
	}
);
