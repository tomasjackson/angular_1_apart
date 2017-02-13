
/*--------------------------------------------------------------------
           Service for Notification management
--------------------------------------------------------------------*/

'use strict';

angular.module('frontendApp').service('NotificationSevice', function (APIConsole){

    // get self instance
        var self = this;

    // get all notification
        self.GetNotifications = function(callback) {
            APIConsole.sendAPIRequest('GET', 'notifications').then(function(res) {
                    callback(res);
                }, function(res) {
                    console.log(res);
                    callback(false);
                }
            );
        };

    // search notification by date
        self.SearchNotificationByDate = function(query, callback) {
            APIConsole.sendAPIRequest('POST', 'search/notifications', query).then(function(data) {
                    callback(data);
                }, function(data) {
                    console.log(data);
                    callback(false);
                }
            );
        };

    // get unread notification count
        self.GetNotificationCount = function(callback) {
            APIConsole.sendAPIRequest('GET', 'notifications/count').then(function (data) {
                callback(data);
              }, function(data){
                console.log(data);
                callback(false);
              }
            )
        };

    // check notification as read
        self.ReadNotifications = function(ids, callback) {
            APIConsole.sendAPIRequest('POST', 'notifications/markasread', {notification_ids: ids}).then(function(data){
              callback(data);
            }, function(data){
              callback(false);
            });
        };

        self.GetAllNotifications = function(since, max, callback) {
            APIConsole.sendAPIRequest('GET', 'notifications/all/' + since + '/' + max).then(function(data){
              callback(data);
            }, function(data) {
              console.log(data);
              callback(false);
            });
        };
});
