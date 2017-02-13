'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:loginCtrl
 * @description
 * # loginCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('loginCtrl', function ($state, $uibModal, $stateParams ,modalInstance, mainService , Authentication) {

 	var self = this;
    self.story = {};
    self.accessToken = '';
    self.modalInstance = modalInstance;

    mainService.exejQuery();                //execute Jquery libraries

    mainService.pageTitle = $state.current.data.title;  //Change page title

    /*-------------------------------
    *   Open Login Modal
    *   Click Login Button
    -------------------------------*/
    self.openLoginModal = function(){
        modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/partials/modals/login-modal.html',
            controller: 'loginModalController',
            controllerAs: '$ctrl',
            size: 'tiny-st'
        });
        self.modalInstance.set(modalInstance);
    };

    /*-------------------------------
    *   Open CreateStory Modal
    *   Click Create story Button
    -------------------------------*/

    self.openCreateNewStoryModal = function(){
        modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/partials/modals/createnewstory-modal.html',
            controller: 'createnewstoryModalController',
            controllerAs: '$ctrl',
            size: 'medium-st',
            backdrop  : 'static',
            keyboard  : false,
            resolve: {
              param: function () {
                return {
                    'story': [] ,
                    'fromWhere' : ''
                };
              }
            }
        });
        self.modalInstance.set(modalInstance);

    };
    /*-----------------------------------------
    *   If there is param for verify account
    *   (User account veryfiy)
    -----------------------------------------*/
    if ($state.current.name == 'passwordVerify') {
        if ($stateParams.token) {
            Authentication.forgotPasswordVerify = true;
            self.openLoginModal();
        }
    }   else if($state.current.name == 'registerVerify') {
        if($stateParams.token) {
            self.openLoginModal();  //Open Login Modal
            Authentication.VerifyAccountAction($stateParams.token , function(response){ //check the verfiy token
                if (!response) {

                }   else    {
                    if ($cookies.get('accessToken')) {
                        $window.location = "/#/my_journal";
                        $window.location.reload()
                    }
                }
            });
        }
    }

  });
