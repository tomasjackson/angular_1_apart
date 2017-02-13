'use strict';

angular.module('frontendApp').controller('myGalleryCtrlA', function($uibModal, $scope, $rootScope, $sce , $loading, modalInstance, Authentication, angularGridInstance, MediaService) {

    // initial
    	var self = this;

        self.my_gallery = [];

    // auth check
        var isLoggedIn = Authentication.isLoggedIn();
        if (!isLoggedIn) {
            $window.location = "/#/login";
            $window.location.reload();
        }

    // convert url to safe
        $scope.trustSrc = function(src) {
            return $sce.trustAsResourceUrl(src);
        };

    // loading bar
        $scope.startLoading = function (name) {
            $loading.start(name);
        };
        $scope.finishLoading = function (name) {
            $loading.finish(name);
        };    

    // get media gallery
        $scope.startLoading('loading-gallery');

        MediaService.GetGallery(function(res){

            $rootScope.myGallery = res;
            $scope.finishLoading('loading-gallery');

        });

    // expand options in the gallery image
        self.expandOptions = function expandOptions(e , media){
            e.stopPropagation();
            e.preventDefault();
            media.expanded = !media.expanded;
            // angularGridInstance.gallery.refresh();
        };

    // parse date and time string
        self.parseDateTime

         = function (dateStr) {

            var date_obj = new Date(dateStr);

            var time = '';
            if (date_obj.getHours() < 10) {
                time = '0' + date_obj.getHours();
            }   else    {
                time = date_obj.getHours();
            }

            time += ':';

            if (date_obj.getMinutes() < 10) {
                time += '0' + date_obj.getMinutes();
            }   else    {
                time += date_obj.getMinutes();
            }

            var string_weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            var string_month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

            var date = date_obj.getDate() + ' ' + string_month[date_obj.getMonth()] + ' ' + date_obj.getFullYear();

            return {
                date : date,
                time : time
            }
        };

    // edit media
        self.EditMedia = function EditMedia(id , event , $index) {

            MediaService.fromWhere = 'GALLERY';
            MediaService.mediaId = id;

            var modal = $uibModal.open({
                animation: true,
                templateUrl: 'views/partials/modals/media/editmedia-modal.html',
                controller: 'EditMediaController',
                controllerAs: '$ctrl',
                size: 'medium-st',
                backdrop  : 'static',
                keyboard  : false,
                resolve: {
                    param: function () {
                        return {
                            'index' : $index
                        };
                    }
                }                
            });

            modalInstance.set(modal);
        };

    // open detail modal
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

    // delete medial show confirm message
        self.DeleteThisMedia = function($event , media){
            event.stopPropagation();
            media.confirm_delete = true;
        };

    // confirm message for delete
        self.ConfirmDelete = function(flag , media , $event , $index){
            event.stopPropagation();

            if (flag === 'DELETE_MEDIA') {         //Delete this media

                MediaService.DeleteMedia(media , function(response){
                    if (response) {
                        $rootScope.myGallery.splice($index , 1);
                    }
                })

            }   else if(flag === 'CANCEL_ACTION')    {       //No, cancel this action

                media.confirm_delete = false;

            }   else    {

                console.log('Unknow error occured while binding');

            }
        };        
});

