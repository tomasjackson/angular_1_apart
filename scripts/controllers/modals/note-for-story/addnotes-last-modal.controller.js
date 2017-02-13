'use strict';

angular.module('frontendApp')
  .controller('AddNotesLastController', 
  	function ($scope, $loading, $uibModal, $state, modalInstance, param, StoryManager, MediaService) {

  	// initial
		var self = this;

	// binding variables
		self.note_string = param.notes;	// variable for storing note description
		self.private_flag = false;	// variable for privacy of note
		self.media_count = 0;

	// dw loading begin/end functions
	    $scope.startLoading = function (name) {
	        $loading.start(name);
	    };
	    $scope.finishLoading = function (name) {
	        $loading.finish(name);
	    };

	// test area
		console.log(param.story, param.notes, param.mediaList);

	
	// add media for note
		self.AddMore = function($event) {
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
	                        'notes' : param.notes,
	                        'mediaList' : param.mediaList
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
					var success_count = 0;
					for (var i = 0; i < param.mediaList.length; i++) {
						StoryManager.AddMediaToNote(res.data.note.id, param.mediaList[i], function(response) {
							if (response) {
								success_count ++;
							}
						});
					}
					var scrollInterval = setInterval(function(){
						if (success_count == param.mediaList.length ) {
							clearInterval(scrollInterval);
						}
					},15);
					$scope.finishLoading('saving-note');
					modalInstance.get().close();
					$state.reload();
				}
			});
		};
	// add note to story
		function Note2Story() {
			StoryManager.AddNoteToStory(param.story.id, self.note_string, function(res) {
				if (res) {
					var success_count = 0;
					for (var i = 0; i < param.mediaList.length; i++) {
						StoryManager.AddMediaToNote(res.data.note.id, param.mediaList[i], function(response) {
							if (response) {
								success_count ++;
							}
						});
					}
					var scrollInterval = setInterval(function(){
						if (success_count == param.mediaList.length ) {
							clearInterval(scrollInterval);
						}
					},15);
					$scope.finishLoading('saving-note');
					modalInstance.get().close();

				}
			});
		};


	// close modal button click
		self.CloseModal = function($event) {
			$event.preventDefault();
			modalInstance.get().close();
		};

	// check box click
		self.CheckClick = function($event) {
			$event.preventDefault();
			self.private_flag = !self.private_flag;
		};

	// back button click
		self.BackButton = function($event) {
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
	                        'notes' : param.notes,
	                        'mediaList' : param.mediaList
	                    };
	                }
	            }
	        });
	        modalInstance.set(modal);

		};
});
