'use strict';


angular.module('frontendApp').service('mainService', function($state, APIConsole) {
	var service = {};
	service.pageTitle = '';

	service.commonjQuery = function() {
		bootstrapJS();
		jquery004();
		generalUtilities();
		viewingPermission();
		shareContent();
		cropImage();
		calendarJS();
		searchActions();
		wmds();
		scriptsJS();
	};

	service.exejQuery = function() {
		customJS();
		functionsJS();
		domMan();
	};

  service.Search = function (data, callback) {
    var url = 'search/' + data.category;
    APIConsole.sendMediaAPIRequest('POST', url, data)
      .then(function(response){
        callback(response.data);
      }, function(){
        callback(false);
      });
  };

	return service;
});

angular.module('frontendApp').service('modalInstance', function () {
    var property = {};

    return {
        get: function () {
            return property;
        },
        set: function(value) {
            property = value;
        }
    };
});
angular.module('frontendApp').service('ModalInstanceStore' , function() {
  var self = this;
  self.crop_image_modal = {};
  self.media_from_gallery = {};
  self.edit_story_modal = {};
  self.image_from_fb_modal = {};
  self.manage_privacy_modal = {};
  self.edit_media_modal = {};
});
