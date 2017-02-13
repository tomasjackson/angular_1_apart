/**
 * Created by bear on 9/27/16.
 */

angular.module('frontendApp')
  .controller('connectUserConfirmCtrl', function ($scope, modalInstance, param, UserService, $uibModalInstance, $q) {
    var self = this;

    self.user = param.user;
    self.category = param.category;
    self.groups = [];
    self.savedGroups = [];
    self.deletedGroups = [];

    self.closeModal = function closeModal() {
      $uibModalInstance.close();
      //modalInstance.get().close();
    };

    self.removeContact = function removeContact() {
      UserService.removeContact(self.user, function(response) {
        console.log('removeContact-controler = ', response);
        if(response) {
          $uibModalInstance.close(true);
          //modalInstance.get().close();
        } else {
          $uibModalInstance.close(false);
          //modalInstance.get().close();
        }
      });
    };

    self.removeFavourite = function removeFavourite() {
      UserService.removeFavourite(self.user, function(response) {
        console.log('removeFavourite-controler = ', response);
        if(response) {
          $uibModalInstance.close(true);
        } else {
          $uibModalInstance.close(false);
        }
      });
    };

    self.addGroup = function addGroup() {
      UserService.addGroup(self.user, function(response) {
        console.log('addGroup-controler = ', response);
        if(response) {
          $scope.SuccessMessage = response.message;
        } else {
          $scope.ErrorMessage = response.message;
        }
      });
    };

    self.getAllGroups = function getAllGroups() {
      UserService.getAllGroups(function(response) {
        for(var i = 0; i < response.groups.length; i++) {
          var tempGroup = {
            group: response.groups[i],
            existUser: false
          };
          self.groups.push(tempGroup);
        }

        self.IsExistUserInGroup();
      });
    };

    self.IsExistUserInGroup = function() {
      for(var i = 0; i < self.groups.length; i++) {
        UserService.getSelectedGroupUsers(self.groups[i].group, function(response) {
          if(response) {
            var users = response.users;
            for(var j = 0; j < users.length; j++) {
              if(self.user.id === users[j].user.id) {
                for(var k = 0; k < self.groups.length; k++) {
                  if(self.groups[k].group.id === response.group.id) {
                    self.groups[k].existUser = true;
                  }
                }
                break;
              }
            }
          }
        });
      }
    };

    self.addToUser = function(group) {
      group.existUser = !group.existUser;

      if(group.existUser) {
        var deleteFlag = false;
        for(var i = 0; i < self.deletedGroups.length; i++) {
          if(group.group.id === self.deletedGroups[i].id) {
            self.deletedGroups.splice(i, 1);
            deleteFlag = true;
          }
        }
        if(!deleteFlag)
          self.savedGroups.push(group.group);
      } else {
        var saveFlag = false;
        for(var k = 0; k < self.savedGroups.length; k++) {
          if(group.group.id === self.savedGroups[k].id) {
            self.savedGroups.splice(k, 1);
            saveFlag = true;
          }
        }
        if(!saveFlag)
          self.deletedGroups.push(group.group);
      }

      console.log('deletedGroups = ', self.deletedGroups);
      console.log('savedGroups = ', self.savedGroups);
    };

    self.deleteGroup = function deleteGroup(deletedGroups) {
      var defer = $q.defer();
      self.count = 0;
      if(deletedGroups.length) {
        for(var i = 0; i < deletedGroups.length; i++) {
          self.count++;
          UserService.deleteUserFromGroup(deletedGroups[i], self.user, function (response) {
            self.count--;
            if (response) {
              console.log('deleteUserFromGroup = ', response);
            }
            if(self.count == 0) {
              defer.resolve();
            }
          });
        }
      } else {
        defer.resolve();
      }

      return defer.promise;
    };

    self.saveGroup = function saveGroup(savedGroup) {
      var defer = $q.defer();
      self.count = 0;
      if(savedGroup.length) {
        for(var i = 0; i < savedGroup.length; i++) {
          self.count++;
          UserService.addUserToGroup(savedGroup[i], self.user, function(response) {
            self.count--;
            if(response) {
              console.log('addUserToGroup = ', response);
            }
            if(self.count == 0) {
              defer.resolve();
            }
          });
        }
      } else {
        defer.resolve();
      }

      return defer.promise;
    };

    self.onSave = function() {
      self.index = 0;

      self.deleteGroup(self.deletedGroups)
        .then(function() {
          self.saveGroup(self.savedGroups)
            .then(function() {
              $uibModalInstance.close();
            })
        });
    };

    if(self.category === 'addToGroup') {
      self.getAllGroups();
    }
  });
