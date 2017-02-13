'use strict';

angular.module('frontendApp')
  .controller('AddNotesController', 
  	function ($scope, $loading, $uibModal, $state, modalInstance, param, StoryManager, MediaService) {

  	// initial
		var self = this;

	// binding variables
		self.note_string = '';	// variable for storing note description
		self.private_flag = false;	// variable for privacy of note


	// dw loading begin/end functions
	    $scope.startLoading = function (name) {
	        $loading.start(name);
	    };
	    $scope.finishLoading = function (name) {
	        $loading.finish(name);
	    };

	// test area
		console.log(param.story);
		console.log(param.media);
	
	// add media for note
		self.AddMediaForNote = function($event) {
			$event.preventDefault();

			modalInstance.get().close();

	        var modal = $uibModal.open({
	            animation: true,
	            templateUrl: 'views/partials/modals/note-for-story/addmedia-for-note-modal.html',
	            controller: 'MediaForNoteCtrl',
	            controllerAs: '$ctrl',
	            size: 'modal-note-st-custom',
	            backdrop  : 'static',
	            keyboard  : false,
	            resolve: {
	                param: function () {
	                    return {
	                        'story' : param.story,
	                        'media' : param.media,
	                        'notes' : self.note_string,
	                        'mediaList' : []
	                    };
	                }
	            }
	        });
	        modalInstance.set(modal);
		};

	// post note button click
		self.PostNote = function($event) {
			$scope.startLoading('saving-note');
			if (param.media) {
				Note2Media();
			}	else if (param.story) {
				Note2Story();
			}	else {
				console.log('unexpected error occure on saving notes');
			}
		};

	// add note to media
		function Note2Media() {
			MediaService.AddNoteToMedia(param.media.id, self.note_string, function(res) {
				if (res) {
					$scope.finishLoading('saving-note');
					modalInstance.get().close();
				}
			});
		};
	// add note to story
		function Note2Story() {
			StoryManager.AddNoteToStory(param.story.id, self.note_string, function(res) {
				if (res) {
					$scope.finishLoading('saving-note');
					modalInstance.get().close();
					$state.reload();
				}
			});
		};

	// close modal button click
		self.CloseModal = function($event) {
			$event.preventDefault();
			modalInstance.get().close();
		};
});
