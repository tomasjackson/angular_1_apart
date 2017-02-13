'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:ModalsSharestoryModalControllerCtrl
 * @description
 * # ModalsSharestoryModalControllerCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
    .controller('ShareMediaController', function ($scope, modalInstance, UserService, MediaService, $loading, param) {
    // initial
        var self = this;
        self.my_contact = [];
        self.opt = {
            mode_all : false,
            mode_select : false
        };
        self.shared_users = [];

    // loading bar
        $scope.startLoading = function (name) {$loading.start(name);};
        $scope.finishLoading = function (name) {$loading.finish(name);};

        this.$onInit = function(){
          $scope.startLoading('loading_contact');
          UserService.getFriends(function(res){
            if (res) {
              $scope.finishLoading('loading_contact');
              for (var i = 0; i < res.friends.length; i++) self.my_contact.push(res.friends[i].user);
            }
          });
          MediaService.GetSharedDetails(param.media.id , function(res) {
            if (res) {
              for (var i = 0;i < res.shared.users.length; i++) {
                getContactId(res.shared.users[i].user);
              }
            }
          });
        };

        function getContactId(contact) {
          for (var i = 0; i < self.my_contact.length; i++) {
            if (self.my_contact[i].id == contact.id) {
              self.my_contact[i].selected = true;
            }
          }
        }

    // click close modal
        self.Close = function() {
            modalInstance.get().close();
        };

    // click select mode option
        self.SelectMode = function($event , mode) {
            if (mode == 'MODE_ALL') {
                self.opt.mode_all = !self.opt.mode_all;
                self.opt.mode_select = false;
                SetSelected(self.opt.mode_all);
            }   else if (mode == 'MODE_SELECT') {
                self.opt.mode_select = !self.opt.mode_select;
                self.opt.mode_all = false;
                SetSelected(false);
            }   else    {
                console.log('Unexpected Error occured');
            }
        };

    // click avatar
        self.SelectContact = function($event, account) {
            if (self.opt.mode_all) {
                self.opt.mode_all = false;
                SetSelected(false);
            }
            account.selected = !account.selected;
        };

    // click share this story
        self.ShareThisMedia = function($event) {
            $scope.startLoading('share-media');
            var friends = [];
            for (var i = 0; i < self.my_contact.length; i++) {
                if (self.my_contact[i].selected) {
                    friends.push(self.my_contact[i].id);
                }
            }

            MediaService.SetPrivacyForMedia(param.media.id, {scope:1, allow_share: true, notes_private: true}, function(res) {
              if (res) {
                MediaService.ShareMediaToFriends(param.media.id, friends, function(res) {
                  if (res) {
                    $scope.finishLoading('share-media');
                    modalInstance.get().close();
                  }
                });             }
            });
        };

    // set select value function
        var SetSelected = function (mode) {
            for (var i = 0; i < self.my_contact.length; i++) {
                  self.my_contact[i].selected = mode;
            }
        };

});
