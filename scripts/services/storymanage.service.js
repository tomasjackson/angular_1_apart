

/*--------------------------------------------------------------------
           Service for story management

   Actions : Save Story , Edit Story , Get Story , Delet Story

   globalstory is for storing currently saved and updated story.
--------------------------------------------------------------------*/

'use strict';

angular.module('frontendApp').service('StoryManager', function ($cookies , $http , $window , APIConsole){

	var self = this;	                //set instance to self

    self.saved_id = 0;                  //currently saved story id
    self.updated_story = [];            //var for append story when create / edit

    self.journal_edit_story_index = null;
    self.journal_selected_story = [];

    self.upload_finished = false;
    self.error_message = '';
    /*------------------------------
    *   Update service variable
    ------------------------------*/
    self.UpdateService = function (id , callback) {

        APIConsole.sendAPIRequest('GET' , 'story/' + id)
            .then(function(data) {
                self.updated_story = data.data.story;
                callback(true);
            },
            function() {
                callback(false);
            });
    };
	/*-------------------------------
	*	Save story Action
	-------------------------------*/
	self.SaveStoryAction = function (story , callback){
		APIConsole.sendAPIRequest('PUT' , 'story' , {
            title: story.title,
            date: story.date,
            time: story.time,
            location: story.location,
            keywords: story.keywords,
            description: story.description
		}).then(function(data){
            console.log(data);
            self.saved_id = data.data.story.id;         //get saved story id
            $cookies.remove('storyStore');              //remove cookie
            self.updated_story = data.data.story;       //get newly saved story
			callback(true);

		},
		function(data) {

			console.log(data);                           //error catch
			callback(false);

		});
	};
    /*-------------------------------
    *   Update story Action
    -------------------------------*/
    self.UpdateStoryAction = function (story , id ,callback){
        APIConsole.sendAPIRequest('POST' , 'story/'+id , {
            title: story.title,
            date: story.date,
            time: story.time,
            location: story.location,
            keywords: story.keywords,
            description: story.description
        }).then(function(data){

            $cookies.remove('storyStore');              //remove cookie
            self.updated_story = data.data.story;       //get updated story
            console.log(data);
            callback(data.data);

        },
        function(data) {

            console.log(data);                          //error catch
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
    /*----------------------------------
    *   Get single story from its id
    -----------------------------------*/
    self.GetSingleStory = function (id , callback) {
        APIConsole.sendAPIRequest('GET' , 'story/' + id)
            .then(function(data) {
                callback(data.data.story);
            },
            function(data) {
                console.log(data);
                callback(false);
            });
    };
    /*----------------------
    *   Get Story Action
    -----------------------*/
    self.GetStoryAction = function (sinceDate , maxResult , callback) {
        APIConsole.sendAPIRequest('GET' , 'stories/' + sinceDate + '/' + maxResult)
            .then(function(data){
                callback(data.data);
            },
            function() {
                callback(false);                    //error catch
            });
    };
    self.GetMyStoryInfo = function (callback) {
      APIConsole.sendAPIRequest('GET' , 'stories')
        .then(function(data){
            callback(data.data);
          },
          function() {
            callback(false);                    //error catch
          });
    };
    self.GetFavoriteInfo = function (callback) {
      APIConsole.sendAPIRequest('GET', 'story/favorite').then(function(data) {
        callback(data.data);
      }, function(){
        callback(false);
      });
    };
  /*------------------------
  *   Delete Story Action
  -------------------------*/
    self.DeleteStoryAction = function (story_id , callback) {
        APIConsole.sendAPIRequest('DELETE' , 'story/' + story_id)
            .then(function(data){
                console.log(data);
                callback(true);
            },
            function(data){
                console.log(data);
                callback(false);
            });
    };
    /*----------------------
    *   Share story
    ----------------------*/
    self.ShareStoryAction = function (story_id , user_group , callback) {
        APIConsole.sendAPIRequest('POST' , 'story/share/' + story_id , {friends_id : user_group}).then(function(data) {
                callback(data);
            } , function() {
                callback(false);
            }
        );
    };
    /*-------------------------
    *   Get Shared stories
    -------------------------*/
    self.GetSharedStories = function(since_date , maxResult , callback) {
        APIConsole.sendAPIRequest('GET' , 'story/shared/' + '0' + '/' + maxResult).then(function(data) {
                callback(data.data.stories);
            } , function(data) {
                console.log(data);
                callback(false);
            }
        );
    };
    /*-------------------------
    *   Get Shared stories
    -------------------------*/
    self.GetHiddenStories = function(since_date, maxResult, callback) {
        APIConsole.sendAPIRequest('GET', 'story/shared/hidden/' + '0' + '/' + maxResult).then(function(data) {
                callback(data.data.stories);
            }, function(data) {
                console.log(data);
                callback(false);
            }
        );
    };
    /*----------------------------------
    *   Get shared details of story
    ----------------------------------*/
    self.GetSharedDetails = function (story_id , callback) {
        APIConsole.sendAPIRequest('GET' , 'story/shared/details/' + story_id).then(function(data) {
                callback(data.data.shared);
            } , function(data) {
                console.log(data);
                callback(false);
            }
        );
    };
    /*----------------------------------
    *   Expand Story
    ----------------------------------*/
    self.ExpandStoryAction = function(story_id, callback) {
        APIConsole.sendAPIRequest('POST' , 'story/expand/' + story_id).then(function(data) {
                callback(data);
            }, function(data) {
                console.log(data);
                callback(false);
            }
        );
    };
    /*----------------------------------
    *   Search Journal
    ----------------------------------*/
    self.SearchStoryAction = function(query, callback) {

        APIConsole.sendAPIRequest('POST', 'search/journal', query).then(function(data) {
                callback(data);
            }, function(data) {
                console.log(data);
                callback(false);
            }
        );
    };
    self.SearchSharedStoriesAction = function(query, callback) {
        APIConsole.sendAPIRequest('POST', 'search/story/shared', query).then(function (data) {
          callback(data);
        }, function(data) {
          console.log(data);
          callback(false);
        })
    };

    /*--------------------------
    *   Add story to journal
    --------------------------*/
    self.AddStoryToJournal = function(story_id, incognito, callback) {
        APIConsole.sendAPIRequest('PUT', 'journal/add/' + story_id, {incognito: incognito}).then(function(data) {
                callback(data);
            }, function(data) {
                console.log(data);
                callback(false);
            }
        );
    };
    /*-------------------------------
    *   Remove story from journal
    -------------------------------*/
    self.RemoveStoryFromJournal = function(story_id, callback) {
        APIConsole.sendAPIRequest('DELETE', 'journal/remove/' + story_id).then(function(data) {
                callback(data);
            }, function(data) {
                console.log(data);
                callback(false);
            }
        );
    };
    /*----------------------------
     *   Add note to story
     ----------------------------*/
    self.AddNoteToStory = function(story_id, content, callback) {
      APIConsole.sendAPIRequest('POST', 'note/story/' + story_id, {content: content}).then(function(data) {
          callback(data);
        }, function(data) {
          console.log(data);
          callback(false);
        }
      );
    };
    /*--------------------------
     *   Set story as favorite
     --------------------------*/
    self.SetNoteAsFavorite = function(note_id, callback) {
      APIConsole.sendAPIRequest('PUT', 'note/favorite/' + note_id).then(function(data) {
          callback(data);
        }, function(data) {
          console.log(data);
          callback(false);
        }
      );
    };
    self.RemoveNoteFromFavorite = function(note_id, callback) {
      APIConsole.sendAPIRequest('DELETE', 'note/favorite/' + note_id).then(function(data) {
        callback(data.data);
      }, function(data) {
        console.log(data);
        callback(false);
      });
    };
    self.ReplyToNote = function(note_id, content, callback) {
      APIConsole.sendAPIRequest('POST', 'note/reply/' + note_id, {content:content}).then(function(data) {
          callback(data);
        }, function(data) {
          console.log(data);
          callback(false);
        }
      );
    };
    /*--------------------------
     *   Add media to note
     --------------------------*/
    self.AddMediaToNote = function(note_id, media_id, callback) {
      APIConsole.sendAPIRequest('PUT', 'note/media', {note_id:note_id, media_id:media_id}).then(function(data) {
          callback(data);
        }, function(data) {
          console.log(data);
          callback(false);
        }
      );
    };
    /*--------------------------------
    *   Get Notes for my notes page
    ---------------------------------*/
    self.GetNotesAction = function(sinceDate, maxResult, callback) {
        APIConsole.sendAPIRequest('GET', 'note/' + sinceDate + '/' + maxResult).then(function(data) {
                callback(data);
            }, function(data) {
                console.log(data);
                callback(false);
            }
        );
    };

    // search notification by date
    self.SearchNotesByDate = function(query, callback) {
        APIConsole.sendAPIRequest('POST', 'search/notes', query).then(function(data) {
                callback(data);
            }, function(data) {
                console.log(data);
                callback(false);
            }
        );
    };

    self.DeleteNote = function(note_id, callback) {
        APIConsole.sendAPIRequest('DELETE', 'note/' + note_id).then(function(data) {
          callback(data.data);
        }, function(data) {
          console.log(data);
          callback(false);
        })
    }
    /*----------------------
    *   Get Journal Action
    -----------------------*/
    self.GetJournalAction = function (sinceDate , maxResult , callback) {
        APIConsole.sendAPIRequest('GET' , 'journal/' + sinceDate + '/' + maxResult)
            .then(function(data){

                if (data.data.stories.length === 0) {
                    self.upload_finished = true;
                }   else    {
                    self.upload_finished = false;
                }

                callback(data.data);
            },
            function(data) {
                console.log(data);
                callback(false);                    //error catch

            });
    };
    self.GetJournalInfo = function(callback) {
        APIConsole.sendAPIRequest('GET', 'journal').then(function(data){
            callback(data.data);
        }, function(data) {
            console.log(data);
            callback(false);
        });
    };
    /*--------------------------
    *   Set story as favorite
    --------------------------*/
    self.SetAsFavorite = function(story_id, callback) {
        APIConsole.sendAPIRequest('PUT', 'story/favorite/' + story_id).then(function(data) {
                callback(data);
            }, function(data) {
                console.log(data);
                callback(false);
            }
        );
    };
    self.RemoveFromFavorite = function(story_id, callback) {
        APIConsole.sendAPIRequest('DELETE', 'story/favorite/' + story_id).then(function(data) {
          callback(data.data);
        }, function(data) {
          console.log(data);
          callback(false);
        });
    };
    /*--------------------------------
    *   Hide/Show shared stories
    --------------------------------*/
    self.ToggleSharedStory = function(storyId, callback) {
        APIConsole.sendAPIRequest('POST', 'story/share/hide/' + storyId).then(function(data) {
                callback(data);
            }, function(data) {
                console.log(data);
                callback(false);
            }
        );
    };


    self.SetPrivacyForStory = function(storyId, privacyData, callback) {
        APIConsole.sendAPIRequest('POST', 'story/privacy/' + storyId, privacyData)
            .then(function(data) {
                console.log('SetPrivacyForStory-service = ', data);
                callback(data);
            }, function(data) {
                console.log('SetPrivacyForStory-service-error = ', data);
                callback(false);
            });
    };

    self.getScopes = function(callback) {
        APIConsole.sendAPIRequest('GET', 'scopes')
            .then(function(data) {
                callback(data);
            }, function(data) {
                console.log(data);
                callback(false);
        });
    };
});
/*-----------------------------------
*   story object reserve
-----------------------------------*/
angular.module('frontendApp').service('globalStory', function ($cookies) {

    var current_date_time = new Date();
    var self = this;

    self.string_weekday = ['Sun', 'Mon', 'Tues', 'Wednes', 'Thurs', 'Fri', 'Satur'];
    self.string_month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    var story = {
        id: '',
        title: '',
        location: '',
        // dateshow: self.string_weekday[current_date_time.getDay()] + ', ' + current_date_time.getDate() + 'th' + ' ' + self.string_month[current_date_time.getMonth()] + ', ' + current_date_time.getFullYear(),
        date: current_date_time.getFullYear() + '/' + (current_date_time.getMonth()+1) + '/' + current_date_time.getDate() ,
        time: current_date_time.getHours() + ':' + current_date_time.getMinutes(),
        keywords:  [],
        description: '',
        mediaFiles: [],
        user: [],
        privacy: [],
        userDate:[]

    };
    /*------------------------------------
    *   if there is object in the cookie
    *   restore the object from cookie
    -------------------------------------*/
    if($cookies.getObject('storyStore')) {

        story = $cookies.getObject('storyStore');   //restore story object from cookie

    }

    return {
        get: function () {
            return story;       //returns story object
        },
        set: function(value) {  //set story object values
            story.title = value.title;
            story.location = value.location;
            story.date = value.date;
            story.time = value.time;
            story.keywords = value.keywords;
            story.description = value.description;
            story.createdDate = value.createdDate;
            story.mediaFiles = value.mediaFiles;
            story.user = value.user;
            story.privacy = value.privacy;
            story.userDate = value.userDate;
            story.id = 0;
            $cookies.putObject('storyStore' , story);   //put story object to cookie
        },
        reset: function() {             //reset all values of story object
            story.title = '';
            story.location = '';
            story.date = '';
            story.time = '';
            story.keywords = [];
            story.description = '';
            story.createdDate = '';
            story.mediaFiles = [];
            story.user = [];
            story.privacy = [];
            story.userDate = [];
            $cookies.putObject('storyStore' , story);
        }
    };
});

