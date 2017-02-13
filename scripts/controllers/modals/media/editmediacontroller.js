'use strict';

/*---------------------------------------------------
*   Edit Image Controller
*   Here you can get the editing image controller
----------------------------------------------------*/
angular.module('frontendApp').controller('EditMediaController', function($http, $scope, $rootScope, $sce, $loading, ModalInstanceStore, param , modalInstance , MediaService) {

    var self = this;

    var temp_title = '';                        //get saved title

    self.detail = [];

    self.currentMediaDetail = {
        id : '' , title : '', time : '' , date : '' , location : '' , keywords : [] , description : ''
    }

    var id = '';

    if (MediaService.fromWhere === 'GALLERY') {
        
        id = MediaService.mediaId;
        MediaService.fromWhere = '';

    }   else    {
        
        id = MediaService.ImportMediaList[MediaService.SelectedMediaIndex].id;      //get id
    
    }

// dw-loading bar initial
    $scope.startLoading = function (name) {
        $loading.start(name);
    };

    $scope.finishLoading = function (name) {
        $loading.finish(name);
    };    


    $scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
    };

    $scope.startLoading('loading-media-info');
    MediaService.GetMediaInfomation(id , function(response){                        //read detail from db using id
        if (response) {
            console.log(response);
            self.mediaType = response.data.mediaFileType;
            self.currentImgUrl = response.data.path.t3;             //set image url as thumb 600 - 400
            self.currentVideoUrl = response.data.path;

            self.dateshow = new Date();
            self.timeshow = new Date();

            var date_temp = new Date();
            date_temp = strToDate(response.data.userDate);

            //get selected media information
            temp_title = response.data.title;
            self.currentMediaDetail.id = response.data.id;
            self.currentMediaDetail.title = response.data.title;
            self.currentMediaDetail.time = parseTime(date_temp);
            self.currentMediaDetail.date = date_temp;
            self.currentMediaDetail.location = response.data.location;
            self.currentMediaDetail.description = response.data.description;
            self.currentMediaDetail.keywords = response.data.keywords;
            self.dateshow = date_temp;
            self.timeshow = date_temp;

            self.detail = response.data;
            $scope.finishLoading('loading-media-info');
        }
    });

    /*------------------------------------------------
    *   Close 'X' Button Click
    --------------------------------------------------*/
    self.CloseModal = function (){
        modalInstance.get().close();

    }
    /*-------------------------------------------------------------------
    *   Save button click to save the edited media detail information
    --------------------------------------------------------------------*/
    self.SaveButtonClick = function SaveButtonClick() {
        $scope.startLoading('loading-media-info');
        self.currentMediaDetail.date = self.dateshow.getFullYear() + '/' + (self.dateshow.getMonth() + 1) + '/' + self.dateshow.getDate();
        self.currentMediaDetail.time = parseTime(self.timeshow);
        for (var i = 1; i < self.currentMediaDetail.keywords.length; i++) {
            self.currentMediaDetail.keywords[i].id = self.currentMediaDetail.id;
        }
        self.currentMediaDetail.keywords.splice(0 , 1);
        var keywords = [];
        for (var i = 0; i < self.currentMediaDetail.keywords.length; i++){
            keywords.push(self.currentMediaDetail.keywords[i].keyword);
        }
        self.currentMediaDetail.keywords.length = 0;
        self.currentMediaDetail.keywords = keywords;
        MediaService.UpdateMediaDetail(self.currentMediaDetail , function(response) {
            if (response) {
                MediaService.GetMediaInfomation(id , function(response) {

                    if (response) {
                        MediaService.editMedia_info.success = true;
                        MediaService.editMedia_info.media = response.data;
                        $rootScope.myGallery[param.index] = response.data;
                        $scope.finishLoading('loading-media-info');
                        self.CloseModal();

                    }

                });
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

        if (!dateStr) {
            return new Date();
        }

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
