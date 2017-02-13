'use strict';

/*--------------------------------------
*   Upload media Controller
--------------------------------------*/

angular.module('frontendApp').controller('upLoadMediaCtrl', function($scope , $window ,$base64 , $uibModal, $loading , $state, $sce ,MediaService , modalInstance, Upload , param) {

    var self = this;

    if (param.fromWhere) {
        $scope.added_media = MediaService.ImportMediaList;

        self.added_media_count = MediaService.ImportMediaList.length;
    }   else    {
        $scope.added_media = MediaService.ImportMediaList = [];
        MediaService.ImportMediaBlobList = [];                      //initial variables

        self.added_media_count = MediaService.ImportMediaList.length;
    }

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
    };
    $scope.startLoading = function (name) {
        $loading.start(name);
    };

    $scope.finishLoading = function (name) {
        $loading.finish(name);
    };

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
                                    self.added_media_count = MediaService.ImportMediaList.length;
                                    MediaService.ImportMediaBlobList.push("video");
                                    if (self.added_media_count >= files.length )
                                      $scope.finishLoading('loading-media');
                                }
                            });
                        }   else if (file.type.substring(0 , 5) === 'image') {
                            MediaService.AddImageFromDevice(e.target.result.substring(e.target.result.search('base64,') + 7 , e.target.result.length) , file.type , file.size , function(response){
                                if (response) {
                                    self.added_media_count = MediaService.ImportMediaList.length;
                                    MediaService.ImportMediaBlobList.push(e.target.result);
                                    if (self.added_media_count >= files.length )
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
    };
    /*----------------------------------------------------
    *   Delete added Image from server and current array
    ----------------------------------------------------*/
    self.DeleteMedia = function DeleteMedia(item) {
        MediaService.DeleteMedia(item , function(response){
            if (!response) {
            }   else    {
                self.added_media_count = MediaService.ImportMediaList.length;
            }
        });
    }
    /*-------------------------------
    *   Crop Image button Click
    -------------------------------*/
    self.CropPhoto = function CropPhoto(item , e) {
        e.stopPropagation();
        MediaService.GetSelectedMediaIndex(item);

        modalInstance.get().close();

        var modal = $uibModal.open({
            animation: true,
            templateUrl: 'views/partials/modals/cropimage-modal.html',
            controller: 'cropImageCtrl',
            controllerAs: '$ctrl',
            size: 'medium-st',
            backdrop  : 'static',
            keyboard  : false ,
            resolve : {
                param: function () {
                    return {
                        'fromWhere' : 'UPLOAD'
                    }
                }
            }
        });
        modalInstance.set(modal);
    }
    /*----------------------
    *   Save and exit
    ----------------------*/
    self.openEditDialog = function openEditDialog() {
        self.closeModal();
    }
    /*---------------------------------
    *   Edit Media button Click
    ---------------------------------*/
    self.EditMedia = function EditMedia(item , e) {
        e.stopPropagation();
        MediaService.GetSelectedMediaIndex(item);

        modalInstance.get().close();

        var modal = $uibModal.open({
            animation: true,
            templateUrl: 'views/partials/modals/editmedia-modal.html',
            controller: 'editImageCtrl',
            controllerAs: '$ctrl',
            size: 'medium-st',
            backdrop  : 'static',
            keyboard  : false,
            resolve : {
                param: function () {
                    return {
                        'fromWhere' : 'UPLOAD'
                    }
                }
            }
        });
        modalInstance.set(modal);
    }
/*----------------------------------Button Click Events------------------------------------------*/

    /*------------------------------------------------
    *   Close 'X' Button Click
    --------------------------------------------------*/
    self.closeModal = function closeModal(){
        modalInstance.get().close();    //close modal dialog
    }
    /*---------------------------------------------------
    *   Click Gallery button , opens My gallery Page
    -----------------------------------------------------*/
    self.openMyGalleryPage = function OpenMyGalleryPage(){
        self.closeModal();
        $state.go('mainPage.myGallery');
    }

    self.onUploadFromDeviceButtonClick = function onUploadFromDeviceButtonClick(){
        // MediaService.GetMediaFromId( 13 , function(response){
        //     if (!response) {
        //     }   else    {
        //     }
        // });
    }
});
/*---------------------------------------------------
*   Crop Image Controller
*   Here you can get the cropping image controller
----------------------------------------------------*/
angular.module('frontendApp').controller('cropImageCtrl', function($http, $scope, $uibModal, $loading, modalInstance, MediaService, param) {

    var self = this;

    $scope.startLoading = function (name) {
        $loading.start(name);
    };

    $scope.finishLoading = function (name) {
        $loading.finish(name);
    };

    self.currentImg = MediaService.ImportMediaBlobList[MediaService.SelectedMediaIndex];    //get selected image from service
    self.croppedImage = '';                                                                 //initial cropped image var
    /*------------------------------
    *   Apply button clicked
    -------------------------------*/
    self.applyCropping = function applyCropping() {
        // self.croppedImage = '';//this is the base64 encoded cropped image
        $scope.startLoading('loading-media');

        var id = MediaService.ImportMediaList[MediaService.SelectedMediaIndex].id;
        var base64_string = self.croppedImage.substring(self.croppedImage.search('base64,') + 7 , self.croppedImage.length);
        var content_type = MediaService.ImportMediaList[MediaService.SelectedMediaIndex].fileType;
        MediaService.CropImageAction (id , base64_string , content_type , function(response){
            if (response) {
                MediaService.ImportMediaBlobList[MediaService.SelectedMediaIndex] = self.croppedImage;
                $scope.finishLoading('loading-media');
                self.closeModal();
            }
        });
    }
    /*------------------------------------------------
    *   Close 'X' Button Click
    --------------------------------------------------*/
    self.closeModal = function closeModal(){

        modalInstance.get().close();    //close modal dialog

        if (param.fromWhere == "UPLOAD") {
            var modal = $uibModal.open({
                animation: true,
                templateUrl: 'views/partials/modals/uploadmedia-modal.html',
                controller: 'upLoadMediaCtrl',
                controllerAs: '$ctrl',
                size: 'medium-st',
                backdrop  : 'static',
                keyboard  : false,
                resolve : {
                    param: function () {
                        return {
                            'fromWhere' : 'CROP'
                        }
                    }
                }
            });
            modalInstance.set(modal);
        }   else if (param.fromWhere = 'EDIT') {
            var modal = $uibModal.open({
                animation: true,
                templateUrl: 'views/partials/modals/editmedia-modal.html',
                controller: 'editImageCtrl',
                controllerAs: '$ctrl',
                size: 'medium-st',
                backdrop  : 'static',
                keyboard  : false,
                resolve : {
                    param: function () {
                        return {
                            'fromWhere' : 'CROP'
                        }
                    }
                }
            });
            modalInstance.set(modal);
        }
    }
});
'use strict';

/*---------------------------------------------------
*   Edit Image Controller
*   Here you can get the editing image controller
----------------------------------------------------*/
angular.module('frontendApp').controller('editImageCtrl', function($http, $scope, $sce, $uibModal, modalInstance, MediaService, param) {

    var self = this;

    self.currentMediaDetail = {
        id : '' , title : '', time : '' , date : '' , location : '' , keywords : [] , description : ''
    }
    $scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
    }
    var id = MediaService.ImportMediaList[MediaService.SelectedMediaIndex].id;      //get id

    MediaService.GetMediaInfomation(id , function(response){                        //read detail from db using id
        if (response) {
            self.mediaType = response.data.mediaFileType;
            self.currentImgUrl = response.data.path.t3;             //set image url as thumb 600 - 400
            self.currentVideoUrl = response.data.path;

            self.dateshow = new Date();
            self.timeshow = new Date();

            var date_temp = new Date();
            date_temp = strToDate(response.data.userDate);
            //get selected media information
            self.currentMediaDetail.id = response.data.id;
            self.currentMediaDetail.title = response.data.title;
            self.currentMediaDetail.time = parseTime(date_temp);
            self.currentMediaDetail.date = date_temp;
            self.currentMediaDetail.location = response.data.location;
            self.currentMediaDetail.description = response.data.description;
            self.currentMediaDetail.keywords = response.data.keywords;

            // for (var i = 0; i < response.data.keywords.length; i++) {
            //     self.currentMediaDetail.keywords[i] = response.data.keywords[i];
            // }
            self.dateshow = date_temp;
            self.timeshow = date_temp;

        }
    });
    /*-------------------------------------
    *   Crope image on edit media modal
    --------------------------------------*/
    self.CropImage = function CropImage ($event) {
        modalInstance.get().close();

        var modal = $uibModal.open({
            animation: true,
            templateUrl: 'views/partials/modals/cropimage-modal.html',
            controller: 'cropImageCtrl',
            controllerAs: '$ctrl',
            size: 'medium-st',
            backdrop  : 'static',
            keyboard  : false ,
            resolve : {
                param: function () {
                    return {
                        'fromWhere' : 'EDIT'
                    }
                }
            }
        });
        modalInstance.set(modal);
    }
    /*------------------------------------------------
    *   Close 'X' Button Click
    --------------------------------------------------*/
    self.closeModal = function closeModal(){
        modalInstance.get().close();    //close modal dialog

        if (param.fromWhere) {
            var modal = $uibModal.open({
                animation: true,
                templateUrl: 'views/partials/modals/uploadmedia-modal.html',
                controller: 'upLoadMediaCtrl',
                controllerAs: '$ctrl',
                size: 'medium-st',
                backdrop  : 'static',
                keyboard  : false,
                resolve : {
                    param: function () {
                        return {
                            'fromWhere' : 'EDIT'
                        }
                    }
                }
            });
            modalInstance.set(modal);
        }
    }
    /*-------------------------------------------------------------------
    *   Save button click to save the edited media detail information
    --------------------------------------------------------------------*/
    self.SaveButtonClick = function SaveButtonClick() {

        self.currentMediaDetail.date = self.dateshow.getFullYear() + '/' + (self.dateshow.getMonth() + 1) + '/' + self.dateshow.getDate();
        self.currentMediaDetail.time = parseTime(self.timeshow);
        self.currentMediaDetail.keywords.splice(0 , 1);
        MediaService.UpdateMediaDetail(self.currentMediaDetail , function(response) {
            if (response) {
                self.closeModal();
            }
        });
    }
    /*------------------------------------------------
    *   Functions for Date Picker
    --------------------------------------------------*/
    self.flag_datepicker_opend = false;
    self.openDatepicker = function(){
    self.flag_datepicker_opend = true;
    }
    /*---------------------------------------
    *   Get Time string
    ---------------------------------------*/
    function parseTime(dateObj) {
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
    /*--------------------------------------------------------
    *   This function is convert date string to Date object
    ---------------------------------------------------------*/
    function strToDate(dateStr)
    {
        var dateTry = new Date(dateStr);

        if (!dateTry.getTime())
        {
            throw new Exception("Bad Date! dateStr: " + dateStr);
        }

        var tz = dateStr.trim().match(/(Z)|([+-](\d{2})\:?(\d{2}))$/);

        if (!tz)
        {
            var newTzOffset = dateTry.getTimezoneOffset() / 60;
            var newSignStr = (newTzOffset >= 0) ? '-' : '+';
            var newTz = newSignStr + ('0' + Math.abs(newTzOffset)).slice(-2) + ':00';

            dateStr = dateStr.trim() + newTz;
            dateTry = new Date(dateStr);

            if (!dateTry.getTime())
            {
                throw new Exception("Bad Date! dateStr: " + dateStr);
            }
        }

        return dateTry;
    }
});
