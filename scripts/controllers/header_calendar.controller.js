'use strict';

angular.module('frontendApp').controller('HeaderCalendarCtrl', function($scope, $rootScope, $uibModal, $loading, $sce, $timeout, StoryManager, modalInstance) {

	// initial
		var self = this;
    self.modalInstance = modalInstance;

	// calendar data
		var today = new Date();		// get today
		var year_page = parseInt(today.getFullYear() / 10);		// parsing year to pagenation

		self.year_list = [];		// this variable is needed for keeping 10 period year date
		self.month_display = [];	// this varialbe is needed for showing months on year/month picker

		self.selected_date = {		// this variable is needed for reserving selected year/month
			year: today.getFullYear(),
			month: today.getMonth(),
			month_string: ''
		};

		self.calendar_info = {		// this variable is for drawing big calendar
			'week_1' : [],
			'week_2' : [],
			'week_3' : [],
			'week_4' : [],
			'week_5' : [],
			'week_6' : []
		};
    var initializing = true;
    $scope.$watch(function() {
      return $rootScope.finish_flag;
    }, function() {
      if (initializing) {
        $timeout(function() { initializing = false; });
      } else {
        if ($rootScope.finish_flag) {
          DrawCalendar(self.selected_date.year, self.selected_date.month);
          $rootScope.finish_flag = false;
        }
      }
    },  true);
	// dw loading begin/end functions
	    $scope.startLoading = function (name) {
	        $loading.start(name);
	    };
	    $scope.finishLoading = function (name) {
	        $loading.finish(name);
	    };

	// trust src
	    $scope.trustSrc = function(src) {
	        return $sce.trustAsResourceUrl(src);
	    };

	// temp variables
		var init_month = [];	//temp variables used for once at initial

		var query = {
			query : null,
			date : self.selected_date.year + '-' + (self.selected_date.month + 1)
		};

		var search_result = [];



	// construction function
		function CalendarInfo(year_page) {

			self.year_list.length = 0;
		// constructing calendar data
			for (var year = 0; year < 10; year++) {
				self.year_list.push({year : year_page * 10 + year + 1 , current: false , month: []});

				if (self.year_list[year].year == today.getFullYear()) {
					self.year_list[year].current = true;
					init_month = self.year_list[year];
				}

				for (var i = 0; i < 12; i++) {
					self.year_list[year].month.push({month : MonthConverter(i).month , current: false});
					if (self.year_list[year].current) {
						if (self.year_list[year].month[i].month == MonthConverter(today.getMonth()).month) {
							self.year_list[year].month[i].current = true;
						}
					}
				}
			}
		}

		function MonthConverter(month , year) {

			var month_array = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
			var full_month_array = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

			return {
				month : month_array[month],
				full_month : full_month_array[month]
			}
		}
	// initializing calendar information variable
		function InitCalenderInfo() {
			for (var i = 0; i < 7; i++) {
				self.calendar_info.week_1[i] = {'cal_info' : false, 'date' : null, 'stories' : []};
			}
			for (var i = 0; i < 7; i++) {
				self.calendar_info.week_2[i] = {'cal_info' : false, 'date' : null, 'stories' : []};
			}
			for (var i = 0; i < 7; i++) {
				self.calendar_info.week_3[i] = {'cal_info' : false, 'date' : null, 'stories' : []};
			}
			for (var i = 0; i < 7; i++) {
				self.calendar_info.week_4[i] = {'cal_info' : false, 'date' : null, 'stories' : []};
			}
			for (var i = 0; i < 7; i++) {
				self.calendar_info.week_5[i] = {'cal_info' : false, 'date' : null, 'stories' : []};
			}
			for (var i = 0; i < 7; i++) {
				self.calendar_info.week_6[i] = {'cal_info' : false, 'date' : null, 'stories' : []};
			}
		}

	// push info to calendar information variable
		function PushCalendarInfo(week_num, date, index) {
			if (week_num == 0) {
				self.calendar_info.week_1[index].cal_info = true;
				self.calendar_info.week_1[index].date = date;
			}	else if (week_num == 1)	{
				self.calendar_info.week_2[index].cal_info = true;
				self.calendar_info.week_2[index].date = date;
			}	else if (week_num == 2)	{
				self.calendar_info.week_3[index].cal_info = true;
				self.calendar_info.week_3[index].date = date;
			}	else if (week_num == 3)	{
				self.calendar_info.week_4[index].cal_info = true;
				self.calendar_info.week_4[index].date = date;
			}	else if (week_num == 4)	{
				self.calendar_info.week_5[index].cal_info = true;
				self.calendar_info.week_5[index].date = date;
			}	else if (week_num == 5)	{
				self.calendar_info.week_6[index].cal_info = true;
				self.calendar_info.week_6[index].date = date;
			}	else	{
				console.log('error');
			}

		}

	// push journal date to calendar information variable
		function PushJournalInfo(week_num, story, index)  {
			if (week_num == 0) {
				self.calendar_info.week_1[index].stories.push(story);
			}	else if (week_num == 1)	{
				self.calendar_info.week_2[index].stories.push(story);
			}	else if (week_num == 2)	{
				self.calendar_info.week_3[index].stories.push(story);
			}	else if (week_num == 3)	{
				self.calendar_info.week_4[index].stories.push(story);
			}	else if (week_num == 4)	{
				self.calendar_info.week_5[index].stories.push(story);
			}	else if (week_num == 5)	{
				self.calendar_info.week_6[index].stories.push(story);
			}	else	{
				console.log('error');
			}
		}

	// construct big calendar date from selected year and month
		function DrawCalendar(year, month) {

			InitCalenderInfo();					// initializing calendar

			var total_date_num = new Date(year, month + 1, 0).getDate();
			var start_week_day = new Date(year, month, 1).getDay();

			var week_num = 0;
			var week_day = start_week_day;
			for (var day = 1; day <= total_date_num; day++) {

				if (week_day > 6) {
					week_day = 0;
					week_num ++;
				}
				PushCalendarInfo(week_num, day, week_day);
				week_day++;
			}

			var query = {
				query : null,
				date : self.selected_date.year + '-' + (self.selected_date.month + 1)
			};
      if (self.selected_date.month < 9) query.date = self.selected_date.year + '-' + '0' + (self.selected_date.month + 1);
			$scope.startLoading('loading-calendar');
			StoryManager.SearchStoryAction(query, function(res) {
				if (res) {
					search_result = res.data.stories;
					console.log(search_result);
					for (var i = 0; i < search_result.length; i++) {
						AlignJournalStories(search_result[i]);
					}
					$scope.finishLoading('loading-calendar');
				}
			});

		}

	// getting week number from the date
		function GetWeekNum(year, month, day) {

			var start_week_day = new Date(year, month, 1).getDay();
			var week_num = 0;
			var week_day = start_week_day;

			for (var i = 0; i < day; i++) {

				if (week_day > 6) {
					week_day = 0;
					week_num ++;
				}
				week_day ++;
			}

			return {
				'week_num' : week_num
			}
		}

	// sort journal story to calendar information variable
		function AlignJournalStories(story) {

			var date_obj = new Date(story.userDate);
			var week_num = GetWeekNum(date_obj.getFullYear(), date_obj.getMonth(), date_obj.getDate()).week_num;
			var index_num = date_obj.getDay();

			PushJournalInfo(week_num, story, index_num);

		}

	// initial date construct
		CalendarInfo(year_page);
		self.month_display = init_month.month;

		self.selected_date.year = today.getFullYear();
		self.selected_date.month = today.getMonth();
		self.selected_date.month_string = MonthConverter(today.getMonth()).full_month;

		DrawCalendar(self.selected_date.year, self.selected_date.month);

	// next/prev year
		self.YearPage = function($event , option) {
			$event.stopPropagation();
			if (option == 'PREV') {
				year_page --;
				CalendarInfo(year_page);

			}	else if (option == 'NEXT') {
				year_page ++;
				CalendarInfo(year_page);

			}	else {
				console.log('error');
			}
		};

	// click year
		self.YearClick = function($event, year) {
			$event.stopPropagation();
			self.month_display = year.month;
			self.selected_date.year = year.year;
		};

	// click month
		self.MonthClick = function($event, index) {
			self.selected_date.month = index;
			self.selected_date.month_string = MonthConverter(index).full_month;
      console.log(self.selected_date);
			DrawCalendar(self.selected_date.year, self.selected_date.month);
		};

	// click day from the big calendar
		self.fnAppendStoriesBox = function($event, cal, $index) {
			if (cal.stories.length) {
				cal.append_flag = !cal.append_flag;
			}
		};

	// mouse leave from td in big calendar
		self.fnMouseLeave = function($event, cal) {
			cal.append_flag = false;
		};

	// get substring of description
		self.GetSubString = function(str) {
			if (str.length > 40) {
				return str.substring(0, 40) + '...';
			}	else	{
				return str;
			}
		};

    self.CalendarNavigating = function($event, cases) {
      switch (cases) {
        case 'NEXT':
          if (self.selected_date.month == 11) {
            self.selected_date.month = 0;
            self.selected_date.year += 1;
          } else {
            self.selected_date.month += 1;
          }
          self.selected_date.month_string = MonthConverter(self.selected_date.month).full_month;
          break;
        case 'PREV':
          if (self.selected_date.month == 0) {
            self.selected_date.month = 11;
            self.selected_date.year -= 1;
          } else {
            self.selected_date.month -= 1;
          }
          self.selected_date.month_string = MonthConverter(self.selected_date.month).full_month;
          break;
        default:
          break;
      }
      DrawCalendar(self.selected_date.year, self.selected_date.month);
    };

    self.AddNewStory = function(cal, week_num) {
      var date_string = self.selected_date.year + '-' + self.selected_date.month_string + '-' + cal.date;

      var modal = $uibModal.open({
        animation: true,
        templateUrl: 'views/partials/modals/createnewstory-modal.html',
        controller: 'createnewstoryModalController',
        controllerAs: '$ctrl',
        size: 'medium-st',
        backdrop  : 'static',
        keyboard  : false ,
        resolve: {
          param: function () {
            return {
              'story': [] ,
              'fromWhere' : '',
              'date': date_string
            };
          }
        }
      });
      self.modalInstance.set(modal);
    };

    // hiding boxes when leaving container
    angular.element('.calendar-main-wrap .container').mouseleave(function(){
      angular.element(this).find('.stories-box').remove();
    });

});

