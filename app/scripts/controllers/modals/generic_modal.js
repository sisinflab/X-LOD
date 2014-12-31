var ModalGenericCtrl = function ($scope,$modalInstance,title,message,buttonOK,buttonCancel) {

  $scope.message=message;
  $scope.title=title;
  $scope.buttonOK=buttonOK;
  $scope.buttonCancel=buttonCancel;

  $scope.ok = function () {
    $modalInstance.close("OK");
  };

  $scope.cancel = function () {
    $modalInstance.close('CANCEL');
  };
};