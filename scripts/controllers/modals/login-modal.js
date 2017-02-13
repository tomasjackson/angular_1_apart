'use strict';

angular.module('frontendApp').controller('loginModalController', function loginModalController($http, $state, $cookies, $window, $scope ,modalInstance, Authentication, globalStory , StoryManager) {

        /*-----------------------------
        *   Hide/Show Forgot Password
        ------------------------------*/
        this.forgot = function forgot(){
            $('#home').addClass('active');
            $('.login-default').addClass('hide');
            $('.enter-code').addClass('hide');
            $('.forgot-password-reset').removeClass('hide');
            // $('#register').addClass('hide');

        };
        // Initialization
        $scope.onKeyDownResult = "";
        $scope.onKeyUpResult = "";
        $scope.onKeyPressResult = "";

        // Utility functions

        var getKeyboardEventResult = function (keyEvent, keyEventDesc)
        {
            if (keyEventDesc === 'Key down') {
                if (keyEvent.keyCode == 13) {
                    self.doLogin();
                }
            }

            return keyEventDesc + " (keyCode: " + (window.event ? keyEvent.keyCode : keyEvent.which) + ")";
        };

        // Event handlers
        $scope.onKeyDown = function ($event) {
          $scope.onKeyDownResult = getKeyboardEventResult($event, "Key down");
        };

        $scope.onKeyUp = function ($event) {
          $scope.onKeyUpResult = getKeyboardEventResult($event, "Key up");
        };

        $scope.onKeyPress = function ($event) {
          $scope.onKeyPressResult = getKeyboardEventResult($event, "Key press");
        };

        /*-----------------------------
        *   Variables declaration
        ------------------------------*/
        var self = this;
        self.flag_RememberMe = false;
        self.resetcode = '';
        self.flag_new_email = false;
        self.flag_new_usr = false;
        self.flag_new_pwd = false;
        self.flag_accept_term = false;
        self.loginSuccessMessage = '';
        self.loginErrorMessage = '';
        self.codeErrorMessage = 'Please enter a valid code.';
        self.resetPasswordErrorMessage = 'Password does not match.';
        self.resetPasswordSuccessMessage = '';
        self.registrationEmailErrorMessage = 'Please enter a valid email';
        self.registrationUsernameErrorMessage = 'Username must be at least 4 characters';
        self.registrationErrorMessage = '';
        self.registration = {email: '', username: '', password: ''};
        self.login = {email: '', password: ''};
        self.accessToken = '';
        self.login.email = $cookies.get('cur_email');
        self.email_existing = false;
        /*-------------------------
        *   Close button click
        -------------------------*/
        self.closeModal = function closeModal(){
            modalInstance.get().close();
        };
        /*-------------------------
        *   Login button click
        -------------------------*/
        self.doLogin = function doLogin(){
            if (self.flag_RememberMe) {
                var now = new Date();
                var expire_date = new Date(now.getFullYear() + 1 , now.getMonth() + now.getDate());
                $cookies.put('cur_email' , self.login.email , {expires : expire_date});
            }
            if (!this.login.email) {
                self.loginSuccessMessage ='';
                self.loginErrorMessage = 'Please enter your email or username.';
            }   else if (!this.login.password) {
                self.loginSuccessMessage = '';
                self.loginErrorMessage = 'Please enter your pasword to login.';
            }   else {
                // var ret = self.validateEmail(this.login.email);
                // self.loginErrorMessage = 'Email address error!';
                // if (ret)    {
                    Authentication.LoginAction(this.login.email , this.login.password, function(response){
                        if(!response) {
                            self.loginSuccessMessage = '';
                            self.loginErrorMessage = Authentication.message_001;
                        }   else    {
                            console.log($cookies.get('storyStore'));
                            if ($cookies.get('storyStore')) {
                                StoryManager.SaveStoryAction(globalStory.get() , function(response){
                                    if (response) {
                                        console.log('cached story saved successfully');
                                    }
                                });
                                self.closeModal();
                                $state.go('mainPage.myJournal');
                            }   else {
                                self.closeModal();
                                $state.go('mainPage.myJournal');
                            }
                        }
                    });
                // }
            }
        };
        /*-----------------------------
        *   Reset Email button click
        ------------------------------*/
        self.resetPassSubmit = function resetPassSubmit(){
            var forgotPassword_container = $('.forgot-password-reset');     //get instance of forgot password
            if(!self.validateEmail(this.forgot.email)){     //validation check
                self.resetErrorMessage = 'Please enter a valid email address';  //set error message
                self.throwValidationError(forgotPassword_container , false);    //show error message
            }
            else{
                Authentication.ForgotPasswordAction(this.forgot.email, function(response){  //run service
                    if (!response) {
                        self.resetErrorMessage = Authentication.message_003;    //get error message
                        self.throwValidationError(forgotPassword_container , false);    //show error message
                    }   else    {
                        $('.enter-code').removeClass('hide');
                        $('.forgot-password-reset').addClass('hide');
                    }
                });
            }
        };
        /*----------------------------------------
        *   hide error message when typing
        -------------------------------------------*/
        self.resetPassHideErr = function resetPassHideErr(){
            $('.forgot-password-reset .validation-wrong').hide();
        };
        /*-----------------------------------------------------
        *   Back to login button clicked-forgotpassword modal
        ------------------------------------------------------*/
        self.backToLogin = function backToLogin(){
            $('.login-default').removeClass('hide');
            $('.forgot-password-reset').addClass('hide');
        };
        /*----------------------------------------------
        *   Cancel Forgot password dialog
        ----------------------------------------------*/
        self.cancelReset = function cancelReset(){
            $('.enter-code').addClass('hide');
            $('.login-default').removeClass('hide');
            $('.password-reset-form').addClass('hide');
        };
        /*------------------------------------------
        *   Check the reset password checking code
        -------------------------------------------*/
        self.signInCode = function signInCode(){
            // input_val = $('.enter-code input').val();
            var $input_val = this.resetcode;
            if($input_val.trim() === ''){ $('.enter-code .validation-wrong').show();
            }   else    {
                Authentication.CheckResetCodeAction(this.resetcode , function(response){
                    if (!response) {
                        self.codeErrorMessage = Authentication.message_003;
                        $('.enter-code .validation-wrong').show();
                    }   else    {
                        $('.enter-code').addClass('hide');
                        $('.enter-code .validation-wrong').hide();
                        $('.password-reset-form').removeClass('hide');
                    }
                });
            }
        };
        /*--------------------------------------
        *   Rest password button clicked
        --------------------------------------*/
        self.resetPasswordBtn = function resetPasswordBtn(){

            if(this.newPassword1 != this.newPassword2){
                $('.new-password-confirm-validation').show();   //check new pass is same as confirm
            }else{
                $('.new-password-confirm-validation').hide();   //if same hide error message
                Authentication.ResetPasswordAction(this.resetcode , this.newPassword1 , function(response){     //call service
                    if (!response) {                                                                            //if fail
                        self.resetPasswordErrorMessage = Authentication.message_003;
                        self.resetPasswordSuccessMessage = '';
                        $('.new-password-confirm-validation').show();
                        $('.new-password-success').hide();                                                      //show error message
                    }   else    {
                        self.resetPasswordSuccessMessage = Authentication.message_000;                          //if success
                        self.resetPasswordErrorMessage = '';                                                    //show success message
                        self.loginSuccessMessage = 'You have successfully changed your password! Please login with your new password.'
                        self.loginErrorMessage = '';
                        $('.new-password-confirm-validation').hide();
                        $('.new-password-success').show();
                        self.cancelReset();
                    }
                });
            }
        };
        /*---------------------------------
        *   Signin with google.com
        ----------------------------------*/
        self.signInGmail = function signInGmail(){
            googleAuth.signIn().
                then(function(res){
                    var user = googleAuth.currentUser.get();
                    var googleAccessToken = user.getAuthResponse().id_token;
                    Authentication.GoogleSignInAction(googleAccessToken , function(response){
                        if (response) {
                            if ($cookies.get('storyStore')) {
                                StoryManager.SaveStoryAction(globalStory.get() , function(response){
                                  $window.location = "/#/my_journal";
                                  $window.location.reload();
                                });
                            }   else {
                                $window.location = "/#/my_journal"; //route to my journal page
                                $window.location.reload();
                            }
                       }
                    });
                });
        };
        /*------------------------------------------
        *   Sign in with Facebook.com
        -------------------------------------------*/
        self.signInFB = function signInFb(){
            FB.login(function(facebookOauth) {
                if(facebookOauth.status === 'connected'){
                    Authentication.FaceBookSignInAction(facebookOauth.authResponse.accessToken , function(response){
                        if (response) {
                            if ($cookies.get('storyStore')) {
                                StoryManager.SaveStoryAction(globalStory.get() , function(response){
                                  $window.location = "/#/my_journal";
                                  $window.location.reload();
                                });
                            }   else {
                                $window.location = "/#/my_journal"; //route to my journal page
                                $window.location.reload();
                            }
                       }
                    });
                }

            });
        };
        /*-----------------------------------
        *   Register new account
        ------------------------------------*/
        self.doRegister = function doRegister(){
            var registeration_email_container = $('.privacy-select');
            if (!this.registration.email || !this.registration.username || !this.registration.password) {
                self.registrationErrorMessage = 'All the fields are required.';
                self.throwValidationError(registeration_email_container , false);
            }   else    {
                if (self.flag_new_email && self.flag_new_usr && self.flag_new_pwd) {
                    if (!self.flag_accept_term) {
                        self.registrationErrorMessage = 'Please accept the terms of use to continue';
                        self.throwValidationError(registeration_email_container , false);
                    }   else    {
                        Authentication.ReigisterNewAccountAction(self.registration.email , self.registration.username , self.registration.password , function(response){
                            if (!response) {
                                self.registrationErrorMessage = Authentication.message_003;
                                self.throwValidationError(registeration_email_container , false);
                            }   else    {
                                $cookies.remove('accessToken');
                                Authentication.LoginAction(self.registration.email , self.registration.password, function(response){
                                    if(!response) {
                                        self.registrationErrorMessage = 'Server is busy now....'    ;
                                        self.throwValidationError(registeration_email_container , false);
                                    }   else    {
                                        if ($cookies.get('storyStore')) {
                                            StoryManager.SaveStoryAction(globalStory.get() , function(response){
                                                if (response) {
                                                    console.log('cached story saved successfully');
                                                }
                                            });
                                            self.closeModal();
                                            $state.go('mainPage.myJournal');
                                        }   else {
                                            self.closeModal();
                                            $state.go('mainPage.myJournal');
                                        }
                                    }
                                });
                            }
                        });
                    }
                }
            }
        };
        /*-----------------------------------
        *   Validation check - email address
        ------------------------------------*/
        self.validateEmail = function validateEmail(email) {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        };
         /*-------------------------------
         *  Show/Hide validation message
         *  @param : errorContainer
         *  @param : isValid
         --------------------------------*/
        self.throwValidationError = function throwValidationError(errorContainer, isValid){
            if(isValid){
                errorContainer.find('.validation-wrong').css('display','none');
                errorContainer.find('.validation-ok').css('display','block');
            }else{
                errorContainer.find('.validation-ok').css('display','none');
                errorContainer.find('.validation-wrong').css('display','block');
            }
            errorContainer.find('.validation-wrap').slideDown('fast');
        };
        /*-----------------------------------
        *   Validation check - signUp
        *   Email
        ------------------------------------*/
        self.registrationEmailValidate = function registrationEmailValidate(event) {
            self.email_existing = false;
            event.stopPropagation();
            var inputContainer = $("#registrationEmail");
            self.flag_new_email = self.validateEmail(this.registration.email);
            if (self.flag_new_email) {
                Authentication.CheckEmailInDB(this.registration.email , function(response){
                    if (!response) {
                        self.registrationEmailErrorMessage = '';
                        self.throwValidationError( inputContainer, true );
                    }   else    {
                        self.registrationEmailErrorMessage = '';
                        self.email_existing = true;
                        inputContainer.find('.validation-ok').css('display' , 'none');
                        inputContainer.find('.validation-wrong').css('display' , 'none');
                    }
                });
            }   else    {
                self.registrationEmailErrorMessage = 'Please enter a valid email';
                self.throwValidationError( inputContainer, self.flag_new_email );

            }
        };
        /*-----------------------------------
        *   Validation check - signUp
        *   username
        ------------------------------------*/
        self.registrationUsernameValidate = function registrationUsernameValidate(event){
            event.stopPropagation();
            var minCharacters = 4;
            var inputContainer = $("#registrationUsername");
            self.flag_new_usr = ( this.registration.username.length >= minCharacters );
            if (self.flag_new_usr) {
                Authentication.CheckUsernameInDB(this.registration.username , function(response){
                    if (!response) {
                        self.registrationUsernameErrorMessage = '';
                        self.throwValidationError(inputContainer , true);
                    }   else    {
                        self.registrationUsernameErrorMessage = 'That username is already in use. Try another?';
                        self.throwValidationError(inputContainer , false);
                    }
                });
            }   else    {
                self.registrationUsernameErrorMessage = 'Username must be at least 4 characters';
                self.throwValidationError( inputContainer, self.flag_new_usr );
            }
        };
         /*-----------------------------------
        *   Validation check - signUp
        *   password
        ------------------------------------*/
        self.registrationPasswordValidate = function registrationPasswordValidate(event){
            event.stopPropagation();
            var minCharacters = 6;
            var inputContainer = $("#registrationPassword");
            self.flag_new_pwd = ( this.registration.password.length >= minCharacters );
            self.throwValidationError( inputContainer, self.flag_new_pwd );
        };
        /*-----------------------------------
        *   Check password strength
        ------------------------------------*/
        self.signUpPassInput = function(){
            this.checkPassStrength(self.registration.password, '#reg-pass-strength-word', '#reg-pass-strength-bar');
        };

        self.newPassInput = function newPassInput(){
            if(self.newPassInput != '') {
                $('.new-password-validation').hide();
            }else{
                $('.new-password-validation').show();
                $('#pass-strength-bar').removeClass('medium hard weak')
            }
            this.checkPassStrength(this.newPassword1, '#pass-strength-word', '#pass-strength-bar');
        };

        self.checkPassStrength = function(password, wordContainer, barContainer){
            var $val = password;
            var $strength = 1;
            var $number = $val.match(/\d+/g);
            var $spec_char = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/);
            if ($number != null) {
                $strength++;
            }
            if($spec_char.test($val)){
                $strength++;
            }
            if($strength == 1){
                $(wordContainer).text('Weak');
                $(barContainer).removeClass('medium hard').addClass('weak');
            }else if($strength == 2){
                $(wordContainer).text('Medium');
                $(barContainer).removeClass('weak hard').addClass('medium');
            }else if($strength == 3){
                $(wordContainer).text('Strong');
                $(barContainer).removeClass('medium weak').addClass('hard');
            }
        };

        /*------------------------------------------
        *   Accept term and condition , privacy
        -------------------------------------------*/
        self.stCheckbox = function stCheckbox(event){

            var $element = $(event.target);
            $element.toggleClass('checked');
            if (!self.flag_accept_term) {
                self.flag_accept_term = true;
                self.registrationErrorMessage = '';
            }   else    {
                self.flag_accept_term = false;
            }
        };

        /*------------------------------------------------------
        *   Lost focus of email and password on login modal
        ------------------------------------------------------*/
        self.lostFocusLoginEmail = function lostFocusLoginEmail(){
            self.loginErrorMessage = '';
            self.loginSuccessMessage = '';
        };

        self.lostFocusLoginPassword = function lostFocusLoginPassword(){
            self.loginErrorMessage = '';
            self.loginSuccessMessage = '';
        };

        self.onLoading = function onLoading(){
            if (Authentication.forgotPasswordVerify) {
                $('.login-default').addClass('hide');
                $('.enter-code').removeClass('hide');
                $('.forgot-password-reset').addClass('hide');
                Authentication.forgotPasswordVerify = false;
            }
        }
});
