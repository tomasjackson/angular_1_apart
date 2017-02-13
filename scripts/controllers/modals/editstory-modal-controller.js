/**
 * Created by bear on 9/14/16.
 */
'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:ImageFromFBCtrl
 * @description
 * # ImageFromFBCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('EditMediaStoryCtrl', function ($scope, $rootScope, $loading, $cookies, $sce, $uibModal, modalInstance, StoryManager, AdditionalService, MediaStoryService, MediaService, param) {

    var self = this;  //get instance
// dw-loading initial functions
    $scope.startLoading = function (name) {
        $loading.start(name);
    };

    $scope.finishLoading = function (name) {
        $loading.finish(name);
    };  

    var media_id_list = MediaStoryService.imported_MediaIdList;
    self.mediaList = [];
    self.story = [];
    self.story = param.story;


    self.storyDate = new Date(self.story.date);                         //parse usr date to datepicker and timepicker
    $scope.storytime = new Date('2016/1/1' + ' ' + self.story.time);
    //  Get media from gallery
    $scope.startLoading('loading');
    for (var i = 0; i < media_id_list.length; i++) {
      MediaService.GetMediaInfomation(media_id_list[i] , function(response) {
        if (response) {
          self.mediaList.push(response.data);
          $scope.finishLoading('loading');
        }
      });
    }

    $scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
    }     
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

    }

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
    }
    /*-----------------------------------------------
    *   Crop selected Media and save
    -----------------------------------------------*/
    self.CropMedia = function(media, event) {

      alert('Sorry, this section is on Developing ...');

        // MediaStoryService.selected_Media = media;

        // var modal = $uibModal.open({
        //   animation: true,
        //   templateUrl: 'views/partials/modals/media/cropimage-modal.html',
        //   controller: 'CropImageController',
        //   controllerAs: '$ctrl',
        //   size: 'medium-st' ,
        //   backdrop  : 'static',
        //   keyboard  : false          
        // });

        // ModalInstanceStore.crop_image_modal = modal;

    };
    /*-----------------------------------------------
    *   Edit selected Media and save
    -----------------------------------------------*/
    self.EditMedia = function(media, event) {

      alert('Sorry, this section is on Developing ...');

        // MediaStoryService.selected_Media = media;

        // var modal = $uibModal.open({
        //   animation: true,
        //   templateUrl: 'views/partials/modals/media/editmedia-modal.html',
        //   controller: 'EditMediaController',
        //   controllerAs: '$ctrl',
        //   size: 'medium-st'
        // });

        // ModalInstanceStore.edit_media_modal = modal;

    };

    /*------------------------------------
    * Link Media and Story
    ------------------------------------*/
    self.EditSave = function() {
  
      $scope.startLoading('loading');

      self.story.date = self.storyDate.getFullYear() +'/' + (self.storyDate.getMonth() + 1) + '/' + self.storyDate.getDate();
      self.story.time = AdditionalService.parseTime($scope.storytime);
      var keywords = [];
      for (var i = 0; i < self.story.keywords.length; i++) {
        keywords.push(self.story.keywords[i].keyword);
      }
      self.story.keywords = keywords;
      StoryManager.SaveStoryAction(self.story , function(response){
          if (response) {
              var success_count = 0;
              for (var i = 0; i < media_id_list.length; i++) {
                StoryManager.LinkStoryWithMedia(StoryManager.updated_story.id , media_id_list[i] , function(response) {
                  if (response) {
                    success_count ++;
                  }
                });
              }
              var scrollInterval = setInterval(function(){
                  if ( success_count == media_id_list.length ) {
                    clearInterval(scrollInterval);
                    StoryManager.GetSingleStory(StoryManager.updated_story.id , function(response) {
                      if (response) {
                        StoryManager.updated_story = response;
                        modalInstance.get().close();
                        SpliceStory(Date.parse(StoryManager.updated_story.userDate).getTime()/1000);                        
                      }
                    });
                  }
              },15);
          }
      });

    }
    /*--------------------------------
    *   Close modal dialog
    --------------------------------*/
    self.CloseModal = function() {
      modalInstance.get().close();
      var modal = $uibModal.open({
        animation: true,
        templateUrl: 'views/partials/modals/import_fromgallery-modal.html',
        controller: 'ImagefromgalleryModalController',
        controllerAs: '$ctrl',
        size: 'medium-st',
        backdrop  : 'static',
        keyboard  : false,                 
        resolve: {
          param: function () {
            return {'story': self.story};
          }
        }                    
      });
      modalInstance.set(modal);
    }
    /***************************Date and Time picker************************/
    self.flag_datepicker_opend = false;

    self.openDatepicker = function(){

        self.flag_datepicker_opend = true;

    }

    $scope.$watch('storytime', function (newValue, oldValue) {

      if (!angular.equals(newValue, oldValue)) {

      }
    });
    /**********************************************************************/
    function SpliceStory(val) {

        $rootScope.journal_updated = true;

        // var last = $rootScope.myStories.length;

        // if ($rootScope.myStories[last - 1].userDate.unix > val) {
        //     console.log('no need to slice');
        // }   else if ($rootScope.myStories[0].userDate.unix <= val) {
        //     $rootScope.myStories.splice(0 , 0 , AdditionalService.parseStoryObject(StoryManager.updated_story));
        // }   else {
        //     for (var i = 1; i < $rootScope.myStories.length - 1; i++) {
        //         $rootScope.myStories[i].userDate.unix
        //         if ($rootScope.myStories[i].userDate.unix <= val)
        //         {
        //             $rootScope.myStories.splice(i , 0 , AdditionalService.parseStoryObject(StoryManager.updated_story));
        //             break;
        //         }
        //     }
        // }
    }
  });
/*---------------------------------------------------
*   Crop Image Controller
*   Here you can get the cropping image controller
----------------------------------------------------*/
angular.module('frontendApp').controller('CropImportedMediaController', function($http , $scope , ModalInstanceStore , MediaStoryService) {

    var self = this;

    self.currentImg = MediaService.ImportMediaBlobList[MediaService.SelectedMediaIndex];    //get selected image from service
    self.croppedImage = '';                                                                 //initial cropped image var
    /*------------------------------
    *   Apply button clicked
    -------------------------------*/
    self.applyCropping = function applyCropping() {
        // self.croppedImage = '';//this is the base64 encoded cropped image
        var id = MediaService.ImportMediaList[MediaService.SelectedMediaIndex].id;
        var base64_string = self.croppedImage.substring(self.croppedImage.search('base64,') + 7 , self.croppedImage.length);
        var content_type = MediaService.ImportMediaList[MediaService.SelectedMediaIndex].fileType;
        MediaService.CropImageAction (id , base64_string , content_type , function(response){
            if (response) {
                MediaService.ImportMediaBlobList[MediaService.SelectedMediaIndex] = self.croppedImage;
                self.closeModal();
            }
        });
    }
    /*------------------------------------------------
    *   Close 'X' Button Click
    --------------------------------------------------*/
    self.closeModal = function closeModal(){
       ModalInstanceStore.crop_image_modal.close();    //close modal dialog
    }
});
