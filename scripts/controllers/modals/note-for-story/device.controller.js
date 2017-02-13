'use strict';

angular.module('frontendApp')
  .controller('noteDeviceCtrl', function (
  	$scope, $sce, $uibModal, $loading, param, modalInstance, MediaService, MediaStoryService) {

  	var self = this;	//get instance of modal

  	self.mediaList = MediaService.ImportMediaList = [];
  	self.mediaCount = 0;     // total count of medias in the StoryThat Gallery
    var selectedCount = 0;    //selected media count
    self.selectedIdList = []; //selected media id list


  // watch out for changing files array
    $scope.$watch('files', function () {
        $scope.upload($scope.files);
    });
    $scope.$watch('file', function () {
        if ($scope.file != null) {
           $scope.files = [$scope.file];
        }
    });

  // converting video url as encodable
    $scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
    }

  // dw-loading bar intitial functions
    $scope.startLoading = function (name) {
        $loading.start(name);
    };
    $scope.finishLoading = function (name) {
        $loading.finish(name);
    };

  // delete media from sevice server and service
    self.DeleteMedia = function DeleteMedia(item) {
        MediaService.DeleteMedia(item , function(response){
            if (response) {
                self.mediaCount = MediaService.ImportMediaList.length;
            }
        });
    }

  // upload media from modal or drag and drop feature
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
                                    self.mediaCount = MediaService.ImportMediaList.length;
                                    MediaService.ImportMediaBlobList.push("video");
                                    $scope.finishLoading('loading-media');
                                }
                            });
                        }   else if (file.type.substring(0 , 5) === 'image') {
                            MediaService.AddImageFromDevice(e.target.result.substring(e.target.result.search('base64,') + 7 , e.target.result.length) , file.type , file.size , function(response){
                                if (response) {
                                    self.mediaCount = MediaService.ImportMediaList.length;
                                    MediaService.ImportMediaBlobList.push("video");
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

  // next button click
    self.NextButton = function () {

      	for (var i = 0; i < self.mediaList.length; i++) {
      		self.selectedIdList.push(self.mediaList[i].id);
          param.mediaList.push(self.mediaList[i].id);
      	}

      	// MediaStoryService.imported_MediaIdList = self.selectedIdList;

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
              			'story': param.story,
                    'media': param.media,
                    'notes': param.notes,
                    'mediaList': param.mediaList
            			};
          		}
        		}
      	});
     		modalInstance.set(modal);
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
  	}

  // close button click
  	self.CloseModal = function CloseModal() {
  		modalInstance.get().close();
  	};
  	
});
