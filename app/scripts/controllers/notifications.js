'use strict';

angular.module('lodeditApp')
  .controller('NotificationCtrl', function ($rootScope,$scope,Data) {

    
});

'use strict';

angular.module('lodeditApp')
  .controller('AccordionCtrl', function ($q,$modal,$location,$rootScope,$scope,Data,AdminControls) {

  $scope.scopo="accordion";
   //to open just one accordion at the time
  $scope.oneAtATime = false;
  //using $q to create a promise
  var d=$q.defer();
  //wait function makes controller wait
  //until 
  $q.all([
    doQuery($q,Data.OWLAPI)
    ]).then(function(data){
      $scope.classes=data[0];
    });
  $scope.items=[
      {id:"1",isEntity:true,confirmed:false,rejected:false,name:"Nome Entità",uri:"http://dati.comune.matera.it/lod/entity",
        class:{uri:"http://dbpedia.it/classA",labrl:"Class A"},
        properties:[
          {id:"1_1",isEntity:false,confirmed:false,rejected:false,labrl:"Proprietà 1",uri:"http://dbpedia.it/property1",value:"Value 1",value_uri:"http://dbpedia.it/value_1"},
          {id:"1_2",isEntity:false,confirmed:false,rejected:false,labrl:"Proprietà 2",uri:"http://dbpedia.it/property2",value:"Value 2",value_uri:"none"}
        ]},
      {id:"2_1",isEntity:false,confirmed:false,rejected:false,labrl:"Proprietà 3",uri:"http://dbpedia.it/property1",value:"Value 3",value_uri:"http://dbpedia.it/value_3"}
    ];
 
  for(var i=0;i<$scope.items.length;i++){
    $scope.items[i].selected=angular.copy($scope.items[i]);
    if(typeof $scope.items[i].properties != 'undefined'){
      for(var j=0;j<$scope.items[i].properties.length;j++){
        $scope.items[i].properties[j].selected=angular.copy($scope.items[i].properties[j]);
      }
    }
  }

$scope.typeOf = function(input) {
    return typeof input;
  }

  $scope.editMode=false;

  

 

  

  var a = 5;
});

