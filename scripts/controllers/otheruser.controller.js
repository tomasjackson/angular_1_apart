'use strict';
/**
 * @ngdoc function
 * @name frontendApp.controller:OtheruserControllerCtrl
 * @description
 * # OtheruserControllerCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('OtherUserCtrl', function ($scope, $stateParams, $loading, $rootScope, $sce,
      UserService, angularGridInstance, MediaService, StoryManager) {

    var self = this;

    self.user = [];
    self.viewMode = 'ABOUT';
    self.sinceDate = timeConverter($rootScope.sinceDate);
    self.stories = [];
    self.medias = [];

    $scope.startLoading = function (name) {
      $loading.start(name);
    };

    $scope.finishLoading = function (name) {
      $loading.finish(name);
    };
    function GetProfileInfo() {
      //UserService.GetUserAvatar($stateParams.id, function(res) {
      //  if (res){
      //  }
      //});
      $scope.startLoading('loading-content');
      UserService.GetOthersProfile($stateParams.id, function(res) {
        if(res) {
          self.user = res;
          if (!self.user.birthdate) $scope.finishLoading('loading-content');
          $scope.birthday = new Date(self.user.birthdate.date);
          $scope.birthdayLabel = $scope.birthday.getFullYear() + '/' + ($scope.birthday.getMonth() + 1) + '/' + $scope.birthday.getDate();
          $scope.finishLoading('loading-content');
        }
      });
    }

    function GetSharedStories() {
      UserService.GetSharedStories($stateParams.id, 0, 0, function(res){
        if (res) {
          self.stories = res.stories;
        }
      });
    }

    function GetSharedMedias() {
      UserService.GetSharedMedia($stateParams.id, 0, 0, function(res) {
        if(res) {
          console.log(res);
          self.medias = res.media;
        }
      })
    }

    GetProfileInfo();
    GetSharedStories();
    GetSharedMedias();

    // convert url to readable
    $scope.trustSrc = function(src) {return $sce.trustAsResourceUrl(src);};


    // time converter unix to date string
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
    // expand option
    self.expandView = function($event, story){
      story.expanded = !story.expanded;
    };
    self.expandMedia = function($event, media) {
      media.expanded = !media.expanded;
    }
    // change time string
    self.parseDateTime = function(dateStr) {

      var date_obj = new Date(dateStr);

      var unix_time = Date.parse(dateStr).getTime()/1000;

      var time = '';
      if (date_obj.getHours() < 10) {
        time = '0' + date_obj.getHours();
      }   else    {
        time = date_obj.getHours();
      }

      time += ':';

      if (date_obj.getMinutes() < 10) {
        time += '0' + date_obj.getMinutes();
      }   else    {
        time += date_obj.getMinutes();
      }


      var string_weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      var string_month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

      var date = date_obj.getDate() + '.' + string_month[date_obj.getMonth()];

      return {
        date : date,
        time : time,
        unix : unix_time
      }
    };
    // set story as favorite
// set story as favorite
    self.SetAsFavorite = function($event, story) {
      if (story.favorite) {
        StoryManager.RemoveFromFavorite(story.id, function(res) {
          if (res) {
            story.favorite = false;
          }
        });
      } else {
        StoryManager.SetAsFavorite(story.id, function(res) {
          if (res) {
            story.favorite = true;
          }
        });
      }
    };
    self.SetAsFavoriteMedia = function (media) {
      if (media.favorite) {
        MediaService.RemoveFromFavorite(media.id, function(res) {
          if(res) {
            media.favorite = false;
            self.nFavorite_count -= 1;
          }
        });
      } else {
        MediaService.PutFavoriteMedia(media.id, function(res) {
          if(res) {
            media.favorite = true;
            self.nFavorite_count += 1;
          }
        });
      }
    };
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
    // hide shared story
    self.HideSharedStory = function($event, story) {
      StoryManager.ToggleSharedStory(story.id, function(res) {
        if (res) {
          console.log(res);
          var ii = self.shared_stories.indexOf(story);
          self.shared_stories.splice(ii, 1);
          self.hidden_stories.push(story);
        }
      });
    };
    // add this story to journal
    self.AddToJournal = function($event, story) {
      $event.preventDefault();
      StoryManager.AddStoryToJournal(story.id, false, function(res) {
        if(res) {
          story.journal = true;
        }
      });
    };

    self.AddToJournalIncogito = function($event, story) {
      $event.preventDefault();
      StoryManager.AddStoryToJournal(story.id, true, function(res) {
        if(res) {
          story.journal = true;
        }
      });
    };
    // remove stories from journal
    self.RemoveFromJournal = function($event, story) {
      if (story.journal) {
        StoryManager.RemoveStoryFromJournal(story.id, function(res) {
          if (res) {
            console.log(res);
            story.journal = false;
          }
        });
      }
    };
    // add note to selected story
    self.AddNote = function($event, story) {
      $event.preventDefault();
      var modal = $uibModal.open({
        animation: true,
        templateUrl: 'views/partials/modals/note-for-story/addnotes-modal.html',
        controller: 'AddNotesController',
        controllerAs: '$ctrl',
        size: 'modal-note-st',
        backdrop  : 'static',
        keyboard  : false,
        resolve: {
          param: function () {
            return {
              'story' : story
            };
          }
        }
      });
      modalInstance.set(modal);

    };
  });
