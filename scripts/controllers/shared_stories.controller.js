'use strict';

/**
 * Shared Stories Page
 */
angular.module('frontendApp')
  .controller('SharedStoriesController', function ($window, $scope, $rootScope, $loading, $sce, $timeout, $uibModal,
  	StoryManager, angularGridInstance, Authentication, modalInstance, mainService, $state) {

		var self = this;  // get self instance
    self.filter = 0;
    self.sinceDate = timeConverter($rootScope.sinceDate);
    self.stories = [];
    self.shared_stories = [];
    self.hidden_stories = [];
    var initializing = true;

    mainService.exejQuery();

  // Authentication check
    var isLoggedIn = Authentication.isLoggedIn();
    if (!isLoggedIn) {
        $window.location = "/#/login";
        $window.location.reload();
    }

  // loading bar
    $scope.startLoading = function (name) {$loading.start(name);};
    $scope.finishLoading = function (name) {$loading.finish(name);};

  // convert url to readable
    $scope.trustSrc = function(src) {return $sce.trustAsResourceUrl(src);};

    /**
     * Get initial data about shared stories
     * @constructor
     */
    self.GetSharedStoriesData = function() {
      $scope.startLoading("initial_loading");
      StoryManager.GetSharedStories(parseInt(self.sinceDate) , 0 , function(res) {
        if (res) {
          $scope.finishLoading("initial_loading");
          self.shared_stories = res;
          self.stories = self.shared_stories;
          angularGridInstance.stories.refresh();
        }
      });
      StoryManager.GetHiddenStories(parseInt(self.sinceDate), 100, function(res) {
        if (res) {
          self.hidden_stories = res;
        }
      });
    };

    self.GetSharedStoriesData();
    // watch mini calender select
    $scope.$watch(function() {
      return $rootScope.mini_date;
    }, function() {
      if (initializing) {
        $timeout(function() { initializing = false; });
      } else {
        $scope.mini_date = $rootScope.mini_date;
        self.sinceDate = self.GetSelectedDateString($scope.mini_date);
        if (isToday($rootScope.mini_date)) {
          self.noResult = false;
          self.GetSharedStoriesData();
        } else {
          $scope.LoadSharedStories();
        }
      }
    },  true);

    $scope.$watch(function() {
      return $rootScope.searchActivated;
    }, function() {
      if (initializing) {
        $timeout(function() { initializing = false; });
      } else {
        console.log($rootScope.searchActivated);
        $scope.searchActivated = $rootScope.searchActivated;
        if (!$rootScope.searchActivated) {
          self.noResult = false;
          self.GetSharedStoriesData();
        } else {
          $scope.LoadSharedStories();
        }
      }
    }, true);

    /**
     * Watching search query and notice when it changed
     */
    $scope.$watch(function() {
      return $rootScope.searchQuery;
    }, function() {
      if (initializing) {
        $timeout(function() { initializing = false; });
      } else {
        if ($rootScope.searchActivated) {
          $scope.mini_date = $rootScope.mini_date;
          $scope.LoadSharedStories();
        }
      }
    },  true);

    $scope.LoadSharedStories = function() {
      self.noResult = false;
      $scope.startLoading('initial_loading');
      var query = null;
      if ($rootScope.searchActivated) {
        query = $rootScope.searchQuery.query;
      }   else    {
        query = null;
      }
      StoryManager.SearchSharedStoriesAction({query: query, date: $rootScope.mini_date, sort:'DESC'}, function(res){
        if (res) {
          console.log(res);
          self.stories = res.data.stories;
          //angularGridInstance.stories.refresh();
          $scope.finishLoading('initial_loading');
        }
      });
    };

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
        // StoryManager.ExpandStoryAction(story.id, function(res) {
        //     if (res) {
        //     	console.log(res);
        story.expanded = !story.expanded;
    // 	}
    // });
    // angularGridInstance.shared_stories.refresh();
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

    /**
     * Check date is today
     * @param string
     * @returns {boolean}
       */
  function isToday(string) {
    var today = new Date();
    var str = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    if (string == str) return true;
    return false;
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
  // set tooltip attribute
      self.GetToolTip = function (journal_flag) {
          if (journal_flag) {
              return 'Remove from Journal';
          }   else    {
              return undefined;
          }
      };

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
  // open detail show modal
  self.OpenDetailModal = function OpenDetailModal(e , media , $index) {
    e.stopPropagation();
    var modal = $uibModal.open({
      animation: true,
      templateUrl: 'views/partials/modals/photo-modal.html',
      controller: 'photoModalCtrl',
      controllerAs: '$ctrl',
      size: 'medium-st',
      backdrop  : 'static',
      keyboard  : false,
      resolve: {
        param: function () {
          return {
            'media' : media
          };
        }
      }
    });
    modalInstance.set(modal);
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

// change filter
  self.ChangeFilter = function(val) {
    self.filter = val;
    if (self.filter == 1) {
      self.stories = self.hidden_stories;
      console.log(self.stories);
    }	else 	{
      self.stories = self.shared_stories;
    }
  };

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
  self.selectOtherUser = function selectOtherUser(user) {
      $state.go('mainPage.otherUser', {user: user});
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
});