angular.module('lodeditApp')
  .controller('ItemCtrl', function ($modal,$rootScope,$scope,Data,AdminControls) {
    $scope.scopo="item";
    $scope.loading=false;

    $scope.toggleEditMode=function(){
      $scope.editMode=!$scope.editMode;
      $scope.editDisabled=!$scope.editDisabled;
    }
    $scope.saveChanges=function(i){
      if ($scope.items[i].isEntity) {
        $scope.items[i].class=angular.copy($scope.items[i].selected.class);
        $scope.items[i].name=angular.copy($scope.items[i].selected.name);
      }else{
        $scope.items[i].labrl=angular.copy($scope.items[i].selected.labrl);
        $scope.items[i].uri=angular.copy($scope.items[i].selected.uri);
        $scope.items[i].value=angular.copy($scope.items[i].selected.value);
      }
      
      $scope.items[i].selected=angular.copy($scope.items[i]);
      $scope.toggleEditMode();
    }

    $scope.confirm=function(i){
      var temp=angular.copy($scope.items[i]);
      $scope.loading=true;
      if (temp.isEntity) {
        if (typeof temp.properties!='undefined') {
           delete temp.properties;
         
        }
        delete temp.selected;
        //fire post
        var promise=AdminControls.confirmEntity(temp);
        promise.success(function(data,status,headers,config){
          $scope.items[i].confirmed=true;
          $scope.items[i].rejected=false;
          $scope.loading=false;
          if (typeof $scope.items[i].properties!='undefined') {
            for(var j=0;j<$scope.items[i].properties.length;j++){
              $scope.items[i].properties[j].confirmed=false;
              $scope.items[i].properties[j].rejected=false;
            }
          }
        });
        promise.error(function(data,status,headers,config){
          $scope.loading=false;
          if (status==401) {
            $modal.open({
                  templateUrl:"views/modals/not_authorized_modal.html",
                  controller: ModalNoAuthCtrl
            });
            $location.path('/admin/login');
          }else if (status==404) {
            //error message


            // mock da eliminare
            var message='Ho mandato la post e ho avuto 404 - Oggetto: '+JSON.stringify(temp);
            var title='Mandato';
            $scope.items[i].confirmed=true;
            $scope.items[i].rejected=false;
            if (typeof $scope.items[i].properties!='undefined') {
              for(var j=0;j<$scope.items[i].properties.length;j++){
                $scope.items[i].properties[j].confirmed=false;
                $scope.items[i].properties[j].rejected=false;
              }
            }
            $modal.open({
                  templateUrl:"views/modals/generic_modal.html",
                  controller: ModalGenericCtrl,
                  resolve: {
                    message: function () {
                      return message;
                    },
                    title: function () {
                      return title;
                    }
                  }
            });
          }
        });
      }else{
        //it is a property
        delete temp.selected;
        //fire post
        var promise=AdminControls.confirmProperty(temp);
        promise.success(function(data,status,headers,config){
          $scope.items[i].confirmed=true;
          $scope.items[i].rejected=false;
          $scope.loading=false;
        });
        promise.error(function(data,status,headers,config){
            $scope.loading=false;
            if (status==401) {
              $modal.open({
                    templateUrl:"views/modals/not_authorized_modal.html",
                    controller: ModalNoAuthCtrl
              });
              $location.path('/admin/login');
            }else if (status==404) {
              //error message


              // mock da eliminare
              var message='Ho mandato la post e ho avuto 404 - Oggetto: '+JSON.stringify(temp);
              var title='Mandato';
              $scope.items[i].confirmed=true;
              $scope.items[i].rejected=false;
              $modal.open({
                    templateUrl:"views/modals/generic_modal.html",
                    controller: ModalGenericCtrl,
                    resolve: {
                      message: function () {
                        return message;
                      },
                      title: function () {
                        return title;
                      }
                    }
              });
            }
          });


      }
    }


    $scope.reject=function(i){
      var temp=angular.copy($scope.items[i]);
      $scope.loading=true;
      if (temp.isEntity) {
        
        delete temp.selected;
        //fire post
        var promise=AdminControls.rejectEntity(temp);
        promise.success(function(data,status,headers,config){
          $scope.items[i].confirmed=true;
          $scope.items[i].rejected=false;
          if (typeof $scope.items[i].properties!='undefined') {
            for(var j=0;j<$scope.items[i].properties.length;j++){
              $scope.items[i].properties[j].confirmed=false;
              $scope.items[i].properties[j].rejected=true;
            }
          }
          $scope.loading=false;
        });
        promise.error(function(data,status,headers,config){
          $scope.loading=false;
          if (status==401) {
            $modal.open({
                  templateUrl:"views/modals/not_authorized_modal.html",
                  controller: ModalNoAuthCtrl
            });
            $location.path('/admin/login');
          }else if (status==404) {
            //error message



            //mock da eliminare
            var message='Ho mandato la post e ho avuto 404 - Oggetto: '+JSON.stringify(temp);
            var title='Mandato';
            $scope.items[i].confirmed=false;
            $scope.items[i].rejected=true;
            if (typeof $scope.items[i].properties!='undefined') {
              for(var j=0;j<$scope.items[i].properties.length;j++){
                $scope.items[i].properties[j].confirmed=false;
                $scope.items[i].properties[j].rejected=true;
              }
            }
            $modal.open({
                  templateUrl:"views/modals/generic_modal.html",
                  controller: ModalGenericCtrl,
                  resolve: {
                    message: function () {
                      return message;
                    },
                    title: function () {
                      return title;
                    }
                  }
            });
          }
        });
      }else{
      //it is a property
        delete temp.selected;
        //fire post
        var promise=AdminControls.rejectProperty(temp);
        promise.success(function(data,status,headers,config){
          $scope.items[i].confirmed=false;
          $scope.items[i].rejected=true;
          $scope.loading=false;
        });
        promise.error(function(data,status,headers,config){
            $scope.loading=false;
            if (status==401) {
              $modal.open({
                    templateUrl:"views/modals/not_authorized_modal.html",
                    controller: ModalNoAuthCtrl
              });
              $location.path('/admin/login');
            }else if (status==404) {
              //error message


              // mock da eliminare
              var message='Ho mandato la post e ho avuto 404 - Oggetto: '+JSON.stringify(temp);
              var title='Mandato';
              $scope.items[i].confirmed=false;
              $scope.items[i].rejected=true;
              $modal.open({
                    templateUrl:"views/modals/generic_modal.html",
                    controller: ModalGenericCtrl,
                    resolve: {
                      message: function () {
                        return message;
                      },
                      title: function () {
                        return title;
                      }
                    }
              });
            }
          });


      }
    }


    $scope.confirmNested=function(i,j){

      var temp=angular.copy($scope.items[i].properties[j]);
      $scope.loading=true;
        delete temp.selected;
        //fire post
        var promise=AdminControls.rejectEntity(temp);
        promise.success(function(data,status,headers,config){
          $scope.items[i].properties[j].confirmed=true;
          $scope.items[i].properties[j].rejected=false;
          $scope.loading=false;
        });
        promise.error(function(data,status,headers,config){
          $scope.loading=false;
          if (status==401) {
            $modal.open({
                  templateUrl:"views/modals/not_authorized_modal.html",
                  controller: ModalNoAuthCtrl
            });
            $location.path('/admin/login');
          }else if (status==404) {
            //error message


            // mock da eliminare
            var message='Ho mandato la post e ho avuto 404 - Oggetto: '+JSON.stringify(temp);
            var title='Mandato';
            $scope.items[i].properties[j].confirmed=true;
            $scope.items[i].properties[j].rejected=false;
            $modal.open({
                  templateUrl:"views/modals/generic_modal.html",
                  controller: ModalGenericCtrl,
                  resolve: {
                    message: function () {
                      return message;
                    },
                    title: function () {
                      return title;
                    }
                  }
            });
          }
        });
    }

    $scope.rejectNested=function(i,j){
      var temp=angular.copy($scope.items[i].properties[j]);
      $scope.loading=true;
        delete temp.selected;
        //fire post
        var promise=AdminControls.rejectEntity(temp);
        promise.success(function(data,status,headers,config){
          $scope.items[i].properties[j].confirmed=false;
          $scope.items[i].properties[j].rejected=true;
          $scope.loading=false;
        });
        promise.error(function(data,status,headers,config){
          $scope.loading=false;
          if (status==401) {
            $modal.open({
                  templateUrl:"views/modals/not_authorized_modal.html",
                  controller: ModalNoAuthCtrl
            });
            $location.path('/admin/login');
          }else if (status==404) {
            //error message


            // mock da eliminare
            var message='Ho mandato la post e ho avuto 404 - Oggetto: '+JSON.stringify(temp);
            var title='Mandato';
            $scope.items[i].properties[j].confirmed=false;
            $scope.items[i].properties[j].rejected=true;
            $modal.open({
                  templateUrl:"views/modals/generic_modal.html",
                  controller: ModalGenericCtrl,
                  resolve: {
                    message: function () {
                      return message;
                    },
                    title: function () {
                      return title;
                    }
                  }
            });
          }
        });
    }
});


function doQuery($q,res) {
   var d = $q.defer();
   var result = res.query({}, function() {
        d.resolve(result);
   });
   return d.promise;
}