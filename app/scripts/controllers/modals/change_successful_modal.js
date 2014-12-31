var ModalSuccessfulChangeCtrl = function ($scope, $modalInstance,$location,entityName) {

  
	$scope.name = entityName;
  $scope.ok = function () {
    $modalInstance.close();
    $location.path('/view/'+entityName);

  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};