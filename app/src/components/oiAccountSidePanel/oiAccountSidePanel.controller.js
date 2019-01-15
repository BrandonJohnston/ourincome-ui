/**
 * Created by brandonj on 6/22/17.
 */

angular
	.module('budget.ui')
	.controller('oiAccountSidePanelController', oiAccountSidePanelController);


oiAccountSidePanelController.$inject = [
	'$log',
	'$scope',
	'$translate',
	'AccountSidePanelFactory',
	'AccountFactory',
	'TagsFactory',
	'UtilsService',
	'CalendarConstants',
	'EventsConstants',
	'TransactionConstant'
];


function oiAccountSidePanelController($log, $scope, $translate, AccountSidePanelFactory, AccountFactory, TagsFactory,
									  UtilsService, CalendarConstants, EventsConstants, TransactionConstant) {

	var vm = this;
	$log.debug('oiAccountSidePanelController');


	// Setup functions
	vm.addTransaction = addTransaction;
	vm.openDatePicker = openDatePicker;
	vm.toggleTag = toggleTag;
	vm.isTransactionValid = isTransactionValid;
	vm.isTagDropdownDisabled = isTagDropdownDisabled;
	vm.editTagValue = editTagValue;
	vm.closeTagEdit = closeTagEdit;


	// Setup variables
	vm.transactionTypeDropdown = {};
	vm.tagsDropdown = {};
	vm.datepicker = {
		selectedDate: AccountSidePanelFactory.getTransDateData(),
		opened: false,
		dateOptions: {
			maxDate: new Date(),
			minDate: new Date(2010, 1, 1),
			startingDay: 0,
			showWeeks: false
		},
		dateFormat: "MM/dd/yyyy" // TODO: this needs to be determined by user locale
	};
	vm.transactionData = AccountSidePanelFactory.getTransactionData();
	vm.editTagIsOpen = false; // should we show the edit tag popover?
	vm.openTagRow = false; // determines which tag is currently open
	vm.tagPopoverConfig = null;


	// Local vars
	var translationKeys = [
		'budget.ACCOUNT.SIDE_PANEL.TAG_POPOVER.HEADER'
	];

	var translationValues;


	init();

	function init() {

		// Assign translations & configure for Transaction Type dropdown
		vm.transactionTypeDropdown = AccountSidePanelFactory.getTransTypeConfig();

		// Assign translations & configure for Transaction Tags dropdown
		var tags = TagsFactory.getUserTagsData();

		vm.tagsDropdown = AccountSidePanelFactory.getTransTagsConfig(tags);

		// Set the account id
		AccountSidePanelFactory.setTransactionAccountId($scope.accountId);

		// Get translations, then process
		$translate(translationKeys).then(function(translations) {

			translationValues = translations;

			// Setup popover config
			vm.tagPopoverConfig = {
				title: translationValues['budget.ACCOUNT.SIDE_PANEL.TAG_POPOVER.HEADER'],
				customTemplate: 'components/oiAccountSidePanel/editTransactionTag/editTag.html',
				placement: 'right',
				outsideClick: false
			};

		});
	}


	/*******************************************************************
	 * Public Functions
	 *******************************************************************/

	/*
	 * addTransaction - user clicked to add a new transaction
	 */
	function addTransaction() {

		if (!isTransactionValid()) {

			return;
		}

		// TODO: Need to check that any tags with a currency value does not exceed the transaction amount
		//       Present a warning modal if this occurs

		vm.transactionData.transProcessing = true;

		var preparedTransactionInfo = {
			accountId: vm.transactionData.accountId,
			transType: vm.transactionTypeDropdown.selectedTransaction.value,
			transDate: moment(vm.datepicker.selectedDate.selectedDate).format(CalendarConstants.DATE_ID_FORMAT),
			transName: UtilsService.sanitizeText(vm.transactionData.transName),
			transAmount: UtilsService.sanitizeText(vm.transactionData.transAmount),
			transTags: vm.transactionData.transTags,
			transNote: UtilsService.sanitizeText(vm.transactionData.transNote)
		};

		// Send account data to app to be added
		AccountFactory.createNewTransaction(preparedTransactionInfo).then(
			function(response) {

				// Reset the transaction data
				AccountSidePanelFactory.setTransactionDataToDefault();

				// Reset all tags to default state
				for (var i = 1; i < vm.tagsDropdown.tags.length; i++) {

					vm.tagsDropdown.tags[i].isSelected = false;
				}

				// Reset the form state
				$scope.newTransactionForm.$setPristine();

				// Reset the selected tags
				for (i = 0; i < vm.tagsDropdown.tags.length; i++) {

					vm.tagsDropdown.tags[i].isSelected = false;

					if (vm.tagsDropdown.tags[i].children &&
						vm.tagsDropdown.tags[i].children.length > 0) {

						for (var j = 0; j < vm.tagsDropdown.tags[i].children.length; j++) {

							vm.tagsDropdown.tags[i].children[j].isSelected = false;
						}
					}
				}

				// Broadcast for account update
				$scope.$emit(EventsConstants.UPDATE_ACCOUNT_BALANCE);

				// TODO: Present an error if failure
			}
		);
	}


	/*
	 * openDatePicker - toggle the date picker
	 */
	function openDatePicker() {

		vm.datepicker.opened = true;
	}


	/*
	 * toggleTag - user has added or removed a tag
	 */
	function toggleTag(newVal) {

		// Check if we need to add or remove the tag
		var tagExists = false;

		// Loop over all existing tags
		for (var i = 0; i < vm.transactionData.transTags.length; i++) {

			if (vm.transactionData.transTags[i].id === newVal.id) {

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

			$log.debug("adding new tag...");
			$log.debug(newVal);

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
	}


	/*
	 * isTransactionValid
	 */
	function isTransactionValid() {

		return vm.transactionData.transName &&
				vm.transactionData.transAmount &&
				vm.transactionData.transAmount > 0;
	}


	/*
	 * isTagDropdownDisabled - determine if the tags can be added / edited
	 */
	function isTagDropdownDisabled() {

		return !(vm.transactionData.transAmount && vm.transactionData.transAmount > 0);
	}


	/*
	 * editTagValue - opens a transaction tag for editing
	 */
	function editTagValue(tag) {

		$log.debug('editTagValue');
		$log.debug('tag');
		$log.debug(tag);

		vm.openTagRow = vm.openTagRow === tag.id ? false : tag.id;
		vm.tagPopoverConfig.selectedRow = tag.id;

		// Save the current tag data to the factory
		AccountSidePanelFactory.setTagDataForEditing(tag);

		// Save the maximum currency value for tag editing
		AccountSidePanelFactory.setMaxCurrencyValue(vm.transactionData.transAmount);

		// Allow the tag popover to show
		vm.editTagIsOpen = true;
	}


	/*
	 * closeTagEdit - closes the open Edit Transaction Tag popover
	 */
	function closeTagEdit(apply) {

		vm.openTagRow = false;

		// Don't allow the tag popover to show
		vm.editTagIsOpen = false;

		// Call $scope.$apply() for outside click close
		if (apply) {
			$scope.$apply();
		}
	}


	/*******************************************************************
	 * Private Functions
	 *******************************************************************/


	/*******************************************************************
	 * Listeners
	 *******************************************************************/
	//
}
