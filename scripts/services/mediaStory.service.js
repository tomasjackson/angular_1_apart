/**
 * Created by bear on 9/14/16.
 */
/**
 * Created by bear on 9/14/16.
 */
'use strict';

/*-----------------------------
 *   This service is for
 *    MediaStory related service.
 *
 -----------------------------*/

angular.module('frontendApp').service('MediaStoryService', function (APIConsole){

  var self = this;	//set instance to self

  self.imported_MediaIdList = [];
  self.created_Story = [];
  self.editModalInstance = {};
  self.selected_Media = {};
  /*-------------------------------
  *   Save story Action
  -------------------------------*/
  self.SaveStory = function (story , callback){
    APIConsole.sendAPIRequest('PUT' , 'story' , {
            title: story.title,
            date: story.date,
            time: story.time,
            location: story.location,
            keywords: story.keywords,
            description: story.description
    })
    .then(function(data){
      self.created_Story = data.data.story;
      console.log(self.created_Story);
      callback(true);
    },
    function(data) {
      console.log(data);                           //error catch
      callback(false);

    });
  };
  /*-------------------------------
  *   Save story Action
  -------------------------------*/
  self.LinkStoryWithMedia = function (story_id , media_id , callback) {
    APIConsole.sendAPIRequest('PUT' , 'story/media' , {story_id : story_id , media_id : media_id} )
      .then(function(data){
        console.log(data);
        callback(true);
      },
      function(data) {
        console.log(data);
        callback(false);
      });
  };
  /*------------------------
  *   Delete story action
  -------------------------*/
  self.DeleteStory = function (id , callback) {
    APIConsole.sendAPIRequest('DELETE' , 'media/' + id)
      .then(function(data){
        console.log(data);
        callback(true);
      },
      function(data) {
        console.log(data);
        callback(false);
      });
  };
  /*------------------------
   *   save the selected FaceBook Medias
   -------------------------*/
  self.saveSelectedFBMedias = function(photos, FBToken, callback) {
    APIConsole.sendAPIRequest('PUT' , 'media/facebook', {
      access_token: FBToken,
      images: photos
    })
      .then(function(data){
        callback(data);
      },
      function(data) {
        console.log(data);
        callback(false);
      });
  };
});
