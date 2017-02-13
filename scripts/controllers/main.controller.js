'use strict';

angular.module('frontendApp').controller('mainCtrl', function($scope, $rootScope ,mainService) {

	var self = this;

	self.service = mainService;
  mainService.commonjQuery();

  $rootScope.open_calendar = true;

  $scope.short_today = {
    year: '',
    month: '',
    day: '',
    weekday: ''
  };

  $scope.today_date = new Date(1900, 1, 1);
  $scope.calendar = new Date(1990, 1, 1);

  $scope.today = function() {
    $scope.calendar = new Date();
    $scope.today_date = new Date();
    makeShortDate($scope.today_date);
  };

  function makeShortDate(date) {
    $scope.short_today.weekday = getWeekday(date);
    $scope.short_today.month = getMonthName(date).short;
    $scope.short_today.day = date.getDate();
    $scope.short_today.year = date.getFullYear();

  }
  function getWeekday(date) {
    var weekday;

    switch (date.getDay()) {
      case 0:
        weekday = 'Sunday';
        break;
      case 1:
        weekday = 'Monday';
        break;
      case 2:
        weekday = 'Tuesday';
        break;
      case 3:
        weekday = 'Wednesday';
        break;
      case 4:
        weekday = 'Thursday';
        break;
      case 5:
        weekday = 'Friday';
        break;
      case 6:
        weekday = 'Saturday';
        break;
    }

    return weekday;
  }

  function getMonthName(date) {
    var month = {
      full: '',
      short: ''
    };

    switch (date.getMonth()) {
      case 0:
        month.full = 'January';
        month.short = 'Jan';
        break;
      case 1:
        month.full = 'February';
        month.short = 'Feb';
        break;
      case 2:
        month.full = 'March';
        month.short = 'Mar';
        break;
      case 3:
        month.full = 'April';
        month.short = 'Apr';
        break;
      case 4:
        month.full = 'May';
        month.short = 'May';
        break;
      case 5:
        month.full = 'June';
        month.short = 'Jun';
        break;
      case 6:
        month.full = 'July';
        month.short = 'Jul';
        break;
      case 7:
        month.full = 'August';
        month.short = 'Aug';
        break;
      case 8:
        month.full = 'September';
        month.short = 'Sep';
        break;
      case 9:
        month.full = 'October';
        month.short = 'Oct';
        break;
      case 10:
        month.full = 'November';
        month.short = 'Nov';
        break;
      case 11:
        month.full = 'December';
        month.short = 'Dec';
        break;
    }

    return month;
  }

  $scope.$watch('calendar', function (newValue, oldValue) {
    if (!angular.equals(newValue, oldValue)) {
      var date = new Date(newValue);
      console.log(newValue);
      $rootScope.mini_date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    }
  });


  $scope.today();

  $scope.options = {
    customClass: getDayClass,
    showWeeks: false
  };

  $scope.setDate = function(year, month, day) {
    $scope.calendar = new Date(year, month, day);
  };

  function getDayClass(data) {
    var date = data.date,
      mode = data.mode;
    return '';
  }
  /*--------------------------------
  * Get Month and year click event
  ---------------------------------*/
  self.CalendarClick = function($event) {

    if ($event.target.className.indexOf('uib-left') > 0 || $event.target.className.indexOf('uib-right') > 0){
      var temp_date_string = $event.target.parentNode.parentNode.getElementsByTagName('th')[1].getElementsByTagName('strong')[0].innerHTML;
      if (temp_date_string.length == 4){
        console.log(temp_date_string);
        $rootScope.mini_date = temp_date_string;
      } else if (temp_date_string.indexOf('-') > 0) {
        console.log('ignore');
      } else {
        console.log((new Date(temp_date_string).getFullYear() + '-' + (new Date(temp_date_string).getMonth() + 1)));
        $rootScope.mini_date = new Date(temp_date_string).getFullYear() + '-' + (new Date(temp_date_string).getMonth() + 1);
      }
    }

    var element = null;
    var native_element = null;

    if ($event.target.tagName == 'BUTTON' ) {
      element = $event.target.getElementsByTagName('span')[0];
      native_element = $event.target.getElementsByTagName('span')[0];
    } else if ($event.target.tagName == 'SPAN') {
      element = $event.target;
      native_element = $event.target;
    } else {
      return 0;
    }

    for (var i = 0; i < 5; i++) {
      if (element) {  element = element.parentNode;
      } else { return 0;  }
    }
    if (element) {
      var classname = element.getAttribute('class');
      if (classname == 'uib-monthpicker') {

        var month = native_element.innerHTML;
        var parent = native_element.parentNode.parentNode.parentNode.parentNode.parentNode;
        var temp = parent.getElementsByTagName('thead');

        var year = temp[0].getElementsByTagName('th')[1].getElementsByTagName('strong')[0].innerHTML;

        var last = new Date(year , getMonthFromString(month) , 0).getDate();

        var date_string = year + ' ' + month + ' ' + last;

        if (new Date(date_string).getMonth() < 9) {
          $rootScope.mini_date = year + '-0' + (new Date(date_string).getMonth() + 1);
        } else {
          $rootScope.mini_date = year + '-' + (new Date(date_string).getMonth() + 1);
        }
        console.log($rootScope.mini_date);

      } else if (classname == 'uib-yearpicker') {

        var year = native_element.innerHTML;

        $rootScope.mini_date = year;

      } else {
        return 0;
      }
    }
  };

  self.onSelectToday = function () {
    //$scope.today();
    $rootScope.mini_date = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();
  };

  function getMonthFromString(mon){
     return new Date(Date.parse(mon +" 1, 2012")).getMonth()+1
  }

  self.OnCollapseCalendar = function ($event) {
    $rootScope.open_calendar = !$rootScope.open_calendar;
  }
});

