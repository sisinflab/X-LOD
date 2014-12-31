'use strict'

angular.module('lodeditApp')
	.controller('MapCtrl', function ($scope,Index) {



	$scope.queryString = "PREFIX dbpedia: <http://dbpedia.org/ontology/>\nPREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\nPREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>\nPREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\nPREFIX foaf: <http://xmlns.com/foaf/0.1/>\nSELECT DISTINCT ?s ?label ?image ?desc ?lat ?lng\nwhere{\n	?s a dbpedia:ReligiousBuilding.\n	?s geo:lat ?lat .\n	?s rdfs:label ?label .\n	?s foaf:depiction ?image .\n	?s rdfs:comment ?desc  .\n	?s geo:long ?lng .\n	FILTER ( ( ( xsd:float(?lng) - 16.600000 ) > 0.0 && ( xsd:float(?lng) - 16.600000 ) < 0.6 || ( xsd:float(?lng) - 16.600000 ) < 0.0 && ( xsd:float(?lng) - 16.600000 ) > -0.6 ) && ( ( xsd:float(?lat) - 40.666668 ) > 0.0 && ( xsd:float(?lat) - 40.666668 ) < 0.6 || ( xsd:float(?lat) - 40.666668 ) < 0.0 && ( xsd:float(?lat) - 40.666668 ) > -0.6 ))}";

	$scope.search = function(){
		Index.query({search:$scope.searchVal}).$promise.then(function(res){
	      	$scope.markers = {};
	      	angular.forEach(res, function(item){
	      	var mark = {};
	      	if(item.lat != null && item.lng != null){
	      		mark.lat=(item.lat);
		      	mark.lng=(item.lng);
		      	mark.focus = false;
		      	mark.draggable = false;
		      	mark.message = item.description.split("@")[0]+"<img style='width:280px;height:auto;' src='"+item.imageUrl+"'>";
		        $scope.markers[item.uri.split('/lod/')[1]] = mark;
	      	}
	      });
	    });
	}

	$scope.perform = function(){
		Index.perform({search:$scope.queryString}).$promise.then(function(res){
	      	$scope.markers = {};
	      	angular.forEach(res, function(item){
	      	var mark = {};
	      	if(item.lat != null && item.lng != null){
	      		mark.lat=(item.lat);
		      	mark.lng=(item.lng);
		      	mark.focus = false;
		      	mark.draggable = false;
		      	mark.message = item.description.split("@")[0]+"<img style='width:280px;height:auto;' src='"+item.imageUrl+"'>";
		        $scope.markers[item.uri.split('/lod/')[1]] = mark;
	      	}
	      });
	    });
	}

	angular.extend($scope, {
	        center: {
	            lat: 40.6685,
	            lng: 16.5845,
	            zoom: 13
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
	                lat: 40.6685,
	                lng: 16.5845,
	                message: "Matera",
	                focus:true
	            }
	        },
	        events: {
            map: {
                	enable: ['dragend'],
                	logic: 'emit'
            	}
        	}
    	});


});