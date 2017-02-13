'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:ImagefromgalleryModalController
 * @description
 * # ImagefromgalleryModalController
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('ImagefromgalleryModalController', function ($uibModal, $scope , $sce , MediaService , modalInstance , MediaStoryService, mainService, param) {

  	var self = this;	//get instance

  	self.mediaList = [];     //all medias in the StoryThat Gallery
  	self.mediaCount = 0;     // total count of medias in the StoryThat Gallery
    self.selectedCount = 0;    //selected media count
    self.selectedIdList = []; //selected media id list

    self.keyword = '';

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
/**********************************************Function start**********************************************/
    /*------------------------------------
     * Get keydown event from search bar
     ------------------------------------*/
    self.SearchKeydown = function($event) {
      if ($event.keyCode == 13) {
        $event.preventDefault();
        self.Search();
      }
    };

    self.Search = function() {
      self.searchQuery = {
        category: 'media',
        query: self.keyword
      };

      if (self.keyword == ''){
        MediaService.GetMediaGallery(function(response) {
          if (response) {
            console.log(response);
            self.mediaList = MediaService.myGalleryList;
            self.mediaCount = MediaService.nGallery_count;
          }
        });
      } else {
        mainService.Search(self.searchQuery, function(response) {
          if(response) {
            self.mediaList = response.media;
          }else {
            console.log('mainService.Search - error = ', response);
          }
        });
      }
    };
    /*-----------------------------
    * selected image check mark
    --------------------------*/
    self.selectImage = function selectImage(media) {
        media.selected = !media.selected;
        if(media.selected === true) {
            self.selectedCount++;
        } else {
            sellf.selectedCount--;
        }
    };
    /*------------------------------
    *   Click Back button
    *   Delete created story
    ------------------------------*/
    self.CloseModal = function CloseModal() {
      modalInstance.get().close();
      var modal = $uibModal.open({
        animation: true,
        templateUrl: 'views/partials/modals/createnewstory-modal.html',
        controller: 'createnewstoryModalController',
        controllerAs: '$ctrl',
        size: 'medium-st',
        backdrop  : 'static',
        keyboard  : false,
        resolve: {
          param: function () {
            return {
              'story': param.story ,
              'fromWhere' : 'GALLERY'
            };
          }
        }
      });
      modalInstance.set(modal);
    };
    /*-----------------------------------
    *   Click Next button
    -----------------------------------*/
    self.NextButton = function NextButton() {
      self.selectedIdList.length = 0;
      for (var i = 0; i < self.mediaList.length; i++) {
        if (self.mediaList[i].selected === true) {
          self.selectedIdList.push(self.mediaList[i].id);
        }
      }
      if (self.selectedIdList.length === self.selectedCount) {

        MediaStoryService.imported_MediaIdList = self.selectedIdList;

        modalInstance.get().close();

        var modal = $uibModal.open({
          animation: true,
          templateUrl: 'views/partials/modals/editstory-modal.html',
          controller: 'EditMediaStoryCtrl',
          controllerAs: '$ctrl',
          size: 'medium-st',
          backdrop  : 'static',
          keyboard  : false,
          resolve: {
            param: function () {
              return {
                'story': param.story ,
                'fromWhere' : 'GALLERY'
              };
            }
          }
        });
        modalInstance.set(modal);
      }
    };
  });
