'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:UserGroupCtrl
 * @description
 * # UserGroupCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('UserGroupCtrl', function ($scope, UserService, $uibModal, $state) {
    var self = this;

    var flag_created = false;

    self.myContacts = '';
    self.myFavorites = [];
    self.favoritedBy = [];
    self.defaultGroup = [
      {
        name: 'My Contacts'
      },
      {
        name: 'My Favorites'
      },
      {
        name: 'Favorited By'
      }
    ];
    self.category = self.defaultGroup[0];

    self.getMyContacts = function getMyContacts() {
      self.myContacts = '';
      UserService.getFriends(function(response) {
        self.myContacts = response.friends;
        self.friends = self.myContacts;
      });
    };

    self.getMyFavorites = function getMyFavorites() {
      self.myFavorites = [];
      UserService.getFavourite(function(response) {
        for(var i = 0; i < response.users.length; i++) {
          self.myFavorites.push({user: response.users[i].favoriteUser});
        }
      });
    };

    self.getFavoritedBy = function getFavoritedBy() {
      self.favoritedBy = [];
      UserService.getFavoritedBy(function(response) {
        for(var i = 0; i < response.users.length; i++) {
          self.favoritedBy = response.users;
        }
      });
    };

    self.selectCategory = function selectCategory(category) {
      console.log(category);
      self.category = category;
      self.friends = '';

      switch (category) {
        case self.defaultGroup[0]:
          self.friends = self.myContacts;
          break;
        case self.defaultGroup[1]:
          self.friends = self.myFavorites;
          break;
        case self.defaultGroup[2]:
          self.friends = self.favoritedBy;
          break;
        default :
          UserService.getSelectedGroupUsers(category, function(response) {
            self.friends = response.users;
          });
          break;
      }
    };

    self.addContact = function addContact(user) {
      UserService.addContact(user, function(response) {
        if(response) {
          var modal = $uibModal.open({
            animation: true,
            templateUrl: 'views/partials/modals/connectUser-confirm-modal.html',
            controller: 'connectUserConfirmCtrl',
            controllerAs: '$ctrl',
            size: 'medium-st',
            backdrop  : 'static',
            keyboard  : false,
            resolve: {
              param: function () {
                return {
                  'category': 'addContact',
                  'user': user
                };
              }
            }
          }).result.then(function(){
            });
        } else {
          $scope.ErrorMessage = response.message;
        }
      });
    };

    self.removeContact = function removeContact(user) {
      var modal = $uibModal.open({
        animation: true,
        templateUrl: 'views/partials/modals/connectUser-confirm-modal.html',
        controller: 'connectUserConfirmCtrl',
        controllerAs: '$ctrl',
        size: 'medium-st',
        backdrop  : 'static',
        keyboard  : false,
        resolve: {
          param: function () {
            return {
              'category': 'removeContact',
              'user': user
            };
          }
        }
      }).result.then(function(param){
          if(param) {
            for(var i = 0; i < self.myContacts.length; i++) {
              if(user.id === self.myContacts[i].user.id) {
                self.myContacts.splice(i, 1);
              }
            }
            for(i = 0; i < self.myFavorites.length; i++) {
              if(user.id === self.myFavorites[i].user.id) {
                self.myFavorites[i].user.areFriends = false;
              }
            }
            for(i = 0; i < self.favoritedBy.length; i++) {
              if(user.id === self.favoritedBy[i].user.id) {
                self.favoritedBy[i].user.areFriends = false;
              }
            }
            for(i = 0; i < self.friends.length; i++) {
              if(user.id === self.friends[i].user.id) {
                self.friends[i].user.areFriends = false;
              }
            }
          }
        });
    };

    self.addFavourite = function addFavourite(user) {
      UserService.addFavourite(user, function(response) {
        if(response) {
          var modal = $uibModal.open({
            animation: true,
            templateUrl: 'views/partials/modals/connectUser-confirm-modal.html',
            controller: 'connectUserConfirmCtrl',
            controllerAs: '$ctrl',
            size: 'medium-st',
            backdrop  : 'static',
            keyboard  : false,
            resolve: {
              param: function () {
                return {
                  'category': 'addFavourite',
                  'user': user
                };
              }
            }
          }).closed.then(function(){
              self.getMyFavorites();
              for(var i = 0; i < self.myContacts.length; i++) {
                if(user.id === self.myContacts[i].user.id) {
                  self.myContacts[i].user.isFavorite = true;
                }
              }
              for(i = 0; i < self.favoritedBy.length; i++) {
                if(user.id === self.favoritedBy[i].user.id) {
                  self.favoritedBy[i].user.isFavorite = true;
                }
              }
              for(i = 0; i < self.friends.length; i++) {
                if(user.id === self.friends[i].user.id) {
                  self.friends[i].user.isFavorite = true;
                }
              }
            });
        } else {
          $scope.ErrorMessage = response.message;
        }
      });
    };

    self.removeFavorite = function removeFavorite(user) {
      var modal = $uibModal.open({
        animation: true,
        templateUrl: 'views/partials/modals/connectUser-confirm-modal.html',
        controller: 'connectUserConfirmCtrl',
        controllerAs: '$ctrl',
        size: 'medium-st',
        backdrop  : 'static',
        keyboard  : false,
        resolve: {
          param: function () {
            return {
              'category': 'removeFavourite',
              'user': user
            };
          }
        }
      }).result.then(function(param){
          if(param) {
            for(var i = 0; i < self.myFavorites.length; i++) {
              if(user.id === self.myFavorites[i].user.id) {
                self.myFavorites.splice(i, 1);
              }
            }
            for(i = 0; i < self.myContacts.length; i++) {
              if(user.id === self.myContacts[i].user.id) {
                self.myContacts[i].user.isFavorite = false;
              }
            }
            for(i = 0; i < self.favoritedBy.length; i++) {
              if(user.id === self.favoritedBy[i].user.id) {
                self.favoritedBy[i].user.isFavorite = false;
              }
            }
            for(i = 0; i < self.friends.length; i++) {
              if(user.id === self.friends[i].user.id) {
                self.friends[i].user.isFavorite = false;
              }
            }
          }
        });
    };

    self.addToGroup = function addToGroup(user) {
      var modal = $uibModal.open({
        animation: true,
        templateUrl: 'views/partials/modals/connectUser-confirm-modal.html',
        controller: 'connectUserConfirmCtrl',
        controllerAs: '$ctrl',
        size: 'small-st',
        backdrop  : 'static',
        keyboard  : false,
        resolve: {
          param: function () {
            return {
              'category': 'addToGroup',
              'user': user
            };
          }
        }
      }).closed.then(function(){
          InitUserGroupCtrl();
        });
    };

    self.createNewGroup = function createNewGroup() {
      self.category = 'newGroup';
      var modal = $uibModal.open({
        animation: true,
        templateUrl: 'views/partials/modals/newGroup-modal.html',
        controller: 'newGroupCtrl',
        controllerAs: '$ctrl',
        size: 'medium-st',
        backdrop  : 'static',
        keyboard  : false
      }).closed.then(function(){
          InitUserGroupCtrl();
          flag_created = true;
        });
    };

    self.getAllGroups = function getAllGroups() {
      UserService.getAllGroups(function(response) {
        self.allGroups = response.groups;
        if (flag_created){
          self.category = self.allGroups[self.allGroups.length - 1];
          self.selectCategory(self.category);
          flag_created = false;
        }
      });
    };

    self.editGroup = function editGroup(group) {
      var modal = $uibModal.open({
        animation: true,
        templateUrl: 'views/partials/modals/editGroup-modal.html',
        controller: 'editGroupCtrl',
        controllerAs: '$ctrl',
        size: 'medium-st',
        backdrop  : 'static',
        keyboard  : false,
        resolve: {
          param: function () {
            return {
              'group': group
            };
          }
        }
      }).closed.then(function(){
          InitUserGroupCtrl();
        });
    };

    self.deleteGroup = function deleteGroup(group) {
      UserService.deleteGroup(group, function(response) {
        InitUserGroupCtrl();
      });
    };

    self.selectOtherUser = function selectOtherUser(user) {
      $state.go('mainPage.otherUser', {user: user});
    };

    function InitUserGroupCtrl() {
      self.myContacts = '';
      self.myFavorites = [];
      self.category = self.defaultGroup[0];
      //self.acceptContactRequest();
      self.getMyContacts();
      self.getMyFavorites();
      self.getFavoritedBy();
      self.selectCategory(self.category);
      self.getAllGroups();
    }

    InitUserGroupCtrl();
  });
