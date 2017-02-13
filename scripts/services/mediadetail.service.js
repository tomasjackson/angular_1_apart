'use strict';

/**
 * @ngdoc service
 * @name frontendApp.mediaDetailService
 * @description
 * # mediaDetailService
 * Service in the frontendApp.
 */
angular.module('frontendApp')
  .service('MediaDetailService', function (APIConsole) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var self = this;

    self.media_in_gallery = [];

    //load medias from gallery

    APIConsole.sendAPIRequest('GET' , 'media/gallery')
        .then(function(data){
        	self.media_in_gallery = data.data.files;
        },
        function(data){
        	console.log(data);
    	}
    );


});
