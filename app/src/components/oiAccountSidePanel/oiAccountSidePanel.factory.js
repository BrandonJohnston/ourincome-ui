/**
 * Created by brandonj on 6/23/17.
 */

(function() {
	"use strict";

	angular
		.module('budget.ui')
		.factory('AccountSidePanelFactory', AccountSidePanelFactory);

	AccountSidePanelFactory.$inject = [
		'$log',
		'$filter',
		'$translate',
		'TransactionConstant'
	];

	function AccountSidePanelFactory($log, $filter, $translate, TransactionConstant) {

		var transactionData = {
			id: null,
			transId: null,
			transDate: null,
			transName: null,
			transAmount: null,
			transTags: [],
			transNote: null,
			transError: false,
			transProcessing: false,
			panelMode: TransactionConstant.PANEL_MODES.ADD
		};

		var transactionTypeDropdown = {
			config: {
				displayMode: 'block',
				label: $translate.instant('budget.ACCOUNT.SIDE_PANEL.TRANSACTION_TYPE')
			},
			transactionTypes: TransactionConstant.TRANS_TYPES
		};

		var tagsDropdown = {
			config: {
				displayMode: 'block',
				label: $translate.instant('budget.ACCOUNT.SIDE_PANEL.TRANS_TAGS_LABEL'),
				multiSelect: true
			},
			tags: []
		};

		var tagValueTypeDropdown = {
			config: {
				displayMode: 'block',
				label: $translate.instant('budget.ACCOUNT.SIDE_PANEL.TAG_POPOVER.VALUE_TYPE')
			},
			tagValueTypes: TransactionConstant.TAG_VALUE_OPTIONS
		};

		var transactionDateData = {
			selectedDate: new Date()
		};

		var currentTagForEditing = null;
		var transactionMaxCurrencyValue = null;

		var service = {
			getTransTypeConfig: getTransTypeConfig,
			getTransTagsConfig: getTransTagsConfig,
			getTagValueTypeConfig: getTagValueTypeConfig,
			getTransTypeTranslation: getTransTypeTranslation,
			getTransDateData: getTransDateData,
			getTransactionData: getTransactionData,
			setTransactionAccountId: setTransactionAccountId,
			setTransactionDataToDefault: setTransactionDataToDefault,
			setTagDataForEditing: setTagDataForEditing,
			getTagDataForEditing: getTagDataForEditing,
			setMaxCurrencyValue: setMaxCurrencyValue,
			getMaxCurrencyValue: getMaxCurrencyValue
		};

		return service;


		/*
		 * getTransTypeConfig - defines the config and data for the transaction type dropdown
		 */
		function getTransTypeConfig() {

			// Get the proper translation for each transaction
			angular.forEach(transactionTypeDropdown.transactionTypes, function(transactionType, key) {
				transactionTypeDropdown.transactionTypes[key].name = angular.copy(getTransTypeTranslation(transactionType.name));
			});

			// Select 'Expense' by default
			transactionTypeDropdown.selectedTransaction = transactionTypeDropdown.transactionTypes[1];

			return transactionTypeDropdown;
		}


		/*
		 * getTransTagsConfig - defines the config and data for the transaction tags dropdown
		 */
		function getTransTagsConfig(userTags) {

			// Add 'Select a tag'
			var defaultTag = {
				id: '0',
				owner_id: '0',
				name: $translate.instant('budget.ACCOUNT.SIDE_PANEL.DEFAULT_TAG'),
				value: $translate.instant('budget.ACCOUNT.SIDE_PANEL.DEFAULT_TAG')
			};

			tagsDropdown.tags.push(defaultTag);

			// Get the proper translation for each transaction
			angular.forEach(userTags.tags, function(tag, key) {
				tagsDropdown.tags.push(tag);
			});

			// Select 'Expense' by default
			tagsDropdown.selectedTag = tagsDropdown.tags[0];

			return tagsDropdown;
		}


		/*
		 * getTagValueTypeConfig - defines the config and data for the tag value type dropdown
		 */
		function getTagValueTypeConfig() {

			// Get the proper translation for each transaction
			angular.forEach(tagValueTypeDropdown.tagValueTypes, function(tagValueType, key) {
				tagValueTypeDropdown.tagValueTypes[key].name = angular.copy(getTagValueTranslation(tagValueType.name));
			});

			return tagValueTypeDropdown;
		}


		/*
		 * getTransTypeTranslation - returns the translation for the specific transaction type
		 */
		function getTransTypeTranslation(transactionType) {

			var transactionVar = $filter('lowercase')(transactionType);

			switch(transactionVar) {
				case 'income':
					return $translate.instant('budget.ACCOUNT.SIDE_PANEL.INCOME');
				case 'expense':
					return $translate.instant('budget.ACCOUNT.SIDE_PANEL.EXPENSE');
			}
		}


		/*
		 * getTransDateData - get the transaction date data
		 */
		function getTransDateData() {

			$log.debug('AccountSidePanelFactory :: getTransDateData()');

			return transactionDateData;
		}


		/*
		 * getTransactionData - get the transaction data
		 */
		function getTransactionData() {

			$log.debug('AccountSidePanelFactory :: getTransactionData()');

			return transactionData;
		}


		/*
		 * setTransactionAccountId - get the transaction data
		 */
		function setTransactionAccountId(accountId) {

			$log.debug('AccountSidePanelFactory :: setTransactionAccountId()');

			transactionData.accountId = accountId;
		}


		/*
		 * setTransactionDataToDefault - set the transaction data to default state
		 */
		function setTransactionDataToDefault() {

			$log.debug('AccountSidePanelFactory :: setTransactionDataToDefault()');

			// Set transaction data
			transactionData.id = null;
			transactionData.transDate = null;
			transactionData.transName = null;
			transactionData.transAmount = null;
			transactionData.transTags = [];
			transactionData.transNote = null;
			transactionData.transError = false;
			transactionData.transProcessing = false;

			// Set panel mode to 'add'
			transactionData.panelMode = TransactionConstant.PANEL_MODES.ADD;

			// Set the transaction type to expense
			setTransDropdownType('2');

			// Set the date to today
			transactionDateData.selectedDate = new Date();
		}


		/*
		 * setTagDataForEditing - set the data for currently editing tag
		 */
		function setTagDataForEditing(tagData) {

			currentTagForEditing = tagData;
		}


		/*
		 * getTagDataForEditing - get the data for currently editing tag
		 */
		function getTagDataForEditing() {

			return currentTagForEditing;
		}


		/*
		 * setMaxCurrencyValue - set the data for currency max value
		 */
		function setMaxCurrencyValue(maxValue) {

			transactionMaxCurrencyValue = maxValue;
		}


		/*
		 * getMaxCurrencyValue - get the data for currency max value
		 */
		function getMaxCurrencyValue() {

			return transactionMaxCurrencyValue;
		}


		/*******************************************************************
		 * Private Functions
		 *******************************************************************/

		/*
		 * setTransDropdownType - changes the transaction type dropdown to the passed in state
		 */
		function setTransDropdownType(transTypeId) {

			switch(transTypeId) {
				case '1':
					transactionTypeDropdown.selectedTransaction = transactionTypeDropdown.transactionTypes[0];
					return;
				case '2':
					transactionTypeDropdown.selectedTransaction = transactionTypeDropdown.transactionTypes[1];
					return;
			}
		}


		/*
		 * getTagValueTranslation - get translated text for tag value type
		 */
		function getTagValueTranslation(tagValueName) {

			var translationVar = $filter('lowercase')(tagValueName);

			switch(translationVar) {
				case 'percent':
					return $translate.instant('budget.ACCOUNT.SIDE_PANEL.TAG_POPOVER.PERCENT');
				case 'currency':
					return $translate.instant('budget.ACCOUNT.SIDE_PANEL.TAG_POPOVER.CURRENCY');
			}
		}

	}
})();
