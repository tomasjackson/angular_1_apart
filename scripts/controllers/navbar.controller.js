'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:NavbarCCtrl
 * @description
 * # NavbarControllerCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('NavbarCtrl', function ($scope, mainService, $rootScope, $state, $loading, Authentication, modalInstance, NotificationSevice, $uibModal, param, $window) {

    var self = this;

    self.pageName = param.pageName;
    self.modalInstance = modalInstance;
    self.UserInformation = null;

    self.searchQuery = {
      category: self.pageName,
      query: ''
    };



    self.open_calendar = true;
    self.notifications = [];
    self.unread_notification_count = 0;
    self.searchState = false;

    $rootScope.calendar_show = false;

    self.GetUnreadNotification = function () {
      NotificationSevice.GetNotificationCount(function(res) {
        if (res) {
          self.unread_notification_count = res.data.num;
        }
      });
    };

    function NotificationPolling() {
      self.GetUnreadNotification();
    }
    setInterval(NotificationPolling, 10000);

    /*------------------------------------
    * Get keydown event from search bar
    ------------------------------------*/
    self.SearchKeydown = function($event) {
      // $event.preventDefault();
      if ($event.keyCode == 13) {
        $event.preventDefault();
        self.Search($event.target.parentNode);
      }
    };
    /*------------------------------------------
     *   Logout Action
     ------------------------------------------*/
    self.doLogout = function doLogout(){
      console.log('doLogOut');
      Authentication.LogoutAction(function(response){
        if(response) {
          $window.open = '';   //route login
          $window.location.reload();
          //$state.go('loginPage')
        }
      });
    };
    /*-------------------------------
     *   Open Upload media dialog
     -------------------------------*/
    self.OpenUploadDialog = function() {
      var modal = $uibModal.open({
        animation: true,
        templateUrl: 'views/partials/modals/uploadmedia-modal.html',
        controller: 'upLoadMediaCtrl',
        controllerAs: '$ctrl',
        size: 'medium-st',
        backdrop  : 'static',
        keyboard  : false,
        resolve : {
          param: function () {
            return {
              'fromWhere' : ''
            }
          }
        }
      });
      self.modalInstance.set(modal);
    };
    /*----------------------------------
     *   Open create story modal
     -----------------------------------*/
    self.ToggleCalendar = function ($event) {
      $rootScope.calendar_show = !$rootScope.calendar_show;
      console.log($rootScope.calendar_show);
    };
    /*----------------------------------
     *   Open create story modal
     -----------------------------------*/
    self.OpenCreateStory = function() {
      var modal = $uibModal.open({
        animation: true,
        templateUrl: 'views/partials/modals/createnewstory-modal.html',
        controller: 'createnewstoryModalController',
        controllerAs: '$ctrl',
        size: 'medium-st',
        backdrop  : 'static',
        keyboard  : false ,
        resolve: {
          param: function () {
            return {
              'story': [] ,
              'fromWhere' : ''
            };
          }
        }
      });
      self.modalInstance.set(modal);
    };

    Authentication.GetCurrentUserInfo(function(response){
      if (response) {
        self.UserInformation = Authentication.UserInfo;
        $rootScope.userAvatar = Authentication.UserInfo.avatar;
        $rootScope.userName = Authentication.UserInfo.username;
      }
    });

    self.chooseSearchCategory = function(category) {
      self.pageName = category;
    };

    self.Search = function($event) {
      self.searchState = !self.searchState;
      var element = [];
      if ($event.target) {
        if ($event.target.tagName == 'BUTTON') {
          element = $event.target.getElementsByTagName('i')[0];
        } else {
          element = $event.target;
        }
      } else  {
        element = $event.getElementsByClassName('search_button')[0].getElementsByTagName('i')[0];
      }

      $rootScope.searchActivated = self.searchState;

      if (!self.searchState) {
        self.searchQuery.query = '';
      } else {
        switch (self.pageName) {
          case 'Journal':
            $state.go('mainPage.myJournal');
            self.searchQuery.category = 'journal';
            break;
          case 'Gallery':
            $state.go('mainPage.myGallery');
            self.searchQuery.category = 'media';
            break;
          case 'Story':
            $state.go('mainPage.sharedStories');
            self.searchQuery.category = 'story';
            break;
          case 'User':
            $state.go('mainPage.resultPage');
            self.searchQuery.category = 'user';
            break;
          case 'Note':
            $state.go('mainPage.myNotes');
            self.searchQuery.category = 'note';
          default :
            self.searchQuery.category = 'journal';
        }
        $rootScope.searchQuery = self.searchQuery;
        if (self.searchQuery.category == 'user') {
          $scope.startLoading('searching');
          mainService.Search(self.searchQuery, function(response) {
            $scope.finishLoading('searching');
            if(response) {
              console.log('mainService.Search = ', response);
              $rootScope.searchActivated = true;
              $rootScope.$broadcast('SearchResult', {
                query: self.searchQuery,
                result: response
              });
            }else {
              console.log('mainService.Search - error = ', response);
              $rootScope.$broadcast('SearchResult', {
                query: self.searchQuery,
                result: response
              });
            }
          });
        }
      }
    };
    $scope.startLoading = function (name) {
        $loading.start(name);
    };

    $scope.finishLoading = function (name) {
        $loading.finish(name);
    };

    self.OnBellClicked = function ($event) {
      $scope.startLoading('loading-notification');
      var notificiation_ids_array = [];
      NotificationSevice.GetNotifications(function(res) {
        if (res) {
          self.notifications = res.data.notifications.reverse();
          $scope.finishLoading('loading-notification');
          for (var i = 0; i < self.notifications.length; i++) {
            notificiation_ids_array.push(self.notifications[i].id);
          }
          NotificationSevice.ReadNotifications(notificiation_ids_array, function(res){
            if (res){
              self.GetUnreadNotification();
            }
          });
        }
      });
    };

    self.GetDuration = function(date) {
      var today = new Date();
      var that = new Date(date);
      var diffMs = (today - that); // milliseconds between now & Christmas
      var diffDays = Math.floor(diffMs / 86400000); // days
      var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
      var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes

      if (diffDays > 0) {
        return diffDays + ' days ago';
      } else if (diffDays == 0 && diffHrs > 0) {
        return diffHrs + ' hours ago';
      } else if (diffDays == 0 && diffHrs == 0 && diffMins > 0) {
        return diffMins + ' minutues ago';
      } else if (diffDays == 0 && diffHrs == 0 && diffMins == 0) {
        return 'few seconds ago';
      }
      return 'not sure';
    };

    // description wrapper
    self.DescriptionWrapper = function(string) {
      if (!string)  return '';
      if (string.length > 200) {
        return string.substring(0 , 200) + '...';
      }   else    {
        return string;
      }
    };
  });
