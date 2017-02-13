'use strict';
/**
 * @ngdoc function
 * @name frontendApp.controller:createnewstoryModalController
 * @description
 * # createnewstoryController
 * Controller of the frontendApp
 */

angular.module('frontendApp').controller('createnewstoryModalController', function (
    $http, $cookies, $uibModal, $rootScope, $scope , $sce , MediaService , modalInstance, globalStory ,APIConsole,
     StoryManager , MediaStoryService, Authentication , ModalInstanceStore , AdditionalService , param) {

    var self = this;

    var accessToken = $cookies.get('accessToken');   //Auth token
    self.createStoryErrorMessage = '';  //Error Message

    self.story = {title: '', location: '', dateshow: '' , date: '', time: '', keywords:  [], description: ''};

    //Check if there is story in the cookie...

    if (!$cookies.get('storyStore')) {
        globalStory.reset();
    }

    self.media_link = '';



    self.mediaList = [];


    /***************************Functions***********************************/
    /*---------------------------------------------------------
    *   Delete one story in the journal page
    *
    *   DeleteMedia : click delete button
    *   ConfirmDelete   : confirm delete action
    ---------------------------------------------------------*/

    self.DeleteMedia = function(media , event) {

      var $img_cont = $(event.target.parentNode).parent();
      $img_cont.find('.confirm-delete').slideDown();

    }

    self.ConfirmDelete = function(flag , media , event){

        if (flag === 'DELETE_STORY') {         //Delete this story

          var $img_cont = $(event.target.parentNode).parent();
          $img_cont.find('.confirm-delete').slideUp();

          var media_index_num = self.mediaList.indexOf(media);    //get media index num
          self.mediaList.splice(media_index_num , 1);             //delete media from imported array

        }   else if(flag === 'CANCEL_ACTION')    {       //No, cancel this action

          var $img_cont = $(event.target.parentNode).parent();
          $img_cont.find('.confirm-delete').slideUp();

        }   else    {

            console.log('Unknow error occured while binding');

        }
    }
    /****************************************************************************/


    var temp_story_value;

    var url_id = [];

    if (param.fromWhere) {
        temp_story_value = param.story;
    }   else    {
        temp_story_value = globalStory.get();
    }

    self.story.title = temp_story_value.title;
    self.story.location = temp_story_value.location;
    self.story.date = temp_story_value.date;
    self.story.time = temp_story_value.time;
    self.story.description = temp_story_value.description;
    self.story.keywords = [];

    if (param.date) {
      self.story.date = param.date;
    }


  for (var  i = 0; i < temp_story_value.keywords.length; i ++ ) {
        self.story.keywords[i] = temp_story_value.keywords[i];
    }
    if (self.story.date) {
        console.log(self.story.date);
        self.storydate = new Date(self.story.date);                         //display saved story date and time
        $scope.storytime = new Date('2016/1/1' + ' ' + self.story.time);
    }   else    {
        self.storydate = new Date();
        $scope.storytime = new Date();
    }

    /*------------------------------------------------
    *   Close 'X' Button Click
    *   close modal and no data stores in the browser
    --------------------------------------------------*/
    self.closeModal = function closeModal(){

        self.story.date = self.storydate.getFullYear() +'/' + (self.storydate.getMonth() + 1) + '/' + self.storydate.getDate();
        self.story.time = AdditionalService.parseTime($scope.storytime);

        globalStory.set(self.story);

        modalInstance.get().close();    //close modal dialog

    };
    /*-----------------------------------------------
    *   Cancel button click
    *   all the created date lost
    ------------------------------------------------*/
    self.cancelModal = function cancelModal(){
        globalStory.reset();
        modalInstance.get().close();
    };
    /*--------------------------------
    *   when user type title
    --------------------------------*/
    self.onTitleChange = function onTitleChange() {
        self.createStoryErrorMessage = '';
    };
    /*----------------------------------------
    *   Save Story Function
    ----------------------------------------*/
    self.saveStory = function(){

        self.story.date = self.storydate.getFullYear() +'/' + (self.storydate.getMonth() + 1) + '/' + self.storydate.getDate();
        self.story.time = AdditionalService.parseTime($scope.storytime);

        var tag_temp = [];

        for (var i = 0; i < self.story.keywords.length; i ++) {     //move keywords to 1x array
            tag_temp.push(self.story.keywords[i].keyword);
        }

        self.story.keywords.length = 0;
        self.story.keywords = tag_temp;

        globalStory.set(self.story);                                //set to globalstory

        if (!self.story.title) {
            self.createStoryErrorMessage = 'Please give a title to your story and then click SAVE to create';
            $('#title-input').focus();
        }   else    {
            self.createStoryErrorMessage = '';
            if (!accessToken) {
                console.log('Please login to save your story, current state will save to cookie.');
                // globalStory.set(self.story);    //call set function of globalstory to save to cookie
                self.closeModal();
                self.openSavedStoryModal();
            }   else    {
                StoryManager.SaveStoryAction(self.story , function(response){
                    if (response) {
                        modalInstance.get().close();    //close modal dialog
                        $rootScope.finish_flag = true;
                        var success_count = 0;
                        for (var i = 0; i < self.mediaList.length; i++) {
                            StoryManager.LinkStoryWithMedia(StoryManager.saved_id , self.mediaList[i].id , function(response) {
                                if (response) {
                                    success_count ++;
                                }
                            });
                        }
                        var scrollInterval = setInterval(function(){
                            if ( success_count == self.mediaList.length ) {

                                clearInterval(scrollInterval);
                                StoryManager.UpdateService(StoryManager.saved_id , function(res) {

                                    SpliceStory(Date.parse(StoryManager.updated_story.userDate).getTime()/1000);

                                    self.story = AdditionalService.parseStoryObject(StoryManager.updated_story);

                                    var string = StoryManager.updated_story.userDate.slice(0 , StoryManager.updated_story.userDate.length);

                                    var date_obj = new Date(string);

                                    self.story.date = date_obj.getFullYear() +'/' + (date_obj.getMonth() + 1) + '/' + date_obj.getDate();
                                    self.story.time = self.story.userDate.time;
                                    globalStory.set(self.story);

                                    $cookies.remove('storyStore');
                                    self.openSavedStoryModal();
                                });

                            }

                        },15);
                    }
                });
            }
        }
    };
    /*-----------------------------------
    *   open saved story modal dialog
    -----------------------------------*/
    self.openSavedStoryModal = function(){
        var modal = $uibModal.open({
            animation: true,
            templateUrl: 'views/partials/modals/createdstory-modal.html',
            controller: 'createdstoryModalController',
            controllerAs: '$ctrl',
            size: 'medium-st',
            backdrop  : 'static',
            keyboard  : false,
        });
        modalInstance.set(modal);
    };
    /*--------------------------------
    *   Date Picker
    --------------------------------*/
    self.flag_datepicker_opend = false;
    self.openDatepicker = function(){
        self.flag_datepicker_opend = true;
    };
    /*---------------------------------
        Import Images from FaceBook
    -------------------------------- */
    self.ImportImageFromFB = function() {

      var isLoggedIn = Authentication.isLoggedIn();

      if (!isLoggedIn) {
        self.createStoryErrorMessage = 'Please login to access your StoryThat Gallery';
      } else {

        if (!self.story.title) {
          self.createStoryErrorMessage = 'Please give a title to your story and then click SAVE to create';
          $('#title-input').focus();
        } else {
          self.story.date = self.storydate.getFullYear() + '/' + (self.storydate.getMonth() + 1) + '/' + self.storydate.getDate();
          self.story.time = AdditionalService.parseTime($scope.storytime);
          self.cancelModal();

            var modal = $uibModal.open({
                animation: true,
                templateUrl: 'views/partials/modals/import_fromFB-modal.html',
                controller: 'ImageFromFBCtrl',
                controllerAs: '$ctrl',
                size: 'medium-st' ,
                backdrop : 'static' ,
                keyboard : false ,
                resolve : {
                    param : function() {
                        return {'story' : self.story};
                    }
                }
            });
            modalInstance.set(modal);
        }
      }
    };
    /*-------------------------------
    *   Import Images from Gallery
    --------------------------------*/
    self.ImportImageFromGallery = function() {

        var isLoggedIn = Authentication.isLoggedIn();
        if (!isLoggedIn) {
            self.createStoryErrorMessage = 'Please login to access your StoryThat Gallery';
        }   else    {

            if (!self.story.title) {
                self.createStoryErrorMessage = 'Please give a title to your story and then click SAVE to create';
                $('#title-input').focus();
            }   else    {

                self.story.date = self.storydate.getFullYear() +'/' + (self.storydate.getMonth() + 1) + '/' + self.storydate.getDate();
                self.story.time = AdditionalService.parseTime($scope.storytime);
                self.cancelModal();

                var modal = $uibModal.open({
                    animation: true,
                    templateUrl: 'views/partials/modals/import_fromgallery-modal.html',
                    controller: 'ImagefromgalleryModalController',
                    controllerAs: '$ctrl',
                    size: 'medium-st',
                    backdrop  : 'static',
                    keyboard  : false,
                    resolve: {
                      param: function () {
                        return {'story': self.story};
                      }
                    }
                });
                modalInstance.set(modal);
            }
        }
     };
    /*-------------------------------------
    *   Upload link of media to story
    -------------------------------------*/
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
    /*-------------------------------
    *   Import Images from Device
    --------------------------------*/
    self.ImportImageFromDevice = function() {

        // story title validation check

        var isLoggedIn = Authentication.isLoggedIn();
        if (!isLoggedIn) {
            self.createStoryErrorMessage = 'Please login to access your StoryThat Gallery';
        }   else    {

            if (!self.story.title) {
                self.createStoryErrorMessage = 'Please give a title to your story and then click SAVE to create';
                $('#title-input').focus();
            }   else    {

                self.story.date = self.storydate.getFullYear() +'/' + (self.storydate.getMonth() + 1) + '/' + self.storydate.getDate();
                self.story.time = AdditionalService.parseTime($scope.storytime);
                self.cancelModal();

                var modal = $uibModal.open({
                    animation: true,
                    templateUrl: 'views/partials/modals/import_fromdevice-modal.html',
                    controller: 'ImagefromdeviceModalController',
                    controllerAs: '$ctrl',
                    size: 'medium-st',
                    backdrop  : 'static',
                    keyboard  : false,
                    resolve: {
                      param: function () {
                        return {'story': self.story};
                      }
                    }
                });
                modalInstance.set(modal);
            }
        }
     };
    function SpliceStory(val) {

        $rootScope.journal_updated = true;

    }

    $scope.$watch('storytime', function (newValue, oldValue) {
      if (!angular.equals(newValue, oldValue)) {
        console.log('create Time is ', newValue);
      }
    });
    /*-------------------------------------------------------------
    *   Change video url as readable remove all security token
    -------------------------------------------------------------*/
    $scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
    };
    self.checkURL = function (url) {
        return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
    }
});
