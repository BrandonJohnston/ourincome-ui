/**
 * Created by brandonj on 2/3/16.
 */

angular
    .module('budget.ui')
    .controller('sideboardController', sideboardController);


sideboardController.$inject = [
    '$rootScope',
    '$log',
    '$state',
	'$stateParams',
    'UserService',
	'AccountFactory'
];


function sideboardController($rootScope, $log, $state, $stateParams, UserService, AccountFactory) {

    var vm = this;
    $log.debug('sideboardController');


    // Setup functions
    vm.navigate = navigate;
    vm.checkUserData = checkUserData;
	vm.checkAccountActive = checkAccountActive;


    // Setup variables
    vm.stateDetails = null;
    vm.isSideboardOpen = false;
    vm.userData = {};
	vm.userAccounts = null;


	/*******************************************************************
	 * Public Functions
	 *******************************************************************/

    /*
     * Navigate to new state when option is clicked in sideboard
     */
    function navigate(newState, stateParam) {

		$log.debug('sideboard.controller :: navigate()');

		// send user to new state
		if (newState === 'account.view.transactions') {

			$state.go(newState, {'accountId': stateParam});
		} else {

			$state.go(newState);
		}
    }


	/*
	 * UserDataLoaded - initial run user data has been returned
	 * this helps users if they are already logged in on first page load
	 */
	function checkUserData() {

		vm.userData = UserService.getUserData();

		if (vm.userData && vm.userData.loggedin) {

			getAccounts();
		}
	}


	/*
	 * checkAccountActive -
	 */
	function checkAccountActive(accountId) {

		return $stateParams.accountId === accountId;
	}


	/*******************************************************************
	 * Private Functions
	 *******************************************************************/

	/*
	 * getAccounts - gets all available user accounts and adds them to navigation
	 */
	function getAccounts() {

		AccountFactory.getAllAccounts().then(
			function(response) {

				vm.userAccounts = response.data;
			}
		);
	}


	/*******************************************************************
	 * Listeners
	 *******************************************************************/

    /*
     * Update the state when it changes
     */
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {

        vm.stateDetails = toState;

        // check user status when state changes
		// may need to find a better way to check for updates to side nav
        checkUserData();
    });


    /*
     * listen for sideboardToggle - it can be sent from other views
     */
    $rootScope.$on('sideboardToggle', function() {
        vm.isSideboardOpen = !vm.isSideboardOpen;
    });


    $rootScope.$on('UserDataLoaded', function() {
        checkUserData();
    });

}
