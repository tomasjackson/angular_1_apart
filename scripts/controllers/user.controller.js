'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('UserCtrl', function ($scope, UserService, Authentication, $window, $rootScope, $state) {

    var isLoggedIn = Authentication.isLoggedIn();

    if (!isLoggedIn) {
      $window.location = "/#/login";
      $window.location.reload();
    }

    $scope.editableProfile = false;

    $scope.ErrorMessage = '';
    $scope.SuccessMessage = '';

    $scope.PassErrorMessage = '';
    $scope.PassSuccessMessage = '';

    $scope.userInfo = {
      avatar: './assets/img/no-avatar.png'
    };

    $scope.pass = {
      current: '',
      password: '',
      repeat: ''
    };

    $scope.permission = {
      firstname: 'private',
      lastname: 'private',
      email: 'private',
      profession: 'private',
      website: 'private',
      phone: 'private',
      birthdate: 'private',
      numOfStories: 'private',
      numOfPictures: 'private',
      numOfVideos: 'private',
      numOfFavoriteUsers: 'private',
      favoriteBy: 'private'
    };

    $scope.MainSocialNet = [{
        name:'facebook',
        selected: true,
        link: ''
      },
      {
        name:'twitter',
        selected: true,
        link: ''
      },
      {
        name:'google',
        selected: true,
        link: ''
      }
    ];

    $scope.otherSocialNet = [{
        name: 'pinterest',
        selected: false,
        link: ''
      },
      {
        name: 'tumblr',
        selected: false,
        link: ''
      },
      {
        name: 'linkedin',
        selected: false,
        link: ''
      }
    ];

    $scope.social_Placeholder = 'Choose a Network';

    $scope.showAddSocialNet = false;
    $scope.newLink = '';

    $scope.publicFields = {};

    $scope.today = function () {
      $scope.start_date = new Date();
      $scope.end_date = new Date();
    };
    $scope.today();

    $scope.birthday = new Date();


    var self = this;

    self.viewMode = 'ABOUT';

    // Disable weekend selection
    function disabled(data) {
      var date = data.date,
        mode = data.mode;
      return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
    }

    $scope.EditBirthday = function () {
      $scope.birthdayPicker.opened = true;
    };

    $scope.format = 'yyyy/MM/dd';

    $scope.birthdayPicker = {
      opened: false
    };

    function getDayClass(data) {
      var date = data.date,
        mode = data.mode;
      if (mode === 'day') {
        var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

        for (var i = 0; i < $scope.events.length; i++) {
          var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

          if (dayToCheck === currentDay) {
            return $scope.events[i].status;
          }
        }
      }
      return '';
    }

    $scope.inlineOptions = {
      customClass: getDayClass,
      minDate: new Date(),
      showWeeks: true
    };

    $scope.dateOptions = {
      dateDisabled: disabled,
      formatYear: 'yy',
      maxDate: new Date(2020, 5, 22),
      minDate: new Date(1900, 1, 1),
      startingDay: 1
    };

    $scope.editProfile = function () {
      $scope.editableProfile = !$scope.editableProfile;
      getUserInfo();
    };

    $scope.$watch('avatar', function (newValue, oldValue) {
      if (!angular.equals(newValue, oldValue)) {
        uploadAvatar(newValue);
      }
    });

    function getUserInfo() {
      UserService.getUserInfo(function (response) {
        if(response) {
          $scope.userInfo = response;
          $scope.birthday = new Date($scope.userInfo.birthdate);
          $scope.birthdayLabel = $scope.birthday.getFullYear() + '/' + ($scope.birthday.getMonth() + 1) + '/' + $scope.birthday.getDate();
          console.log('getUserInfo = ', response);

          $scope.MainSocialNet[0].name = 'google';
          $scope.MainSocialNet[0].link = $scope.userInfo.social.google;

          $scope.MainSocialNet[1].name = 'facebook';
          $scope.MainSocialNet[1].link = $scope.userInfo.social.facebook;

          $scope.MainSocialNet[2].name = 'twitter';
          $scope.MainSocialNet[2].link = $scope.userInfo.social.twitter;

          $scope.otherSocialNet[0].name = 'tumblr';
          $scope.otherSocialNet[0].link = $scope.userInfo.social.tumblr;

          $scope.otherSocialNet[1].name = 'linkedin';
          $scope.otherSocialNet[1].link = $scope.userInfo.social.linkedin;

          $scope.otherSocialNet[2].name = 'pinterest';
          $scope.otherSocialNet[2].link = $scope.userInfo.social.pinterest;

          UserService.getUserPermission(function (response) {
            //if (response.settings.firstname !== null) {
            if (response) {
              $scope.permission = response.settings;
              console.log('getUserPermission = ', $scope.permission);
              getPublicUserInfo();
            }
          });
        }
      });

      UserService.getUserStateInfo(function(response) {
        if(response) {
          $scope.userState = response;
        }
        console.log('getUserStateInfo = ', response);
      });
    }

    function getPublicUserInfo() {
      var permission_field, user_field;
      for (permission_field in $scope.permission) {
        if ($scope.permission[permission_field] === 'public') {
          for (user_field in $scope.userInfo) {
            if(user_field === permission_field) {
              if($scope.userInfo[user_field] !== null && $scope.userInfo[user_field] !== '') {
                if(user_field === 'birthdate') {
                  $scope.publicFields['birthday'] = $scope.birthdayLabel;
                  break;
                } else {
                  $scope.publicFields[user_field] = $scope.userInfo[user_field];
                  break;
                }
              } else {
                break;
              }
            }
          }
        }
      }
    }

    getUserInfo();

    $scope.changePass = function() {
      $scope.PassErrorMessage = '';
      $scope.PassSuccessMessage = '';
      validatePassword();
    };

    $scope.pass_close = function() {
      $scope.pass = {
        current: '',
        password: '',
        repeat: ''
      };
      $scope.PassErrorMessage = '';
      $scope.PassSuccessMessage = '';
    };

    $scope.pass_close_modal = function($event) {
      $event.preventDefault();
      $scope.pass = {
        current: '',
        password: '',
        repeat: ''
      };
      $scope.PassErrorMessage = '';
      $scope.PassSuccessMessage = '';
      if($('#change-pass').hasClass('in')){
        $('#change-pass.collapse').collapse('hide');
      }
    };

    $scope.close_del_modal = function($event) {
      if($('#delete-account-options').hasClass('in')){
        $('#delete-account-options.collapse').collapse('hide');
      }
    };

    function validatePassword() {
      if($scope.pass.current !== '' && $scope.pass.password !== '' && $scope.pass.repeat !== '') {
        if($scope.pass.password !== $scope.pass.repeat) {
          $scope.PassErrorMessage = 'Password does not match.';
        }
        else {
          UserService.changePassword($scope.pass, function(response) {
            if(response) {
              $scope.PassSuccessMessage = response.message;
            }
            else {
              console.log('change password failed');
              //$scope.PassErrorMessage = response.message;
            }
          });
        }
      }
      else {
        $scope.PassErrorMessage = 'Password can not be empty.';
      }
    }

    $scope.saveProfile = function() {
      $scope.userInfo.birthdate = $scope.birthday.getFullYear() + '/' + ($scope.birthday.getMonth() + 1) + '/' + $scope.birthday.getDate();

      var social = {};
      for(var i = 0; i < $scope.MainSocialNet.length; i++) {

        switch ($scope.MainSocialNet[i].name) {
          case 'google':
                social.google = $scope.MainSocialNet[i].link;
                break;
          case 'facebook':
                social.facebook = $scope.MainSocialNet[i].link;
                break;
          case 'twitter':
                social.twitter = $scope.MainSocialNet[i].link;
                break;
          case 'tumblr':
                social.tumblr = $scope.MainSocialNet[i].link;
                break;
          case 'pinterest':
                social.pinterest = $scope.MainSocialNet[i].link;
                break;
          case 'linkedin':
                social.linkedin = $scope.MainSocialNet[i].link;
                break;
        }
      }

      console.log('saveProfile = ', $scope.userInfo);
      UserService.saveProfile($scope.userInfo, function(response) {
        if(response) {
          UserService.savePermission($scope.permission, function(response) {
            if(response) {
              UserService.saveSocialInfo(social, function(response) {
                if(response) {
                  $scope.SuccessMessage = response.message;
                  $scope.editProfile();
                  $rootScope.userName = $scope.userInfo.username;
                }
                else {
                  //$scope.ErrorMessage = response.message;
                }
              });
            }
            else {
              //$scope.ErrorMessage = response.message;
            }
          });
        }
        else {
          //$scope.ErrorMessage = response.message;
        }
      });
    };

    function uploadAvatar(file) {
      if (!file.$error) {
        var reader = new FileReader();

        reader.onload = function (e) {
          UserService.UploadAvatar(e.target.result.substring(e.target.result.search('base64,') + 7 , e.target.result.length), file.type, file.size, function(response) {

            if(response) {
              $scope.userInfo.avatar = response.avatar;
              $rootScope.userAvatar = $scope.userInfo.avatar;
            }
          });
        };

        reader.readAsDataURL(file);
      }
    }

    $scope.publicPage = function() {
      //$window.location = "/#/public_profile";
      $state.go('mainPage.publicProfile');
    };

    $scope.removeSocialNet = function(net) {
      console.log(net);
      for (var index = 0; index < $scope.MainSocialNet.length; index++) {
        // If current array item equals itemToRemove then
        if ($scope.MainSocialNet[index].name === net.name) {
          // Remove array item at current index
          $scope.MainSocialNet.splice(index, 1);

          // Decrement index to iterate current position
          // one more time, because we just removed item
          // that occupies it, and next item took it place
          index--;
        }
      }
    };

    $scope.addSocialNet = function() {
      $scope.showAddSocialNet = true;
    };

    $scope.chooseNet = function(net) {
      $scope.social_Placeholder = net.name;
    };

    $scope.addNewLink = function() {
      if($scope.newLink) {
        $scope.MainSocialNet.push({
          name: $scope.social_Placeholder,
          selected: true,
          link: $scope.newLink
        });

        for (var index = 0; index < $scope.otherSocialNet.length; index++) {
          if ($scope.otherSocialNet[index].name === $scope.social_Placeholder) {
            $scope.otherSocialNet.splice(index, 1);
            index--;
          }
        }
        $scope.showAddSocialNet = false;
        $scope.newLink = '';
        $scope.social_Placeholder = 'Choose a Network';
      }
    };
  });
