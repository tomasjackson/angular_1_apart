angular.module('frontendApp')
  .controller('ConfirmPopupCtrl', function ($scope, $uibModalInstance, modalInstance, param) {
    var self = this;

    self.closeModal = function closeModal(flag) {
      if (flag)
        $uibModalInstance.close();
      else
        $uibModalInstance.dismiss();
    };

  });
