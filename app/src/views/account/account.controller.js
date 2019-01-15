/**
 * Created by brandonj on 4/10/17.
 */

angular
	.module('budget.ui')
	.controller('accountController', accountController);


accountController.$inject = [
	'$rootScope',
	'$scope',
	'$log',
	'$state',
	'UserService'
];


function accountController($rootScope, $scope, $log, $state, UserService) {

	var vm = this;
	$log.debug("accountController");


	// Setup functions
	//


	// Setup variables
	//


	/*
	 * Get any user data
	 */
	//


}