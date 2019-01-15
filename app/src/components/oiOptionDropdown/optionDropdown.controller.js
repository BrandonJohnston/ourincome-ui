/**
 * Created by brandonj on 11/2/16.
 */

angular
    .module('budget.ui')
    .controller('budgetOptionDropdownController', budgetOptionDropdownController);


budgetOptionDropdownController.$inject = [
    '$element',
    '$scope',
    '$log'
];


function budgetOptionDropdownController($element, $scope, $log) {

    var vm = this;
    $log.debug('budgetOptionDropdownController');


    // Setup functions
    vm.toggleOptionList = toggleOptionList;
    vm.selectOption = selectOption;
	vm.isOptionSelected = isOptionSelected;


    // Setup variables
    var ngModel = $element.controller('ngModel');
    vm.dropdownDisabled = $scope.dropdownDisabled || false;
    vm.selectConfig = $scope.config || null;
    vm.selectOptions = $scope.selectOptions || [];
    vm.selectedOption = null;
    vm.isListOpen = false;


    if (!ngModel) {
        return;
    }


    // Watch for changes to dropdownDisabled
    $scope.$watch('dropdownDisabled', function() {
        vm.dropdownDisabled = angular.copy($scope.dropdownDisabled) || false;
    });


    ngModel.$render = function() {

        vm.selectedOption = ngModel.$viewValue;

        if (!vm.selectedOption) {
            vm.selectedOption = vm.selectOptions[0];
        }
    };


    /*
     * toggleOptionList - user has clicked to open the list
     */
    function toggleOptionList() {

        // Do not open if the dropdown is disabled
        if (vm.dropdownDisabled) {
            return;
        }

        // Assign the new option as selected
        vm.isListOpen = !vm.isListOpen;
    }


    /*
     * selectOption - user has clicked to select an option
     */
    function selectOption(option) {
        $log.debug('budgetOptionDropdownController::selectOption():');

        // Assign the new option as selected
        vm.selectedOption = option;

        // Update the model
        ngModel.$setViewValue(vm.selectedOption);

        // Close the option list
        vm.isListOpen = false;

	    //
	    callChangeFunction(vm.selectedOption);
    }


	/*
	 * isOptionSelected - determine if this option is selected
	 */
	function isOptionSelected(option) {

		var isSelected = false;

		if (vm.selectConfig.multiSelect) {

			isSelected = option.isSelected;
		} else {

			isSelected = vm.selectedOption.id === option.id;
		}

		return isSelected;
	}


	/*******************************************************************
	 * Private Functions
	 *******************************************************************/

	function callChangeFunction(selectionOption) {

		if (typeof $scope.changeFn === "function") {
			$scope.changeFn({value: selectionOption});
		}
	}
}
