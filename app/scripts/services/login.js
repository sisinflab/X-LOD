'use strict';

var app=angular.module('lodeditApp').factory('userLogin',function ($rootScope,$http,$resource,$localStorage,User){
		//initialization section for session service
		
		var token="";
		var loggedIn=false;
		var userRoles = {
			public: 1, // 001
			user:   2, // 010
			admin:  4  // 100
		};
		var role=userRoles.public;
		var lastPage="";
		if(typeof $localStorage.token != 'undefined'){
			token=$localStorage.token;
			$http.defaults.headers.common ['X-Auth-Token'] = token;
			loggedIn=true;
			role=$localStorage.role;
			User.username=$localStorage.username;
			$rootScope.authenticated=true;
			$rootScope.username=$localStorage.username;
		}
		
		
		
		
		//return session service object
		return{
			lastPage:lastPage,
			role:role,
			token:token,
			userRoles:userRoles,
			loggedIn:loggedIn,
			login: function(usr,pwd){
				var data = {
					username: usr,
					password: pwd
				};
				var prom=$http({
					   url:$rootScope.serverPath+$rootScope.apiPath+'user/authenticate',
					   method:"POST",
					   headers: {
								  'Content-Type': 'application/x-www-form-urlencoded'
					   },
					   data: $.param(data),
					   cache: false
				  });
				return prom;
			},
			setUser: function(token,username,role){
				this.loggedIn=true;
				this.role=role;
				$http.defaults.headers.common ['X-Auth-Token'] = token;
				this.token=token;
				$localStorage.token=token;
				$localStorage.role=role;
				User.setUser(username);
				$rootScope.authenticated=true;
				$rootScope.username=username;
			},
			logout: function(){
				delete $http.defaults.headers.common['X-Auth-Token'];
				delete $localStorage.token;
				this.token='0';
				User.removeUser();
				this.loggedIn=false;
				this.role=this.userRoles.public;
				$rootScope.authenticated=false;
				delete $rootScope.username;
			},
			confirmemail : function(code){
				var prom=$http({
					   url:$rootScope.serverPath+$rootScope.apiPath+'user/confirmemail',
					   method:"POST",
					   headers: {
								  'Content-Type': 'application/x-www-form-urlencoded'
					   },
					   data: code,
					   cache: false
				  });
				return prom;
			},
			forgotPassword : function(email){
				var prom=$http({
					   url:$rootScope.serverPath+$rootScope.apiPath+'user/forgotpassword',
					   method:"POST",
					   headers: {
								  'Content-Type': 'application/x-www-form-urlencoded'
					   },
					   data: email,
					   cache: false
				  });
				return prom;
			}
		}
	}
);
