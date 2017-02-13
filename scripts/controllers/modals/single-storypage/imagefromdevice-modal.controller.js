'use strict';

angular.module('frontendApp')
  .controller('ImportFromDeviceSingleController', function (
  	$scope, $sce, $uibModal, $loading, $state, param, modalInstance, MediaService, MediaStoryService, StoryManager) {

  	var self = this;	//get instance of modal

  	self.mediaCount = 0;     // total count of medias in the StoryThat Gallery
    var selectedCount = 0;    //selected media count
    self.selectedIdList = []; //selected media id list
    self.media_list = [];

    $scope.$watch('files', function () {
        $scope.upload($scope.files);
    });
    $scope.$watch('file', function () {
        if ($scope.file != null) {
           $scope.files = [$scope.file];
        }
    });
    $scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
    }
    /*------------------------------
    *	Loading bar functions...
    ------------------------------*/
    $scope.startLoading = function (name) {
        $loading.start(name);
    };
    $scope.finishLoading = function (name) {
        $loading.finish(name);
    };
    /*----------------------------------------------------
    *   Delete added Image from server and current array
    ----------------------------------------------------*/
    self.DeleteMedia = function DeleteMedia(item) {
        MediaService.DeleteMedia(item , function(response){
            if (response) {
                self.mediaCount = self.media_list.length;
            }
        });
    }
    /*-------------------------------------------
    *   Upload drag and drop media to server
    --------------------------------------------*/
    $scope.upload = function (files) {        
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                if (!file.$error) {

                    var reader = new FileReader();
                    reader.onload = function (e) {
                        $scope.startLoading('loading-media');
                        if (file.type.substring(0 , 5) === 'video') {
                            var base64_str = e.target.result;
                            var base64_param = base64_str.substring(base64_str.search('base64,') + 7 , base64_str.length);

                            MediaService.AddVideoFromDevice(base64_param, file.type , file.size , function(response) {
                                if (response) {
                                    self.media_list.push(response);
                                    self.mediaCount = self.media_list.length;
                                    $scope.finishLoading('loading-media');
                                }
                            });
                        }   else if (file.type.substring(0 , 5) === 'image') {
                            MediaService.AddImageFromDevice(e.target.result.substring(e.target.result.search('base64,') + 7 , e.target.result.length) , file.type , file.size , function(response){
                                if (response) {
                                    self.media_list.push(response);
                                    self.mediaCount = self.media_list.length;
                                    $scope.finishLoading('loading-media');                                    
                                }
                            });
                        }   else {
                            console.log('Unexpected file imported!!!');
                            $scope.finishLoading('loading-media');                            
                        }
                    };
                    reader.readAsDataURL(file);
                }
            }
        }
    }
    /*-----------------------------------
    *   Click Save button
    -----------------------------------*/
    self.SaveButton = function () {

      var success_count = 0;
      for (var i = 0; i < self.media_list.length; i++) {
        StoryManager.LinkStoryWithMedia(param.story.id , self.media_list[i].id , function(response) {
          if (response) {
            success_count ++;
          }
        });
      }
      var scrollInterval = setInterval(function(){
          if ( success_count == self.media_list.length ) {
            clearInterval(scrollInterval);
            console.log('success');
          }
      },15);

    	modalInstance.get().close();
      $state.reload();

    };    
  	/*-------------------------------------
  	*	Back button
  	--------------------------------------*/
  	self.BackButton = function () {

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
            return {'story': param.story};
          }
        }                    
      });
      modalInstance.get().close();
      modalInstance.set(modal);

  	}
  	/*-------------------
  	*	Close modal
  	---------------------*/
  	self.CloseModal = function CloseModal() {
  		modalInstance.get().close();
  	};
  	
});
