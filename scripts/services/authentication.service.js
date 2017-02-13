'use strict';

/*-----------------------------
	Message Map
000 : Success
001 : Login Failure
002 : Logout Failure
------------------------------*/
// Authentication Service


angular.module('frontendApp').service('Authentication', function ($cookies , $http , $window , APIConsole){

	var self = this;	//set instance to self

    self.message_000 = '';
    self.message_001 = '';
    self.message_002 = '';
    self.message_003 = '';
    self.forgotPasswordVerify = false;

    self.UserInfo = [];
    /*----------------------
    *   Login Service
    ----------------------*/
    self.LoginAction = function (email , password, callback){
        $cookies.remove('accessToken');
        APIConsole.sendAPIRequest('POST', 'login', {account: email, password: password})
                .then(function(data){
                    self.loginToken = data.data.token;		//get token info from api
                    $cookies.put('accessToken', self.loginToken);	//set token to cookies
                    self.message_000 = data.data.message;
                    callback(true);
                },
                function (data) {
                	self.message_001 = data.data.message;
                    callback(false);
                });
    };
    /*------------------------
    *   Logout service
    -------------------------*/
    self.LogoutAction = function (callback){
    	APIConsole.sendAPIRequest('POST', 'logout')
    		.then(function(data){
                $cookies.remove('accessToken'); //remove token from cookie
    			self.message_000 = data.data.message;	//success message
    			callback(true);
    		},
    		function (data){
                $cookies.remove('accessToken'); //remove token from cookie
    			self.message_002 = data.data.message;	//fail, message
    			callback(false);
    		});
    };
    /*---------------------------
    *   Forgot password service
    ----------------------------*/
    self.ForgotPasswordAction = function (forgot_email , callback){
        APIConsole.sendAPIRequest('POST', 'forgotpassword', {email: forgot_email})
            .then(function(data){
                callback(true);
            },
            function (data) {
                self.message_003 = data.data.message;
                callback(false);
            });
    };
    /*-------------------------
    *   Check valid Code
    --------------------------*/
    self.CheckResetCodeAction = function (chk_token , callback){
        APIConsole.sendAPIRequest('POST' , 'forgotpassword/verify/token', {token : chk_token})
            .then(function(data){
                self.message_000 = data.data.message;
                callback(true);
            },
            function(data){
                self.message_003 = data.data.message;
                console.log(self.message_003);
                callback(false);
            });
    };
    /*-----------------------------------
    *   Reset Password Request send
    ------------------------------------*/
    self.ResetPasswordAction = function (reset_code , new_password , callback){
        APIConsole.sendAPIRequest('POST' , 'forgotpassword/verify' , {token : reset_code, password: new_password})
            .then(function(data){
                self.message_000 = data.data.message;
                callback(true);
            },
            function(data){
                self.message_003 = data.data.message;
                console.log(self.message_003);
                callback(false);
            });
    };
    /*--------------------------------
    *   Register New Account Service
    ---------------------------------*/
    self.ReigisterNewAccountAction = function(email_addr , username , password , callback) {
        APIConsole.sendAPIRequest('POST', 'register', {username: username, email: email_addr, password: password})
            .then(function(data){
                    console.log(data);
                    self.message_000 = data.data.message;
                    callback(true);
                },
                function(data) {
                    self.message_003 = data.data.message;
                    console.log(self.message_003);
                    callback(false);
                });

    };
    /*--------------------------------
    *   Google Login Services
    ---------------------------------*/
    self.GoogleSignInAction = function(google_token , callback) {
        $cookies.remove('accessToken');
        APIConsole.sendAPIRequest('POST' , 'google' , {access_token: google_token})
            .then(function(data){
                self.message_000 = data.data.message;
                self.loginToken = data.data.token;
                $cookies.put('accessToken', self.loginToken);   //set token to cookies
                callback(true);
            },
            function(data){
                self.message_003 = data.data.message;
                console.log(self.message_003);
                callback(false);
            });
    };
    /*------------------------------
    *   Facebook Login Service
    -------------------------------*/
    self.FaceBookSignInAction = function(facebook_token , callback) {
        $cookies.remove('accessToken');
        APIConsole.sendAPIRequest('POST' , 'facebook' , {access_token: facebook_token})
            .then(function(data){
                self.message_000 = data.data.message;
                self.loginToken = data.data.token;
                $cookies.put('accessToken', self.loginToken);
                callback(true);
            },
            function(data){
                self.message_003 = data.data.message;
                callback(false);
            });
    };
    /*--------------------------------
    *   Verify Account Action
    ---------------------------------*/
    self.VerifyAccountAction = function(verify_token , callback) {
        APIConsole.sendAPIRequest('POST' , 'register/verify' , {token : verify_token})
            .then(function(data){
                self.message_000 = data.data.message;
                callback(true);
            },
            function(data){
                self.message_003 = data.data.message;
                console.log(self.message_003);
                callback(false);
            });
    };
    /*---------------------------
    *   Get current user id
    ----------------------------*/
    self.GetCurrentUserIdAction = function(callback) {
        APIConsole.sendAPIRequest('GET' , 'user')
            .then(function(data){
                callback(true);
            },
            function(data){
                console.log(data);
                callback(false);
            });
    };
    /*------------------------------------
    *   Get current user information
    ------------------------------------*/
    self.GetCurrentUserInfo = function(callback){
        APIConsole.sendAPIRequest('GET' , 'user' )
            .then(function(data){
                self.UserInfo = data.data;
                callback(true);
            },
            function(data){
                console.log(data);
                callback(false);
            });
    };
    /*------------------------------
    *   Delete user account
    ------------------------------*/
    self.DeleteUserAccount = function(account_id , callback) {
        APIConsole.sendAPIRequest('DELETE' , 'user/127')
            .then(function(data){
            },
            function(data){
            });
    };
    /*-----------------------------------
    *   Check email already in use
    -----------------------------------*/
    self.CheckEmailInDB = function(email , callback) {
        APIConsole.sendAPIRequest('POST' , 'check/email' , {email: email})
            .then(function(data){
                if (data.data.exists) {
                    callback(true);
                }   else    {
                    callback(false);
                }
            },
            function(data){
                console.log(data.data.message);
            });
    };
    /*-----------------------------------
    *   Check username already in use
    -----------------------------------*/
    self.CheckUsernameInDB = function(username , callback) {
        APIConsole.sendAPIRequest('POST' , 'check/username' , {username: username})
            .then(function(data){
                if (data.data.exists) {
                    callback(true);
                }   else    {
                    callback(false);
                }
            },
            function(data){
                console.log(data.data.message);
            });
    };
	/*-------------------------------------------
    *   Check current cookie for userlogin
    --------------------------------------------*/
    self.isLoggedIn = function (){
    	return $cookies.get('accessToken') ? true : false;
    };
    return self;
});
