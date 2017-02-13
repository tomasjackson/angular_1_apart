'use strict';

angular.module('frontendApp')
  .controller('ReplyNotesController',
  	function ($scope, $loading, $uibModalInstance, $state, modalInstance, param, StoryManager, MediaService) {

		  var self = this;
      self.note = param.note;
      self.reply_content = '';


      self.PostReply = function($event) {
        self.CloseModal();
        StoryManager.ReplyToNote(self.note.id, self.reply_content, function(res) {
          if (res) {
            param.note.replays.push(res.data.reply);
            param.note.numReplies += 1;
            self.CloseModal();
          }
        });
      };

      self.CloseModal = function($event) {
        $uibModalInstance.close();
      };
});
