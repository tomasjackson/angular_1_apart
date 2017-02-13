'use strict';
/**!!!!!!!!!!!!!!!!!!! NEED TO CHECK IF THIS STORY IS MINE OR NOT**/
/**
 * @ngdoc function
 * @name frontendApp.controller:SingleStoryController
 * @description
 * # SingleStoryController
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('SingleStoryController', function ($loading, $scope, $stateParams, $sce, StoryManager, $state, Authentication, $uibModal, modalInstance, mainService) {

  	//*****************************	Authentication check *************************

    var isLoggedIn = Authentication.isLoggedIn();

    if (!isLoggedIn) {
      	$window.location = "/#/login";
      	$window.location.reload();
    }
    //****************************************************************************
  	var selected_storyId = $stateParams.id;	//get id from state param ui router

  	var self = this;	// 	get instance
    Authentication.GetCurrentUserIdAction(function(response){});
  	self.story = [];	//	story
    self.cur_usr_name = "";

    $scope.startLoading = function (name) {
        $loading.start(name);
    };

    $scope.finishLoading = function (name) {
        $loading.finish(name);
    };

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
  	//	Get selected story information
  	$scope.startLoading('loading');
  	StoryManager.GetSingleStory(selected_storyId , function (response) {
  		if (response)	{
        self.cur_usr_name = Authentication.UserInfo.username;
  			self.story = response;
        if (!self.story.description) {
          self.story.description = "You have not added any text to your story. Use 'Edit' button to add text, photos, videos to your story or to make anyother changes";
        }
        console.log(self.story);

        $scope.finishLoading('loading');
  		}
  	});
    /*----------------------
    * Add media to story
    -----------------------*/
    self.AddMediaToStory = function($event) {
        var modal = $uibModal.open({
            animation: true,
            templateUrl: 'views/partials/modals/addmedia-modal.html',
            controller: 'AddMediaController',
            controllerAs: '$ctrl',
            size: 'medium-st',
            backdrop  : 'static',
            keyboard  : false,
            resolve: {
                param: function () {
                    return {
                        'story' : self.story
                    };
                }
            }
        });
        modalInstance.set(modal);
    };
    /*---------------------
    * Change View mode
    ---------------------*/
    self.ChangeViewMode = function($event) {
      var $element = $($event.target.parentNode);
      $element.find('.carousel-inner').toggleClass('show-all');
      $element.find('.note-gal-arrow').toggleClass('hide');
      if ($element.find('.carousel-inner').hasClass('show-all')) {
          $element.find('#st-view-photos').text('Cover Picture / Video');
      } else {
          $element.find('#st-view-photos').text('All Pictures / Videos');
      }
    };

    /*--------------------
    * Expand Note box
    --------------------*/
    self.ExpandNoteBox = function(note, $event) {
      $event.preventDefault();
      note.expanded = !note.expanded;
    };

    /*----------------------------------
    * Slide Next/Previous Button
    ----------------------------------*/
    self.SlideArrow = function ($event, button_kind) {
      $event.preventDefault();
      if (true) {}
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

    /*----------------------
    * Full Screen mode
    ----------------------*/
    self.FullScreenShow = function ($event) {

      var slides = [];

      $('#supersized-loader').empty().remove();
      $('#supersized').empty().remove();
      $('#hzDownscaled').empty().remove();
      $('body').append('<div id="supersized-loader"></div><ul id="supersized"></ul>');

      // $.supersized({slides: slides});
      var temp_big = '';
      var temp_thumb = '';

      for (var i = 0; i < self.story.mediaFiles.length; i++) {
          if (!self.story.mediaFiles[i].mediaFileType) {

              if (self.story.mediaFiles[i].path.original) {
                  temp_big = self.story.mediaFiles[i].path.original;
                  temp_thumb = self.story.mediaFiles[i].path.t1;
              }   else    {
                  temp_big = self.story.mediaFiles[i].path;
                  temp_thumb = self.story.mediaFiles[i].path;
              }

              slides.push({
                  image : temp_big ,
                  title : self.story.mediaFiles[i].title,
                  thumb : temp_thumb,
                  url : temp_big
              });

          }

      }
      $('body').addClass('full-screen');
      $(window).resize();
      mainService.exejQuery();
      $.supersized({
            // Functionality
            slideshow               :   1,          // Slideshow on/off
            autoplay                :   0,          // Slideshow starts playing automatically
            start_slide             :   1,          // Start slide (0 is random)
            stop_loop               :   0,          // Pauses slideshow on last slide
            random                  :   0,          // Randomize slide order (Ignores start slide)
            slide_interval          :   3000,       // Length between transitions
            transition              :   6,          // 0-None, 1-Fade, 2-Slide Top, 3-Slide Right, 4-Slide Bottom, 5-Slide Left, 6-Carousel Right, 7-Carousel Left
            transition_speed        :   1000,       // Speed of transition
            new_window              :   1,          // Image links open in new window/tab
            pause_hover             :   0,          // Pause slideshow on hover
            keyboard_nav            :   1,          // Keyboard navigation on/off
            performance             :   1,          // 0-Normal, 1-Hybrid speed/quality, 2-Optimizes image quality, 3-Optimizes transition speed // (Only works for Firefox/IE, not Webkit)
            image_protect           :   1,          // Disables image dragging and right click with Javascript

            // Size & Position
            min_width               :   0,          // Min width allowed (in pixels)
            min_height              :   0,          // Min height allowed (in pixels)
            vertical_center         :   1,          // Vertically center background
            horizontal_center       :   1,          // Horizontally center background
            fit_always              :   1,          // Image will never exceed browser width or height (Ignores min. dimensions)
            fit_portrait            :   1,          // Portrait images will not exceed browser height
            fit_landscape           :   0,          // Landscape images will not exceed browser width

            // Components
            slide_links             :   'blank',    // Individual links for each slide (Options: false, 'num', 'name', 'blank')
            thumb_links             :   1,          // Individual thumb links for each slide
            thumbnail_navigation    :   1,          // Thumbnail navigation
            slides                  :   slides,
            // Theme Options
            progress_bar            :   1,          // Timer for each slide
            mouse_scrub             :   0

        });
        // theme = {
        //   afterAnimation:  function(){
        //       $('.slidenumber').html(vars.current_slide + 1);
        //   }
        // }
      // $image_source = $(this).parents('.image-ram').find('.item.active img').attr('src');
      // $('#thumb-list img[src="' + $image_source +'"]').trigger('click');
    };
    /*-------------------------------------------------------------
    *   Change video url as readable remove all security token
    -------------------------------------------------------------*/
    $scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
    };

    // get privacy of note
    self.GetPrivacy = function(flag) {
      if (flag) {
        return 'Private Note';
      } else  {
        return 'Shared Note';
      }
    };

    // extract note content
    self.ExtractNoteTitle = function(note_content) {
      if (note_content.length > 50) {
        return note_content.substring(0 , 50) + '...';
      } else  {
        return note_content;
      }
    };
    self.TitleWrapper = function(string) {
      if (string) {
        if (string.length > 50) {
          return string.substring(0 , 50) + '...';
        } else  {
          return string;
        }
      } else {
        return string;
      }
    };
    /*-----------------------------------------------------
    *   Get Date and time string from userDate parameter
    *       input   : 2016-09-09T11:08:00-0400
    *       output  : Friday, 22 Apr 2016 at 1:11 AM
    ------------------------------------------------------*/
    self.parseDateTime = function(dateStr) {

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

        var date = string_weekday[date_obj.getDay()] + ', ' + date_obj.getDate() + ' ' + string_month[date_obj.getMonth()] + ' ' + date_obj.getFullYear();

        return date + ' at ' + time;
    };

    self.EditStoryButton = function EditStoryButton(event , story) {

      event.preventDefault();     //disable link to #

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
              'display_index' : 0 ,
              'story' : story
            };
          }
        }
      });
      modalInstance.set(modal);
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


    self.DeleteThisStory = function($event){

      var modal = $uibModal.open({
        animation: true,
        templateUrl: 'views/partials/modals/confirm-popup-modal.html',
        controller: 'ConfirmPopupCtrl',
        controllerAs: '$ctrl',
        size: 'confirm-dialog',
        backdrop  : 'static',
        keyboard  : false,
        resolve: {
          param: function () {
            return {
              'info': self.story
            };
          }
        }
      }).closed.then(function(){
        StoryManager.DeleteStoryAction(self.story.id , function(response){
          if (response) {
            $state.go('mainPage.myJournal');
          }
        });
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
    self.SetNoteAsFavorite = function($event, note) {
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
  });
