'use strict';

angular.module('frontendApp').controller('createdstoryModalController', function (
    $rootScope ,$scope , $cookies, $uibModal, $sce,$window , modalInstance, globalStory, Authentication, StoryManager , AdditionalService) {

    var self = this;

    self.story = {title: '', location: '', date: '', time: '', keywords:  [], description: ''};

    var temp_story_value = globalStory.get();
	
    self.story.title = temp_story_value.title;
    self.story.location = temp_story_value.location;
    self.story.date = temp_story_value.date;
    self.story.time = temp_story_value.time;
    self.story.description = temp_story_value.description;
    self.story.keywords = [];
    for (var i = 0; i < temp_story_value.keywords.length; i++) {
        self.story.keywords[i] = temp_story_value.keywords[i];
    }
    self.storyDate = new Date(self.story.date);                         //display saved story date and time
    $scope.storytime = new Date('2016/1/1' + ' ' + self.story.time);   

    self.str_displayDate = AdditionalService.parseDateTime(self.story.date + ' ' + self.story.time);


    self.story.id = temp_story_value.id;
    self.story.mediaFiles = temp_story_value.mediaFiles;
    console.log(temp_story_value.mediaFiles);

    if (!self.story.description) {
      self.story.description = "You have not added any text to your story. Use 'Edit' button to add text, photos, videos to your story or to make anyother changes";
    }
    var accessToken = $cookies.get('accessToken');    
    self.loggedIn = false;
    if (accessToken) {
        self.loggedIn = true;
    }
    /*--------------------------------------
    *	  Open Register Modal for log in
    --------------------------------------*/
   	self.openRegisterModal = function openRegisterModal() {
        var modal = $uibModal.open({
            animation: true,
            templateUrl: 'views/partials/modals/login-modal.html',
            controller: 'loginModalController',
            controllerAs: '$ctrl',
            size: 'tiny-st',
            backdrop  : 'static',
            keyboard  : false,            
        });
        self.closeModal();
        modalInstance.set(modal);
   	}
    /*-----------------------------------
    *   Edit Story and clicked save
    -----------------------------------*/
    self.EditSave = function onEditSave() {
        self.story.date = self.storyDate.getFullYear() +'/' + (self.storyDate.getMonth() + 1) + '/' + self.storyDate.getDate();
        self.story.time = AdditionalService.parseTime($scope.storytime);

        var tag_temp = [];
        if (!$cookies.get('accessToken')) {
            for (var i = 0; i < self.story.keywords.length; i++) {
                tag_temp.push(self.story.keywords[i].keyword);
            }
        }   else    {
            for (var i = 1; i < self.story.keywords.length; i++) {
                tag_temp.push(self.story.keywords[i].keyword);
            }
        }

        self.story.keywords = tag_temp;
        globalStory.set(self.story);
        
        if (!self.story.title) {
            // self.createStoryErrorMessage = 'Please give a title to your story and then click SAVE to create';
        }   else    {
            // self.createStoryErrorMessage = '';
            if (!accessToken) {
                console.log('Please login to save your story, current state will save to cookie.' ,self.story);
                globalStory.set(self.story);    //call set function of globalstory to save to cookie
                self.closeModal();
                self.openSavedStoryModal();
            }   else    {
                StoryManager.UpdateStoryAction(self.story , StoryManager.saved_id ,  function(response){
                    if (response) {

                        self.story = AdditionalService.parseStoryObject(StoryManager.updated_story);

                        var string = StoryManager.updated_story.userDate.slice(0 , StoryManager.updated_story.userDate.length - 8);

                        var date_obj = new Date(string);

                        self.story.date = date_obj.getFullYear() +'/' + (date_obj.getMonth() + 1) + '/' + date_obj.getDate();
                        self.story.time = self.story.userDate.time;

                        globalStory.set(self.story);

                        $cookies.remove('storyStore');                        
                        self.closeModal();
                        self.openSavedStoryModal();
                        // $rootScope.myStories.splice(0, 0 , StoryManager.updated_story);
                    }
                });
            }
        }
    }
   	/*-------------------------------------
   	*	  Login with facebook and save 
   	* 	story
   	-------------------------------------*/
   	self.facebookLogin = function facebookLogin() {
        FB.login(function(facebookOauth) {
            if(facebookOauth.status === 'connected'){
                Authentication.FaceBookSignInAction(facebookOauth.authResponse.accessToken , function(response){
                    if (response) {
                        StoryManager.SaveStoryAction(self.story , function(response){
                          $window.location = "/#/my_journal";
                          $window.location.reload();
                        });                        
                    }
                });
            }
        });
   	}
    /*--------------------------------------
    *   Login with google and save story
    --------------------------------------*/
   	self.googleLogin = function googleLogin() {
        googleAuth.signIn().
            then(function(res){
                var user = googleAuth.currentUser.get();
                var googleAccessToken = user.getAuthResponse().id_token;
                Authentication.GoogleSignInAction(googleAccessToken , function(response){
                    if (response) {                        
                        StoryManager.SaveStoryAction(self.story , function(response){
                          $window.location = "/#/my_journal"; //route to my journal page
                          $window.location.reload();
                        });
                   }
                });
            });      
   	}
    /*---------------------------------------------------------
    *   Delete one story in the journal page
    *   
    *   DeleteThisStory : click delete button
    *   ConfirmDelete   : confirm delete action
    ---------------------------------------------------------*/
    self.DeleteCreatedStory = function($event){
        event.stopPropagation();

        var $containerGall = $(event.target.parentNode).parent().parent();
        $containerGall.find('.confirm-prompt-dialog').show();
    }

    self.ConfirmDelete = function(flag , story , $event){
        event.stopPropagation();

        if (flag === 'DELETE_STORY') {         //Delete this story

            if ($cookies.get(accessToken)) {    //check user info token and if user logged in ... delete story and remove from showing array
                StoryManager.DeleteStoryAction(StoryManager.saved_id , function(response){
                    if (response) {
                        $rootScope.myStories.splice(0 , 1);     //remove created story from showing array
                        modalInstance.get().close();            //close modal dialog
                    }
                })                
            }   else    {                                       //check user info token and if user didn't logged in yet.... remove cookie and hide modal
                $cookies.remove('storyStore');
                modalInstance.get().close();                    //close modal dialog
            }

        }   else if(flag === 'CANCEL_ACTION')    {       //No, cancel this action

            var $containerGall = $(event.target.parentNode).parent().hide(); 

        }   else    {

            console.log('Unknow error occured while binding');

        }
    }
    /*-------------------------
    *   Close Modal
    -------------------------*/
    self.closeModal = function closeModal(){
        if ($cookies.get('accessToken')){
            $cookies.remove('storyStore');
        }
        modalInstance.get().close();
    }
    self.CloseModal = function CloseModal() {
        self.closeModal();
        self.openSavedStoryModal();
    }
    /*-----------------------------
    *   Open Edit story Modal
    ------------------------------*/
    self.openEditModal = function openEditModal() {
        var modal = $uibModal.open({
            animation: true,
            templateUrl: 'views/partials/modals/editstory-modal.html',
            controller: 'createdstoryModalController',
            controllerAs: '$ctrl',
            size: 'medium-st',
            backdrop  : 'static',
            keyboard  : false,            
        });
        self.closeModal();
        modalInstance.set(modal);     
    }
    /*-------------------------------
    *   Open Created Story Modal
    -------------------------------*/
    self.openSavedStoryModal = function openSavedStoryModal() {
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
    }
    /*-------------------------
    *   Append Edit area
    --------------------------*/
    self.appendEdit = function(event) {
        if ($('#edit-story-append').css('display') == 'none') {
            $('#edit-story-append').css('display', 'block'); 
            $('#appendid1').find('.story-content').addClass('gradient-bottom');
            $('#appendid1').find('.story-inner').addClass('options-open');
        }
        else {
            $('#edit-story-append').css('display', 'none'); 
            $('#appendid1').find('.story-content').removeClass('gradient-bottom');
            $('#appendid1').find('.story-inner').removeClass('options-open');
        }        
    }
    self.flag_datepicker_opend = false;
    self.openDatepicker = function(){
        self.flag_datepicker_opend = true;
    }    
    $scope.$watch('storytime', function (newValue, oldValue) {
      if (!angular.equals(newValue, oldValue)) {
      }
    });
    /*-------------------------------------------------------------
    *   Change video url as readable remove all security token
    -------------------------------------------------------------*/
    $scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
    };    
});
