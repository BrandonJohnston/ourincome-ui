/**
 * Created by brandonj on 4/27/17.
 */

(function() {
	"use strict";

	angular
		.module('budget.ui')
		.factory('AccountFactory', AccountFactory);

	AccountFactory.$inject = [
		'$log',
		'$http',
		'$q',
		'TagsFactory',
		'CalendarConstants',
		'AccountConstants'
	];

	function AccountFactory($log, $http, $q, TagsFactory, CalendarConstants, AccountConstants) {

		var accountData = {
			transactions: [],
			accountId: null,
			accountName: null,
			calculatedBalance: null,
			startingBalance: null
		};

		var service = {
			getAccountData: getAccountData,
			setAccountData: setAccountData,
			calculateAccountBalance: calculateAccountBalance,
			checkAcctNameDuplicate: checkAcctNameDuplicate,
			createNewAccount: createNewAccount,
			getAllAccounts: getAllAccounts,
			getAccountDetails: getAccountDetails,
			createNewTransaction: createNewTransaction,
			updateTransaction: updateTransaction,
			deleteTransaction: deleteTransaction
		};

		return service;


		/*
		 * getAccountData - returns the current account object
		 */
		function getAccountData() {

			return accountData;
		}


		/*
		 * setAccountData - sets a new account object
		 */
		function setAccountData(accountDataObj) {

			accountData = accountDataObj;
		}


		/*
		 * calculateAccountBalance - calculates the current account balance
		 * @startingBalance - account beginning balance
		 */
		function calculateAccountBalance(startingBalance, transactions) {

			var calculatedBalance = Number(startingBalance);

			angular.forEach(transactions, function(transaction, key) {

				if (transaction.rowType === AccountConstants.ROW_TYPE_TRANSACTION && transaction.transType === '1') {

					// Income transaction - add the amount
					calculatedBalance = calculatedBalance + Number(transaction.transAmount);

				} else if (transaction.rowType === AccountConstants.ROW_TYPE_TRANSACTION && transaction.transType === '2') {

					// Expense transaction - subtract the amount
					calculatedBalance = calculatedBalance - Number(transaction.transAmount);
				}
			});

			return calculatedBalance;
		}


		/*
		 * checkAcctNameDuplicate - check if the account name already exists
		 */
		function checkAcctNameDuplicate(accountName) {

			$log.debug("AccountFactory :: checkAcctNameDuplicate()");

			var data = {
				'accountName': accountName
			};

			return $http({
				url: '/api.php/api/account/checkName',
				method: 'POST',
				data: data,
				withCredentials: true,
				headers: {
					'Content-Type': 'application/json; charset=utf-8'
				}
			});
		}


		/*
		 * createNewAccount - create a new account
		 */
		function createNewAccount(accountName, acctBalance) {

			$log.debug("AccountFactory :: createNewAccount()");

			var data = {
				'accountName': accountName,
				'acctBalance': acctBalance
			};

			return $http({
				url: '/api.php/api/account/create',
				method: 'POST',
				data: data,
				withCredentials: true,
				headers: {
					'Content-Type': 'application/json; charset=utf-8'
				}
			});
		}


		/*
		 * getAllAccounts - gets all available user accounts
		 */
		function getAllAccounts() {

			$log.debug("AccountFactory :: getAllAccounts()");

			return $http({
				url: '/api.php/api/account/getAccounts',
				method: 'GET',
				withCredentials: true,
				headers: {
					'Content-Type': 'application/json; charset=utf-8'
				}
			});
		}


		/*
		 * getAccountDetails - gets details for an account
		 * @param accountData - object containing account details
		 */
		function getAccountDetails(accountData) {

			$log.debug("AccountFactory :: getAccountDetails()");

			var deferred = $q.defer();

			// Submit POST and process API reponse
			$http.get('/api.php/api/account/getAccountDetails',
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json; charset=utf-8'
					},
					params: {
						account_id: accountData.accountId
					}
				})
				.then(
				function successCallback(response) {

					var formattedData = response.data;

					// Process transaction data
					formattedData.transactions = transformAccountTransactionsData(response.data.transactions);

					// Add subhead rows to transactions
					formattedData.transactions = addMonthSubheads(formattedData.transactions);

					return deferred.resolve(formattedData);
				},
				function errorCallback(errorResponse) {

					$log.debug("account.factory :: getAccountDetails() error:");
					$log.debug(errorResponse);

					//TODO: Need to format a proper error response and handle it in the controller

					return deferred.resolve(errorResponse);
				}
			);


			return deferred.promise;
		}


		/*
		 * createNewTransaction - add a new transaction
		 * @transactionData - object {transType, transName, transAmount}
		 */
		function createNewTransaction(transactionData) {

			// Prepare data
			var postData = transactionData;

			var deferred = $q.defer();

			// Submit POST and process API reponse
			$http.post('/api.php/api/account/createTransaction',
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json; charset=utf-8'
					},
					data: postData
				})
				.then(
				function successCallback(response) {

					$log.debug("account.factory :: createNewTransaction()");
					$log.debug("response");
					$log.debug(response);

					// Convert the object to an array
					var data = [response.data];

					// Process the response
					var formattedData = transformAccountTransactionsData(data);
					addTransactionToDataObj(formattedData[0]);

					return deferred.resolve(formattedData);
				},
				function errorCallback(errorResponse) {

					// TODO: Process the error

					return deferred.resolve(errorResponse.data);
				}
			);

			return deferred.promise;
		}


		/*
		 * updateTransaction - update a transaction
		 * @transactionData - object {transType, transName, transAmount}
		 */
		function updateTransaction(transactionData) {

			$log.debug('AccountFactory :: updateTransaction()');

			// Prepare data
			var postData = transactionData;

			var deferred = $q.defer();

			// Submit POST and process API reponse
			$http.post('/api.php/api/account/updateTransaction',
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json; charset=utf-8'
					},
					data: postData
				})
				.then(
				function successCallback(response) {

					if (response.data.success) {

						// Convert the object to an array
						var data = [response.data];

						// Process the response
						var formattedData = transformAccountTransactionsData(data);
						updateTransactionData(formattedData[0]);

						return deferred.resolve(formattedData);
					} else {
						return false;
					}

				},
				function errorCallback(errorResponse) {

					// TODO: Process the error

					return deferred.resolve(errorResponse.data);
				}
			);

			return deferred.promise;
		}


		/*
		 * deleteTransaction - delete a transaction
		 * @transactionData - object {transType, transName, transAmount}
		 */
		function deleteTransaction(transactionData) {

			// Prepare data
			var postData = {
				transId: transactionData.id
			};

			var deferred = $q.defer();

			// Submit POST and process API reponse
			$http.post('/api.php/api/account/deleteTransaction',
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json; charset=utf-8'
					},
					data: postData
				})
				.then(
				function successCallback(response) {

					// Process the response
					if (response.data.success) {
						removeTransactionFromDataObj(response.data);
					}

					return deferred.resolve(response.data);
				},
				function errorCallback(errorResponse) {

					$log.debug("account.factory :: deleteTransaction() error:");
					$log.debug(errorResponse);

					// TODO: Process the error

					return deferred.resolve(errorResponse.data);
				}
			);

			return deferred.promise;
		}


		/*******************************************************************
		 * Private Functions
		 *******************************************************************/

		/*
		 * addTransactionToDataObj - add a new transaction
		 * @transaction - object {transType, transName, transAmount, etc.}
		 */
		function addTransactionToDataObj(transaction) {

			// Find the correct location in the array to add the new transaction row
			var newTransactionDate = moment(transaction.transDate, CalendarConstants.DATE_ID_FORMAT).format(CalendarConstants.DATE_YEAR_MONTH_DAY);
			var transactionYearMonth;
			var targetYearMonthFound;
			var headerRow;

			if (accountData.transactions.length === 0 ) {

				// If the account has no transactions, just push them in
				headerRow = {
					rowType: AccountConstants.ROW_TYPE_MONTH_HEADER,
					monthDisplayDate: moment(transaction.transDate, CalendarConstants.DATE_ID_FORMAT).format(CalendarConstants.DATE_MONTH_FORMAT)
				};

				accountData.transactions.push(headerRow);
				accountData.transactions.push(transaction);

			} else {

				// If the account already has transactions, do some processing
				for (var i = 0; i < accountData.transactions.length; i++) {

					var transactionDate = moment(accountData.transactions[i].transDate, CalendarConstants.DATE_ID_FORMAT).format(CalendarConstants.DATE_YEAR_MONTH_DAY);

					// Add the row if the date is the same or above
					if (newTransactionDate === transactionDate || newTransactionDate > transactionDate) {

						// Check if we need a new header for this transaction
						transactionYearMonth = moment(transaction.transDate, CalendarConstants.DATE_ID_FORMAT).format(CalendarConstants.DATE_MONTH_FORMAT);
						targetYearMonthFound = checkForMonthSubhead(transactionYearMonth);

						// Header for the new transaction wasn't found, let's add it
						if (!targetYearMonthFound) {

							headerRow = {
								rowType: AccountConstants.ROW_TYPE_MONTH_HEADER,
								monthDisplayDate: moment(transaction.transDate, CalendarConstants.DATE_ID_FORMAT).format(CalendarConstants.DATE_MONTH_FORMAT)
							};

							accountData.transactions.splice(i - 1, 0, headerRow);
						}

						// Add new transaction in the correct position
						if (accountData.transactions[i - 1].rowType &&
							accountData.transactions[i - 1].rowType === AccountConstants.ROW_TYPE_MONTH_HEADER) {

							if (transactionYearMonth === accountData.transactions[i - 1].monthDisplayDate) {
								accountData.transactions.splice(i, 0, transaction);
							} else {
								accountData.transactions.splice(i - 1, 0, transaction);
							}

						} else {

							accountData.transactions.splice(i, 0, transaction);
						}

						break;

					} else if (i === accountData.transactions.length - 1) {

						// There are no more rows to loop through

						// Check if we need a new header for this transaction
						transactionYearMonth = moment(transaction.transDate, CalendarConstants.DATE_ID_FORMAT).format(CalendarConstants.DATE_MONTH_FORMAT);
						targetYearMonthFound = checkForMonthSubhead(transactionYearMonth);

						// Header for the new transaction wasn't found, let's add it
						if (!targetYearMonthFound) {

							headerRow = {
								rowType: AccountConstants.ROW_TYPE_MONTH_HEADER,
								monthDisplayDate: moment(transaction.transDate, CalendarConstants.DATE_ID_FORMAT).format(CalendarConstants.DATE_MONTH_FORMAT)
							};

							accountData.transactions.splice(i + 1, 0, headerRow);
						}

						accountData.transactions.splice(i + 2, 0, transaction);

						break;
					}
				}
			}
		}


		/*
		 * removeTransactionFromDataObj - remove a transaction
		 * @transaction - object {id}
		 */
		function removeTransactionFromDataObj(transaction) {

			// Loop over all transactions
			for (var i = 0; i < accountData.transactions.length; i++) {

				if (accountData.transactions[i].id === transaction.id) {

					// Determine if prev & next rows are transactions or headers
					var prevRowIsTransaction = accountData.transactions[i - 1].rowType === AccountConstants.ROW_TYPE_TRANSACTION;
					var nextRowIsTransaction = accountData.transactions[i + 1].rowType === AccountConstants.ROW_TYPE_TRANSACTION;

					if (!prevRowIsTransaction && !nextRowIsTransaction) {

						// This is the only transaction in this month, remove the month header as well
						accountData.transactions.splice(i - 1, 2);

					} else {

						// More than one transaction in this month, only remove the transaction
						accountData.transactions.splice(i, 1);
					}

					break;
				}
			}
		}


		/*
		 * transformAccountTransactionsData - formats the api response data for transactions
		 */
		function transformAccountTransactionsData(transData) {

			var newTransData = [];
			var date,
				displayDate;

			angular.forEach(transData, function(transaction, key) {

				date = transaction.trans_date.split('-');
				displayDate = date[1] === '05' ?
					moment(transaction.trans_date, CalendarConstants.DATE_ID_FORMAT).format(CalendarConstants.DATE_NICE_FORMAT_MAY) :
					moment(transaction.trans_date, CalendarConstants.DATE_ID_FORMAT).format(CalendarConstants.DATE_NICE_FORMAT);

				var transaction = {
					rowType: AccountConstants.ROW_TYPE_TRANSACTION,
					transAmount: transaction.trans_amount,
					transDate: transaction.trans_date,
					transDisplayDate: displayDate,
					transName: transaction.trans_name,
					transType: transaction.trans_type,
					transTags: processTransactionTagsData(transaction.trans_tags),
					transNote: transaction.trans_note,
					id: transaction.id
				};

				newTransData[key] = transaction;
			});

			return newTransData;
		}


		/*
		 * addMonthSubheads - adds subhead rows for each month
		 */
		function addMonthSubheads(transData) {

			var newTransData = [];

			for (var i = 0; i < transData.length; i++) {

				var rowData;

				var rowYearMonth = moment(transData[i].transDate, CalendarConstants.DATE_ID_FORMAT).format(CalendarConstants.DATE_YEAR_MONTH);
				var prevRowYearMonth = i > 0 ? moment(transData[i - 1].transDate, CalendarConstants.DATE_ID_FORMAT).format(CalendarConstants.DATE_YEAR_MONTH) : 0;

				if (i === 0 || rowYearMonth < prevRowYearMonth) {

					// Add a month header row
					rowData = {
						rowType: AccountConstants.ROW_TYPE_MONTH_HEADER,
						monthDisplayDate: moment(transData[i].transDate, CalendarConstants.DATE_ID_FORMAT).format(CalendarConstants.DATE_MONTH_FORMAT)
					};

					newTransData.push(rowData);

					// Add the following transaction row
					rowData = transData[i];
					newTransData.push(rowData);

				} else {

					// Add the transaction row
					rowData = transData[i];
					newTransData.push(rowData);
				}
			}

			return newTransData;
		}


		/*
		 * checkForMonthSubhead
		 */
		function checkForMonthSubhead(targetYearMonth) {

			var targetYearMonthFound = false;

			for (var i = 0; i < accountData.transactions.length; i++) {

				if (accountData.transactions[i].rowType === AccountConstants.ROW_TYPE_MONTH_HEADER) {

					if (accountData.transactions[i].monthDisplayDate === targetYearMonth) {

						targetYearMonthFound = true;
						break;
					}
				}
			}

			return targetYearMonthFound;
		}


		/*
		 * updateTransactionData - updates data for a transaction
		 */
		function updateTransactionData(transData) {

			// Loop over all transactions
			for (var i = 0; i < accountData.transactions.length; i++) {

				// Find the transaction with the same id
				if (accountData.transactions[i].id === transData.id) {

					// Date has changed, let's process the transaction and subheads
					if (accountData.transactions[i].transDate !== transData.transDate) {

						if (accountData.transactions[i - 1].rowType === AccountConstants.ROW_TYPE_TRANSACTION ||
							accountData.transactions[i + 1].rowType === AccountConstants.ROW_TYPE_TRANSACTION) {

							// Row has a sibling that is a transaction, no need to adjust headers
							// Remove the current row
							accountData.transactions.splice(i, 1);

							addTransactionToDataObj(transData);

						} else {

							// Remove the header row and the transaction row
							accountData.transactions.splice(i - 1, 2);
							addTransactionToDataObj(transData);
						}

					} else {

						// Date did not change, just update the data
						accountData.transactions[i] = transData;
					}
				}
			}
		}


		/*
		 * processTransactionTagsData
		 * transactionTags - array of objects containing basic tag data
		 *                      @string tag_id: id of the tag
		 */
		function processTransactionTagsData(transactionTags) {

			if (!transactionTags || transactionTags.length === 0) {
				return [];
			}

			var transTags = [];
			var userTags = TagsFactory.getUserTagsData();

			// loop over each tag assigned to the transaction
			for (var i = 0; i < transactionTags.length; i++) {

				// loop over each tag the user has access to
				for (var j = 0; j < userTags.tags.length; j++) {

					var matchFound = false,
						transTag;

					// compare the transaction tag id to the users tag id
					if (transactionTags[i].tag_id === userTags.tags[j].id) {

						transTag = {
							id: transactionTags[i].id,
							tagId: transactionTags[i].tag_id,
							name: userTags.tags[j].name,
							value: userTags.tags[j].value,
							valType: transactionTags[i].tag_value_type,
							valAmount: transactionTags[i].tag_value_amount
						};

						transTags.push(transTag);

						matchFound = true;
					}

					// the parent tag id didn't match, see if the tag has children and check those
					if (!matchFound &&
						userTags.tags[j].children &&
						userTags.tags[j].children.length > 0
					) {

						for (var k = 0; k < userTags.tags[j].children.length; k++) {

							// compare the transaction tag id to the users tag id
							if (transactionTags[i].tag_id === userTags.tags[j].children[k].id) {

								transTag = {

									id: transactionTags[i].id,
									tagId: transactionTags[i].tag_id,

									name: userTags.tags[j].children[k].name,
									value: userTags.tags[j].children[k].value,
									valType: transactionTags[i].tag_value_type,
									valAmount: transactionTags[i].tag_value_amount
								};

								transTags.push(transTag);

								matchFound = true;
								break;
							}
						}
					}

					if (matchFound) {
						break;
					}
				}
			}

			return transTags;
		}
	}
})();
