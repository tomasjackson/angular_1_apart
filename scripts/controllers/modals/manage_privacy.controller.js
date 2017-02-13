/**
 * Created by bear on 9/17/16.
 */
'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:ManagePrivacyCtrl
 * @description
 * # ManagePrivacyCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('ManagePrivacyCtrl', function ($loading, $scope, param, modalInstance, StoryManager, UserService, mainService) {
    var self = this;
    self.story = param.story;
    self.privacy = self.story.privacy;
    self.privacyScopes = '';

    self.shareStory = false;
    self.hideNote = false;
    self.IsPrivate = false;
    self.IsSelectUser = false;

    self.newGroupName = '';
    self.showExistingGroup = true;
    self.groupIndex = 0;
    self.selectedGroup = '';
    self.allGroup = [
      {
        group: {
          name: 'My Contacts'
        },
        users: [],
        selectAll: false
      },
      {
        group: {
          name: 'My Favorites'
        },
        users: [],
        selectAll: false
      },
      {
        group: {
          name: 'Favorited By'
        },
        users: [],
        selectAll: false
      }
    ];

    self.friends = [];
    self.selectedFriends = [];
    self.searchUser = '';
    self.searchedFriends = [];

// loading bar
    $scope.startLoading = function (name) {
        $loading.start(name);
    };
    $scope.finishLoading = function (name) {
        $loading.finish(name);
    };

    $scope.startLoading('loading');
    self.getScopes = function getScopes() {
      StoryManager.getScopes(function (response) {
        if(response) {
          self.privacyScopes = response.data.scopes;
          $scope.finishLoading('loading');
        }
      });
    };
    /*------------------------------------------------
     *   Close 'X' Button Click
     *   close modal and no data stores in the browser
     --------------------------------------------------*/
    self.closeModal = function closeModal(){
      modalInstance.get().close();
    };
    /*-----------------------------------------------
     *   Cancel button click
     *   all the created date lost
     ------------------------------------------------*/
    self.cancelModal = function cancelModal(){
      modalInstance.get().close();
    };

    self.savePrivacy = function savePrivacy() {
      if(self.privacy.scope.id === 3) {
        var friendsIds = [];
        for(var i = 0; i < self.selectedFriends.length; i++) {
          friendsIds.push(self.selectedFriends[i].id);
        }

        StoryManager.setPrivacyForStoryWithUsers(self.story.id, friendsIds, function(response) {
          if(response) {
            modalInstance.get().close();
          }
        });
      } else {
        var privacyData = {
          allow_share: self.privacy.allowShare,
          notes_private: self.privacy.notesPrivate,
          view_permission: true,
          scope: self.privacy.scope.id
        };
        StoryManager.SetPrivacyForStory(self.story.id, privacyData, function(response) {
          if(response) {
            modalInstance.get().close();
          }
        });
      }
    };

    self.selectPrivacy = function selectPrivacy(privacyId) {
      self.privacy.scope.id = privacyId;
      if(privacyId === 2) {
        self.IsPrivate = true;
        self.IsSelectUser = false;
      } else if(privacyId === 3){
        self.IsPrivate = false;
        self.IsSelectUser = true;
      } else {
        self.IsPrivate = false;
        self.IsSelectUser = false;
      }
    };

    self.selectShareStory = function selectShareStory() {
      self.privacy.allowShare = !self.privacy.allowShare;
    };

    self.selectHideNote = function selectHideNote() {
      self.privacy.notesPrivate = !self.privacy.notesPrivate;
    };

    self.selectExistingGroupOption = function selectExistingGroupOption(flag) {
      self.showExistingGroup = flag;
      self.friends = [];

      if(self.showExistingGroup) {
        self.selectGroup(self.allGroup[0]);
      }
    };

    self.selectGroup = function selectGroup(group) {
      console.log('selectGroup = ', group);
      self.selectedGroup = group;
      self.friends = group.users;
    };

    self.selectedFriend = function selectedFriend(friend) {
      if(self.showExistingGroup) {//existing Group
        friend.selected = !friend.selected;
        for(var i = 0; i < self.allGroup.length; i++) {
          for(var j = 0; j < self.allGroup[i].users.length; j++) {
            if(friend.id === self.allGroup[i].users[j].id) {
              self.allGroup[i].users[j].selected = friend.selected;
            }
          }
        }
        self.IsSelectedAllUsersinGroup();
      } else {
        friend.selected = !friend.selected;
      }

      self.refactorSelFriendList(friend);
    };

    self.refactorSelFriendList = function(friend) {
      var sameUserIndex = -1;
      for(var i = 0; i < self.selectedFriends.length; i++) {
        if(friend.id === self.selectedFriends[i].id) {
          sameUserIndex = i;
        }
      }

      if(sameUserIndex === -1) {
        if(friend.selected)
          self.selectedFriends.push(friend);
      } else {
        if(!friend.selected) {
          self.selectedFriends.splice(sameUserIndex, 1);
        }
      }
    };

    self.selectAllFriends = function selectAllFriends(group) {
      group.selectAll = !group.selectAll;

      for(var i = 0; i < group.users.length; i++) {
        group.users[i].selected = group.selectAll;
        self.markUsersInAllGroup(group.users[i], group.selectAll);
        self.refactorSelFriendList(group.users[i]);
      }

      self.IsSelectedAllUsersinGroup();
    };

    self.markUsersInAllGroup = function markUsersInAllGroup(user, IsSelected) {
      for(var i = 0; i < self.allGroup.length; i++) {
        for(var j = 0; j < self.allGroup[i].users.length; j++) {
          if(user.id === self.allGroup[i].users[j].id) {
            self.allGroup[i].users[j].selected = IsSelected;
          }
        }
      }
    };

    self.IsSelectedAllUsersinGroup = function() {
      for(var i = 0; i < self.allGroup.length; i++) {
        var selectedCount = 0;
        var deselectedCount = 0;

        for(var j = 0; j < self.allGroup[i].users.length; j++) {
          if(self.allGroup[i].users[j].selected === true) {
            selectedCount++;
          } else {
            deselectedCount++;
          }
        }
        if(selectedCount === self.allGroup[i].users.length) {
          self.allGroup[i].selectAll = true;
        } else {
          self.allGroup[i].selectAll = false;
        }
        if(deselectedCount === self.allGroup[i].users.length) {
          self.allGroup[i].selectAll = false;
        }
      }
    };

    /*------------------------------------
     * Get keydown event from search bar
     ------------------------------------*/
    self.SearchKeydown = function($event) {
      // $event.preventDefault();
      if ($event.keyCode == 13) {
        $event.preventDefault();
        self.Search();
      }
    };

    self.Search = function() {
      self.searchQuery = {
        category: 'user',
        query: self.searchUser
      };

      console.log('Search-query = ', self.searchQuery);
      mainService.Search(self.searchQuery, function(response) {
        if(response) {
          self.searchedFriends = response.users;

          for(var i = 0; i < self.selectedFriends.length; i++) {
            for(var j = 0; j < self.searchedFriends.length; j++) {
              if(self.selectedFriends[i].id === self.searchedFriends[j].id) {
                self.searchedFriends[j].selected = self.selectedFriends[i].selected;
              }
            }
          }
        }else {
          console.log('mainService.Search - error = ', response);
        }
      });
    };

    self.getAllGroup = function() {
      UserService.getFriends(function(response) {
        for(var i = 0; i < response.friends.length; i++) {
          response.friends[i].user.selected = false;
          self.allGroup[0].users.push(response.friends[i].user);
        }
      });
      UserService.getFavourite(function(response) {
        for(var i = 0; i < response.users.length; i++) {
          response.users[i].favoriteUser.selected = false;
          self.allGroup[1].users.push(response.users[i].favoriteUser);
        }
      });
      UserService.getFavoritedBy(function(response) {
        for(var i = 0; i < response.users.length; i++) {
          response.users[i].user.selected = false;
          self.allGroup[2].users.push(response.users[i].user);
        }
      });
      UserService.getAllGroups(function(allGroups) {
        for(var i = 0; i < allGroups.data.groups.length; i++) {
          var group = allGroups.data.groups[i];

          var tempGroup = {
            group: group,
            users: [],
            selectAll: false
          };
          self.allGroup.push(tempGroup);
        }

        self.groupIndex = 3;
        for(var index = 3; index < self.allGroup.length; index++) {
          UserService.getSelectedGroupUsers(self.allGroup[index].group, function(response) {
            var groupUsers = [];
            for(var j = 0; j < response.users.length; j++) {
              response.users[j].user.selected = false;
              groupUsers.push(response.users[j].user);
            }
            self.allGroup[self.groupIndex].users = groupUsers;
            self.groupIndex++;
          });
        }
      });
    };

    self.getAllGroup();
    self.selectGroup(self.allGroup[0]);

    self.getScopes();
    self.selectPrivacy(self.privacy.scope.id);
  });
