/**
 * Created by brandonj on 4/10/17.
 */

angular
	.module('budget.ui')
	.controller('editTransactionModalController', editTransactionModalController);


editTransactionModalController.$inject = [
	'$log',
	'$scope',
	'$filter',
	'AccountSidePanelFactory',
	'TagsFactory',
	'CalendarConstants',
	'TransactionConstant'
];


function editTransactionModalController($log, $scope, $filter, AccountSidePanelFactory, TagsFactory, CalendarConstants,
                                        TransactionConstant) {

	var vm = this;
	$log.debug('editTransactionModalController');


	// Setup functions
	vm.openDatePicker = openDatePicker;
	vm.changeTransType = changeTransType;
	vm.changeTransDate = changeTransDate;
	vm.changeTransDetails = changeTransDetails;
	vm.toggleTag = toggleTag;


	// Setup variables
	vm.options = $scope.options;
	vm.originalTransaction = angular.copy($scope.data.transaction);
	vm.transactionData = $scope.data.transaction;
	vm.transactionTypeDropdown = {};
	vm.tagsDropdown = {};
	vm.datepicker = {
		selectedDate: null,
		opened: false,
		dateOptions: {
			maxDate: new Date(),
			minDate: new Date(2010, 1, 1),
			startingDay: 0,
			showWeeks: false
		},
		dateFormat: 'MM/dd/yyyy' // TODO: this needs to be determined by user locale
	};
	var typeChanged = false;
	var dateChanged = false;
	var detailsChanged = false;


	init();

	function init() {

		// Set action disabled / valid states
		vm.options.actionDisabled = true;
		vm.options.actionValid = false;

		// Assign translations & configure for Transaction Type dropdown
		vm.transactionTypeDropdown = AccountSidePanelFactory.getTransTypeConfig();

		// Pre-select the transaction type
		if (vm.transactionData.transType === '1') {
			vm.transactionTypeDropdown.selectedTransaction = vm.transactionTypeDropdown.transactionTypes[0];
		}

		// Set the date (month is 0-based, let's remove one digit
		var dateArray = vm.transactionData.transDate.split('-');
		vm.datepicker.selectedDate = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);

		// Set the amount field to currency
		vm.transactionData.transAmount = $filter('currency')(vm.transactionData.transAmount);

		// Assign translations & configure for Transaction Tags dropdown
		var tags = TagsFactory.getUserTagsData();

		vm.tagsDropdown = AccountSidePanelFactory.getTransTagsConfig(tags);

		// Loop over the transaction's selected tags
		for (var i = 0; i < vm.originalTransaction.transTags.length; i++) {

			var matchFound = false;

			// Loop over the parent level tags
			for (var j = 0; j < vm.tagsDropdown.tags.length; j++) {

				// compare the transaction tag to the top level of all tags
				if (vm.originalTransaction.transTags[i].tagId === vm.tagsDropdown.tags[j].tagId) {
					vm.tagsDropdown.tags[j].isSelected = true;
					matchFound = true;
				}

				// match wasn't found on top level, check for children tags
				if (!matchFound &&
					vm.tagsDropdown.tags[j].children &&
					vm.tagsDropdown.tags[j].children.length > 0)
				{

					for (var k = 0; k < vm.tagsDropdown.tags[j].children.length; k++) {

						// compare the transaction tag to the child level tags
						if (vm.originalTransaction.transTags[i].tagId === vm.tagsDropdown.tags[j].children[k].tagId) {

							vm.tagsDropdown.tags[j].children[k].isSelected = true;

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
	}


	/*******************************************************************
	 * Public Functions
	 *******************************************************************/

	/*
	 * openDatePicker - toggle the date picker
	 */
	function openDatePicker() {

		vm.datepicker.opened = true;
	}


	/*
	 * changeTransType - process change of transaction type
	 */
	function changeTransType() {

		// Assign new value to the model
		vm.transactionData.transType = vm.transactionTypeDropdown.selectedTransaction.id;

		// Check if the transaction type has changed
		typeChanged = vm.transactionTypeDropdown.selectedTransaction.id !== vm.originalTransaction.transType;

		// If one of the types has been changed, set options properties
		if (typeChanged || dateChanged || detailsChanged) {

			vm.options.actionDisabled = false;
			vm.options.actionValid = true;
		} else {

			vm.options.actionDisabled = true;
			vm.options.actionValid = false;
		}
	}


	/*
	 * changeTransDate - process change of transaction date
	 */
	function changeTransDate() {

		// Format the selected date
		var newDate = moment(vm.datepicker.selectedDate).format(CalendarConstants.DATE_ID_FORMAT);

		// Assign new value to the model
		vm.transactionData.transDate = newDate;

		// Check if new date is different from previous
		dateChanged = newDate !== vm.originalTransaction.transDate;

		// If one of the types has been changed, set options properties
		if (typeChanged || dateChanged || detailsChanged) {

			vm.options.actionDisabled = false;
			vm.options.actionValid = true;
		} else {

			vm.options.actionDisabled = true;
			vm.options.actionValid = false;
		}
	}


	/*
	 * changeTransDetails - check if the transaction data has changed
	 */
	function changeTransDetails() {

		var nameChanged = vm.transactionData.transName !== vm.originalTransaction.transName;
		var amountChanged = false;
		var noteChanged = vm.transactionData.transNote !== vm.originalTransaction.transNote;
		var tagsChanged = checkTagsChanged();

		// Check if the transaction amount has changed
		if (vm.transactionData.transAmount.charAt(0) === "$") {

			amountChanged = vm.transactionData.transAmount.substr(1) !== vm.originalTransaction.transAmount;

		} else {

			amountChanged = vm.transactionData.transAmount !== vm.originalTransaction.transAmount;
		}

		// Determine if details have changed
		detailsChanged = nameChanged || amountChanged || noteChanged || tagsChanged;

		// Check if a value has changed, enable the save button
		// If one of the types has been changed, set options properties
		if (typeChanged || dateChanged || detailsChanged) {

			vm.options.actionDisabled = false;
			vm.options.actionValid = true;
		} else {

			vm.options.actionDisabled = true;
			vm.options.actionValid = false;
		}
	}


	/*
	 * toggleTag - user has added or removed a tag
	 */
	function toggleTag(newVal) {

		// Check if we need to add or remove the tag
		var tagExists = false;

		// Loop over all existing tags
		for (var i = 0; i < vm.transactionData.transTags.length; i++) {

			if (vm.transactionData.transTags[i].tagId === newVal.id) {

				// found a matching tag, this one is already in the list
				tagExists = true;

				// mark the tag as not selected
				vm.tagsDropdown.selectedTag.isSelected = false;

				// remove this one from the list
				vm.transactionData.transTags.splice(i, 1);

				break;
			}
		}

		// Tag wasn't found, let's add it
		if (!tagExists) {

			// mark the tag as selected
			vm.tagsDropdown.selectedTag.isSelected = true;

			var newTag = newVal;

			// Assign default values for tag amount (100%)
			newTag.valType = TransactionConstant.DEFAULT_TAG_VALUES.TAG_TYPE;
			newTag.valAmount = TransactionConstant.DEFAULT_TAG_VALUES.TAG_AMOUNT;

			// Add the tag to the transaction
			vm.transactionData.transTags.push(newVal);
		}

		// Set the dropdown model back to default
		vm.tagsDropdown.selectedTag = vm.tagsDropdown.tags[0];

		// Check if the tags details have changed - for enabling saving
		changeTransDetails();
	}


	/*******************************************************************
	 * Private Functions
	 *******************************************************************/

	/*
	 * checkTagsChanged - check if transaction tags have changed
	 */
	function checkTagsChanged() {

		var tagsChanged = false;

		if (vm.transactionData.transTags.length !== vm.originalTransaction.transTags.length) {

			// Length is not the same, something has changed
			return true;

		} else {

			// Length is the same, compare each tag and see if there are any differences
			for (var i = 0; i < vm.transactionData.transTags.length; i++) {

				for (var j = 0; j < vm.originalTransaction.transTags.length; j++) {

					var matchFound = false;

					if (vm.transactionData.transTags[i].id === vm.originalTransaction.transTags[j].id) {

						matchFound = true;
						break;
					}
				}

				// a match was never found, something had to have changed
				if (!matchFound) {
					tagsChanged = true;
					break;
				}
			}
		}

		return tagsChanged;
	}
}
