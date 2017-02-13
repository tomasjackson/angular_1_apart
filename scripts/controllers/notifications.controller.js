'use strict';

angular.module('frontendApp')
    .controller('NotificationCtrl', function ($sce, $scope, $rootScope, $state, $loading,
        $timeout, NotificationSevice, Authentication, UserService) {

    // get initial instance
        var self = this;
        var initializing = true;
        self.notifications = [];
        self.sinceDate = timeConverter($rootScope.sinceDate);

        self.infinite_scroll_flag = true;

    // check user authentication
        if (!Authentication.isLoggedIn()) {
            $state.go('loginPage');
        }

    // get notifications from service

        function getSinceDate() {
          if (self.notifications.length > 0) {
            return Date.parse(self.notifications[self.notifications.length - 1].createdDate).getTime()/1000 - 1;
          } else {
            return 0;
          }
        }

        $scope.LoadMoreNotifications = function(){
          if (self.infinite_scroll_flag) {
            self.infinite_scroll_flag = false;
            $loading.start('initial-loading');
            NotificationSevice.GetAllNotifications(getSinceDate() , 10, function(res) {
              if (res) {
                for (var i = 0; i < res.data.notifications.length; i++) {
                  self.notifications.push(res.data.notifications[i]);
                }
                console.log(self.notifications);
                $loading.finish('initial-loading');
                self.infinite_scroll_flag = true;
              }
            });
          }
        };

    // watch mini calender select
        $scope.$watch(function() {
          return $rootScope.mini_date;
        }, function() {
            if (initializing) {
                $timeout(function() { initializing = false; });
            } else {
                $loading.start('initial-loading');
                $scope.mini_date = $rootScope.mini_date;
                self.sinceDate = self.GetSelectedDateString($scope.mini_date);
                self.GetNotificationByDate($scope.mini_date);
            }
        },  true);



    // get time string
        self.ConvertTime = function(string) {
            var t_str = new Date(string);
            var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

            return t_str.getDate() + ' ' + months[t_str.getMonth()] + ' ' + t_str.getFullYear() + ' at ' + t_str.getHours() + ':' + t_str.getMinutes();
        };

    // description wrapper
        self.DescriptionWrapper = function(notification) {
          var string = '';

          switch (notification.contentType) {
              case 'story':
                  string = notification.content.description;
                  break;
              case 'note':
                  if (notification.content.context){
                      string = notification.content.content;
                  } else {
                      string = '';
                  }
                  break;
              default:
                string = '';
            }


          if (!string)  return '';
            if (string.length > 200) {
                return string.substring(0 , 200) + '...';
            }   else    {
                return string;
            }
        };

    // get selected date string
        self.GetSelectedDateString = function(dateStr) {

            var string_month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

            if (dateStr.length == 4) {
                return dateStr;
            }   else if (dateStr.length > 4 && dateStr.length < 8) {
                return string_month[new Date(dateStr).getMonth()] + ' ' + new Date(dateStr).getFullYear();
            }   else {
                return new Date(dateStr).getDate() + ' ' + string_month[new Date(dateStr).getMonth()] + ' ' + new Date(dateStr).getFullYear();
            }

        };

    // get notification by date
        self.GetNotificationByDate = function(dateStr) {
            NotificationSevice.SearchNotificationByDate({date: dateStr, sort:'DESC'}, function(res) {
                if (res) {
                    self.notifications = res.data.notifications;
                    $loading.finish('initial-loading');
                }
            });
        };

    // trust src
        $scope.trustSrc = function(src) {
            return $sce.trustAsResourceUrl(src);
        };

        function timeConverter(UNIX_timestamp){
          var a = new Date(UNIX_timestamp * 1000);
          var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
          var year = a.getFullYear();
          var month = months[a.getMonth()];
          var date = a.getDate();
          var hour = a.getHours();
          var min = a.getMinutes();
          var sec = a.getSeconds();
          var time = date + ' ' + month + ' ' + year;
          return time;
        }

        self.StoryTitle = function (notification) {
          var ret_str = '';
          switch (notification.contentType) {
            case 'story':
              ret_str = notification.content.title;
              break;
            case 'note':
              if (notification.content.context){
                ret_str = notification.content.context.title;
              } else {
                ret_str = '';
              }
              break;
            default:
              ret_str = '';
          }
          return ret_str;
        };

        self.NotificationType = function(notification) {

          var ret_str = '';
          switch (notification.contentType) {
            case 'user':
              if (notification.notification.name == 'User added as favorite') ret_str = 'USER_FAVORITE';
              if (notification.notification.name == 'User added as contact') {
                if (notification.notification.message == 'accepted contact request')  {
                  ret_str = 'ACCEPTED_CONTACT_REQUEST';
                } else {
                  ret_str = 'USER_CONTACT_REQUEST';
                }
              }
              break;
            case 'note':
              ret_str = 'NOTE_ADDED';
              break;
            default:
              ret_str = '0x0000';
          }

          return ret_str;
        };

      self.acceptContactRequest = function acceptContactRequest(request, flag) {

        if (!flag) {
          return;
        }
        UserService.acceptContactRequest(request.byUser, function(response) {
          if(response) {
            console.log(response);
          }
        });
      };

    });
