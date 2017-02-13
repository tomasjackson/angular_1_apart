'use strict';

/**
 * @ngdoc overview
 * @name frontendApp
 * @description
 * # frontendApp
 *
 * Main module of the application.
 */
angular
  .module('frontendApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap',
    'ngTagsInput',
    'ui.router',
    'ngMaterial',
    'ngDatepicker',
    'ngFileUpload',
    'base64',
    'ngImgCrop',
    'ngMaterialDatePicker',
    'infinite-scroll',
    'ui.timepicker',
    'ngSanitize',
    'darthwade.dwLoading',
    'angularGrid'
  ]).value('THROTTLE_MILLISECONDS', 1000)
  .config(function ($stateProvider, $urlRouterProvider, $qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
    $urlRouterProvider.otherwise('/');
    $stateProvider.
    state('loginPage', {
      url: '/',
      templateUrl: 'views/partials/login.html',
      controller: 'loginCtrl',
      controllerAs: 'login',
      data: {
        title: 'Login'
      }
    }).
    state('loginPage.login', {
      url: '',
      views: {
        'modals': { templateUrl: 'partials/modals.html' }
      }
    }).
    state('mainPage', {
      url: '/main',
      templateUrl: 'views/partials/main.html',
      controller: 'mainCtrl',
      controllerAs: '$ctrl'
    }).
    state('mainPage.myJournal', {
      url: '/my_journal',
      views: {
        'navbar': {
          templateUrl: 'views/partials/navbar.html',
          controller: 'NavbarCtrl',
          controllerAs: '$ctrl',
          resolve: {
            param: function () {
              return {'pageName': 'Journal'};
            }
          }
        },
        'headerCalendar': {
          templateUrl: 'views/partials/header_calendar.html',
          controller: 'HeaderCalendarCtrl',
          controllerAs: '$ctrl'
        },
        'modals': { templateUrl: 'views/partials/modals.html' },
        'bootstrapWidgets': { templateUrl: 'views/partials/bootstrap_widgets.html' },
        'mainContent': {
          templateUrl: 'views/partials/pages/my_journal.html',
          controller: 'myJournalCtrl',
          controllerAs: '$ctrl'
        }
      },
      data: {
        title: 'My Journal'
      }
    }).
    state('mainPage.sharedStories', {
      url: '/shared_stories',
      views: {
        'navbar': {
          templateUrl: 'views/partials/navbar.html',
          controller: 'NavbarCtrl',
          controllerAs: '$ctrl',
          resolve: {
            param: function () {
              return {'pageName': 'Story'};
            }
          }
        },
        'headerCalendar': {
          templateUrl: 'views/partials/header_calendar.html',
          controller: 'HeaderCalendarCtrl',
          controllerAs: '$ctrl'
        },
        'modals': { templateUrl: 'views/partials/modals.html' },
        'bootstrapWidgets': { templateUrl: 'views/partials/bootstrap_widgets.html' },
        'mainContent': {
          templateUrl: 'views/partials/pages/shared_stories.html',
          controller: 'SharedStoriesController',
          controllerAs: '$ctrl'
        }
      },
      data: {
        title: 'Shared Stories'
      }
    }).
    state('mainPage.myGallery', {
      url: '/my_gallery',
      views: {
        'navbar': {
          templateUrl: 'views/partials/navbar.html',
          controller: 'NavbarCtrl',
          controllerAs: '$ctrl',
          resolve: {
            param: function () {
              return {'pageName': 'Gallery'};
            }
          }
        },
        'headerCalendar': {
          templateUrl: 'views/partials/header_calendar.html',
          controller: 'HeaderCalendarCtrl',
          controllerAs: '$ctrl'
        },
        'modals': { templateUrl: 'views/partials/modals.html' },
        'bootstrapWidgets': { templateUrl: 'views/partials/bootstrap_widgets.html' },
        'mainContent': {
          templateUrl: 'views/partials/pages/my_gallery.html',
          controller: 'myGalleryCtrl',
          controllerAs: '$ctrl'
        }
      },
      data: {
        title: 'My Gallery'
      }
    }).
    state('mainPage.myGalleryA', {
      url: '/my_galleryA',
      views: {
        'navbar': {
          templateUrl: 'views/partials/navbar.html',
          controller: 'NavbarCtrl',
          controllerAs: '$ctrl',
          resolve: {
            param: function () {
              return {'pageName': 'Gallery'};
            }
          }
        },
        'headerCalendar': {
          templateUrl: 'views/partials/header_calendar.html',
          controller: 'HeaderCalendarCtrl',
          controllerAs: '$ctrl'
        },
        'modals': { templateUrl: 'views/partials/modals.html' },
        'bootstrapWidgets': { templateUrl: 'views/partials/bootstrap_widgets.html' },
        'mainContent': {
          templateUrl: 'views/partials/pages/my_gallery_add.html',
          controller: 'myGalleryCtrlA',
          controllerAs: '$ctrl'
        }
      },
      data: {
        title: 'My Gallery'
      }
    }).

    state('mainPage.myNotes', {
      url: '/my_notes',
      views: {
        'navbar': {
          templateUrl: 'views/partials/navbar.html',
          controller: 'NavbarCtrl',
          controllerAs: '$ctrl',
          resolve: {
            param: function () {
              return {'pageName': 'Note'};
            }
          }
        },
        'headerCalendar': {
          templateUrl: 'views/partials/header_calendar.html',
          controller: 'HeaderCalendarCtrl',
          controllerAs: '$ctrl'
        },
        'modals': { templateUrl: 'views/partials/modals.html' },
        'bootstrapWidgets': { templateUrl: 'views/partials/bootstrap_widgets.html' },
        'mainContent': {
          templateUrl: 'views/partials/pages/my_notes.html',
          controller: 'MyNotesCtrl',
          controllerAs: '$ctrl'
        }
      },
      data: {
        title: 'My Notes'
      }
    }).
    state('mainPage.allNotifications', {
      url: '/all_notifications',
      views: {
        'navbar': {
          templateUrl: 'views/partials/navbar.html',
          controller: 'NavbarCtrl',
          controllerAs: '$ctrl',
          resolve: {
            param: function () {
              return {'pageName': ''};
            }
          }
        },
        'headerCalendar': {
          templateUrl: 'views/partials/header_calendar.html',
          controller: 'HeaderCalendarCtrl',
          controllerAs: '$ctrl'
        },
        'modals': { templateUrl: 'views/partials/modals.html' },
        'bootstrapWidgets': { templateUrl: 'views/partials/bootstrap_widgets.html' },
        'mainContent': {
          templateUrl: 'views/partials/pages/all_notifications.html',
          controller: 'NotificationCtrl',
          controllerAs: '$ctrl'
        }
      },
      data: {
        title: 'All Notifications'
      }
    }).
    state('mainPage.publicProfile', {
      url: '/public_profile',
      views: {
        'navbar': {
          templateUrl: 'views/partials/navbar.html',
          controller: 'NavbarCtrl',
          controllerAs: '$ctrl',
          resolve: {
            param: function () {
              return {'pageName': ''};
            }
          }
        },
        'headerCalendar': {
          templateUrl: 'views/partials/header_calendar.html',
          controller: 'HeaderCalendarCtrl',
          controllerAs: '$ctrl'
        },
        'modals': { templateUrl: 'views/partials/modals.html' },
        'bootstrapWidgets': { templateUrl: 'views/partials/bootstrap_widgets.html' },
        'mainContent': {
          templateUrl: 'views/partials/pages/public_profile.html',
          controller: 'UserCtrl',
          controllerAs: '$ctrl'
        }
      },
      data: {
        title: 'Public Profile'
      }
    }).
    state('mainPage.myGroups', {
      url: '/my_groups',
      views: {
        'navbar': {
          templateUrl: 'views/partials/navbar.html',
          controller: 'NavbarCtrl',
          controllerAs: '$ctrl',
          resolve: {
            param: function () {
              return {'pageName': 'User'};
            }
          }
        },
        'headerCalendar': {
          templateUrl: 'views/partials/header_calendar.html',
          controller: 'HeaderCalendarCtrl',
          controllerAs: '$ctrl'
        },
        'modals': { templateUrl: 'views/partials/modals.html' },
        'bootstrapWidgets': { templateUrl: 'views/partials/bootstrap_widgets.html' },
        'mainContent': {
          templateUrl: 'views/partials/pages/my_groups.html',
          controller: 'UserGroupCtrl',
          controllerAs: '$ctrl'
        }
      },
      data: {
        title: 'My Groups'
      }
    }).
    state('mainPage.myAccount', {
      url: '/my_account',
      views: {
        'navbar': {
          templateUrl: 'views/partials/navbar.html',
          controller: 'NavbarCtrl',
          controllerAs: '$ctrl',
          resolve: {
            param: function () {
              return {'pageName': 'User'};
            }
          }
        },
        'headerCalendar': {
          templateUrl: 'views/partials/header_calendar.html',
          controller: 'HeaderCalendarCtrl',
          controllerAs: '$ctrl'
        },
        'modals': { templateUrl: 'views/partials/modals.html' },
        'bootstrapWidgets': { templateUrl: 'views/partials/bootstrap_widgets.html' },
        'mainContent': {
          templateUrl: 'views/partials/pages/my_account.html',
          controller: 'UserCtrl',
          controllerAs: 'User'
        }
      },
      data: {
        title: 'My Account'
      }
    }).
    state('mainPage.termsOfUse', {
      url: '/terms_of_use',
      views: {
        'navbar': {
          templateUrl: 'views/partials/navbar.html',
          controller: 'NavbarCtrl',
          controllerAs: '$ctrl',
          resolve: {
            param: function () {
              return {'pageName': ''};
            }
          }
        },
        'headerCalendar': {
          templateUrl: 'views/partials/header_calendar.html',
          controller: 'HeaderCalendarCtrl',
          controllerAs: '$ctrl'
        },
        'modals': { templateUrl: 'views/partials/modals.html' },
        'bootstrapWidgets': { templateUrl: 'views/partials/bootstrap_widgets.html' },
        'mainContent': {
          templateUrl: 'views/partials/pages/terms_of_use.html'
          // controller: 'myJournalCtrl',
          // controllerAs: 'myJournal'
        }
      },
      data: {
        title: 'Terms Of Use'
      }
    }).
    state('mainPage.myContacts', {
      url: '/my_contacts',
      views: {
        'navbar': {
          templateUrl: 'views/partials/navbar.html',
          controller: 'NavbarCtrl',
          controllerAs: '$ctrl',
          resolve: {
            param: function () {
              return {'pageName': 'User'};
            }
          }
        },
        'headerCalendar': {
          templateUrl: 'views/partials/header_calendar.html',
          controller: 'HeaderCalendarCtrl',
          controllerAs: '$ctrl'
        },
        'modals': { templateUrl: 'views/partials/modals.html' },
        'bootstrapWidgets': { templateUrl: 'views/partials/bootstrap_widgets.html' },
        'mainContent': {
          templateUrl: 'views/partials/pages/my_contacts.html',
          controller: 'myJournalCtrl',
          controllerAs: 'myJournal'
        }
      },
      data: {
        title: 'My Contacts'
      }
    }).
    state('mainPage.DMCA', {
      url: '/dmca',
      views: {
        'navbar': {
          templateUrl: 'views/partials/navbar.html',
          controller: 'NavbarCtrl',
          controllerAs: '$ctrl',
          resolve: {
            param: function () {
              return {'pageName': ''};
            }
          }
        },
        'headerCalendar': {
          templateUrl: 'views/partials/header_calendar.html',
          controller: 'HeaderCalendarCtrl',
          controllerAs: '$ctrl'
        },
        'modals': { templateUrl: 'views/partials/modals.html' },
        'bootstrapWidgets': { templateUrl: 'views/partials/bootstrap_widgets.html' },
        'mainContent': {
          templateUrl: 'views/partials/pages/dmca.html',
          controller: 'myJournalCtrl',
          controllerAs: 'myJournal'
        }
      },
      data: {
        title: 'DMCA'
      }
    }).
    state('mainPage.privacyPolicy', {
      url: '/privacy_policy',
      views: {
        'navbar': {
          templateUrl: 'views/partials/navbar.html',
          controller: 'NavbarCtrl',
          controllerAs: '$ctrl',
          resolve: {
            param: function () {
              return {'pageName': ''};
            }
          }
        },
        'headerCalendar': {
          templateUrl: 'views/partials/header_calendar.html',
          controller: 'HeaderCalendarCtrl',
          controllerAs: '$ctrl'
        },
        'modals': { templateUrl: 'views/partials/modals.html' },
        'bootstrapWidgets': { templateUrl: 'views/partials/bootstrap_widgets.html' },
        'mainContent': {
          templateUrl: 'views/partials/pages/privacy_policy.html'
          // controller: 'myJournalCtrl',
          // controllerAs: 'myJournal'
        }
      },
      data: {
        title: 'Privacy Policy'
      }
    }).
    state('mainPage.resultPage', {
      url: '/resultPage',
      views: {
        'navbar': {
          templateUrl: 'views/partials/navbar.html',
          controller: 'NavbarCtrl',
          controllerAs: '$ctrl',
          resolve: {
            param: function () {
              return {'pageName': ''};
            }
          }
        },
        'headerCalendar': {
          templateUrl: 'views/partials/header_calendar.html',
          controller: 'HeaderCalendarCtrl',
          controllerAs: '$ctrl'
        },
        'modals': { templateUrl: 'views/partials/modals.html' },
        'bootstrapWidgets': { templateUrl: 'views/partials/bootstrap_widgets.html' },
        'mainContent': {
          templateUrl: 'views/partials/pages/result_page.html',
          controller: 'SearchResultCtrl',
          controllerAs: '$ctrl'
        }
      },
      data: {
        title: 'Result Page'
      }
    }).
    state('mainPage.singleStory', {
      url: '/single_story/:id',
      views: {
        'navbar': {
          templateUrl: 'views/partials/navbar.html',
          controller: 'NavbarCtrl',
          controllerAs: '$ctrl',
          resolve: {
            param: function () {
              return {'pageName': 'Story'};
            }
          }
        },
        'headerCalendar': {
          templateUrl: 'views/partials/header_calendar.html',
          controller: 'HeaderCalendarCtrl',
          controllerAs: '$ctrl'
        },
        'modals': { templateUrl: 'views/partials/modals.html' },
        'bootstrapWidgets': { templateUrl: 'views/partials/bootstrap_widgets.html' },
        'mainContent': {
          templateUrl: 'views/partials/pages/single_story.html',
          controller: 'SingleStoryController',
          controllerAs: '$ctrl'
        }
      },
      data: {
        title: 'Single Story'
      }
    }).
    state('mainPage.singleStoryNoMedia', {
      url: '/single_story_no_media',
      views: {
        'navbar': {
          templateUrl: 'views/partials/navbar.html',
          controller: 'NavbarCtrl',
          controllerAs: '$ctrl',
          resolve: {
            param: function () {
              return {'pageName': 'Story'};
            }
          }
        },
        'headerCalendar': {
          templateUrl: 'views/partials/header_calendar.html',
          controller: 'HeaderCalendarCtrl',
          controllerAs: '$ctrl'
        },
        'modals': { templateUrl: 'views/partials/modals.html' },
        'bootstrapWidgets': { templateUrl: 'views/partials/bootstrap_widgets.html' },
        'mainContent': {
          templateUrl: 'views/partials/pages/single_story_no_media.html',
          controller: 'myJournalCtrl',
          controllerAs: 'myJournal'
        }
      },
      data: {
        title: 'Single Story No Media'
      }
    }).
    state('mainPage.singleStoryNoMediaVisitorsView', {
      url: '/single_story_no_media_visitors_view',
      views: {
        'navbar': {
          templateUrl: 'views/partials/navbar.html',
          controller: 'NavbarCtrl',
          controllerAs: '$ctrl',
          resolve: {
            param: function () {
              return {'pageName': 'Story'};
            }
          }
      },
        'headerCalendar': {
          templateUrl: 'views/partials/header_calendar.html',
          controller: 'HeaderCalendarCtrl',
          controllerAs: '$ctrl'
        },
        'modals': { templateUrl: 'views/partials/modals.html' },
        'bootstrapWidgets': { templateUrl: 'views/partials/bootstrap_widgets.html' },
        'mainContent': {
          templateUrl: 'views/partials/pages/single_story_no_media_visitors_view.html',
          controller: 'myJournalCtrl',
          controllerAs: 'myJournal'
        }
      },
      data: {
        title: 'Single Story No Media Visitors View'
      }
    }).
    state('mainPage.singleStoryVisitorsView', {
      url: '/single_story_visitors_view',
      views: {
        'navbar': {
          templateUrl: 'views/partials/navbar.html',
          controller: 'NavbarCtrl',
          controllerAs: '$ctrl',
          resolve: {
            param: function () {
              return {'pageName': 'Story'};
            }
          }
        },
        'headerCalendar': {
          templateUrl: 'views/partials/header_calendar.html',
          controller: 'HeaderCalendarCtrl',
          controllerAs: '$ctrl'
        },
        'modals': { templateUrl: 'views/partials/modals.html' },
        'bootstrapWidgets': { templateUrl: 'views/partials/bootstrap_widgets.html' },
        'mainContent': {
          templateUrl: 'views/partials/pages/single_story_visitors_view.html',
          controller: 'myJournalCtrl',
          controllerAs: 'myJournal'
        }
      },
      data: {
        title: 'Single Story Visitors View'
      }
    })
      .state('registerVerify' , {
      url: '/register/verify/:token',
      templateUrl: 'views/partials/login.html',
      controller: 'loginCtrl',
      controllerAs: 'login',
      data: {
        title: 'Verify Account'
      }
    })
      .state('mainPage.otherUser', {
      url: '/other_users/:id?username',
      params:{user: null},
      views: {
        'navbar': {
          templateUrl: 'views/partials/navbar.html',
          controller: 'NavbarCtrl',
          controllerAs: '$ctrl',
          resolve: {
            param: function () {
              return {'pageName': 'User'};
            }
          }
        },
        'headerCalendar': {
          templateUrl: 'views/partials/header_calendar.html',
          controller: 'HeaderCalendarCtrl',
          controllerAs: '$ctrl'
        },
        'modals': { templateUrl: 'views/partials/modals.html' },
        'bootstrapWidgets': { templateUrl: 'views/partials/bootstrap_widgets.html' },
        'mainContent': {
          templateUrl: 'views/partials/pages/other_users.html',
          controller: 'OtherUserCtrl',
          controllerAs: '$ctrl'
        }
      },

      data: {
        title: 'Other Users'
      }
    })
      .state('passwordVerify' , {
      url: '/reset/:token',
      templateUrl: 'views/partials/login.html',
      controller: 'loginCtrl',
      controllerAs: 'login',
      data: {
        title: 'ForgotPassword'
      }
    });
  })
  .run(function ($rootScope) {

    $rootScope.userAvatar = '';
    $rootScope.userName = '';
    $rootScope.myStories = [];
    $rootScope.sinceDate = new Date().getTime()/1000;
    $rootScope.untilDate = new Date('1971-1-1').getTime()/1000;
    $rootScope.mini_date = 0;
    $rootScope.searchQuery = [];
    $rootScope.searchActived = false;
    $rootScope.searchResult = [];
    $rootScope.myGallery = [];
    $rootScope.journal_updated = false;

    $rootScope.calendar_show = false;

    $rootScope.open_calendar = true;

    $rootScope.finish_flag = false;
  })
  .constant('Config', {
    /*
     Allows to rewrite urls on which api calls and resource retrieval are performed.
     Remove this section to leave urls as defined in the code.
     */
    urlRewrite: {
      //String or regular expression to match
      match: /^\/api\//,
      //String to replace
      replace: 'https://secure.budgettracker.com/api/'
    },
    FBToken: 'FBToken'
});
