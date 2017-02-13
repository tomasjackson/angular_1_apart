'use strict';


angular.module('frontendApp')
  .controller('MyNotesCtrl', function ($scope, $sce, $rootScope, $timeout, $loading, $uibModal, modalInstance, StoryManager) {

  	// init instance
  		var self = this;
  		self.my_notes = [];
      var initializing = true;
      self.noResult = false;
      self.delete_confirm_data = {
        show: false,
        note: []
      };

    // loading bar
        $scope.startLoading = function (name) {
            $loading.start(name);
        };
        $scope.finishLoading = function (name) {
            $loading.finish(name);
        };

    // watch mini calender select
        $scope.$watch(function() {
          return $rootScope.mini_date;
        }, function() {
            if (initializing) {
                $timeout(function() { initializing = false; });
            } else {
                $loading.start('loading-notes');
                $scope.mini_date = $rootScope.mini_date;

                // self.sinceDate = self.GetSelectedDateString($scope.mini_date);
                self.GetNotesByDate($scope.mini_date);
            }
        },  true);

  	// get notes
  		$scope.startLoading('loading-notes');
  		StoryManager.GetNotesAction(0, 0, function(res){
  			if (res) {
          console.log(res);
  				self.my_notes = res.data.notes;
  				$scope.finishLoading('loading-notes');
  			}
  		});

      $scope.$watch(function() {
        return $rootScope.searchActivated;
      }, function() {
        if (initializing) {
          $timeout(function() { initializing = false; });
        } else {
          $scope.searchActivated = $rootScope.searchActivated;
          if (!$rootScope.searchActivated) {
            self.noResult = false;
            $scope.startLoading('loading-notes');
            StoryManager.GetNotesAction(0, 0, function(res){
              if (res) {
                self.my_notes = res.data.notes;
                $scope.finishLoading('loading-notes');
              }
            });
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
            $scope.LoadNotes();
          }
        }
      },  true);

    $scope.LoadNotes = function() {
      self.noResult = false;
      $scope.startLoading('loading-notes');
      var query = null;
      if ($rootScope.searchActivated) {
        query = $rootScope.searchQuery.query;
      }   else    {
        query = null;
      }
      StoryManager.SearchNotesByDate({query: query, date: $rootScope.mini_date, sort:'DESC'}, function(res){
        if (res) {
          self.my_notes = res.data.notes;
          $scope.finishLoading('loading-notes');
        }
      });
    };

	// expand note box
		self.ExpandNoteBox = function(note, $event) {
			$event.preventDefault();
			note.expanded = !note.expanded;
		};

    self.ExpandReplyBox = function(reply, $event) {
      reply.expanded = !reply.expanded;
    };

    // extract note content
		self.ExtractNoteTitle = function(note_content) {
      if (!note_content)  return 'This Story/media Deleted by user.';
			if (note_content.length > 50) {
				return note_content.substring(0 , 50) + '...';
			} else  {
				return note_content;
			}
		};


    // change time string
	    self.ConvertTimeStamp = function(dateStr) {
	        var date_obj = new Date(dateStr);

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


	        var string_weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Satday'];
	        var string_month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

	        var date = string_weekday[date_obj.getDay()] + ', ' + date_obj.getDate() + ' ' + string_month[date_obj.getMonth()];

	        return date + ' ' + time;
	    };

    // get notification by date
        self.GetNotesByDate = function(dateStr) {
            StoryManager.SearchNotesByDate({date: dateStr, sort:'DESC'}, function(res) {
                if (res) {
                    self.my_notes = res.data.notes;
                    $loading.finish('loading-notes');
                }
            });
        };

	// convert video src
	    $scope.trustSrc = function(src) {
	        return $sce.trustAsResourceUrl(src);
	    };

    /**
     * Delete Notes Button Click
     * @param $event
     * @param note
       */
    self.onDeleteNotesClick = function ($event, note) {
      self.delete_confirm_data.show = true;
      self.delete_confirm_data.note = note;
    };
    /**
     * On click OK button in confirm Delete notes dialog
     * @param $event
     * @param note
     * @param index
       */
    self.confirm_ok = function($event, note, index) {
      StoryManager.DeleteNote(note.id, function(res) {
        if(res) {
          self.delete_confirm_data.show = false;
          self.delete_confirm_data.note = [];
          self.my_notes.splice(index, 1);
        }
      });

    };
    /**
     * Canceling delete notes dialog
     * @param $event
     * @param note
       */
    self.confirm_cancel = function($event, note) {
      self.delete_confirm_data.show = false;
      self.delete_confirm_data.note = [];
    };
    // set story as favorite
    self.SetAsFavorite = function($event, note) {
      if (note.favorite) {
        StoryManager.RemoveNoteFromFavorite(note.id, function(res) {
          if (res) {
            note.favorite = false;
          }
        });
      } else {
        StoryManager.SetNoteAsFavorite(note.id, function(res) {
          if (res) {
            note.favorite = true;
          }
        });
      }
    };
    self.ReplyNote = function(note) {
      var modal = $uibModal.open({
        animation: true,
        templateUrl: 'views/partials/modals/note-for-story/replynotes-modal.html',
        controller: 'ReplyNotesController',
        controllerAs: '$ctrl',
        size: 'normal',
        backdrop  : 'static',
        keyboard  : false,
        resolve: {
          param: function () {
            return {
              'note': note
            };
          }
        }
      });
      modalInstance.set(modal);
    };
    self.DescriptionWrapper = function(content) {
      if (content) {
        if (content.length > 50)  return content.substring(0, 50) + '...';
        else return content;
      }
      return '';
    };
  });
