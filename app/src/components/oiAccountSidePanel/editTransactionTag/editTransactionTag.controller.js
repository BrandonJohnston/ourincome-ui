/**
 * Created by brandonj on 6/22/17.
 */

angular
	.module('budget.ui')
	.controller('oiEditTransactionTagController', oiEditTransactionTagController);


oiEditTransactionTagController.$inject = [
	'$log',
	'$scope',
	'$timeout',
	'AccountSidePanelFactory',
	'TransactionConstant'
];


function oiEditTransactionTagController($log, $scope, $timeout, AccountSidePanelFactory, TransactionConstant) {

	var vm = this;
	$log.debug('oiEditTransactionTagController');


	// Setup functions
	vm.changeTagValueType = changeTagValueType;
	vm.isUpdateValid = isUpdateValid;
	vm.updateTagValue = updateTagValue;


	// Setup variables
	vm.initTagData = null;
	vm.tagModel = {
		valType: null,
		processing: false
	};
	vm.tagValueTypeDropdown = {};
	vm.percentSlider = {
		options: {
			stop: percentSliderStop,
			min: 1,
			max: 100
		},
		model: null
	};
	vm.currencySlider = {
		options: {
			stop: currencySliderStop,
			min: 0.01,
			max: null,
			step: 0.01
		},
		model: null
	};


	// Local vars
	//


	init();

	function init() {

		// Assign translations & configure for Transaction Type dropdown
		vm.tagValueTypeDropdown = AccountSidePanelFactory.getTagValueTypeConfig();

		// Get data for the currently editing tag
		vm.initTagData = AccountSidePanelFactory.getTagDataForEditing();

		// Get the maximum allowable currency value
		vm.currencySlider.options.max = AccountSidePanelFactory.getMaxCurrencyValue();

		// Initialize the tag model (which vaue input do we need to show?)
		vm.tagModel.valType = vm.initTagData.valType;

		// Assign initial values
		if (vm.initTagData.valType === 'P') {

			// Select the correct option for the type dropdown
			vm.tagValueTypeDropdown.selectedTagValueType = vm.tagValueTypeDropdown.tagValueTypes[0];

			// Assign value for the percent slider model
			vm.percentSlider.model = vm.initTagData.valAmount;

			// Assign a default value for the currency model
			vm.currencySlider.model = vm.currencySlider.options.max;

			// Trigger a blur to update the input formatting
			$timeout(function() {
				$('#tag-percent-input').blur();
			}, 0);

		} else {

			// Select the correct option for the type dropdown
			vm.tagValueTypeDropdown.selectedTagValueType = vm.tagValueTypeDropdown.tagValueTypes[1];

			// Assign a default value for the percent slider model
			vm.percentSlider.model = 100;

			// Assign a default value for the currency model
			vm.currencySlider.model = vm.initTagData.valAmount;

			// Trigger a blur to update the input formatting
			$timeout(function() {
				$('#tag-currency-input').blur();
			}, 0);
		}
	}


	/*******************************************************************
	 * Public Functions
	 *******************************************************************/

	/*
	 * changeTagValueType - update data when tag value type change
	 */
	function changeTagValueType() {

		// Update the model value type
		vm.tagModel.valType = vm.tagValueTypeDropdown.selectedTagValueType.value;

		if (vm.tagModel.valType === 'P') {

			// Trigger a blur to update the input formatting
			$timeout(function() {
				$('#tag-percent-input').blur();
			}, 0);

		} else {

			// Trigger a blur to update the input formatting
			$timeout(function() {
				$('#tag-currency-input').blur();
			}, 0);
		}
	}


	/*
	 * isUpdateValid - is the tag value form valid?
	 */
	function isUpdateValid() {

		var modelNum,
			maxNum;

		if (vm.tagModel.valType === 'P') {

			modelNum = Number(vm.percentSlider.model);
			maxNum = 100;
		} else {

			modelNum = Number(vm.currencySlider.model);
			maxNum = Number(vm.currencySlider.options.max);
		}

		return modelNum > 0 && modelNum <= maxNum;
	}


	/*
	 * updateTagValue - update the value of the tag
	 */
	function updateTagValue() {

		if (!isUpdateValid()) {
			return;
		}

		// Start processing animation
		vm.tagModel.processing = true;

		// Allow the animation to complete before closing
		$timeout(function() {

			// Update the tag values by reference
			vm.initTagData.valType = vm.tagModel.valType;
			vm.initTagData.valAmount = vm.tagModel.valType === 'P' ?
				vm.percentSlider.model : vm.currencySlider.model;

			$scope.close();
		}, 250);
	}


	/*******************************************************************
	 * Private Functions
	 *******************************************************************/

	/*
	 * percentSliderStop - when the slider stops, blur the input to get the proper formatting
	 */
	function percentSliderStop() {

		$('#tag-percent-input').blur();
	}


	/*
	 * currencySliderStop - when the slider stops, blur the input to get the proper formatting
	 */
	function currencySliderStop() {

		$('#tag-currency-input').blur();
	}


	/*******************************************************************
	 * Listeners
	 *******************************************************************/
	//
}
