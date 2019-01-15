/**
 * Created by brandonj on 10/30/17.
 */

angular
	.module('budget.ui')
	.controller('budgetPopoverController', budgetPopoverController);


budgetPopoverController.$inject = [
	'$log',
	'$scope'
];


function budgetPopoverController($log, $scope) {

	var vm = this;
	$log.debug('budgetPopoverController');


	// Setup functions
	//


	// Setup variables
	vm.config = $scope.config;
	vm.close = $scope.close || null;


}
