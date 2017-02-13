/**
 * Created by bear on 9/22/16.
 */
'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:SearchresultCtrl
 * @description
 * # SearchresultCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('SearchResultCtrl', function ($scope, UserService, $state, modalInstance, ModalInstanceStore, $uibModal, mainService) {
    var self = this;
    self.searchResult = '';
    self.searchedUsers = '';
    self.searchQuery = '';
    self.Friends = '';
    self.Favourite = '';

    self.noResult = false;
    self.ErrorMessage = '';

    $scope.$on('SearchResult',function(ev, args){

      console.log(args.query);

      if (args.result.users.length == 0) {
        self.noResult = true;
        self.ErrorMessage = "We do not know any user associated with that " + args.query.query;
      }

      self.searchCategory = args.query.category;
      self.searchResult = args.result.users;
      self.searchQuery = args.query;
    });

    //self.getAllFriends = function getAllFriends() {
    //  console.log('getAllFriends start');
    //  UserService.getFriends(function(response) {
    //    console.log('getAllFriends-controler = ', response.friends);
    //    if(response.success) {
    //      self.Friends = response.friends;
    //      self.findFriends();
    //    } else {
    //      $scope.ErrorMessage = response.message;
    //    }
    //  });
    //};
    //
    //self.getAllFavourite = function getAllFavourite() {
    //  UserService.getFavourite(function(response) {
    //    console.log('getAllFavourite-controler = ', response.users);
    //    if(response.success) {
    //      self.Favourite = response.users;
    //      self.findFavourites();
    //    } else {
    //      $scope.ErrorMessage = response.message;
    //    }
    //  });
    //};
    //
    //self.findFriends = function findFriends() {
    //  for(var i = 0; i < self.searchResult.length; i++) {
    //    self.searchResult[i].friend = false;
    //    self.searchResult[i].group = false;
    //    for(var j = 0; j < self.Friends.length; j++) {
    //      if(self.searchResult[i].username === self.Friends[j].user.username) {
    //        self.searchResult[i].friend = true;
    //      }
    //    }
    //  }
    //};
    //
    //self.findFavourites = function findFavourites() {
    //  for(var i = 0; i < self.searchResult.length; i++) {
    //    self.searchResult[i].favourite = false;
    //    for(var j = 0; j < self.Favourite.length; j++) {
    //      if(self.searchResult[i].username === self.Favourite[j].favoriteUser.username) {
    //        self.searchResult[i].favourite = true;
    //      }
    //    }
    //  }
    //};

    self.searchUsers = function searchUsers() {
      mainService.Search(self.searchQuery, function(response) {
        if(response) {
          console.log('mainService.Search = ', response);
        }else {
          console.log('mainService.Search - error = ', response);
        }
      });
    };

    self.addContact = function addContact(user) {
      UserService.addContact(user, function(response) {
        console.log('addContact-controler = ', response);
        if(response) {
          var modal = $uibModal.open({
            animation: true,
            templateUrl: 'views/partials/modals/connectUser-confirm-modal.html',
            controller: 'connectUserConfirmCtrl',
            controllerAs: '$ctrl',
            size: 'medium-st',
            resolve: {
              param: function () {
                return {
                  'category': 'addContact',
                  'user': user
                };
              }
            }
          }).closed.then(function(){
              user.areFriends = true;
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
        resolve: {
          param: function () {
            return {
              'category': 'removeContact',
              'user': user
            };
          }
        }
      }).closed.then(function(){
          user.areFriends = false;
        });
      modalInstance.set(modal);
    };

    self.addFavourite = function addFavourite(user) {
      UserService.addFavourite(user, function(response) {
        console.log('addFavourite-controler = ', response);
        if(response) {
          var modal = $uibModal.open({
            animation: true,
            templateUrl: 'views/partials/modals/connectUser-confirm-modal.html',
            controller: 'connectUserConfirmCtrl',
            controllerAs: '$ctrl',
            size: 'medium-st',
            resolve: {
              param: function () {
                return {
                  'category': 'addFavourite',
                  'user': user
                };
              }
            }
          }).closed.then(function(){
              user.isFavorite = true;
            });
          modalInstance.set(modal);
        } else {
          $scope.ErrorMessage = response.message;
        }
      });
    };

    self.removeFavourite = function removeFavourite(user) {
      var modal = $uibModal.open({
        animation: true,
        templateUrl: 'views/partials/modals/connectUser-confirm-modal.html',
        controller: 'connectUserConfirmCtrl',
        controllerAs: '$ctrl',
        size: 'medium-st',
        resolve: {
          param: function () {
            return {
              'category': 'removeFavourite',
              'user': user
            };
          }
        }
      }).closed.then(function(){
          user.isFavorite = false;
        });
      modalInstance.set(modal);
    };

    self.addGroup = function addGroup(user) {
      var modal = $uibModal.open({
        animation: true,
        templateUrl: 'views/partials/modals/connectUser-confirm-modal.html',
        controller: 'connectUserConfirmCtrl',
        controllerAs: '$ctrl',
        size: 'medium-st',
        resolve: {
          param: function () {
            return {
              'category': 'addGroup',
              'user': user
            };
          }
        }
      }).closed.then(function(){
          //self.getAllFriends();
          //self.getAllFavourite();
        });
      modalInstance.set(modal);
    };

    self.removeGroup = function removeGroup(user) {
      var modal = $uibModal.open({
        animation: true,
        templateUrl: 'views/partials/modals/connectUser-confirm-modal.html',
        controller: 'connectUserConfirmCtrl',
        controllerAs: '$ctrl',
        size: 'medium-st',
        resolve: {
          param: function () {
            return {
              'category': 'removeGroup',
              'user': user
            };
          }
        }
      }).closed.then(function(){
          //self.getAllFriends();
          //self.getAllFavourite();
        });
      modalInstance.set(modal);
    };

    self.selectOtherUser = function selectOtherUser(user) {
      $state.go('mainPage.otherUser', {user: user});
    };
  });
