'use strict';

/****************************************************************/
/*				Here goes some custom services					*/
/****************************************************************/
angular.module('frontendApp')
  .service('AdditionalService', function () {

  	var self = this;
    /*---------------------------------------
    *   Get Time string
    *	Output : 04:02
    ---------------------------------------*/
    self.parseTime = function parseTime(dateObj) {
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
    };
    /*-----------------------------------------------------
    *   Get Date and time string from userDate parameter
    *       input   : 2016-09-09T11:08:00-0400
    *       output  : date = 'Fri 19 Feb 2016'
    *                 time = '05:55'
    ------------------------------------------------------*/
    self.parseDateTime = function parseDateTime (dateStr) {

        var date_obj = new Date(dateStr);

        var time = '';

        var unix_time = Date.parse(dateStr).getTime()/1000;

        if (date_obj.getHours() < 10) {
            time = '0' + date_obj.getHours();
        }   else    {
            time = date_obj.getHours();
        }

        time += ':';

        if (date_obj.getMinutes() < 10) {
            time += '0' + date_obj.getMinutes();
        }   else    {
            time += date_obj.getMinutes();
        }


        var string_weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        var string_month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        var date = string_weekday[date_obj.getDay()] + ' ' + date_obj.getDate() + ' ' + string_month[date_obj.getMonth()] + ' ' + date_obj.getFullYear();

        return {
            date : date,
            time : time,
            unix : unix_time
        };
    };
    /*---------------------------------------------------------
    *   Push user friendly converted story element to array
    ---------------------------------------------------------*/
    self.parseStoryObject = function parseStoryObject (native_story_obj) {
        if (native_story_obj.description === '') {
            native_story_obj.description = "You have not added any text to your story. Use 'Edit' button to add text, photos, videos to your story or to make anyother changes";
        }
        return {
            $$hashKey : native_story_obj.$$hashKey,
            createdDate : native_story_obj.createdDate,
            description : native_story_obj.description,
            id : native_story_obj.id,
            keywords : native_story_obj.keywords,
            mediaFiles : native_story_obj.mediaFiles,
            location : native_story_obj.location,
            title : native_story_obj.title,
            user : native_story_obj.user,
            privacy : native_story_obj.privacy,
            userDate : self.parseDateTime(native_story_obj.userDate)
        };
    };
});
