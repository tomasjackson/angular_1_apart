'use strict';

/*--------------------------------------------------------------------
           Edit story in the journal page
--------------------------------------------------------------------*/
angular.module('frontendApp')
  .controller('EditJournalStoryController', function ($scope , $rootScope , $sce , $uibModal , modalInstance , StoryManager , param) {

  	var	self = this;		// get instance

  	//	get current selected story information from service
  	self.storyDetail = param.story;
    console.log(self.storyDetail);
  	self.storydate = new Date(self.storyDetail.userDate);
    self.mediaList = self.storyDetail.mediaFiles;
  	$scope.storytime = new Date(self.storyDetail.userDate);

    /*------------------------------
    *	Save edit information
    ------------------------------*/
    self.onEditSave = function onEditSave() {

        self.storyDetail.date = self.storydate.getFullYear() +'/' + (self.storydate.getMonth() + 1) + '/' + self.storydate.getDate();
        self.storyDetail.time = self.parseTime($scope.storytime);

        var tag_temp = [];
        for (var i = 0; i < self.storyDetail.keywords.length; i++) {
            //if (self.storyDetail.keywords[i].keyword != self.storyDetail.title) {
                tag_temp.push(self.storyDetail.keywords[i].keyword);
            //}
        }
        self.storyDetail.keywords = tag_temp;

        if (!self.storyDetail.title) {
            // self.createStoryErrorMessage = 'Please give a title to your story and then click SAVE to create';
        }   else    {
            // self.createStoryErrorMessage = '';
            StoryManager.UpdateStoryAction(self.storyDetail , self.storyDetail.id ,  function(response){
                if (response) {
                	$rootScope.myStories[param.display_index] = parseStoryObject(response.story);
                	self.closeEditModal();
                }
            });
        }
    };
    /***************************Functions***********************************/
    /*---------------------------------------------------------
    *   Delete one story in the journal page
    *
    *   DeleteMedia : click delete button
    *   ConfirmDelete   : confirm delete action
    ---------------------------------------------------------*/

    self.DeleteMedia = function(media , event) {

      var $img_cont = $(event.target.parentNode).parent();
      $img_cont.find('.confirm-delete').slideDown();

    };

    self.ConfirmDelete = function(flag , media , event){

        if (flag === 'DELETE_STORY') {         //Delete this story

          var $img_cont = $(event.target.parentNode).parent();
          $img_cont.find('.confirm-delete').slideUp();

          var media_index_num = self.mediaList.indexOf(media);    //get media index num
          self.mediaList.splice(media_index_num , 1);             //delete media from imported array

        }   else if(flag === 'CANCEL_ACTION')    {       //No, cancel this action

          var $img_cont = $(event.target.parentNode).parent();
          $img_cont.find('.confirm-delete').slideUp();

        }   else    {

            console.log('Unknow error occured while binding');

        }
    };
    /*-----------------------------------------------
    *   Crop selected Media and save
    -----------------------------------------------*/
    self.CropMedia = function(media, event) {

        MediaStoryService.selected_Media = media;

        var modal = $uibModal.open({
          animation: true,
          templateUrl: 'views/partials/modals/media/cropimage-modal.html',
          controller: 'CropImageController',
          controllerAs: '$ctrl',
          size: 'medium-st' ,
          backdrop  : 'static',
          keyboard  : false
        });

        ModalInstanceStore.crop_image_modal = modal;

    };
    /*-----------------------------------------------
    *   Edit selected Media and save
    -----------------------------------------------*/
    self.EditMedia = function(media, event) {

        MediaStoryService.selected_Media = media;

        var modal = $uibModal.open({
          animation: true,
          templateUrl: 'views/partials/modals/media/editmedia-modal.html',
          controller: 'EditMediaController',
          controllerAs: '$ctrl',
          size: 'medium-st',
          backdrop  : 'static',
          keyboard  : false
        });

        ModalInstanceStore.edit_media_modal = modal;

    };
    /*-----------------------
    *   Close edit modal
    -----------------------*/
    self.closeEditModal = function closeEditModal() {
        modalInstance.get().close();
    };
    /*---------------------------------------
    *   Get Time string
    ---------------------------------------*/
    self.parseTime = function parseTime(dateObj) {
        var timeStr;

        if (dateObj.getHours() < 10) {
            timeStr = '0' + dateObj.getHours();
        }   else    {
            timeStr = dateObj.getHours();
        }

        timeStr += ':';

        if (dateObj.getMinutes() < 10) {
            timeStr += '0' + dateObj.getMinutes();
        }   else    {
            timeStr += dateObj.getMinutes();
        }
        return timeStr;
    }
    /*-----------------------------------------------------
    *   Get Date and time string from userDate parameter
    *       input   : 2016-09-09T11:08:00-0400
    *       output  : date = 'Fri 19 Feb 2016'
    *                 time = '05:55'
    ------------------------------------------------------*/
    function parseDateTime (dateStr) {

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

        var date = string_weekday[date_obj.getDay()] + ' ' + date_obj.getDate() + ' ' + string_month[date_obj.getMonth()] + ' ' + date_obj.getFullYear();

        return {
            date : date,
            time : time
        }
    }
    /*---------------------------------------------------------
    *   Push user friendly converted story element to array
    ---------------------------------------------------------*/
    function parseStoryObject (native_story_obj) {
    	// var date_string = native_story_obj.userDate.slice(0 , native_story_obj.userDate.length - 8);
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
            userDate : parseDateTime(native_story_obj.userDate)
        };
    }
    /*-------------------------------------------------------------
    *   Change video url as readable remove all security token
    -------------------------------------------------------------*/
    $scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
    };

    $scope.$watch('storytime', function (newValue, oldValue) {
      if (!angular.equals(newValue, oldValue)) {

      }
    });
    /*--------------------------------
    *   Date Picker
    --------------------------------*/
    self.flag_datepicker_opend = false;
    self.openDatepicker = function(){
        self.flag_datepicker_opend = true;
    };
  });
