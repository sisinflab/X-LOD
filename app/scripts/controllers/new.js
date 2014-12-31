'use strict';


angular.module('lodeditApp')
  .controller('NewCtrl', function ($window,$location,$modal,$http,$scope,userLogin,Data,classes) {
    
  	$scope.classes=classes;
    // $scope.classes=[{"uri":"http://dbpedia.org/ontology/Church","label":"Chiesa"},{"uri":"http://dbpedia.org/ontology/Artwork","label":"Opera d'arte"},{"uri":"http://dati.comune.matera.it/lod/ontology/ArchaeologicalSite","label":"Parco Archeologico"},{"uri":"http://dbpedia.org/ontology/HistoricPlace","label":"Sito Storico"},{"uri":"http://dbpedia.org/ontology/Museum","label":"Museo"},{"uri":"http://dati.comune.matera.it/lod/ontology/CulturalHeritage","label":"Bene Culturale"},{"uri":"http://dbpedia.org/ontology/NaturalPlace","label":"Sito Naturalistico"},{"uri":"http://dbpedia.org/ontology/Painting","label":"Pittura"},{"uri":"http://dbpedia.org/ontology/Building","label":"Edificio"},{"uri":"http://dbpedia.org/ontology/Cave","label":"Grotta"},{"uri":"http://dbpedia.org/ontology/Sculpture","label":"Scultura\n"}];
    $scope.entity=new Object();
    $scope.entity.selected=new Object();

    $scope.reset=function(){
      $scope.entity.selected=new Object();
      $scope.newForm.name.$pristine=true;
    }
    $scope.saveEntity=function(){
      //set class into data service to 
      //fetch property in visualization page
        Data.classToRequest=$scope.entity.selected.classModel;
        $scope.loading=true;
        if (typeof $scope.entity.selected.classModel != 'undefined' && typeof $scope.entity.selected.name != 'undefined') {
          $scope.newForm.class.$invalid=false;
          $scope.newForm.class.$pristine=true;
          $scope.newForm.name.$invalid=false;
          var promise=Data.newEntity($scope.entity.selected);
          promise.success(function(data, status, headers, config){
              $scope.loading=false;
              if (status==200) {
                var name = data.name;
                $modal.open({
                  templateUrl:"views/modals/change_successful_modal.html",
                  controller: ModalSuccessfulChangeCtrl,
                  resolve: {
                    entityName: function () {
                      //path is the resource uri 
                      return name;
                    }
                  }
                });
              }

          });
          promise.error(function(data, status, headers, config){
            $scope.loading=false;
            if (status==401) {
              $modal.open({
                templateUrl:"views/modals/not_authorized_modal.html",
                controller: ModalNoAuthCtrl
              });
            }else if(status==301){
                var title="Entity already existed";
                var message="The entity you created already existed. ";
                var buttonOK="Redirect me";
                var buttonCancel="Keep me here";
                var name = data.name;
                var modal = $modal.open({
                  templateUrl:"views/modals/generic_modal.html",
                  controller: ModalGenericCtrl,
                  resolve: {
                    title: function () {
                      return title;
                    },
                    message: function(){
                      return message;
                    },
                    buttonOK: function(){
                      return buttonOK;
                    },
                    buttonCancel:function(){
                      return buttonCancel;
                    }
                  }
                });
                modal.result.then(function(choice){
                  if (choice=="OK") {
                    $location.path('/view/'+name);
                  }
                },function(){

                });
              }


            ///---- modal prova -----
            

            //-----end modal prova -------
          });
        }else if (typeof $scope.entity.selected.name == 'undefined') {
          $scope.newForm.name.$invalid=true;
          $scope.newForm.name.$pristine=false;        
        }else if (typeof $scope.entity.selected.classModel == 'undefined') {
          $scope.newForm.class.$invalid=true;
          $scope.newForm.class.$pristine=false;
        }
      
    };
 
  // $scope.$watch($select.search,function(){
  //   alert($select.search);
  // });
 


  	// $scope.search=function(key){

	  //   // alert("parola chiave: "+key);
	  //   var prom=$http.get("http://jsonplaceholder.typicode.com/users/");
	  //   prom.success(function(data, status, headers, config){
	  //       $scope.classes=data;
   //  });

  // };



});

