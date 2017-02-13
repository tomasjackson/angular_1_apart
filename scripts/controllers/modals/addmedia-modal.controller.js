'use strict';

angular.module('frontendApp')
  .controller('AddMediaController', function ($uibModal,$sce,$scope,$state,modalInstance,param,MediaService,StoryManager) {

  		var self = this;
      self.mediaList = [];
      self.media_link = '';
  	// close dialog
  		self.Close = function($event) {
  			modalInstance.get().close();
  		};
  	// import media from device
  		self.ImportMediaFromDevice = function($event) {
        var modal = $uibModal.open({
            animation: true,
            templateUrl: 'views/partials/modals/single-storypage/import_fromdevice-modal.html',
            controller: 'ImportFromDeviceSingleController',
            controllerAs: '$ctrl',
            size: 'medium-st',
            backdrop  : 'static',
            keyboard  : false,                 
            resolve: {
              param: function () {
                return {'story': param.story};
              }
            }                    
        });
        modalInstance.get().close();
        modalInstance.set(modal);
  		};
  	// import media from gallery
      self.ImportMediaFromGallery = function($event) {
        var modal = $uibModal.open({
            animation: true,
            templateUrl: 'views/partials/modals/single-storypage/import_fromgallery-modal.html',
            controller: 'ImportFromGallerySingleController',
            controllerAs: '$ctrl',
            size: 'medium-st',
            backdrop  : 'static',
            keyboard  : false,                 
            resolve: {
              param: function () {
                return {'story': param.story};
              }
            }                    
        });
        modalInstance.get().close();
        modalInstance.set(modal);
      };
  	// import media from facebook
      self.ImportMediaFromFB = function($event) {
        var modal = $uibModal.open({
            animation: true,
            templateUrl: 'views/partials/modals/single-storypage/import_fromFB-modal.html',
            controller: 'ImportFromFBSingleController',
            controllerAs: '$ctrl',
            size: 'medium-st',
            backdrop  : 'static',
            keyboard  : false,                 
            resolve: {
              param: function () {
                return {'story': param.story};
              }
            }                    
        });
        modalInstance.get().close();
        modalInstance.set(modal);
      };    
    // upload media using link
      self.uploadLink = function($event) {

          if (!self.checkURL(self.media_link)) {
              MediaService.PutMediaURL(self.media_link , function(res) {
                  if (res) {
                      self.mediaList.push(res);
                  }
              });

          }   else    {
              MediaService.PutImageURL(self.media_link , function(res) {
                  if (res) {
                      self.mediaList.push(res);
                  }
              });

          }
      };
    // save button click
      self.SaveButton = function () {

        var success_count = 0;
        for (var i = 0; i < self.mediaList.length; i++) {
          StoryManager.LinkStoryWithMedia(param.story.id , self.mediaList[i].id , function(response) {
            if (response) {
              success_count ++;
            }
          });
        }
        var scrollInterval = setInterval(function(){
            if ( success_count == self.mediaList.length ) {
              clearInterval(scrollInterval);
              console.log('success');
            }
        },15);    
        modalInstance.get().close();  
        $state.reload();
      };    
    // check url is video or image
      self.checkURL = function (url) {
          return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
      };
    // change url to trust
      $scope.trustSrc = function(src) {
          return $sce.trustAsResourceUrl(src);
      };    
  });
