'use strict';

var app=angular.module('lodeditApp').factory('userRegistration',function ($http,$resource,$rootScope){
		//initialization section for registration service
		
		
		//return registration service object
		return{
			register: function(credentials){
				
				var prom=$http({
					   url:$rootScope.serverPath+$rootScope.apiPath+'signup',
					   method:"POST",
					   headers: {
								  'Content-Type': 'application/json'
					   },
					   data: credentials,
					   cache: false
				  });
				return prom;
			}	
		}
	}
);
