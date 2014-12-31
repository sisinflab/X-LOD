'use strict';

angular.module('lodeditApp').controller('MainCtrl', function ($http,$rootScope,$routeParams,$location,$scope,$anchorScroll,Data,entity,Photo,classes,translations) {
  	$scope.scrollTo = function(id) {
  		$.scrollTo('#'+id,800,{offset:-50});
  	}

   //initialization
   
   	$scope.classes=classes;
    $scope.stringLangs=translations;

   $scope.init=function(entity){
	   $rootScope.editDisabled=false;
	   $scope.locationEditMode=false;
	   $scope.editModeNoString=false;
	   $scope.addModeNoString=false;
	   $rootScope.entityModified=false;
	   $scope.OWL=new Object();
	   $scope.range=new Object();
	   $scope.selectDisabled=true;
   	   $scope.entity=angular.copy(entity);
   	   $scope.modifiedEntity=new Object();
	   //$scope.modifiedEntity.type=angular.copy($scope.entity.type);

	   $scope.props=new Object();
	   $scope.props.location=new Object();
	   $scope.props.location.lon=new Object();
	   $scope.props.location.lat=new Object();
	   //checks for latitude and longitute
	   //and stores them in $scope.props.location
	   for (var pro in entity) {
	   	if (entity.hasOwnProperty(pro) && pro.substring(0,1)!="$") {
		   	for (var i = 0; i < entity[pro].length; i++) {
		   		if (entity[pro][i].uri=="http://www.w3.org/2003/01/geo/wgs84_pos#long") {
		   			if (entity[pro][i].value!=null) {
			   			$scope.props.location.lon[pro]=angular.copy(entity[pro]);
			   			$scope.props.location.lonHasValue=true;
			   			$scope.props.location.lonExists=true;
		   			}/*else{
		   				$scope.props.location.lonExists=true;
		   				$scope.props.location.lon[pro]=angular.copy(entity[pro]);
		   			}*/
		   		}else if (entity[pro][i].uri=="http://www.w3.org/2003/01/geo/wgs84_pos#lat") {
		   			if (entity[pro][i].value!=null) {
		   				$scope.props.location.latExists=true;
			   			$scope.props.location.lat[pro]=angular.copy(entity[pro]);
			   			$scope.props.location.latHasValue=true;
		   			}/*else{
		   				$scope.props.location.latExists=true;
		   				$scope.props.location.lat[pro]=angular.copy(entity[pro]);
		   			}*/
		   		}else if (entity[pro][i].label=="type" || entity[pro][i].uri=="http://www.w3.org/1999/02/22-rdf-syntax-ns#type") {
		   			$scope.props.type=angular.copy(entity[pro]);
		   		}

		   	}
	   	}
	   }
	   //null valued props from entity
	   if (!($scope.props.location.lonHasValue && $scope.props.location.latHasValue) && $scope.props.location.latExists && $scope.props.location.lonExists){
	   		$scope.entity.location=[{uri:"",label:"Location",value:null,range:"location"}];
	   };
	   $scope.OWL.props=objToArrayNull("prop_name","prop_obj",$scope.entity);
	   
	   //deletes latitude and longitude from the entity object
	   for (var coord in $scope.props.location.lon) {
	   	delete $scope.entity[coord]
	   };
	   for (var coord in $scope.props.location.lat) {
	   	delete $scope.entity[coord]
	   };
	   //deletes type from the entity object
	   delete $scope.entity.type;
	   //get valued properties
	   
	   $scope.props.other=objToArrayNotNull("prop_name","prop_obj",$scope.entity);
	   	var lat=41.1093;
		var lon=16.8796;
		var zoom = 13;
		var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
		var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
		
		if ($scope.props.location.lonHasValue && $scope.props.location.latHasValue) {
			lon=$scope.props.location.lon[Object.keys($scope.props.location.lon)[0]][0].value[0].split('^^')[0];
			lat=$scope.props.location.lat[Object.keys($scope.props.location.lat)[0]][0].value[0].split('^^')[0];
		};
		angular.extend($scope, {
	        center: {
	            lat: parseFloat(lat),
	            lng: parseFloat(lon),
	            zoom: 15
	        },
	        layers: {
	            baselayers: {
	                osm: {
	                    name: 'OpenStreetMap',
	                    url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
	                    type: 'xyz'
	                }
	            }
	        },
	        defaults: {
	            scrollWheelZoom: false
	        },
	        markers: {
	            marker: {
	                lat: parseFloat(lat),
	                lng: parseFloat(lon),
	                //message: "This is Madrid. But you can drag me to another position",
	                focus: true,
	                draggable: false
	            }
	        },
	        events: {
            map: {
                	enable: ['dragend'],
                	logic: 'emit'
            	}
        	}
    	});
		/*if (typeof $scope.showmap!='undefined') {
	 		$scope.showmap.remove();	
	 	};
		$scope.showmap = L.map('showmap').setView([lat,lon], zoom);
		$scope.showmap.layer = new L.TileLayer(osmUrl, {minZoom: 2, maxZoom: 19, attribution: osmAttrib});
		$scope.showmap.removeLayer($scope.showmap.layer);
		$scope.showmap.addLayer($scope.showmap.layer);
	    $scope.showmap.marker = L.marker([lat,lon]).addTo($scope.showmap);

		//location edit map building
	 	if (typeof $scope.map!='undefined') {
	 		$scope.map.remove();	
	 	};
		$scope.map = L.map('map', {

			    contextmenu: true,
			    contextmenuWidth: 140,
			    contextmenuItems: [{
			        text: 'Set POI',
			        callback: setCoordinates
			    }]
			}).setView([lat,lon], zoom);
		$scope.map.name='map';
		$scope.map.layer = new L.TileLayer(osmUrl, {minZoom: 2, maxZoom: 19, attribution: osmAttrib});
		$scope.map.removeLayer($scope.map.layer);
		$scope.map.addLayer($scope.map.layer);
	    $scope.map.marker = L.marker([lat,lon]).addTo($scope.map);

		

		//location show map building
		

	    //add location property map building
	    if (typeof $scope.newmap!='undefined') {
	 		$scope.newmap.remove();	
	 	};
	    $scope.newmap = L.map('newmap', {
			    contextmenu: true,
			    contextmenuWidth: 140,
			    contextmenuItems: [{
			        text: 'Set POI',
			        callback: setCoordinates
			    }]
			}).setView([41.1093,16.8796], zoom);
		$scope.newmap.name='newmap';
		$scope.newmap.layer = new L.TileLayer(osmUrl, {minZoom: 2, maxZoom: 19, attribution: osmAttrib});
		$scope.newmap.removeLayer($scope.newmap.layer);
		$scope.newmap.addLayer($scope.newmap.layer);
	    $scope.newmap.marker = L.marker([41.1093,16.8796]).addTo($scope.newmap);
*/
   }
   
   $scope.init(entity);



   
   

   
   
   //---------page initialization--------------
   
   	 //time picker settings
	 $scope.ismeridian=false;
	 $scope.time=new Date();
	 //calendar settings
	  $scope.openCalendar = function($event) {
	    $event.preventDefault();
	    $event.stopPropagation();

	    $scope.opened = true;
 	 };


 	 $scope.update = function(properties){
 	 	$rootScope.pageLoading=true;
		 var name = $location.path().split("/view/")[1]; 
		 var promise=Data.update(properties,name);
          promise.success(function(data, status, headers, config){
              $rootScope.pageLoading=false;
              if (status==200) {
                if($rootScope.entityModified){
 	 				$rootScope.entityModified = false;
 	 			}
 	 			$location.path('/view/'+name);
              }

          });	 	
 	 }
	
	//map related functions
	$scope.setLocation=function(map){

		$scope.center.lat = parseFloat($scope.markers.marker.lat);
		$scope.center.lng = parseFloat($scope.markers.marker.lng);

		/*var latlon = new L.LatLng($scope[map].latitude,$scope[map].longitude);
		$scope[map].setView(latlon, $scope[map].zoom);
	    $scope[map].removeLayer($scope[map].marker);
	    $scope[map].marker=L.marker(latlon).addTo($scope[map]);*/
	    //reverse geocoding lat/long---->address
	    $http.get('http://nominatim.openstreetmap.org/reverse', {
	      params: {
	        lat: $scope.center.lat,
	        lon: $scope.center.lng,
	        format: "json"
	      }
	    }).then(function(res){
	      $scope.asyncSelected=res.data;
	    });
	    /*if (this.name=="map") {
	    	$rootScope.locForm.locLatitude.$pristine=false;
	    	$rootScope.locForm.locLongitude.$pristine=false;
	    }else if (this.name=="newmap") {
	    	$rootScope.valueForm.$pristine=false;
	    	$rootScope.valueForm.locLatitude.$pristine=false;
	    	$rootScope.valueForm.locLongitude.$pristine=false;
	    }*/
	    // $scope.$apply(); // necessary to update the value in the input textbox
	}

	$scope.$on('leafletDirectiveMap.drag', function(event){
		$scope.eventDetected = "Drag";
    });

 	function setCoordinates(e){
 		
 		//sets coordinates and address display name
 		//in the text
 		$scope[this.name].latitude=e.latlng.lat;
 		$scope[this.name].longitude=e.latlng.lng;
 		var latlon = new L.LatLng(e.latlng.lat,e.latlng.lng);
	    $scope[this.name].setView(latlon, $scope[this.name].zoom);
	    $scope[this.name].removeLayer($scope[this.name].marker);
	    $scope[this.name].marker=L.marker(latlon).addTo($scope[this.name]);
	    //reverse geocoding lat/long---->address
	    $http.get('http://nominatim.openstreetmap.org/reverse', {
	      params: {
	        lat: e.latlng.lat,
	        lon: e.latlng.lng,
	        format: "json"
	      }
	    }).then(function(res){
	      $scope.asyncSelected=res.data;
	    });
	    if (this.name=="map") {
	    	$rootScope.locForm.locLatitude.$pristine=false;
	    	$rootScope.locForm.locLongitude.$pristine=false;
	    }else if (this.name=="newmap") {
	    	$scope.valueForm.$pristine=false;
	    	$scope.valueForm.locLatitude.$pristine=false;
	    	$scope.valueForm.locLongitude.$pristine=false;
	    }
	    

	    $scope.$apply(); // necessary to update the value in the input textbox
 	}


 	 $scope.getLocation = function(val) {
 	 	//location taken async from OSM
	    return $http.get('http://nominatim.openstreetmap.org/search', {
	      params: {
	        q: val,
	        format: "json"
	      }
	    }).then(function(res){
	      var addresses = [];
	      angular.forEach(res.data, function(item){
	        addresses.push(item);
	      });
	      return addresses;
	    });
  	}

  	$scope.getQueryText = function(val) {
	    return $http.get($rootScope.serverPath+$rootScope.apiPath+'secure/owl/query', {
	      params: {
	        search: val
	      }
	    }).then(function(res){
	      $scope.suggestions = [];
	      if(res.data.length==0){
		      var temp = {};
		      temp.label=val;
		      temp.uri=val;
		      temp.custom = true;
		      $scope.suggestions.push(temp);
		  }
	      angular.forEach(res.data, function(item){
	        $scope.suggestions.push(item);
	      });
	      return $scope.suggestions;
	    });
  	}


  	$scope.onLocationSelect = function ($item, $model, $label,map) {
	    
	    /*var latlon = new L.LatLng($model.lat,$model.lon);
	    $scope[map].setView(latlon, $scope[map].zoom);
	    $scope[map].latitude=$model.lat;
	    $scope[map].longitude=$model.lon;
	    $scope[map].removeLayer($scope[map].marker);
	    $scope[map].marker=L.marker(latlon).addTo($scope[map]);*/
	    $scope.center.lat=parseFloat($model.lat);
	    $scope.center.lng=parseFloat($model.lon);

	    $scope.markers.marker.lat=parseFloat($model.lat);
	    $scope.markers.marker.lng=parseFloat($model.lon);
	}

	

	$scope.getEntities = function(classe) {
    return $http.get($rootScope.serverPath+$rootScope.apiPath+'/entities_by_class', {
	      params: {
	        class: classe,
	      }
	    }).then(function(res){
	      var entities = [];
	      angular.forEach(res.data.results, function(item){
	        entities.push(item);
	      });
	      return entities;
	    });
	  };

$scope.stringLangs=[
{label:"Italiano",tag:"@it"},
{label:"English",tag:"@en"}
];


 

$scope.saveLocation=function(map){
  	    	var lat=$scope.markers.marker.lat;
  	    	var lon=$scope.markers.marker.lng;
  	    	for (var i = 0; i < $scope.props.location.lon[Object.keys($scope.props.location.lon)[0]].length; i++) {
				$scope.props.location.lon[Object.keys($scope.props.location.lon)[0]][i].value[0]=lon;
			};
			for (var i = 0; i < $scope.props.location.lat[Object.keys($scope.props.location.lat)[0]].length; i++) {
				$scope.props.location.lat[Object.keys($scope.props.location.lat)[0]][i].value[0]=lat;
			};
			$scope.modifiedEntity[Object.keys($scope.props.location.lon)[0]]=angular.copy($scope.props.location.lon[Object.keys($scope.props.location.lon)[0]]);
			$scope.modifiedEntity[Object.keys($scope.props.location.lat)[0]]=angular.copy($scope.props.location.lat[Object.keys($scope.props.location.lat)[0]]);
			$scope.props.location.lonHasValue=true;
			$scope.props.location.latHasValue=true;
			$scope.toggleLocationEdit();
			$rootScope.entityModified=true;

		};

// 		}
		$scope.toggleLocationEdit=function(){
			$scope.locationEditMode=!$scope.locationEditMode;
			$scope.markers.marker.draggable=!$scope.markers.marker.draggable;
			$rootScope.editDisabled=!$rootScope.editDisabled;
  	    };

});
   
   
angular.module('lodeditApp')
  .controller('PropCtrl', function ($rootScope,$scope,Data,$location,Photo) {
  		$scope.datatypes=[
			{label:"Decimal",value:"xsd:decimal"},
			{label:"String",value:"http://www.w3.org/2001/XMLSchema#string"},
			{label:"URI",value:"uri"},
			{label:"Float",value:"xsd:float"},
			{label:"Integer",value:"xsd:integer"},
			{label:"Boolean",value:"xsd:boolean"},
			{label:"Duration",value:"xsd:duration"},
			{label:"Time",value:"xsd:time"},
			{label:"Date",value:"xsd:date"},
			{label:"Text",value:"http://www.w3.org/2001/XMLSchema#string"}
		]


  		$scope.editMode=false;

  		Data.getTranslations().then(function(value) {
		  $scope.stringLangs=value;
		}, function(reason) {
		  alert("No Translations Available");
		});

  		$scope.fileModel = null;
  		$scope.name = "prop";
  		$scope.custom = {};

  		$scope.$watch('range.selected', function() {
	       if (typeof $scope.addedProperty != 'undefined' && $scope.addedProperty != null) {
	       	$scope.addedProperty.prop_obj[0].range = angular.copy($scope.range.selected.value);
	       };
	   });
   
	   $scope.$watch('added', function() {
	   		if (typeof $scope.added =='undefined' || typeof $scope.added =='string'|| $scope.added==null) {
	   			$scope.addedProperty=null;
	   			$scope.selectDisabled=true;
	   			delete $scope.range.selected;
	   		}else{
	   			var value = angular.copy($scope.added.propValue);
	   			delete $scope.added.propValue;
	   			$scope.addedProperty = angular.copy($scope.added);
	   			$scope.addedProperty.prop_obj[0].value=new Array();
	   			$scope.addedProperty.prop_obj[0].value[0]=value;
	   			$scope.selectDisabled=false;
	   			if ($scope.added.prop_name=="location") {
	   				for (var i = 0; i < $scope.datatypes.length; i++) {
	   					if($scope.datatypes[i].value!="location"){
	   						$scope.datatypes[i].visible=false;

	   					}
	   				}
	   				if (typeof $scope.range.selected!= 'undefined') {
	   					$scope.range.selected.value="location";
	   				// $scope.addedProperty.prop_obj[0].range.value="location";
	   				}
	   			}else if ($scope.added.prop_name!="location") {
	   				for (var i = 0; i < $scope.datatypes.length; i++) {
	   					if($scope.datatypes[i].value=="location"){
	   						$scope.datatypes[i].visible=false;

	   					}else{
	   						$scope.datatypes[i].visible=true;
	   					}
	   				}
	   			}
	   		}
	   		

	   	});
	
		$scope.add=function(prop_name){
		 	if (prop_name!="location") {
		 		if(!angular.isUndefined($scope.custom.range)){
	  	    		var prom = Data.newEntity({uri:$scope.custom.range,name:$scope.entity[prop_name][0].value[0]});
	  	    		prom.success(function(data, status, headers, config){
	  	    			$scope.entity[prop_name][0].value[0]='http://dati.comune.matera.it/lod/'+data.name;
	  	    			$scope.modifiedEntity[prop_name]=angular.copy($scope.entity[prop_name]);
					 	var string;
					 	for (var i = 0; i < $scope.modifiedEntity[prop_name].length; i++) {
					 		var langy="";
					 		$scope.modifiedEntity[prop_name][i].range=angular.copy($scope.addedProperty.prop_obj[0].range);
					 		if ($scope.modifiedEntity[prop_name][i].range=="http://www.w3.org/2001/XMLSchema#string") {
					 			langy=$scope.added.lang.tag;
					 			string=true;
					 		};
					 		$scope.modifiedEntity[prop_name][i].value=new Array();
					 		$scope.modifiedEntity[prop_name][i].value[0]='http://dati.comune.matera.it/lod/'+data.name+langy;
					 	};
					 	var mock=angular.copy($scope.modifiedEntity[prop_name]);
					 	for (var i = 0; i < mock.length; i++) {
					 		var valt=new Object();
					 		var langt=new Object();

					 		if (!string) {
					 			valt=mock[i].value[0];
					 			langt="";
					 			mock[i].value[0]=valt;
					 		}else{
					 			valt=$scope.added.propValue;
					 			langt=$scope.added.lang.tag;
					 			mock[i].value[0]={lang:langt,val:valt};
					 		}
					 	};
					 	$scope.props.other.push({"prop_name":prop_name,prop_obj:mock});
					 	var delIndex=-1;
					 	for (var i = 0; i < $scope.OWL.props.length && delIndex==-1; i++) {
					 		if($scope.OWL.props[i].prop_name==prop_name){
					 			delIndex=i;
					 		}
					 	};
					 	if (delIndex!=-1) {
					 		$scope.OWL.props.splice(delIndex,1);
					 	};
					 	
					 	$scope.resetAdd();
	  	    		});
  	    		}else{
				 	$scope.modifiedEntity[prop_name]=angular.copy($scope.entity[prop_name]);
				 	var string;
				 	for (var i = 0; i < $scope.modifiedEntity[prop_name].length; i++) {
				 		var langy="";
				 		$scope.modifiedEntity[prop_name][i].range=angular.copy($scope.addedProperty.prop_obj[0].range);
				 		if ($scope.modifiedEntity[prop_name][i].range=="http://www.w3.org/2001/XMLSchema#string") {
				 			langy=$scope.added.lang.tag;
				 			string=true;
				 		};
				 		$scope.modifiedEntity[prop_name][i].value=new Array();
				 		$scope.modifiedEntity[prop_name][i].value[0]=$scope.added.propValue+langy;
				 	};
				 	var mock=angular.copy($scope.modifiedEntity[prop_name]);
				 	for (var i = 0; i < mock.length; i++) {
				 		var valt=new Object();
				 		var langt=new Object();

				 		if (!string) {
				 			valt=mock[i].value[0];
				 			langt="";
				 			mock[i].value[0]=valt;
				 		}else{
				 			valt=$scope.added.propValue;
				 			langt=$scope.added.lang.tag;
				 			mock[i].value[0]={lang:langt,val:valt};
				 		}
				 	};
				 	$scope.props.other.push({"prop_name":prop_name,prop_obj:mock});
				 	var delIndex=-1;
				 	for (var i = 0; i < $scope.OWL.props.length && delIndex==-1; i++) {
				 		if($scope.OWL.props[i].prop_name==prop_name){
				 			delIndex=i;
				 		}
				 	};
				 	if (delIndex!=-1) {
				 		$scope.OWL.props.splice(delIndex,1);
				 	};
				 	
				 	$scope.resetAdd();
			 	}
			 }else{
			 	$scope.saveLocation('newmap');
			 }
			 $rootScope.entityModified=true;

		 } 
			 $scope.resetAdd=function(){
			 	$scope.added.value="";
			 	$scope.added=null;
			 	$scope.selectDisabled=true;
			 	$scope.addedProperty=null;
				delete $scope.range.selected; 
				
			}

  		$scope.toggleEdit=function(){
			$scope.editMode=!$scope.editMode;
			$rootScope.editDisabled=!$rootScope.editDisabled;
			$rootScope.addingDisabled=!$rootScope.addingDisabled;
  	    };
  	    $scope.save=function(name){
  	    	if($scope.addModeNoString){
  	    		var i = $scope.entity[name][0].value.length;
  	    		$scope.entity[name][0].value[i]=$scope.newUri;
  	    		$scope.newUri = null;
  	    	}
  	    	if(!angular.isUndefined($scope.custom.range)){
  	    		var prom = Data.newEntity({uri:$scope.custom.range,name:$scope.entity[name][0].value[0]});
  	    		prom.success(function(data, status, headers, config){
  	    			$scope.custom = {};
  	    			$scope.entity[name][0].value[0]='http://dati.comune.matera.it/lod/'+data.name;
  	    			$scope.modifiedEntity[name]=angular.copy($scope.entity[name]);
		  	    	for (var i = 1; i < $scope.modifiedEntity[name].length; i++) {
		  	    		for (var j = 0; j < $scope.modifiedEntity[name][0].value.length; j++) {
		  	    			$scope.modifiedEntity[name][i].value[j]=$scope.modifiedEntity[name][0].value[j];
		  	   			}
		  	    	}
		  	    	$rootScope.entityModified=true;
		  	    	$scope.toggleEdit();
  	    		});
  	    	}else{
	  	    	$scope.modifiedEntity[name]=angular.copy($scope.entity[name]);
	  	    	for (var i = 1; i < $scope.modifiedEntity[name].length; i++) {
	  	    		for (var j = 0; j < $scope.modifiedEntity[name][0].value.length; j++) {
	  	    			$scope.modifiedEntity[name][i].value[j]=$scope.modifiedEntity[name][0].value[j];
	  	   			}
	  	    	}
	  	    	$rootScope.entityModified=true;
	  	    	$scope.toggleEdit();
  	    	}
  	    }
		

		$scope.toggleEdit=function(value){
			if(!angular.isUndefined(value) && value === "noString"){
				$scope.editModeNoString=!$scope.editModeNoString;
				$rootScope.addingDisabled=!$rootScope.addingDisabled;
				$rootScope.editDisabled=!$rootScope.editDisabled;
			}else if($scope.editModeNoString){
				$scope.editModeNoString=!$scope.editModeNoString;
				$rootScope.addingDisabled=!$rootScope.addingDisabled;
				$rootScope.editDisabled=!$rootScope.editDisabled;
			}else{
				$scope.editMode=!$scope.editMode;
				$rootScope.addingDisabled=!$rootScope.addingDisabled;
				$rootScope.editDisabled=!$rootScope.editDisabled;
			}
  	    }
  	    $scope.toggleEdit=function(value,prop){
  	    	if($scope.addModeNoString){
  	    		$scope.addModeNoString = !$scope.addModeNoString;
  	    	}
			if(!angular.isUndefined(value) && value === "noString"){
				$scope.editModeNoString=!$scope.editModeNoString;
				$rootScope.addingDisabled=!$rootScope.addingDisabled;
				$rootScope.editDisabled=!$rootScope.editDisabled;
			}else if($scope.editModeNoString){
				$scope.editModeNoString=!$scope.editModeNoString;
				$rootScope.addingDisabled=!$rootScope.addingDisabled;
				$rootScope.editDisabled=!$rootScope.editDisabled;
			}else{
				$scope.editMode=!$scope.editMode;
				$rootScope.addingDisabled=!$rootScope.addingDisabled;
				$rootScope.editDisabled=!$rootScope.editDisabled;
			}
			$scope.kindOfProperty(prop);
  	    }

  	    $scope.toggleEditAdd=function(value,prop){
			if(!angular.isUndefined(value) && value === "noString"){
				$scope.editModeNoString=!$scope.editModeNoString;
				$scope.addModeNoString=!$scope.addModeNoString;
				$rootScope.addingDisabled=!$rootScope.addingDisabled;
				$rootScope.editDisabled=!$rootScope.editDisabled;
			}else if($scope.editModeNoString){
				$scope.editModeNoString=!$scope.editModeNoString;
				$rootScope.addingDisabled=!$rootScope.addingDisabled;
				$rootScope.editDisabled=!$rootScope.editDisabled;
			}else{
				$scope.editMode=!$scope.editMode;
				$rootScope.addingDisabled=!$rootScope.addingDisabled;
				$rootScope.editDisabled=!$rootScope.editDisabled;
			}
			$scope.kindOfProperty(prop);
  	    }


  	    $scope.kindOfProperty = function(objects){
	  		angular.forEach(objects, function(object){
	  			if(!angular.isUndefined(object.range)){
		  			if(object.range.indexOf('\\')>-1){
		  				$scope.arrayOfRanges = object.range.split("\\");
		  				$scope.enumerated = true;
			  			$scope.uri=true;
			  		}else{
			  			$scope.enumerated = false;
			  			$scope.uri=false;
			  		}
		  		}
	  			if(object.uri.indexOf('photo') >-1 || object.uri.indexOf('image') >-1 || object.uri.indexOf('depiction') >-1){
	  				$scope.imageProp = true;
	  				$scope.uri=true;
	  			}else{
	  				$scope.imageProp = false;
	  				$scope.uri=false;
	  			}
	  		});
  		}
  	    
  	    $scope.onUriSelect=function(name,$item, $model,range,value){
  	    	var check = false;
	    	if($item.custom){
  	    		$scope.custom.range = range;
  	    	}
  	    	if($scope.entity[name][0].value!=null){
  	    		for (var i = $scope.entity[name].length - 1; i >= 0; i--) {
  	    			for (var j = $scope.entity[name][i].value.length - 1; j >= 0; j--) {
  	    				if($scope.entity[name][i].value[j]===value){
  	    					$scope.entity[name][i].value[j] = $model;
  	    					check=true;
  	    				}
  	    			};
  	    		};
  	    		if(!check){
  	    			$scope.entity[name][0].value[0] = $model;
  	    		}
  	    	}else{
  	    		$scope.entity[name][0].value=[$model];
  	    	}
	    	
  	    }
  	    	/*$scope.modifiedEntity[name]=angular.copy($scope.entity[name]);
  	    	for (var i = 1; i < $scope.modifiedEntity[name].length; i++) {
  	    		$scope.modifiedEntity[name][i].value[0]=$scope.modifiedEntity[name][0].value[0];
  	    		
  	    	}*/
  	    	/*
  	    	$scope.modelUri = '';
  	    	$rootScope.entityModified=true;
  	    	$scope.toggleEdit();
  	    }
  		$scope.newType=function(){
  			$rootScope.pageLoading=true;
 	 		var prom=Data.newClass($scope.type.selected.uri,$location.path().split("/view/")[1]);
 	 		prom.then(function(result){
 	 			//reload $scope.props
 	 			$scope.entity = result;
 	 			$scope.toggleEdit();
 	 			$scope.init($scope.entity);
 	 			var props = {}
				for (var pro in $scope.props) {
					if(pro === "location"){
						props['longitude'] = $scope.props[pro].lon.longitude;
						props['lat'] = $scope.props[pro].lat.lat;
					}else if(pro === "type"){
						props[pro] = $scope.props[pro];
					}else{
						for (var i = $scope.props[pro].length - 1; i >= 0; i--) {
							for (var j = $scope.props[pro][i].prop_obj.length - 1; j >= 0; j--) {
								if($scope.props[pro][i].prop_obj[j].range=="http://www.w3.org/2001/XMLSchema#string"){
									if(!angular.isUndefined($scope.props[pro][i].prop_obj[j].value[0].lang)){
										$scope.props[pro][i].prop_obj[j].value[0]=$scope.props[pro][i].prop_obj[j].value[0].val+$scope.props[pro][i].prop_obj[j].value[0].lang
									}
								}
							};
							props[$scope.props[pro][i].prop_name] = $scope.props[pro][i].prop_obj;
						};
					}
				}
				$scope.type.selected = '';
 	 			$scope.update(props);
 	 		},function(){
 	 			$scope.type.selected = '';
 	 			$scope.toggleEdit();
 	 			$rootScope.pageLoading=false;
 	 		});
 	 		
 	 	}
 	 	$scope.addedT=new Object();*/

 	 	$scope.newType=function(){
  			$rootScope.pageLoading=true;
 	 		var prom=Data.newClass($scope.type.selected.uri,location.hash.split('#/view/')[1]);
 	 		prom.then(function(result){
 	 			//reload $scope.props
 	 			$scope.toggleEdit();
 	 			$scope.init(result);
 	 			$rootScope.pageLoading=false;

 	 		},function(){
 	 			$scope.toggleEdit();
 	 			$rootScope.pageLoading=false;
 	 		});
 	 		
 	 	}
 	 	$scope.addedT=new Object();

 	 	$scope.resetTranslation = function(){
 	 		$scope.addedT=new Object();
 	 	}
 	 	$scope.addTranslation=function(prop_name){
 	 		if ($scope.addedT.propValue && $scope.addedT.lang) {
	 	 		$scope.modifiedEntity[prop_name]=angular.copy($scope.entity[prop_name]);
	 	 		

	  	  		var mock=angular.copy($scope.entity[prop_name]);
	  	  		var current=new Object();
	  	  		for (var i = 0; i < $scope.props.other.length; i++) {
	  	  			if ($scope.props.other[i].prop_name==prop_name) {
	  	  				current=$scope.props.other[i];
	  	  			};
	  	  		};
	  	  		for (var i = 0; i < current.prop_obj.length; i++) {
	  	  			current.prop_obj[i].value.push({lang:$scope.addedT.lang.tag,val:$scope.addedT.propValue});
	  	  		};
	  	  		for (var i = 0; i < current.prop_obj.length; i++) {
	  	  			mock[i].value=[];
	  	  			for (var j = 0; j < current.prop_obj[i].value.length; j++) {
	  	  				mock[i].value.push(current.prop_obj[i].value[j].val+current.prop_obj[i].value[j].lang);
	  	  			};
	  	  		};
			 	$scope.modifiedEntity[prop_name]=angular.copy(mock);
				for (var i = 0; i < $scope.stringLangs.length; i++) {
					if($scope.stringLangs[i].tag==$scope.addedT.lang.tag){
						$scope.stringLangs.splice(i,1);
					}
				};
		      	$rootScope.entityModified=true;
		      	$scope.resetTranslation();
		      }
	 	}

 	 	$scope.isEnumeratedClass = function(range){
  		if(!angular.isUndefined(range)){
  			if(range.indexOf('\\')>-1){
  				$scope.arrayOfRanges = range.split("\\");
  				$scope.enumerated = true;
	  			return true;
	  		}else{
	  			$scope.enumerated = false;
	  			return false;
	  		}
  		}
  		
  	}

  	
 	 	/*$scope.addTranslation=function(name){

 	 		//DA FINIRE!!!!!!!
 	 		$scope.modifiedEntity[name]=angular.copy($scope.entity[name]);
 	 		$scope.modifiedEntity[name][0].value.push({val:$scope.addedT.propValue,lang:$scope.addedT.lang.tag});
  	    	for (var i = $scope.modifiedEntity[name].length -1; i>=0; i--) {
  	    		for (var j = $scope.modifiedEntity[name][0].value.length - 1; j >= 0; j--) {
  	    			$scope.modifiedEntity[name][i].value[j]=$scope.modifiedEntity[name][0].value[j].val+$scope.modifiedEntity[name][0].value[j].lang
				};
  	    	}
  	    	$rootScope.entityModified=true;
 	 	}*/
  	    
		
		$scope.imageUsage = function() {
			var file = new FormData();
			file.append("entity",$location.path().split('/view/')[1]);
			file.append("request",$scope.fileModel);
			Photo.savePhotos(file,function(response){
				var photo = ($rootScope.serverPath +$rootScope.apiPath+ response.name).replace("/api","");
				$scope.prop.prop_obj[0].value.push(photo);
				$scope.fileModel = null;
				$scope.save($scope.prop.prop_name);
			},function(response){
				console.log(response);
			});
  		}

  		$scope.addImage = function() {
			$scope.prop.prop_obj[0].value.push($scope.urlImage);
			$scope.urlImage = null;
			$scope.save($scope.prop.prop_name);
  		}

  });


