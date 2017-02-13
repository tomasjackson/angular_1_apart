'use strict';
/*-----------------------------
*   This service is for
*    make API request
*    and send request to
*    server.
*
*   JZ : 1259345
-----------------------------*/
angular.module('frontendApp').service('APIConsole', function ($cookies , $http){

	var api_store_url = 'http://api.storythat.com/';	//define backend url

	var self = this;	//set instance to self
    self.accessToken = '';

    /*----------------------------------
    *   Send API reqeust to backend
    ----------------------------------*/

    self.sendAPIRequest = function sendAPIRequest(httpMethod, APIMethod, data){
    		self.accessToken = $cookies.get('accessToken');	//get current token from cookie
            var req = {
                method: httpMethod,
                url: api_store_url + APIMethod,
                data: data,
                headers: {
                    'Authorization': self.accessToken		//set Authorization header as accessToken- user login token
                }
            };
            return $http(req);
        };

    self.sendMediaAPIRequest = function sendMediaAPIRequest(httpMethod , APIMethod , data , header1){
        self.accessToken = $cookies.get('accessToken'); //get current token from cookie
        var req = {
            method: httpMethod,
            url: api_store_url + APIMethod,
            data: data,
            headers: {
                'Authorization': self.accessToken,
                'Content-Type': header1
                // 'Content-Length': header2
            }
        };
        return $http(req);
    };
    self.sendCropImageAPIRequest = function sendCropImageAPIRequest(httpMethod , APIMethod , data ){
        self.accessToken = $cookies.get('accessToken'); //get current token from cookie
        var req = {
            method: httpMethod,
            url: api_store_url + APIMethod,
            data: data,
            headers: {
                'Authorization': self.accessToken
                // 'Content-Type': header1
                // 'Content-Length': header2
            }
        };
        return $http(req);
    };
});
