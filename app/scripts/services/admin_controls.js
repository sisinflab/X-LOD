'use strict';

var app=angular.module('lodeditApp').factory('AdminControls',function ($rootScope,$http,$resource){


	return{
			
			
			confirmEntity:function(entity){
				var promise=$http.post($rootScope.serverPath+$rootScope.apiPath+'secure/confirm_entity',entity);
				return promise;
			},
			rejectEntity:function(entity){
				var promise=$http.post($rootScope.serverPath+$rootScope.apiPath+'secure/reject_entity',entity);
				return promise;
			},
			confirmProperty:function(property){
				var promise=$http.post($rootScope.serverPath+$rootScope.apiPath+'secure/confirm_property',property);
				return promise;
			},
			rejectProperty:function(property){
				var promise=$http.post($rootScope.serverPath+$rootScope.apiPath+'secure/reject_property',property);
				return promise;
			}
		}



});