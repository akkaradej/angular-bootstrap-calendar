'use strict';

angular
  .module('mwl.calendar')
  .directive('mwlCalendarDay', function() {

    return {
      templateUrl: 'src/templates/calendarDayView.html',
      restrict: 'EA',
      require: '^mwlCalendar',
      scope: {
        events: '=',
        currentDay: '=',
        onEventClick: '=',
        onDayHourSplitClick: '=',
        dayViewStart: '=',
        dayViewEnd: '=',
        dayViewSplit: '='
      },
      controller: function($scope, $timeout, moment, calendarHelper, calendarConfig) {

        var vm = this;
        var dayViewStart, dayViewEnd;

        vm.calendarConfig = calendarConfig;
        vm.range = range;

        function updateDays() {
          dayViewStart = moment($scope.dayViewStart || '00:00', 'HH:mm');
          dayViewEnd = moment($scope.dayViewEnd || '23:00', 'HH:mm');
          vm.dayViewSplit = parseInt($scope.dayViewSplit);
          vm.hourHeight = (60 / $scope.dayViewSplit) * 30;
          vm.hours = [];
          var dayCounter = moment(dayViewStart);
          var currentDay = moment($scope.currentDay);
          dayCounter.date(currentDay.date());
          dayCounter.month(currentDay.month());
          dayCounter.year(currentDay.year());
          for (var i = 0; i <= dayViewEnd.diff(dayViewStart, 'hours'); i++) {
            vm.hours.push({
              time: moment(dayCounter),
              label: dayCounter.format(calendarConfig.dateFormats.hour)
            });
            dayCounter.add(1, 'hour');
          }
        }

        function range(time, splitTimeAt) {
          return {
            startsAt: moment(time).add(splitTimeAt * vm.dayViewSplit, 'minute'),
            endsAt: moment(time).add((splitTimeAt * vm.dayViewSplit) + vm.dayViewSplit, 'minute')
          };
        }

        var originalLocale = moment.locale();

        $scope.$on('calendar.refreshView', function() {

          if (originalLocale !== moment.locale()) {
            originalLocale = moment.locale();
            updateDays();
          }

          vm.view = calendarHelper.getDayView($scope.events, $scope.currentDay, dayViewStart.hours(), dayViewEnd.hours(), vm.hourHeight);

        });

        updateDays();

      },
      controllerAs: 'vm'
    };

  });
