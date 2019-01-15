/**
 * Created by brandonj on 4/10/17.
 */

angular
	.module('budget.ui')
	.controller('deleteTransactionModalController', deleteTransactionModalController);


deleteTransactionModalController.$inject = [
	'$log',
	'$scope'
];


function deleteTransactionModalController($log, $scope) {

	var vm = this;
	$log.debug('deleteTransactionModalController');


	// Setup functions
	//


	// Setup variables
	vm.options = $scope.options;
	vm.transactionData = $scope.data.transaction;
	$log.debug("vm.transactionData");
	$log.debug(vm.transactionData);


	init();

	function init() {

		vm.options.actionValid = true;
	}


	/*******************************************************************
	 * Public Functions
	 *******************************************************************/

	/*
	 *
	 */


	/*******************************************************************
	 * Private Functions
	 *******************************************************************/

	/*
	 *
	 */
}