angular.module('lodeditApp')
  .controller('TranslationCtrl', function ($rootScope,$scope) {
  	$scope.editMode=false;
  	$scope.toggleEdit=function(){
			$scope.editMode=!$scope.editMode;
			$rootScope.editDisabled=!$rootScope.editDisabled;
  	};
  	$scope.name="transl";

 

  	$scope.save=function(name){
  	    $scope.modifiedEntity[name]=angular.copy($scope.entity[name]);
  	    for (var i = 1; i < $scope.modifiedEntity[name].length; i++) {
  	    	for (var j = 0; j < $scope.modifiedEntity[name][i].value.length; j++) {
  	    		$scope.modifiedEntity[name][i].value[j]=$scope.modifiedEntity[name][0].value[j].val+$scope.modifiedEntity[name][0].value[j].lang;
  	   		};
  	    		// $scope.modifiedEntity[name][i].value[0]=$scope.modifiedEntity[name][0].value[0];
  	    		
  	   	}
  	   	for (var j = 0; j < $scope.modifiedEntity[name][0].value.length; j++) {
  	    		$scope.modifiedEntity[name][0].value[j]=$scope.modifiedEntity[name][0].value[j].val+$scope.modifiedEntity[name][0].value[j].lang;
  	   	};
  	   	$rootScope.entityModified=true;
  	   	$scope.toggleEdit();
  	   	$scope.resetTranslation();
    }

});


  function objToArray(keyName,valueName,object){
  	var temp_data=new Array();
	   for(var key in object){
	   		if (object.hasOwnProperty(key)) {
			   	if(key.substring(0,1)!="$"){
			   	var obj=new Object();
			   	obj[keyName]=key;
			   	obj[valueName]=object[key];
			   	temp_data.push(obj);
		   		}
	   		}
	   }
	   return temp_data;
  }

  function objToArrayNotNull(keyName,valueName,object){
  	var temp_data=new Array();
	   for(var key in object){
	   		if (object.hasOwnProperty(key)) {
			   	if(key.substring(0,1)!="$"){
				   	var obj=new Object();
				   	obj[keyName]=key;
				   	obj[valueName]=object[key];
				   	if (object[key][0].value!=null) {
				   		for (var i = 0; i < object[key].length; i++) {
				   			for (var j = 0; j < object[key][i].value.length; j++) {
				   				var langy="";
				   				var value;
				   				if (object[key][i].range!=null && (object[key][i].range==='http://www.w3.org/2001/XMLSchema#string' || 
				   						object[key][i].range==='http://www.w3.org/2000/01/rdf-schema#Literal')) {
				   					if(!angular.isUndefined(object[key][i].value[j].val)){
				   						value=object[key][i].value[j];
					   					obj[valueName][i].value[j]=value;
				   					}else{
				   						langy=object[key][i].value[j].substr(object[key][i].value[j].length-3,3);
					   					if(langy.indexOf('@')>-1){
					   						value=object[key][i].value[j].substr(0,object[key][i].value[j].length-3);
					   						obj[valueName][i].value[j]={lang:langy,val:value}
					   					}else{
					   						langy="";
					   						value=object[key][i].value[j];
					   						obj[valueName][i].value[j]=value;
					   					}
				   					}
				   				/*}else if(object[key][i].uri!=null && 
				   					(object[key][i].uri.indexOf('photo') >-1 || 
				   						object[key][i].uri.indexOf('depiction') >-1 || 
				   						object[key][i].uri.indexOf('image') >-1)){

				   				*/}else{
				   					value=object[key][i].value[j];
				   					obj[valueName][i].value[j]=value;
				   				}
				   			};
				   			
				   		};
				   		temp_data.push(obj);
				   	}
		   		}
	   		}

	   }
	   return temp_data;
  }

  function objToArrayNull(keyName,valueName,object){
  	var temp_data=new Array();
	   for(var key in object){
	   	if (object.hasOwnProperty(key)) {
			   	if(key.substring(0,1)!="$"){
				   	var obj=new Object();
				   	obj[keyName]=key;
				   	obj[valueName]=object[key];
				   	var full=false;
				   	for (var i = 0; i<obj[valueName].length && !full; i++) {
				   		if (obj[valueName][i].value!=null) {
				   			full=true;
				   		}
				   	}
				   	if (!full) {
				   		temp_data.push(obj);
				   	}
		   		}
	   		}
	   }
	   return temp_data;
  }