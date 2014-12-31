'use strict';

angular.module('lodeditApp').filter('propsFilter', function() {
  return function(items, props) {
    var out = [];

    if (angular.isArray(items)) {
      items.forEach(function(item) {
        var itemMatches = false;

        var keys = Object.keys(props);
        for (var i = 0; i < keys.length; i++) {
          var prop = keys[i];
          var text = props[prop].toLowerCase();
          if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
            itemMatches = true;
            break;
          }
        }

        if (itemMatches) {
          out.push(item);
        }
      });
    } else {
      // Let the output be the input untouched
      out = items;
    }

    return out;
  }
});

'use strict';

angular.module('lodeditApp').controller('DemoCtrl', function($scope, $http) {
  $scope.disabled = undefined;

  $scope.enable = function() {
    $scope.disabled = false;
  };

  $scope.disable = function() {
    $scope.disabled = true;
  };
  // $scope.$watch($select.search,function(){
  //   alert($select.search);
  // });
  $scope.clear = function() {
    $scope.person.selected = undefined;
    $scope.address.selected = undefined;
    $scope.country.selected = undefined;
  };



  $scope.search=function(key){

    // alert("parola chiave: "+key);
    var prom=$http.get("http://jsonplaceholder.typicode.com/users/");
    prom.success(function(data, status, headers, config){
        $scope.people=data;
    });

  };

  $scope.person = {};
  $scope.people = [
    { name: 'Adam', email: 'adam@email.com', age: 10 },
    { name: 'Amalie', email: 'amalie@email.com', age: 12 },
    { name: 'Wladimir', email: 'wladimir@email.com', age: 30 },
    { name: 'Samantha', email: 'samantha@email.com', age: 31 },
    { name: 'Estefanía', email: 'estefanía@email.com', age: 16 },
    { name: 'Natasha', email: 'natasha@email.com', age: 54 },
    { name: 'Nicole', email: 'nicole@email.com', age: 43 },
    { name: 'Adrian', email: 'adrian@email.com', age: 21 }
  ];

  $scope.address = {};
  

});