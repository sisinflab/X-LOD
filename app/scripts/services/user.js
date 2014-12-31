'use strict';

var app=angular.module('lodeditApp').factory('User',function ($translate,$localStorage){
	var lang='en';
	var username="";
	if(typeof $localStorage.username != 'undefined'){
		username=$localStorage.username;
	}
	return{
			username:username,
			lang: lang,
			getLang: function(){
				return this.lang;
			},
			setLang: function(lang){
				this.lang=lang;
				$translate.use(lang);
			},
			setUser: function(username){
				this.username=username;
				$localStorage.username=username;
			},
			removeUser: function(){
				this.username="";
				delete $localStorage.username;
			}
	}
});
