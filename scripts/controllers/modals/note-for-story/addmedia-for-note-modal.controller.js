'use strict';

angular.module('frontendApp')
  .controller('MediaForNoteCtrl', function ($uibModal, param, modalInstance) {

  	// initial
  		var self = this;

  	// template
  		console.log(param.story, param.notes, param.mediaList, param.media);

  	// upload from device button click
  		self.FromDevice = function($event) {
  			modalInstance.get().close();

  			var modal = $uibModal.open({
  				animation: true,
  				templateUrl: 'views/partials/modals/note-for-story/device-modal.html',
  				controller: 'noteDeviceCtrl',
  				controllerAs: '$ctrl',
  				size: 'medium-st',
  				backdrop: 'static',
  				keyboard: false,
  				resolve: {
  					param: function() {
  						return {
  							'story': param.story,
                'media': param.media,
                'notes': param.notes,
                'mediaList': param.mediaList
  						}
  					}
  				}
  			});
  			modalInstance.set(modal);
  		};

  	// upload from gallery button click
  		self.FromGallery = function($event) {
  			modalInstance.get().close();

  			var modal = $uibModal.open({
  				animation: true,
  				templateUrl: 'views/partials/modals/note-for-story/gallery-modal.html',
  				controller: 'noteGalleryCtrl',
  				controllerAs: '$ctrl',
  				size: 'medium-st',
  				backdrop: 'static',
  				keyboard: false,
  				resolve: {
  					param: function() {
  						return {
  							'story': param.story,
                'media': param.media,
                'notes': param.notes,
                'mediaList': param.mediaList                
  						}
  					}
  				}
  			});
  			modalInstance.set(modal);
  		};

  	// upload from facebook button click
  		self.FromFacebook = function($event) {
 			modalInstance.get().close();

  			var modal = $uibModal.open({
  				animation: true,
  				templateUrl: 'views/partials/modals/note-for-story/facebook-modal.html',
  				controller: 'noteFacebookCtrl',
  				controllerAs: '$ctrl',
  				size: 'medium-st',
  				backdrop: 'static',
  				keyboard: false,
  				resolve: {
  					param: function() {
  						return {
  							'story': param.story,
                'media': param.media,
                'notes': param.notes,
                'mediaList': param.mediaList                
  						}
  					}
  				}
  			});
  			modalInstance.set(modal);
  		};

  	// close modal button click
  		self.CloseModal = function($event) {
  			$event.preventDefault();
  			modalInstance.get().close();
  		};

  	// back button click
  		self.BackTo = function($event) {
  			modalInstance.get().close();

        var modal = $uibModal.open({
            animation: true,
            templateUrl: 'views/partials/modals/note-for-story/addnotes-modal.html',
            controller: 'AddNotesController',
            controllerAs: '$ctrl',
            size: 'modal-note-st',
            backdrop  : 'static',
            keyboard  : false,
            resolve: {
                param: function () {
                    return {
                        'story' : param.story,
                        'media': param.media,
                        'notes': param.notes,
                        'mediaList': param.mediaList

                    };
                }
            }
        });
        modalInstance.set(modal);
  		};

  	// next button click
  		self.NextTo = function($event) {
  			$event.preventDefault();
  			modalInstance.get().close();
        var modal = $uibModal.open({
            animation: true,
            templateUrl: 'views/partials/modals/note-for-story/addnotes-last-modal.html',
            controller: 'AddNotesLastController',
            controllerAs: '$ctrl',
            size: 'modal-note-st',
            backdrop  : 'static',
            keyboard  : false,
            resolve: {
                param: function () {
                    return {
                        'story' : param.story,
                        'media': param.media,
                        'notes': param.notes,
                        'mediaList': param.mediaList                        
                    };
                }
            }
        });
        modalInstance.set(modal);        
  		}

});
