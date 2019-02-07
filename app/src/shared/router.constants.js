/**
 * Created by brandonj on 2/7/19.
 */

(function() {
	"use strict";

	angular.module('budget.ui')
		.constant('RouterConstants', {
			'ROUTE_PARENTS': {
				'HOME': 'home',
				'LOGIN': 'login',
				'SIGNUP': 'signup',
				'DASHBOARD': 'dashboard',
				'ACCOUNT': 'account',
				'ACCOUNT_CREATE': 'account.create',
				'ACCOUNT_TRANSACTIONS': 'account.view.transactions',
				'ACCOUNT_BUDGET': 'account.view.budget'
			}
		});
})();