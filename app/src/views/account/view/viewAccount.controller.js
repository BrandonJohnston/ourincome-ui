/**
 * Created by brandonj on 4/10/17.
 */

angular
	.module('budget.ui')
	.controller('viewAccountController', viewAccountController);


viewAccountController.$inject = [
	'$log',
	'$stateParams',
	'AccountFactory'
];


function viewAccountController($log, $stateParams, AccountFactory) {

	var vm = this;
	$log.debug("viewAccountController");


	// Setup functions
	//


	// Setup variables
	vm.isReady = false;
	vm.isError = false;

	var accountData = {
		accountName: null,
		accountId: $stateParams.accountId || null,
		startingBalance: null,
		transactions: []
	};


	init();


	// init function
	function init() {

		// Get account details
		AccountFactory.getAccountDetails(accountData).then(
			function (response) {

				// If the account exists...
				if (response.accountExists) {

					// Process returned data
					accountData.accountName = response.accountName;
					accountData.startingBalance = response.accountBalance;
					accountData.transactions = response.transactions;

					// Calculate the account balance
					accountData.calculatedBalance = AccountFactory.calculateAccountBalance(
						accountData.startingBalance,
						accountData.transactions
					);

					// Set the account data factory object
					AccountFactory.setAccountData(accountData);

					// Enable the view if the account exists
					vm.isReady = true;

				} else {

					// TODO: Process error

					// Done loading data... disable the loading message
					vm.isReady = true;

					// Enable the error message
					vm.isError = true;
				}
			}
		);
	}


	/*******************************************************************
	 * Public Functions
	 *******************************************************************/

	//


	/*******************************************************************
	 * Private Functions
	 *******************************************************************/

	//


	/*******************************************************************
	 * Listeners
	 *******************************************************************/

	//
}
