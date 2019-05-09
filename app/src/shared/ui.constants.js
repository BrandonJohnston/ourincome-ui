/**
 * Created by brandonj on 7/7/17.
 */

(function() {
	"use strict";

	angular.module('budget.ui')
		.constant('CalendarConstants', {
			'DATE_SHORT_FORMAT': 'L',
			'DATE_LONG_FORMAT': 'll',
			'DATE_TIME_FORMAT': 'lll',
			'DATE_ID_FORMAT': 'YYYY-MM-DD',
			'DATE_NICE_FORMAT': 'MMM. DD',
			'DATE_NICE_FORMAT_MAY': 'MMM DD',
			'DATE_NICE_FULL_FORMAT': 'MMM. DD, YYYY',
			'DATE_NICE_FULL_FORMAT_MAY': 'MMM DD, YYYY',
			'DATE_MONTH_FORMAT': 'MMMM YYYY',
			'DATE_YEAR_MONTH': 'YYYYMM',
			'DATE_YEAR_MONTH_DAY': 'YYYYMMDD'
		})
		.constant('moment', moment)
		.constant('EventsConstants', {
			'UPDATE_ACCOUNT_BALANCE': 'updateAccountBalance'
		});
})();
