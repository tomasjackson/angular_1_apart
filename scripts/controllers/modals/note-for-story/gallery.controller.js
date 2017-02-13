'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:ImagefromgalleryModalController
 * @description
 * # ImagefromgalleryModalController
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('noteGalleryCtrl', function ($uibModal, $scope , $sce , MediaService , modalInstance , MediaStoryService , param) {

  	var self = this;	//get instance

  	self.mediaList = [];     //all medias in the StoryThat Gallery
  	self.mediaCount = 0;     // total count of medias in the StoryThat Gallery
    var selectedCount = 0;    //selected media count
    self.selectedIdList = []; //selected media id list

	//load media from my gallery
  	MediaService.GetMediaGallery(function(response) {
  		  if (response) {
  			   self.mediaList = MediaService.myGalleryList;
  			   self.mediaCount = MediaService.nGallery_count;
  		  }
  	});

    $scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
    };

  // select media
    self.selectImage = function selectImage(media) {
        media.selected = !media.selected;
        if(media.selected === true) {
            selectedCount++;
        } else {
            selectedCount--;
        }
    };

  // close button click
    self.CloseModal = function CloseModal() {
      modalInstance.get().close();
    };

  // back button click
    self.BackButton = function () {
      modalInstance.get().close();
      var modal = $uibModal.open({
          animation: true,
          templateUrl: 'views/partials/modals/note-for-story/addmedia-for-note-modal.html',
          controller: 'MediaForNoteCtrl',
          controllerAs: '$ctrl',
          size: 'modal-note-st-custom',
          backdrop  : 'static',
          keyboard  : false,
          resolve: {
              param: function () {
                  return {
                      'story' : param.story,
                      'media' : param.media,
                      'notes' : param.notes,
                      'mediaList' : param.mediaList                      
                  };
              }
          }
      });
      modalInstance.set(modal);
    };


  // next button click
    self.NextButton = function NextButton() {
      self.selectedIdList.length = 0;
      for (var i = 0; i < self.mediaList.length; i++) {
        if (self.mediaList[i].selected === true) {
          self.selectedIdList.push(self.mediaList[i].id);
          param.mediaList.push(self.mediaList[i].id);
        }
      }
      if (self.selectedIdList.length === selectedCount) {

        MediaStoryService.imported_MediaIdList = self.selectedIdList;

        modalInstance.get().close();

        var modal = $uibModal.open({
          animation: true,
          templateUrl: 'views/partials/modals/note-for-story/addnotes-last-modal.html',
          controller: 'AddNotesLastController',
          controllerAs: '$ctrl',
          size: 'medium-st',
          backdrop  : 'static',
          keyboard  : false,
          resolve: {
            param: function () {
              return {
                'story': param.story ,
                'media': param.media,
                'notes': param.notes,
                'mediaList': param.mediaList                
              };
            }
          }
        });
        modalInstance.set(modal);
      }
    };
  });
