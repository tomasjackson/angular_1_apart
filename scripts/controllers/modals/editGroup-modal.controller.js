/**
 * Created by bear on 9/30/16.
 */
'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:editGroupCtrl
 * @description
 * # editGroupCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('editGroupCtrl', function ($scope, UserService, mainService, $uibModalInstance, param) {

    var self = this;
    self.group = param.group;
    self.editGroupName = self.group.name;
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

    self.editGroup = function editGroup() {
      if(self.editGroupName === '') {
        self.ErrorMessage = 'Group Name Required!';
      } else {
        UserService.editGroup(self.group, self.editGroupName, self.selectedFriends, function(response) {
          console.log('editGroup = ', response);
          self.closeModal();
        });
      }
    };

    self.selectExistingGroupOption = function selectExistingGroupOption(flag) {
      self.showExistingGroup = flag;
      self.friends = [];

      if(self.showExistingGroup) {
        self.selectGroup(self.allGroup[0]);
      }
    };

    self.selectGroup = function selectGroup(group) {
      self.selectedGroup = group;
      self.friends = group.users;
    };

    self.closeModal = function closeModal() {
      $uibModalInstance.close();
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
        for(var i = 0; i < allGroups.groups.length; i++) {
          var group = allGroups.groups[i];

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

            if(self.group.id === self.allGroup[self.groupIndex].group.id) {
              for(var j = 0; j < response.users.length; j++) {
                response.users[j].user.selected = true;
                groupUsers.push(response.users[j].user);
              }
              self.allGroup[self.groupIndex].users = groupUsers;
              self.selectGroup(self.allGroup[self.groupIndex]);
              self.selectAllFriends(self.allGroup[self.groupIndex]);
            } else {
              for(var j = 0; j < response.users.length; j++) {
                response.users[j].user.selected = false;
                groupUsers.push(response.users[j].user);
                self.allGroup[self.groupIndex].users = groupUsers;
              }
            }

            self.groupIndex++;
          });
        }
      });
    };

    self.getAllGroup();
  });
