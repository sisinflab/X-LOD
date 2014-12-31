'use strict';

var app=angular.module('lodeditApp').factory('Data',function ($rootScope,$http,$resource){
		//initialization section for session service
		var editAPI=$resource('/api/secure/edit/');
		//-----------mock data--------------------------
		// var dataAPI=$resource('/mocks/:thing.json', {thing:'@id'}, {
		// 	get : {
		// 	  method : 'GET',
		// 	  cache : true
		// 	}
		//   });
		//-----------real data---------------------------
		var dataAPI=$resource($rootScope.serverPath+$rootScope.apiPath+'secure/view/:thing', {thing:'@id'}, {
			get : {
			  method : 'GET',
			  cache : true
			}
		  });
		
		var newAPI=$resource($rootScope.serverPath+$rootScope.apiPath+'secure/owl/class/');
		var OWLAPI=$resource($rootScope.serverPath+$rootScope.apiPath+'secure/owl/classes');
		var propAPI=$resource($rootScope.serverPath+$rootScope.apiPath+'secure/owl/class/',
			{uri:'@uri'});
		var newClassAPI=$resource($rootScope.serverPath+$rootScope.apiPath+'secure/view/:name',
			{name:'@name'});
		var classToRequest=new Object();
		var translationsAPI=$resource('../lang/translationLangs.json');
		
		//return session service object
		return{
			classToRequest:classToRequest,
			OWLAPI: OWLAPI,
			editAPI: editAPI,
			dataAPI: dataAPI,
			newAPI: newAPI,
			newClassAPI:newClassAPI,
			propAPI:propAPI,
			getEntity: function(id,successCB,failCB){

				return dataAPI.get({},{id:id}).$promise.then(successCB,failCB);
			},
			update: function(property,id){
				
				var prom=$http({
					   url:$rootScope.serverPath+$rootScope.apiPath+'secure/owl/class',
					   method:"PUT",
					   params:{
					   	name: id
					   },
					   data: property
				  });
				return prom;
			},
			getClasses:function(){
				
				return OWLAPI.query().$promise;
				// var promise = $http.get($rootScope.serverPath+$rootScope.apiPath+'secure/owl/classes')
				// 		.success(function(data, status, headers, config) {
				// 			return data;
				// 		});
			},
			newEntity:function(entity){
				return $http.post($rootScope.serverPath+$rootScope.apiPath+'secure/owl/class/',entity);
			},
			getClassPropertiesC: function(URI){
				propAPI.get({uri:URI});
				// var prom=$http({
				// 	   url:$rootScope.serverPath+$rootScope.apiPath+'secure/owl/class',
				// 	   method:"POST",
				// 	   headers: {
				// 				  'Content-Type': 'application/json'
				// 	   },
				// 	   data: {'uri':classe}
				//   });
				return propAPI.get({uri:URI}).$promise;
			},
			getClassProperties: function(){
				
				var prom=$http({
					   url:$rootScope.serverPath+$rootScope.apiPath+'secure/owl/class',
					   method:"POST",
					   headers: {
								  'Content-Type': 'application/json'
					   },
					   data: this.classToRequest
				  });
				return prom;
			},
			newClass: function(classURI,Name){
				return newClassAPI.get({newUri:classURI},{name:Name}).$promise;
			},
			getTranslations: function(){
				return translationsAPI.query().$promise;
			}
		}
	}
);
