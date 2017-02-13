'use strict';

angular.module('frontendApp').controller('myJournalCtrl', function( $uibModal, $state, $sce , $window, $loading , $timeout, modalInstance, mainService, Authentication, MediaService, $rootScope ,$scope , StoryManager, ModalInstanceStore) {

    var self = this;

    self.UserInformation = null;

    $rootScope.myStories = [];

    var initializing = true;

    var sinceDate = new Date().getTime()/1000;
    var infinit_enable = true;

    self.sinceDate = timeConverter($rootScope.sinceDate);
    self.untilDate = timeConverter($rootScope.untilDate);
    self.noResult = false;
    self.stop_loading = false;
    self.ErrorMessage = 'No result to display.';

// initial variable
    self.my_journal = [];

  // count filters
    self.count_journal = 0;
    self.count_mine = 0;
    self.count_favorite = 0;

    self.filter = 0;
    self.filter_description = 'All Stories';
    self.filtered_result = true;

    $scope.$watch(function() {
      return $rootScope.mini_date;
    }, function() {
        if (initializing) {
            $timeout(function() { initializing = false; });
        } else {
            console.log($rootScope.mini_date);
            infinit_enable = false;
            $scope.mini_date = $rootScope.mini_date;
            self.sinceDate = self.GetSelectedDateString($scope.mini_date);
            if (isToday($rootScope.mini_date)) {
              $rootScope.myStories.length = 0;
              infinit_enable = true;
              sinceDate = new Date().getTime()/1000;
              self.my_journal = [];
              $scope.loadMore();
              self.noResult = false;
            } else {
              $scope.LoadJournalDate();
            }
        }
    },  true);

    $scope.$watch(function() {
      return $rootScope.journal_updated;
    }, function() {
        $scope.journal_updated = $rootScope.journal_updated;
        if ($scope.journal_updated) {
            SpliceStory(self.parseDateTime(StoryManager.updated_story.userDate).unix);
            $rootScope.journal_updated = false;
        }
    },  true);

    $scope.$watch(function() {
      return $rootScope.searchQuery;
    }, function() {
        if (initializing) {
            $timeout(function() { initializing = false; });
        } else {
          if ($rootScope.searchActivated) {
            infinit_enable = false;
            $scope.mini_date = $rootScope.mini_date;
            $scope.SearchJournalDate();
          }
        }
    },  true);

    $scope.$watch(function() {
      return $rootScope.searchActivated;
    }, function() {
        if (initializing) {
            $timeout(function() { initializing = false; });
        } else {
            console.log($rootScope.searchActivted);
            $scope.searchActivated = $rootScope.searchActivated;
            if (!$rootScope.searchActivated) {
                $rootScope.myStories.length = 0;
                infinit_enable = true;
                sinceDate = new Date().getTime()/1000;
                self.my_journal = [];
                $scope.loadMore();
                self.noResult = false;
            }
            if ($rootScope.searchActivated) {

            }   else    {

            }
        }
    }, true);


    function SpliceStory(val) {
        console.log(val);
        var last = self.my_journal.length;

        if (self.parseDateTime(self.my_journal[last - 1].userDate).unix > val) {
            console.log('no need to slice');
        }   else if (self.parseDateTime(self.my_journal[0].userDate).unix <= val) {
            self.my_journal.splice(0 , 0 , StoryManager.updated_story);
        }   else {
            for (var i = 1; i < self.my_journal.length - 1; i++) {
                if (self.parseDateTime(self.my_journal[i].userDate).unix <= val)
                {
                    self.my_journal.splice(i , 0 , StoryManager.updated_story);
                    break;
                }
            }
        }
    }
    function isToday(string) {
      var today = new Date();
      var str = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
      if (string == str) return true;
      return false;
    };
// dw-loading initial functions
    $scope.startLoading = function (name) {
        $loading.start(name);
    };

    $scope.finishLoading = function (name) {
        $loading.finish(name);
    };

    var isLoggedIn = Authentication.isLoggedIn();

    if (!isLoggedIn) {
        $window.location = "/#/login";
        $window.location.reload();
    }


    // filter functions - all stories journal data
    StoryManager.GetJournalInfo(function(res) {
        if (res) {
            self.count_journal = res.count;
        }
    });
    // filter functions - my stories journal data
    StoryManager.GetMyStoryInfo(function(res) {
        if (res) {
            self.count_mine = res.count;
        }
    });
    // filter functions - my favorite journal data
    StoryManager.GetFavoriteInfo(function(res) {
        if (res) {
            self.count_favorite = res.count;
        }
    });

    /**
     * Filter adjusting functions
     * @param filter_val
     */
    self.changeFilter = function ($event, filter_val) {
      self.filter = filter_val;
      self.filter_description = filterDescription(self.filter);
      for (var i = 0; i < self.my_journal.length;  i++) {
        self.GetFilteredResult(self.my_journal[i]);
      }
    };

    function filterDescription(filter_val) {
      if (filter_val == 0)  return 'All Stories';
      if (filter_val == 1)  return 'My Stories';
      if (filter_val == 2)  return 'Added Stories';
      if (filter_val == 3)  return 'My favorites';
    };

    self.GetFilteredResult = function (story) {
      if (self.filter == 0)  story.filtered = true;
      if (self.filter == 1)  story.filtered = self.CheckStoryAuthor(story);
      if (self.filter == 2)  story.filtered = !self.CheckStoryAuthor(story);
      if (self.filter == 3)  story.filtered = story.favorite;
    }
    /*-------------------------------------------------------------
    *   Change video url as readable remove all security token
    -------------------------------------------------------------*/
    $scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
    };
    /*------------------------
    *   Get current user id
    ------------------------*/
    Authentication.GetCurrentUserIdAction(function(response){});
    /*------------------------------
    *   Get current user info
    ------------------------------*/
    Authentication.GetCurrentUserInfo(function(response){
        if (response) {
          self.UserInformation = Authentication.UserInfo;
          $rootScope.userAvatar = Authentication.UserInfo.avatar;
          $rootScope.userName = Authentication.UserInfo.username;
        }
    });

    mainService.exejQuery();
    mainService.pageTitle = $state.current.data.title;

    /*----------------------------
    *   Get journal by date
    ----------------------------*/
    $scope.LoadJournalDate = function() {
        $scope.startLoading('fetching');
        var query = null;
        if ($rootScope.searchActivated) {
            query = $rootScope.searchQuery.query;
        }   else    {
            query = null;
        }
        StoryManager.SearchStoryAction({query: query, date: $rootScope.mini_date, sort:'DESC'}, function(res){
            if (res) {
                $scope.finishLoading('fetching');
                self.my_journal = res.data.stories;
                for (var i = 0; i < self.my_journal.length; i++) {
                  self.GetFilteredResult(self.my_journal[i]);
                }
                if (!res.data.stories.length) {
                  self.noResult = true;
                }   else {
                  self.noResult = false;
                }
            }
        });
    };
    $scope.SearchJournalDate = function() {
        $scope.startLoading('fetching');
        self.noResult = false;
        StoryManager.SearchStoryAction({query: $scope.searchQuery.query, date:$rootScope.mini_date, sort:'DESC'}, function(res){
            if (res) {
                $scope.finishLoading('fetching');
                self.my_journal = res.data.stories;
                for (var i = 0; i < self.my_journal.length; i++) {
                  self.GetFilteredResult(self.my_journal[i]);
                }
                if (!res.data.stories.length) {
                    self.noResult = true;
                }   else {
                    self.noResult = false;
                }
            }
        });
    };

// infinit scroll loading
    $scope.loadMore = function() {
        if (infinit_enable) {
            $scope.startLoading('fetching');
            infinit_enable = false;
            StoryManager.GetJournalAction(parseInt(sinceDate) , 10 , function(response){
                if (response) {
                    for (var i = 0; i < response.stories.length; i++) {
                      self.GetFilteredResult(response.stories[i]);
                      self.my_journal.push(response.stories[i]);
                    }
                    sinceDate = self.parseDateTime(self.my_journal[self.my_journal.length-1].userDate).unix;
                    $scope.finishLoading('fetching');
                    console.log(self.my_journal);
                    infinit_enable = true;
                }
            });
        }
    };

    /*--------------------------------------------------------
    *   When user click append icon toggle edit story area
    ---------------------------------------------------------*/
    function scrollToTop(scrollDuration , story_pos) {
        var scrollStep = -((window.scrollY - story_pos) / (scrollDuration / 15));
        var temp = 0;
        var scrollInterval = setInterval(function(){
            if ( window.scrollY < story_pos ) {
                window.scrollBy( story_pos, scrollStep );
                if (window.scrollY == temp) {
                    clearInterval(scrollInterval);
                }
                temp = window.scrollY;
            }
            else clearInterval(scrollInterval);
        },15);
    }

// go to sigle story page
    self.GoToSingleStoryPage = function (story, $event) {
        var story_param = {'id' : story.id};
        $state.go('mainPage.singleStory' , story_param);
    };

// story expend
    self.appendEdit = function(event , str , story) {

        event.stopPropagation();
        $scope.startLoading('expanding-story');
        StoryManager.ExpandStoryAction(story.id, function(res) {
            if (res) {
                $scope.finishLoading('expanding-story');
                story.expanded = res.data.expanded;
                var $containerGall = $(event.target.parentNode).parent();
                var offset = 0;

                if (str === 'BOOKMARK') {
                    $containerGall = $(event.target.parentNode).parent().parent().parent().parent();
                    offset = $containerGall.offset().top;
                }   else if (str === 'THREE')   {
                    $containerGall = $(event.target.parentNode).parent().parent().parent().parent();
                    offset = $containerGall.offset().top;
                }   else {
                    $containerGall = $(event.target.parentNode).parent();
                    offset = $containerGall.offset().top;
                }
                scrollToTop(500 , offset - 130);
            }
        });
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
// delete selected story
    self.DeleteThisStory = function($event){
        event.stopPropagation();

        var $containerGall = $(event.target.parentNode).parent().parent();
        $containerGall.find('.confirm-prompt-dialog').show();
    };

    self.ConfirmDelete = function(flag , story , $event){
        event.stopPropagation();

        if (flag === 'DELETE_STORY') {         //Delete this story

            var index_num = self.my_journal.indexOf(story);    //get selected story

            StoryManager.DeleteStoryAction(story.id , function(response){
                if (response) {
                    self.my_journal.splice(index_num , 1);     //remove from showing array
                }
            });


        }   else if(flag === 'CANCEL_ACTION')    {       //No, cancel this action

            var $containerGall = $(event.target.parentNode).parent().hide();

        }   else    {

            console.log('Unknow error occured while binding');

        }
    };

// open edit modal
    self.openEditModal = function openEditModal(event , story) {

        event.preventDefault();     //disable link to #

        var index_num = $rootScope.myStories.indexOf(story);

        var modal = $uibModal.open({
            animation: true,
            templateUrl: 'views/partials/modals/editstory-journal-modal.html',
            controller: 'EditJournalStoryController',
            controllerAs: '$ctrl',
            size: 'medium-st',
            backdrop  : 'static',
            keyboard  : false,
            resolve: {
                param: function () {
                    return {
                        'display_index' : index_num ,
                        'story' : story
                    };
                }
            }
        });
        modalInstance.set(modal);
    };

// share story modal
    self.ShareThisStory = function($event , story) {
        $event.preventDefault();
        var modal = $uibModal.open({
            animation: true,
            templateUrl: 'views/partials/modals/sharestory-modal.html',
            controller: 'ShareStoryController',
            controllerAs: '$ctrl',
            size: 'medium-st',
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

// parse date string to date object
    self.parseDateTime = function (dateStr) {

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

        var date = string_weekday[date_obj.getDay()] + ' ' + date_obj.getDate() + ' ' + string_month[date_obj.getMonth()] + ' ' + date_obj.getFullYear();



        return {
            date : date,
            time : time,
            unix : unix_time
        }
    };

// parse story object
    function parseStoryObject (native_story_obj) {
        return {
            $$hashKey : native_story_obj.$$hashKey,
            createdDate : native_story_obj.createdDate,
            description : native_story_obj.description,
            id : native_story_obj.id,
            keywords : native_story_obj.keywords,
            mediaFiles : native_story_obj.mediaFiles,
            location : native_story_obj.location,
            title : native_story_obj.title,
            user : native_story_obj.user,
            privacy : native_story_obj.privacy,
            expanded : native_story_obj.expanded,
            userDate : parseDateTime(native_story_obj.userDate)
        };
    }

// open privacy modal
    self.openManagePrivacyModal = function(story) {
      var modal = $uibModal.open({
        animation: true,
        templateUrl: 'views/partials/modals/manage_privacy-modal.html',
        controller: 'ManagePrivacyCtrl',
        controllerAs: '$ctrl',
        size: 'medium-st',
        backdrop  : 'static',
        keyboard  : false,
        resolve: {
          param: function () {
            return {'story': story};
          }
        }
      });
      modalInstance.set(modal);
    };

// convert unix time to norma date string
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

// set placeholder to empty description
    self.PrintDescription = function (description_string) {
      if (!description_string) return "You have not added any text to your story. Use 'Edit' button to add text, photos, videos to your story or to make anyother changes.";
      return description_string;
    };

// check story author
    self.CheckStoryAuthor = function(story) {
        if (story.user.username == $rootScope.userName) {
            return true;
        }
        return false;
    };

// set story as favorite
    self.SetAsFavorite = function($event, story) {
        if (story.favorite) {
            StoryManager.RemoveFromFavorite(story.id, function(res) {
              if (res) {
                story.favorite = false;
                self.count_favorite -= 1;
                story.favoriteBy -= 1;
              }
            })
        } else {
            StoryManager.SetAsFavorite(story.id, function (res) {
              if (res) {
                story.favorite = true;
                self.count_favorite += 1;
                story.favoriteBy += 1;
              }
            });
        }
    };

    self.TitleWrapper = function(string) {
      if (string.length > 50) {
        return string.substring(0 , 50) + '...';
      } else  {
        return string;
      }
    };
    // remove stories from journal
    self.RemoveFromJournal = function(story, $index) {
      StoryManager.RemoveStoryFromJournal(story.id, function(res) {
        if (res) {
          self.my_journal.splice($index, 1);
        }
      });
    };

});

