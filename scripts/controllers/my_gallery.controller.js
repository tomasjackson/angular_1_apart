'use strict';

angular.module('frontendApp').controller('myGalleryCtrl', function(
  $uibModal, $state, $scope, $rootScope,
  $sce, $loading, $window, $timeout,
  modalInstance, mainService, Authentication , MediaService) {

  var media_obj = {
      id : 0,
      title : '',
      location : '',
      description : '',
      path : {original : '',  t1 : '',    t2 : '',    t3 : '',    t4 : '',    t5 : ''},
      userDate : {date : '', time : ''},
      fileType : '',
      futherSharing : false,
      dataUploaded : {date : '', time : ''},
      embeddedVideoUrl : '',
      videoThumbnail : '',
      videoFullSizeImg : '',
      videoHost : '',
      mediaFileType : false,
      viewingPermission : false
  };

	var self = this;
  var initializing = true;

  self.UserInformation = null;
  self.nGallery_count = 0;
  self.nFavorite_count = 0;
  self.noResult = false;
  self.MediaColList = {col_1 : [], col_2 : [], col_3 : []};
  $rootScope.sinceDate = new Date().getTime()/1000;
  self.sinceDate = timeConverter($rootScope.sinceDate);
  self.gallery = [];

// authentication check
  Authentication.GetCurrentUserIdAction(function(response){});
  Authentication.GetCurrentUserInfo(function(response){
      if (response) {
          self.UserInformation = Authentication.UserInfo;
      }
  });

  // mainService.exejQuery();
  mainService.pageTitle = $state.current.data.title;

  var isLoggedIn = Authentication.isLoggedIn();
  if (!isLoggedIn) {
      $window.location = "/#/login";
      $window.location.reload();
  }

  $scope.startLoading = function (name) {$loading.start(name);};
  $scope.finishLoading = function (name) {$loading.finish(name);};

  // watching since date chanage event
  $scope.$watch(function() {
    return $rootScope.searchQuery;
  }, function() {
      if (initializing) {
          $timeout(function() { initializing = false; });
      } else {
          $scope.mini_date = $rootScope.mini_date;
          $scope.LoadGalleryDate();
      }
  },  true);
  $scope.$watch(function() {
    return $rootScope.searchActivated;
  }, function() {
    if (initializing) {
      $timeout(function() { initializing = false; });
    } else {
      $scope.searchActivated = $rootScope.searchActivated;
      if (!$rootScope.searchActivated) { self.noResult = false;}
    }
  }, true);
  $scope.$watch(function() {
    return $rootScope.mini_date;
  }, function() {
      if (initializing) {
          $timeout(function() { initializing = false; });
      } else {
          $scope.mini_date = $rootScope.mini_date;
          self.sinceDate = self.GetSelectedDateString($scope.mini_date);
          if (isToday($rootScope.mini_date)) {
            self.gallery.length = 0;
            $rootScope.sinceDate = new Date().getTime()/1000;
            self.gallery = [];
            self.noResult = false;
            // get media gallery
            $scope.startLoading('loading-media');
            MediaService.GetMediaGallery(function(response){
              if (response) {
                SortMediaList();
                $scope.finishLoading('loading-media');
              }
            });

            // get favorite media
            MediaService.GetMediaFavorite(function(response){
              if (response) {
                self.nFavorite_count = MediaService.nFavorite_count;
              }
            });
          } else {
            $scope.LoadGalleryDate();
          }
      }
  },  true);
  function isToday(string) {
    var today = new Date();
    var str = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    if (string == str) return true;
    return false;
  };
  $scope.LoadGalleryDate = function() {
      self.noResult = false;
      $scope.my_gallery = [];
      self.MediaColList.col_1.length = 0;
      self.MediaColList.col_2.length = 0;
      self.MediaColList.col_3.length = 0;
      $scope.startLoading('loading-media');
      var query = null;
      if ($rootScope.searchActivated) query = $rootScope.searchQuery.query;
      else query = null;
      MediaService.SearchGalleryAction({query: query, date: $rootScope.mini_date, sort:'DESC'}, function(res){
          if (res) {
              MediaService.myGalleryList = res.data.media;
              SortMediaList();
              $scope.finishLoading('loading-media');
          }
      });
  };

  function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year;
    console.log(a);
    return time;
  }

  // get media gallery
  $scope.startLoading('loading-media');
  MediaService.GetMediaGallery(function(response){
      if (response) {
          SortMediaList();
          $scope.finishLoading('loading-media');
      }
  });

  // get favorite media
  MediaService.GetMediaFavorite(function(response){
      if (response) {
          self.nFavorite_count = MediaService.nFavorite_count;
      }
  });

  // expand media box
  self.expandOptions = function expandOptions(e , click_case, media){
      e.preventDefault();
      MediaService.ExpandMediaAction(media.id, function(res) {
          if (res) {
              media.expanded = res.data.expanded;
          }
      });
  };

  // delete media from gallery
  self.DeleteThisMedia = function($event){
      event.stopPropagation();
      var $containerGall = $(event.target.parentNode).parent().parent().parent().parent();
      $containerGall.find('.confirm-prompt-dialog').show();
  };

  self.ConfirmDelete = function(flag , media , event , col_num){
      event.stopPropagation();
      if (flag === 'DELETE_MEDIA') {         //Delete this media
          if (col_num == 1) {
              var index_num = self.MediaColList.col_2.indexOf(media);
              MediaService.DeleteMedia(media , function(response){
                  if (response) {
                      var $containerGall = $(event.target.parentNode).parent().parent().hide();
                      self.MediaColList.col_1.splice(index_num , 1);
                  }
              });
          }   else if (col_num == 2) {
              var index_num = self.MediaColList.col_2.indexOf(media);
              MediaService.DeleteMedia(media , function(response){
                  if (response) {
                      var $containerGall = $(event.target.parentNode).parent().parent().hide();
                      self.MediaColList.col_2.splice(index_num , 1);
                  }
              })
          }   else if (col_num == 3) {
              var index_num = self.MediaColList.col_3.indexOf(media);
              MediaService.DeleteMedia(media , function(response){
                  if (response) {
                      var $containerGall = $(event.target.parentNode).parent().parent().hide();
                      self.MediaColList.col_3.splice(index_num , 1);
                  }
              })
          }   else    {
              console.log('Unknow error occured while binding');
          }
      }   else if(flag === 'CANCEL_ACTION')    {       //No, cancel this action
          var $containerGall = $(event.target.parentNode).parent().hide();
      }   else    {
          console.log('Unknow error occured while binding');
      }
  };

  // prevent default
  self.preventLink = function preventLink(e) {
      e.preventDefault();
  };

  // edit media modal
  self.EditMedia = function EditMedia(id , event, array_num, index_num) {
      MediaService.fromWhere = 'GALLERY';
      MediaService.mediaId = id;
      var modal = $uibModal.open({
          animation: true,
          templateUrl: 'views/partials/modals/media/editmedia-modal.html',
          controller: 'EditMediaController',
          controllerAs: '$ctrl',
          size: 'medium-st',
          resolve: {
              param: function () {
                  return {
                      'index' : 0
                  };
              }
          }
      });
      modalInstance.set(modal);
      modal.result.finally(function() {
          if (MediaService.editMedia_info.success) {
              if (array_num == 1)  {
                  ShowEditResult(MediaService.editMedia_info.media , self.MediaColList.col_1[index_num]);
              }   else if (array_num == 2) {
                  ShowEditResult(MediaService.editMedia_info.media , self.MediaColList.col_2[index_num]);
              }   else if (array_num == 3) {
                  ShowEditResult(MediaService.editMedia_info.media , self.MediaColList.col_3[index_num]);
              }
              MediaService.editMedia_info.success = false;
          }
      });
  };

  // open detail show modal
  self.OpenDetailModal = function OpenDetailModal(e , media , $index) {
      e.stopPropagation();
      var modal = $uibModal.open({
          animation: true,
          templateUrl: 'views/partials/modals/photo-modal.html',
          controller: 'photoModalCtrl',
          controllerAs: '$ctrl',
          size: 'medium-st',
          backdrop  : 'static',
          keyboard  : false,
          resolve: {
              param: function () {
                  return {
                      'media' : media
                  };
              }
          }
      });
      modalInstance.set(modal);
  };

// sort gallery array to 3 columns
  function SortMediaList() {
      self.MediaColList.col_1.length = 0;
      self.MediaColList.col_2.length = 0;
      self.MediaColList.col_3.length = 0;
      if (!MediaService.myGalleryList) {
          self.noResult = true;
      }   else    {
          var total = MediaService.myGalleryList.length;
          if (total == 0) {self.noResult = true;} else {self.noResult = false;}
          var rest = total % 3;
          for (var i = 0; i < total; i++) {
              if ($rootScope.sinceDate > parseDateTime(MediaService.myGalleryList[i].userDate).unix && $rootScope.untilDate < parseDateTime(MediaService.myGalleryList[i].userDate).unix) {
                  if ((i % 3) === 0)  {
                      MediaObjSet(MediaService.myGalleryList[i] , self.MediaColList.col_1);
                  }   else if ((i % 3) === 1) {
                      MediaObjSet(MediaService.myGalleryList[i] , self.MediaColList.col_2);
                  }   else if ((i % 3) === 2) {
                      MediaObjSet(MediaService.myGalleryList[i] , self.MediaColList.col_3);
                  }
              }
          }
      }
  }

  // media object formating function
  function MediaObjSet(service , target) {
      target.push({
          id : service.id,
          title : service.title,
          location : service.location,
          description : service.description,
          path : service.path,
          userDate : { date :parseDateTime(service.userDate).date, time : parseDateTime(service.userDate).time },
          fileType : service.fileType,
          furtherSharing : service.furtherSharing,
          dateUploaded : {date : parseDateTime(service.dateUploaded).date, time : parseDateTime(service.dateUploaded).time },
          embeddedVideoUrl : service.embeddedVideoUrl,
          videoThumbnail : service.videoThumbnail,
          videoFullSizeImg : service.videoFullSizeImg,
          videoHost : service.videoHost,
          expanded: service.expanded,
          notes: service.notes,
          mediaFileType : service.mediaFileType,
          viewingPermission : service.viewingPermission,
          keywords : service.keywords
      });
  }

  // edit media info save function
  function ShowEditResult(result, target) {
      target.id = result.id;
      target.title = result.title;
      target.location = result.location;
      target.description = result.description;
      target.path = result.path;
      target.userDate = {date:parseDateTime(result.userDate).date, time:parseDateTime(result.userDate).time};
      target.fileType = furtherSharing.fileType;
      target.furtherSharing = result.furtherSharing;
      target.dateUploaded = {date: parseDateTime(result.dateUploaded).date, time: parseDateTime(response.dateUploaded).time};
      target.embeddedVideoUrl = result.embeddedVideoUrl;
      target.videoThumbnail = service.videoThumbnail;
      target.videoFullSizeImg = service.videoFullSizeImg;
      target.videoHost = result.videoHost;
      target.expanded = result.expanded;
      target.notes = result.notes;
      target.mediaFileType = result.mediaFileType;
      target.viewingPermission = result.viewingPermission;
      target.keywords = result.keywords;
  }

  // parse time string to date object
  function parseDateTime (dateStr) {
      var date_obj = new Date(dateStr);
      var unix_time = new Date(dateStr).getTime()/1000;
      var time = '';
      if (date_obj.getHours() < 10) time = '0' + date_obj.getHours();
      else time = date_obj.getHours();
      time += ':';
      if (date_obj.getMinutes() < 10) time += '0' + date_obj.getMinutes();
      else time += date_obj.getMinutes();
      var string_weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      var string_month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      var date = date_obj.getDate() + ' ' + string_month[date_obj.getMonth()] + ' ' + date_obj.getFullYear();
      return {
          date : date,
          time : time,
          unix : unix_time
      }
  }

  // broadcast search result to controller
  $scope.$on('SearchResult',function(ev, args){
      self.searchCategory = args.query.category;
      self.searchResult = args.result.media;
      MediaService.myGalleryList = self.searchResult;
      SortMediaList();
  });

  // convert unix time to normal time format
  self.UnixToNormal = function (UNIX_timestamp){
      var a = new Date(UNIX_timestamp * 1000);
      var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      var year = a.getFullYear();
      var month = months[a.getMonth()];
      var date = a.getDate();
      var hour = a.getHours();
      var min = a.getMinutes();
      var sec = a.getSeconds();
      var time = date + ' ' + month + ' ' + year;
      return time;
  }

  // convert external url
  $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src);
  };

  // get selected date string
  self.GetSelectedDateString = function(dateStr) {
      var string_month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      if (dateStr.length == 4) {
          return dateStr;
      }   else if (dateStr.length > 4 && dateStr.length < 8) {
          return string_month[new Date(dateStr).getMonth()] + ' ' + new Date(dateStr).getFullYear();
      }   else {
          return new Date(dateStr).getDate() + ' ' + string_month[new Date(dateStr).getMonth()] + ' ' + new Date(dateStr).getFullYear();
      }
  };
  self.ShareMedia = function ($event, media) {
    var modal = $uibModal.open({
      animation: true,
      templateUrl: 'views/partials/modals/sharemedia-modal.html',
      controller: 'ShareMediaController',
      controllerAs: '$ctrl',
      size: 'medium-st',
      backdrop  : 'static',
      keyboard  : false,
      resolve: {
        param: function () {
          return {
            'media' : media
          };
        }
      }
    });
    modalInstance.set(modal);
  };
  self.SetAsFavorite = function (media) {
    if (media.favorite) {
      MediaService.RemoveFromFavorite(media.id, function(res) {
        if(res) {
          media.favorite = false;
          self.nFavorite_count -= 1;
        }
      });
    } else {
      MediaService.PutFavoriteMedia(media.id, function(res) {
        if(res) {
          media.favorite = true;
          self.nFavorite_count += 1;
        }
      });
    }
  };
});

