/**
 * Created by brandonj on 2/7/19.
 */

(function() {
	"use strict";

	angular
		.module('budget.ui')
		.factory('RouterService', RouterService);

	RouterService.$inject = ['RouterConstants'];

	function RouterService(RouterConstants) {

		var service = {
			getNavParentState: getNavParentState
		};

		return service;


		/*
		 * getNavParentState - returns the parent nav item state
		 */
		function getNavParentState(routeName) {

			var parentState = null;

			switch(routeName) {
				case RouterConstants.ROUTE_PARENTS.HOME:
				case RouterConstants.ROUTE_PARENTS.LOGIN:
				case RouterConstants.ROUTE_PARENTS.SIGNUP:
					parentState = RouterConstants.ROUTE_PARENTS.HOME;
					break;

				case RouterConstants.ROUTE_PARENTS.DASHBOARD:
					parentState = RouterConstants.ROUTE_PARENTS.DASHBOARD;
					break;

				case RouterConstants.ROUTE_PARENTS.ACCOUNT:
				case RouterConstants.ROUTE_PARENTS.ACCOUNT_CREATE:
				case RouterConstants.ROUTE_PARENTS.ACCOUNT_TRANSACTIONS:
				case RouterConstants.ROUTE_PARENTS.ACCOUNT_BUDGET:
					parentState = RouterConstants.ROUTE_PARENTS.ACCOUNT;
					break;
				case RouterConstants.ROUTE_PARENTS.SETTINGS:
				case RouterConstants.ROUTE_PARENTS.TAG_MANAGER:
					parentState = RouterConstants.ROUTE_PARENTS.SETTINGS;
					break;
			}

			return parentState;
		}
	}
})();
