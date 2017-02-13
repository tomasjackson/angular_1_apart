/**
 * Created by bear on 9/12/16.
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
  .controller('ImportFromFBSingleController', function ($scope, $sce, $cookies, $window, $rootScope, $state, Config, modalInstance, 
    $uibModal, MediaStoryService , param , StoryManager) {

    var self = this;
    $scope.allPhotos = [];
    $scope.allVideos = [];
    $scope.allMedias = [];
    var FBaccessToken = '';
    self.SumOfSelectedFile = 0;

    self.signInFB = function signInFb(){

      FB.login(function(facebookOauth) {
        if(facebookOauth.status === 'connected'){
          $cookies.put(Config.FBToken, facebookOauth.authResponse.accessToken);
          FBaccessToken = facebookOauth.authResponse.accessToken || '';
          console.log('facebookOauth = ', facebookOauth);

          getMediaFilesFromFB();
          console.log('all Media files = ', $scope.allMedias);
        }
      }, {scope: 'user_photos, user_videos'});
    };

    function getMediaFilesFromFB() {
      getImagesFromFB();
      getVideoFromFB();
    }

    function getVideoFromFB() {
      FB.api(
        '/me/videos/uploaded?fields=description,updated_time,permalink_url,title,source,picture&limit=10',
        function(videosResponse) {
          //console.log( ' got videos for FB Account  = ', videosResponse );
          if (videosResponse && !videosResponse.error) {
            console.log('Video Response = ', videosResponse);
            for (var i = 0; i < videosResponse.data.length; i++) {
              var facebookVideos = videosResponse.data[i];
              $scope.allMedias.push({
                'id'	:	facebookVideos.id,
                'added'	:	facebookVideos.updated_time,
                'url'	:	facebookVideos.source,
                'selected' : false,
                'type' : true ///if video, true. if photo false
              });
              $scope.$apply();
            }
          }
        }
      );
    }

    function getImagesFromFB() {
      getAlbumsFromFB( function(albumResponse) {
        for(var i = 0; i < albumResponse.data.length; i++) {
          var album = albumResponse.data[i];
          getPhotosForAlbumID(album.id, function(albumId, albumPhotosResponse) {
            var facebookPhoto;
            for (i = 0; i < albumPhotosResponse.data.length; i++) {
              facebookPhoto = albumPhotosResponse.data[i];
              $scope.allMedias.push({
                'id'	:	facebookPhoto.id,
                'added'	:	facebookPhoto.created_time,
                'url'	:	makeFacebookPhotoURL( facebookPhoto.id, FBaccessToken ),
                'selected' : false,
                'type' : false ///if video, true. if photo false
              });
              $scope.$apply();
            }
          })
        }
      })
    }

    $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src);
    };

    function getAlbumsFromFB(callback) {
      /* make the API call */
      FB.api(
        '/me/albums',
        function(albumResponse) {
          if (albumResponse && !albumResponse.error) {
            /* handle the result */
            //console.log( ' got albums = ', albumResponse );
            callback(albumResponse);
          }
        }
      );
    }

    function getPhotosForAlbumID(albumId, callback) {
      /* make the API call */
      var url = '/' + albumId + '/photos';
      FB.api(
        url,
        function(albumPhotosResponse) {
          //console.log( ' got photos for album ' + albumId );
          if (callback) {
            callback( albumId, albumPhotosResponse );
          }
        }
      );
    }

    function makeFacebookPhotoURL( id, accessToken ) {
      return 'https://graph.facebook.com/' + id + '/picture?access_token=' + accessToken;
    }

    self.closeModal = function closeModal() {
      modalInstance.get().close();
    };

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
    };

    self.selectImage = function selectImage(photo) {
      photo.selected = !photo.selected;

      if(photo.selected === true) {
        self.SumOfSelectedFile++;
      } else {
        self.SumOfSelectedFile--;
      }
    };

    /*---------------------------------
     Open Add/Edit your Story Modal
     -------------------------------- */
    self.SaveButton = function () {
      MediaStoryService.saveSelectedFBMedias(getSelectedMedias(), FBaccessToken, function(response) {
        if(response) {
          var mediaList = [];
          for(var i = 0; i < response.data.files.length; i++) {
            mediaList.push(response.data.files[i].id);
          }

          var success_count = 0;
          for (var i = 0; i < mediaList.length; i++) {
            StoryManager.LinkStoryWithMedia(param.story.id , mediaList[i] , function(response) {
              if (response) {
                success_count ++;
              }
            });
          }
          var scrollInterval = setInterval(function(){
              if ( success_count == mediaList.length ) {
                clearInterval(scrollInterval);
                console.log('success');
              }
          },15);
          modalInstance.get().close();
          $state.get().close();   
        } else {
          console.log('openEditMediaStoryModal- error = ', response.data);
        }
      });
    };

    function getSelectedMedias() {
      var selectedMedias = [];
      for(var i = 0; i < $scope.allMedias.length; i++) {
        if($scope.allMedias[i].selected === true && $scope.allMedias[i].type === false) {//type is pending feature for only photos
          selectedMedias.push($scope.allMedias[i].id);
        }
      }
      return selectedMedias;
    }

    self.signInFB();
  });
