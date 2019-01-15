/**
 * Created by brandonj on 4/10/17.
 */

angular
	.module('budget.ui')
	.controller('accountTransactionsController', accountTransactionsController);


accountTransactionsController.$inject = [
	'$log',
	'$scope',
	'$state',
	'$stateParams',
	'$translate',
	'$filter',
	'budgetModal',
	'AccountFactory',
	'EventsConstants',
	'AccountConstants',
	'UtilsService'
];


function accountTransactionsController($log, $scope, $state, $stateParams, $translate, $filter, budgetModal, AccountFactory,
                                       EventsConstants, AccountConstants, UtilsService) {

	var vm = this;
	$log.debug('accountTransactionsController');


	// Setup functions
	vm.navigate = navigate;
	vm.isTransactionRow = isTransactionRow;
	vm.openRowOptions = openRowOptions;
	vm.closeRowOptions = closeRowOptions;


	// Setup variables
	vm.accountData = AccountFactory.getAccountData();
	vm.openOptionsRow = false;
	vm.rowPopoverConfig = null;


	// Local vars
	var translationKeys = [
		'budget.ACCOUNT.VIEW.OPTIONS_POPOVER.HEADER',
		'budget.ACCOUNT.VIEW.OPTIONS_POPOVER.EDIT',
		'budget.ACCOUNT.VIEW.OPTIONS_POPOVER.DELETE',
		'budget.ACCOUNT.EDIT_TRANSACTION_MODAL.HEADER',
		'budget.ACCOUNT.EDIT_TRANSACTION_MODAL.SAVE_ACTION'
	];

	var translationValues;


	init();


	// init function
	function init() {

		// Get translations, then process
		$translate(translationKeys).then(function(translations) {

			translationValues = translations;

			// Setup popover config
			vm.rowPopoverConfig = {
				title: translationValues['budget.ACCOUNT.VIEW.OPTIONS_POPOVER.HEADER'],
				listOptions: [
					{
						text: translationValues['budget.ACCOUNT.VIEW.OPTIONS_POPOVER.EDIT'],
						onclick: editTransaction
					},
					{
						text: translationValues['budget.ACCOUNT.VIEW.OPTIONS_POPOVER.DELETE'],
						onclick: deleteTransaction
					}
				],
				placement: 'top-right',
				selectedRow: null,
				outsideClick: true
			};

		});
	}


	/*******************************************************************
	 * Public Functions
	 *******************************************************************/

	/*
	 * navigate - allow user to navigate between account sub-views
	 */
	function navigate(newState) {

		$state.go(newState, {'accountId': $stateParams.accountId});
	}


	/*
	 * isTransactionRow - determines if a row in the transactions table is a transaction or not
	 */
	function isTransactionRow(rowType) {


		return rowType === AccountConstants.ROW_TYPE_TRANSACTION;
	}


	/*
	 * openRowOptions - opens a dropdown for transaction row options
	 */
	function openRowOptions(rowIndex) {

		vm.openOptionsRow = vm.openOptionsRow === rowIndex ? false : rowIndex;
		vm.rowPopoverConfig.selectedRow = rowIndex;
	}


	/*
	 * closeRowOptions
	 */
	function closeRowOptions(apply) {

		vm.openOptionsRow = false;

		// Call $scope.$apply() for outside click close
		if (apply) {
			$scope.$apply();
		}
	}


	/*******************************************************************
	 * Private Functions
	 *******************************************************************/

	/*
	 * editTransaction - function called when a user wants to edit a transaction
	 */
	function editTransaction(index) {

		$log.debug('accountTransactions.controller :: editTransaction()');

		var transactionCopy = null;

		for (var i = 0; i < vm.accountData.transactions.length; i++) {

			if (vm.accountData.transactions[i].id === index) {

				// Set the data in the side panel factory
				transactionCopy = angular.copy(vm.accountData.transactions[i]);
				break;
			}
		}

		var modalData = {
			options: {
				headerText: 'budget.ACCOUNT.EDIT_TRANSACTION_MODAL.HEADER',
				actionButtonText: 'budget.ACCOUNT.EDIT_TRANSACTION_MODAL.SAVE_ACTION'
			},
			settings: {
				size: 'md',
				contentTemplate: 'views/account/view/transactions/editTransactionModal/editTransactionModalView.html'
			},
			data: {
				transaction: transactionCopy
			}
		};

		budgetModal.open(modalData).then(
			function(response) {

				// Remove any possible number formatting ('$' ',' etc)
				var plainNumber = response.transaction.transAmount.replace(/[^\d|\-+|\.+]/g, '');
				plainNumber = $filter('currency')(plainNumber, '');
				plainNumber = plainNumber.replace(/\,/g,'');

				var preparedTransactionInfo = {
					accountId: vm.accountData.accountId,
					transId: response.transaction.id,
					transType: response.transaction.transType,
					transDate: response.transaction.transDate,
					transName: UtilsService.sanitizeText(response.transaction.transName),
					transAmount: UtilsService.sanitizeText(plainNumber),
					transTags: response.transaction.transTags,
					transNote: UtilsService.sanitizeText(response.transaction.transNote)
				};

				// Send account data to app to be updated
				AccountFactory.updateTransaction(preparedTransactionInfo).then(
					function(response) {

						// Broadcast for account update
						$scope.$emit(EventsConstants.UPDATE_ACCOUNT_BALANCE);

						// TODO: Present an error if failure
					}
				);

			}, function() {
				$log.debug('cancelled')
			}
		);

		// Close the popover
		closeRowOptions(false);
	}


	/*
	 * deleteTransaction - function called when a user wants to delete a transaction
	 */
	function deleteTransaction(index) {

		var transaction = null;

		// Loop over transactions to find the one we need
		for (var i = 0; i < vm.accountData.transactions.length; i++) {

			if (vm.accountData.transactions[i].id === index) {

				// copy the transaction
				transaction = angular.copy(vm.accountData.transactions[i]);
				break;
			}
		}

		// Prepare modal
		var modalData = {
			options: {
				headerText: 'budget.ACCOUNT.DELETE_TRANSACTION_MODAL.HEADER',
				actionButtonText: 'budget.ACCOUNT.DELETE_TRANSACTION_MODAL.PRIMARY_ACTION',
				type: 'warning'
			},
			settings: {
				size: 'md',
				contentTemplate: 'views/account/view/transactions/deleteTransactionModal/deleteTransactionModalView.html'
			},
			data: {
				transaction: transaction
			}
		};

		budgetModal.open(modalData).then(
			function(response) {

				processDeleteTransaction(response.transaction);

			}, function() {

				$log.debug('cancelled')
			}
		);
	}


	/*
	 * processDeleteTransaction
	 */
	function processDeleteTransaction(transaction) {


		// Process the deletion
		AccountFactory.deleteTransaction(transaction).then(function(response) {
			// Update the account balance
			updateAccountBalance();
		});

		// Close the popover
		closeRowOptions(false);
	}


	/*
	 * updateAccountBalance - process changes to the account balance
	 */
	function updateAccountBalance() {

		vm.accountData.calculatedBalance = AccountFactory.calculateAccountBalance(
			vm.accountData.startingBalance,
			vm.accountData.transactions
		);
	}


	/*******************************************************************
	 * Listeners
	 *******************************************************************/

	$scope.$on(EventsConstants.UPDATE_ACCOUNT_BALANCE, function() {

		updateAccountBalance();
	});
}
