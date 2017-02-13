/**
 * Created by bear on 9/1/16.
 */
'use strict';

/*-----------------------------
 *   This service is for
 *    user related service.
 *
 -----------------------------*/

angular.module('frontendApp').service('UserService', function ($cookies, APIConsole){

  var self = this;	//set instance to self
  self.message_success = '';
  self.message_failure = '';
  self.index = 0;
  /*-------------------------------
   *	Save story Action
   -------------------------------*/
  self.UploadAvatar = function (data, header1, header2, callback) {
    APIConsole.sendMediaAPIRequest('POST', 'user/avatar', data, header1, header2)
      .then(function(response){
        callback(response.data);
      }, function(response){
        callback(false);
      });
  };

  self.getUserInfo = function (callback) {

    APIConsole.sendAPIRequest('GET', 'user', '')
      .then(function(response){
        callback(response.data);
      } , function(){
        callback(false);
      });
  };

  self.getUserStateInfo = function(callback) {
    APIConsole.sendAPIRequest('GET', 'user/stats', '')
      .then(function(response){
        callback(response.data);
      }, function(response){
        callback(false);
      });
  };

  self.getUserPermission = function (callback) {
    APIConsole.sendAPIRequest('GET', 'user/setting/profile/permissions', '')
      .then(function(response){
        callback(response.data);
      }, function(){
        callback(false);
      });
  };

  self.saveProfile = function (data, callback) {
    APIConsole.sendAPIRequest('POST', 'user', data)
      .then(function(response){
        callback(response.data);
      }, function(response){
        callback(false);
      });
  };

  self.savePermission = function (data, callback) {
    console.log('savePermission');
    APIConsole.sendAPIRequest('POST', 'user/setting/profile/permissions', data)
      .then(function(response){
        callback(response.data);
      }, function(response){
        callback(false);
      });
  };

  self.changePassword = function (data, callback) {
    console.log('changePassword-service');
    APIConsole.sendAPIRequest('POST', 'user/password', data)
      .then(function(response){
        callback(response.data);
      }, function(response){
        callback(false);
      });
  };

  self.saveSocialInfo = function(data, callback) {
    console.log('saveSocialInfo = ', data);
    APIConsole.sendAPIRequest('POST', 'user/setting/social', data)
      .then(function(response){
        callback(response.data);
      }, function(response){
        callback(false);
      });
  };

  self.getFriends = function(callback) {
    APIConsole.sendAPIRequest('GET', 'friends', '')
      .then(function(response){
        callback(response.data);
      }, function(response){
        console.log(response);
        callback(false);
      });
  };

  self.getFavourite = function(callback) {
    APIConsole.sendAPIRequest('GET', 'user/favorite', '')
      .then(function(response){
        callback(response.data);
      }, function(response){
        callback(false);
      });
  };

  self.getFavoritedBy = function(callback) {
    APIConsole.sendAPIRequest('GET', 'user/favoriteby', '')
      .then(function(response){
        callback(response.data);
      }, function(response){
        callback(false);
      });
  };

  self.addContact = function(user, callback) {
    APIConsole.sendAPIRequest('POST', 'friend/request', user)
      .then(function(response){
        callback(response.data);
      }, function(response){
        callback(false);
      });
  };

  self.removeContact = function(user, callback) {
    var url = 'friend/' + user.id;
    APIConsole.sendAPIRequest('DELETE', url, '')
      .then(function(response){
        callback(response.data);
      }, function(response){
        callback(false);
      });
  };

  self.addFavourite = function(user, callback) {
    var url = 'user/favorite/' + user.id;
    APIConsole.sendAPIRequest('PUT', url, '')
      .then(function(response){
        callback(response.data);
      }, function(response){
        callback(false);
      });
  };

  self.removeFavourite = function(user, callback) {
    var url = 'user/favorite/' + user.id;
    APIConsole.sendAPIRequest('DELETE', url, '')
      .then(function(response){
        callback(response.data);
      }, function(response){
        callback(false);
      });
  };

  self.addGroup = function(user, callback) {
    APIConsole.sendAPIRequest('POST', 'friend/request', user)
      .then(function(response){
        callback(response.data);
      }, function(response){
        callback(false);
      });
  };

  self.removeGroup = function(user, callback) {
    APIConsole.sendAPIRequest('POST', 'friend/request', user)
      .then(function(response){
        callback(response.data);
      }, function(response){
        callback(false);
      });
  };

  self.getAllGroups = function(callback) {
    APIConsole.sendAPIRequest('GET', 'user/groups', '')
      .then(function(response){
        callback(response.data);
      }, function(){
        callback(false);
      });
  };

  self.getAllFriendsRequest = function(callback) {
    APIConsole.sendAPIRequest('GET', 'friend/requests', '')
      .then(function(response){
        callback(response.data);
      }, function(){
        callback(false);
      });
  };

  self.acceptContactRequest = function(user, callback) {
    APIConsole.sendAPIRequest('POST', 'friend/accept', {id: user.id})
      .then(function(response){
        callback(response.data);
      }, function(){
        callback(false);
      });
  };

  self.getSelectedGroupUsers = function(group, callback) {
    var url = 'user/group/' + group.id;
    APIConsole.sendAPIRequest('GET', url, '')
      .then(function(response){
        callback(response.data);
      }, function(){
        callback(false);
      });
  };

  self.createNewGroup = function(groupName, users, callback) {
    var param = {
      'name': groupName,
      'description': ''
    };
    APIConsole.sendAPIRequest('PUT', 'user/group', param)
      .then(function(response){
        var url = 'user/group/' + response.data.group.id + '/user';
        for(self.index = 0; self.index < users.length; self.index++) {
          APIConsole.sendAPIRequest('PUT', url, {id: users[self.index].id})
            .then(function(response){
              if(self.index === users.length) {
                callback(response.data);
              }
            }, function(data){
              console.log(data);
              callback(false);
            });
        }
      }, function(data){
        callback(false);
      });
  };

  self.addUserToGroup = function(group, user, callback) {
    console.log('addUserToGroup-group = ', group);
    console.log('addUserToGroup-user = ', user);
    var url = 'user/group/' + group.id + '/user';
    APIConsole.sendAPIRequest('PUT', url, user)
      .then(function(response){
          callback(response.data);
      }, function(){
        callback(false);
      });
  };

  self.deleteUserFromGroup = function(group, user, callback) {
    var url = 'user/group/' + group.id + '/user';
    APIConsole.sendAPIRequest('DELETE', url, {id: user.id})
      .then(function(response){
        callback(response.data);
      }, function(){
        callback(false);
      });
  };

  self.editGroup = function(oldGroup, editGroupName, users, callback) {
    self.deleteGroup(oldGroup, function(delResponse) {
      if(delResponse) {
        self.createNewGroup(editGroupName, users, function(response) {
          if(response) {
            callback(response);
          }
        });
      }
    });
  };

  self.deleteGroup = function(group, callback) {
    console.log('deleteGroup = ', group);
    var url = 'user/group/' + group.id;
    APIConsole.sendAPIRequest('DELETE', url, '')
      .then(function(response){
        callback(response.data);
      }, function(){
        callback(false);
      });
  };

  self.CollapseMiniCalendar = function (str) {
    APIConsole.sendAPIRequest('POST', 'user/setting/personal', {mini_calendar: str}).then(function(response) {
      callback(response.data);
    }, function(response) {
      console.log(responose);
      callback(false);
    })
  }
  self.getMiniCalendar = function(callback) {
    APIConsole.sendAPIRequest('GET', 'user/setting/personal').then(function(response) {
      callback(response.data);
    }, function (response) {
      console.log(response);
      callback(false);
    })
  }
  self.GetOthersProfile = function(id, callback) {
    APIConsole.sendAPIRequest('GET', 'user/' + id).then(function(response) {
      callback(response.data);
    }, function(response){
      console.log(response);
      callback(false);
    });
  }
  self.GetUserAvatar = function(username, callback) {
    APIConsole.sendAPIRequest('GET', 'avatar/' + username).then(function(response) {
      callback(response.data);
    }, function(response) {
      console.log(response);
      callback(false);
    });
  };
  self.GetSharedStories = function(id, since, max, callback) {
    APIConsole.sendAPIRequest('GET', 'user/' + id + '/stories/' + since + '/' + max).then(function(response){
      callback(response.data);
    }, function(response){
      console.log(response);
      callback(false);
    });
  };
  self.GetSharedMedia = function(id, since, max, callback) {
    APIConsole.sendAPIRequest('GET', 'user/' + id + '/media/' + since + '/' + max).then(function(response){
      callback(response.data);
    }, function(response){
      console.log(response);
      callback(false);
    });
  };
});
