'use strict';
angular.module('frontendApp')
  .controller('ShareStoryController', function ($scope, modalInstance, UserService, StoryManager, $loading, param, mainService) {
      var self = this;
      self.groupIndex = 0;
      self.friends = [];
      self.selectedFriends = [];
      self.showExistingGroup = true;

      self.allGroup = [
        {group: {name: 'My Contacts'}, users: [], selectAll: false},
        {group: {name: 'My Favorites'}, users: [], selectAll: false},
        {group: {name: 'Favorited By'}, users: [], selectAll: false}
      ];
      self.getAllGroup = function() {
        UserService.getFriends(function(response) {
          $scope.finishLoading('loading_contact');

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
            var tempGroup = {group: group, users: [], selectAll: false};
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

      self.selectGroup = function selectGroup(group) {
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
      self.selectExistingGroupOption = function selectExistingGroupOption(flag) {
        self.showExistingGroup = flag;
        self.friends = [];

        if(self.showExistingGroup) {
          self.selectGroup(self.allGroup[0]);
        }
      };

      self.refactorSelFriendList = function(friend) {
        var sameUserIndex = -1;
        for(var i = 0; i < self.selectedFriends.length; i++) {
          if(friend.id === self.selectedFriends[i].id) sameUserIndex = i;
        }
        if(sameUserIndex === -1) {
          if(friend.selected) self.selectedFriends.push(friend);
        } else {
          if(!friend.selected) self.selectedFriends.splice(sameUserIndex, 1);
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
          self.allGroup[i].selectAll = selectedCount === self.allGroup[i].users.length;

          if(deselectedCount === self.allGroup[i].users.length) self.allGroup[i].selectAll = false;
        }
      };

    // loading bar
      $scope.startLoading = function (name) {$loading.start(name); };
      $scope.finishLoading = function (name) {$loading.finish(name);};

      this.$onInit = function(){
        $scope.startLoading('loading_contact');
        self.getAllGroup();
        self.selectGroup(self.allGroup[0]);
        StoryManager.GetSharedDetails(param.story.id , function(res) {
          if (res) {
            for (var i = 0;i < res.users.length; i++) {
              getContactId(res.users[i].user);
            }
          }
        });
      };

      function getContactId(contact) {
        for (var i = 0; i < self.friends.length; i++) {
          if (self.friends[i].id == contact.id) {
            self.friends[i].selected = true;
            self.selectedFriends.push(self.friends[i]);
          }
        }
      }

  // click close modal
      self.Close = function() {
          modalInstance.get().close();
      };

  // click avatar
      self.SelectContact = function($event, account) {
          if (self.opt.mode_all) {
              self.opt.mode_all = false;
              SetSelected(false);
          }
          account.selected = !account.selected;
      };

      self.ShareThisStory = function($event) {
        $scope.startLoading('share-story');

        var friendsIds = [];
        for(var i = 0; i < self.selectedFriends.length; i++) {friendsIds.push(self.selectedFriends[i].id);}

        StoryManager.SetPrivacyForStory(param.story.id, {scope:1, allow_share: true, notes_private: true}, function(res) {
          if (res) {
            param.story.privacy.scope = 1;
            StoryManager.ShareStoryAction(param.story.id , friendsIds , function(res) {
              $scope.finishLoading('share-story');
              if (res) modalInstance.get().close();
            });
          }
        });
      };

});
