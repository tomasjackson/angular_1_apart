'use strict';

angular.module('frontendApp').controller('photoModalCtrl', function($sce, $scope, $uibModal, modalInstance,param,mainService,MediaDetailService,MediaService) {

	var self = this;

	//get medias from service
	self.media_array = MediaService.myGalleryList;
	self.current_id = param.media.id;
  self.favorite_media = [];                //favorite media
	self.displaying_media = param.media;
  self.view_mode = 'DEFAULT';
  console.log(param.media);

    $scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
    };

    /*-------------------------------
    *   Get Favorite Media count
    -------------------------------*/

    MediaService.GetFavoriteMedia(function(res){
        if (res) {
            self.favorite_media_count = res.mediaFiles.length;
        }
    });

    //initialize id array
    self.id_array = [];
    for (var i = 0; i < self.media_array.length; i++) {
        self.id_array.push(self.media_array[i].id);
    }


	var index_id = self.id_array.indexOf(param.media.id);

    //prevent default routing
	self.CarouseSlide = function ($event , state) {
		$event.preventDefault();
		if (state == 'LEFT') {
			index_id--;
			if (index_id < 0) {
				index_id = self.media_array.length - 1;
			}
			self.displaying_media = self.media_array[index_id];
		}	else	{
			index_id++;
			if (index_id > self.media_array.length - 1) {
				index_id = 0;
			}
			self.displaying_media = self.media_array[index_id];
		}
	};
	//close modal
    self.closeModal = function closeModal() {
        modalInstance.get().close();
    };
    /*------------------------------
    *   Toggle to About view
    ------------------------------*/
    self.ViewMode = function ($event , mode) {

        self.view_mode = mode;

        $($event.target.parentNode).find('button').removeClass('active');
        $($event.target).addClass('active');


        // var $element_obj = $($event.target.parentNode).parent();
        // $element_obj.find('.media-container').addClass(class_name.add);
        // $element_obj.find('.media-container').removeClass(class_name.remove);
    };
    /*-----------------------------------
    *   Set this media as favorite
    -----------------------------------*/
    self.SetAsFavorite = function($event) {
        if ($($event.target.parentNode).hasClass('active')) {
            MediaService.RemoveFromFavorite(self.displaying_media.id , function(res) {
                if (res) {
                    MediaService.GetFavoriteMedia(function(res){
                        if (res) {
                            self.favorite_media_count = res.mediaFiles.length;
                            $($event.target.parentNode).removeClass('active');
                        }
                    });
                }
            });
        }   else    {
            MediaService.PutFavoriteMedia(self.displaying_media.id , function(res) {
                if (res) {
                    MediaService.GetFavoriteMedia(function(res){
                        if (res) {
                            self.favorite_media_count = res.mediaFiles.length;
                            $($event.target.parentNode).addClass('active');
                        }
                    });
                }
            });
        }

    }
    /*----------------------
    * Full Screen mode
    ----------------------*/
    self.FullScreenShow = function ($event) {

        modalInstance.get().close();
        $('#supersized-loader').empty().remove();
        $('#supersized').empty().remove();
        $('#hzDownscaled').empty().remove();
        $('body').append('<div id="supersized-loader"></div><ul id="supersized"></ul>');

        var slides = [];
        var temp_big = '';
        var temp_thumb = '';
        for (var i = index_id; i < self.media_array.length; i++) {



            if (!self.media_array[i].mediaFileType) {
                if (self.media_array[i].path.original) {
                    temp_big = self.media_array[i].path.original;
                    temp_thumb = self.media_array[i].path.t1;
                }   else    {
                    temp_big = self.media_array[i].path;
                    temp_thumb = self.media_array[i].path;
                }
                slides.push({
                    image : temp_big ,
                    title : self.media_array[i].title,
                    thumb : temp_thumb,
                    url : temp_big
                });

            }

        }

       for (var i = 0; i < index_id; i++) {

            if (!self.media_array[i].mediaFileType) {
                if (self.media_array[i].path.original) {
                    temp_big = self.media_array[i].path.original;
                    temp_thumb = self.media_array[i].path.t1;
                }   else    {
                    temp_big = self.media_array[i].path;
                    temp_thumb = self.media_array[i].path;
                }
                slides.push({
                    image : temp_big ,
                    title : self.media_array[i].title,
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
    };
    /*-----------------------------------------------------
    *   Get Date and time string from userDate parameter
    *       input   : 2016-09-09T11:08:00-0400
    *       output  : date = 'Fri 19 Feb 2016'
    *                 time = '05:55'
    ------------------------------------------------------*/
    self.parseDateTime = function (dateStr) {

        if (typeof dateStr === 'object' && dateStr) {
            return {
                date: dateStr.date,
                time: dateStr.time
            }
        }

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

        var string_weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        var string_month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        var date = date_obj.getDate() + ' ' + string_month[date_obj.getMonth()] + ' ' + date_obj.getFullYear();

        return {
            date : date,
            time : time
        }
    };

    self.AddNote = function($event, media) {
        $event.preventDefault();
        modalInstance.get().close();
        console.log(media);
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
                        'media' : media
                    };
                }
            }
        });
        modalInstance.set(modal);
    };
});

