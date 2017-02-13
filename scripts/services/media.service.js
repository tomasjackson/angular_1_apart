'use strict';

/*-----------------------------
*   media related service
------------------------------*/

angular.module('frontendApp').service('MediaService', function ($cookies , $http , $window , APIConsole){
    var self = this;
    //messge map
    self.message_success = '';
    self.message_failure = '';
    //export variables
    self.nGallery_count = 0;
    self.nFavorite_count = 0;

    self.added_media_detail = [];
    self.ImportMediaList = [];
    self.ImportMediaBlobList = [];
    self.SelectedMediaIndex = 0;

    self.myGalleryList = [];

    self.fromWhere = '';
    self.mediaId = '';

    self.editMedia_info = {
        success: false,
        media: []
    };

    /*--------------------------------
    *   Get all media from gallery
    ---------------------------------*/
    self.GetMediaGallery = function (callback){
        APIConsole.sendAPIRequest('GET' , 'media/gallery')
            .then(function(data){
                self.message_success = data.data.message;
                self.nGallery_count = data.data.files.length;
                self.myGalleryList = data.data.files;
                callback(true);
            },
            function(data){
                console.log(data);
                callback(false);
            });
    };

    self.GetMediaGalleryWithDate = function(sinceDate, maxResult, callback) {
        APIConsole.sendAPIRequest('GET', 'media/gallery/' + parseInt(sinceDate) + '/' + maxResult).then(
           function(data) {
                console.log(data);
                callback(true);
            }, function(data) {
                console.log(data);
                callback(false);
            }
        );
    };
    /*--------------------------------
    *   Get all media from gallery
    ---------------------------------*/
    self.GetGallery = function (callback){
        APIConsole.sendAPIRequest('GET' , 'media/gallery')
            .then(function(data){
                callback(data.data.files);
            },
            function(data){
                console.log(data);
                callback(false);
            });
    };
    /*------------------------------------
    *   Get Favorite media from gallery
    -------------------------------------*/
    self.GetMediaFavorite = function (callback){
        APIConsole.sendAPIRequest('GET' , 'media/favorite')
            .then(function(data){
                self.nFavorite_count = data.data.mediaFiles.length;
                callback(true);
            },
            function(data){
                console.log(data);
                callback(false);
            });
    };

    /*------------------------------
    *   Add Media from device
    ------------------------------*/
    self.AddImageFromDevice = function (data , header1 , header2 ,callback){
        APIConsole.sendMediaAPIRequest('PUT' , 'media/device' , data , header1, header2 )
            .then(function(data){
                self.added_media_detail = data.data;
                self.ImportMediaList.push(self.added_media_detail);
                callback(data.data);
            },
            function(data){
                console.log(data);
                callback(false);
            });
    };
    /*------------------------------
    *   Add Video from device
    ------------------------------*/
    self.AddVideoFromDevice = function (data , header1 , header2 ,callback){
        APIConsole.sendMediaAPIRequest('PUT' , 'media/device/video' , data , header1, header2 )
            .then(function(data){
                console.log(data);
                self.added_media_detail = data.data;
                self.ImportMediaList.push(self.added_media_detail);
                callback(data.data);
            },
            function(data){
                console.log(data);
                callback(false);
            });
    };

    /*--------------------------------------
    *   Crop image function
    --------------------------------------*/
    self.CropImageAction = function (id , data ,content_type ,  callback){
        APIConsole.sendMediaAPIRequest('PUT' , 'media/crop/' + id , data , content_type )
            .then(function(data){
                self.ImportMediaList[self.SelectedMediaIndex] = data.data;
                callback(true);
            },
            function(){
                callback(false);
            });
    };
    /*-----------------------------
    *   Delete media from library
    ------------------------------*/
    self.DeleteMedia = function (item , callback){
        APIConsole.sendAPIRequest('DELETE' , 'media/' + item.id)
            .then(function(data){
                self.ImportMediaList.splice(self.ImportMediaList.indexOf(item) , 1);
                self.ImportMediaBlobList.splice(self.ImportMediaList.indexOf(item) , 1);
                self.message_success = data.data.message;
                console.log(self.message_success);
                callback(true);
            },
            function(data){
                console.log(data);
                callback(false);
            });
    };
    /*----------------------------
    *   Get selected media index
    ----------------------------*/
    self.GetSelectedMediaIndex = function (item) {
        self.SelectedMediaIndex = self.ImportMediaList.indexOf(item);
    };
    /*------------------------
    *   Get Media using Id
    ------------------------*/
    self.GetMediaInfomation = function (id , callback) {
        APIConsole.sendAPIRequest('GET' , 'media/' + id)
            .then(function(data){
                console.log(data);
                callback(data);
            },
            function(data){
                console.log(data);
                callback(false);
            });
    };
    self.GetMediaFromGallery = function (id , callback) {
        APIConsole.sendAPIRequest('GET' , 'media/' + id)
            .then(function(data) {
                callback(data.data);
            },
            function(data) {
                console.log(data);
                callback(false);
            });
    };
    /*-------------------------
    *   Update media detail
    --------------------------*/
    self.UpdateMediaDetail = function (media_detail , callback) {
        APIConsole.sendAPIRequest('POST' , 'media/' + media_detail.id , {
            title: media_detail.title,
            date: media_detail.date,
            time: media_detail.time,
            location: media_detail.location,
            keywords: media_detail.keywords,
            description: media_detail.description
        }).then(function(data){
            console.log(data);
            callback(data);
        },
        function(data){
            callback(false);
            console.log(data.data.message);
        });
    };
    /*-----------------------------
    *   Get base64 of media
    -----------------------------*/
    self.Getbase64 = function (media_id , callback) {
        APIConsole.sendAPIRequest('GET' , 'media/base64/' + media_id)
            .then(function(data) {
                callback(data.data);
            },
            function() {
                callback(false);
            }
        );
    };
    /*---------------------------
    *   Link media using url
    ----------------------------*/
    self.PutMediaURL = function(url , callback) {
        APIConsole.sendAPIRequest('PUT' , 'media/video' , {url : url}).then(
            function(data) {
                callback(data.data);
            } ,
            function(data){
                console.log(data);
                callback(false);
            }
        );
    };
    /*---------------------------
    *   Link image url
    ----------------------------*/
    self.PutImageURL = function(url , callback) {
        APIConsole.sendAPIRequest('PUT' , 'media/link' , {url : url}).then(
            function(data) {
                callback(data.data);
            } ,
            function(data){
                console.log(data);
                callback(false);
            }
        );
    };

    /*-------------------------
    *   Get Favorit Media
    -------------------------*/
    self.GetFavoriteMedia = function(callback) {

        APIConsole.sendAPIRequest('GET' , 'media/favorite').then(
            function(data) {
                callback(data.data);
            },
            function(data) {
                console.log(data);
                callback(false);
            }
        );
    };
    /*----------------------------
    *   Set as Favorite Media
    ----------------------------*/
    self.PutFavoriteMedia = function(id , callback) {

        APIConsole.sendAPIRequest('PUT' , 'media/favorite/' + id).then(
            function(data) {
                callback(true);
            },
            function(data) {
                console.log(data);
                callback(false);
            }
        );
    };
    /*---------------------------------------
    *   Delete media from Favorite list
    ----------------------------------------*/
    self.RemoveFromFavorite = function(id , callback) {

        APIConsole.sendAPIRequest('DELETE' , 'media/favorite/' + id).then(
            function(data) {
                console.log(data);
                callback(true);
            },
            function(data) {
                console.log(data);
                callback(false);
            }
        );
    };
    /*----------------------------------
    *   Expand Story
    ----------------------------------*/
    self.ExpandMediaAction = function(media_id, callback) {
        APIConsole.sendAPIRequest('POST' , 'media/expand/' + media_id).then(function(data) {
                callback(data);
            }, function(data) {
                console.log(data);
                callback(false);
            }
        );
    };
    /*----------------------------------
    *   Search Gallery
    ----------------------------------*/
    self.SearchGalleryAction = function(query, callback) {

        APIConsole.sendAPIRequest('POST', 'search/media', query).then(function(data) {
                callback(data);
            }, function(data) {
                console.log(data);
                callback(false);
            }
        );
    };
    /*----------------------------------
    *   Add notes to Media
    -----------------------------------*/
    self.AddNoteToMedia = function(media_id, note_string, callback) {
        APIConsole.sendAPIRequest('POST', 'note/media/' + media_id, {content: note_string}).then(function(data) {
                callback(data);
            }, function(data) {
                console.log(data);
                callback(false);
            }
        );
    };

    self.GetSharedDetails = function(media_id, callback) {
      APIConsole.sendAPIRequest('GET', 'media/shared/details/' + media_id).then(function(res) {
        callback(res.data);
      }, function(res) {
        console.log(res.data);
        callback(false);
      })
    };

    self.ShareMediaToFriends = function(media_id, user_id, callback) {
      APIConsole.sendAPIRequest('POST', 'media/share/' + media_id, {friends_id: user_id}).then(function(res) {
        callback(res.data);
      }, function(err) {
        console.log(err);
        callback(false);
      })
    };

    self.SetPrivacyForMedia = function(mediaId, privacyData, callback) {
      APIConsole.sendAPIRequest('POST', 'media/privacy/' + mediaId, privacyData)
        .then(function(data) {
          callback(data);
        }, function(data) {
          console.log(data);
          callback(false);
        });
    };
});
