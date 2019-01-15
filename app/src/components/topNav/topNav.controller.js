/**
 * Created by brandonj on 6/7/16.
 */

angular
    .module('budget.ui')
    .controller('topNavController', topNavController);


topNavController.$inject = [
    '$rootScope',
	'$scope',
    '$log',
    '$state',
    'UserService'
];


function topNavController($rootScope, $scope, $log, $state, UserService) {

    var vm = this;
    $log.debug('topNavController');


    // Setup functions
    vm.navigate = navigate;
    vm.toggleSideboard = toggleSideboard;
	vm.toggleUserNav = toggleUserNav;
	vm.closeUserNav = closeUserNav;
	vm.getUserFullName = getUserFullName;


    // Setup variables
    vm.userData = null;
    vm.isToggleOpen = false;
	vm.isUserNavOpen = false;


	/*******************************************************************
	 * Public Functions
	 *******************************************************************/

    /*
     * navigate - sends the user to homepage or dashboard depending on logged in status
     */
    function navigate() {

        $log.debug('topNavController :: navigate()');

        vm.userData = UserService.getUserData();

        if (vm.userData) {
            $state.go('dashboard');
        } else {
            $state.go('home');
        }
    }


    /*
     * toggleSideboard - broadcast to toggle the sideboard
     */
    function toggleSideboard() {
        $rootScope.$broadcast('sideboardToggle');
    }


	/*
	 * toggleUserNav - toggle the top user nav open / closed
	 */
	function toggleUserNav() {

		vm.isUserNavOpen = !vm.isUserNavOpen;
	}


	/*
	 * closeUserNav - callback function to close the user nav
	 */
	function closeUserNav() {

		vm.isUserNavOpen = false;
		$scope.$apply();
	}


	/*
	 * getUserFullName - returns the user's First + Last Name
	 */
	function getUserFullName() {

		return vm.userData.firstName + ' ' + vm.userData.lastName;
	}


	/*******************************************************************
	 * Private Functions
	 *******************************************************************/

	/*
	 * UserDataLoaded - initial run user data has been returned
	 * this helps users if they are already logged in on first page load
	 */
	function checkUserData() {

		vm.userData = UserService.getUserData();
	}


	/*******************************************************************
	 * Listeners
	 *******************************************************************/

    /*
     * listen for sideboardToggle - it can be sent from other views
     */
    $rootScope.$on('sideboardToggle', function() {
        vm.isToggleOpen = !vm.isToggleOpen;
    });


	/*
	 * Update the state when it changes
	 */
	$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {

		// Closer user nav on state changes
		vm.isUserNavOpen = false;

		// Get updated user data on state changes
		vm.userData = UserService.getUserData();
	});


	$rootScope.$on('UserDataLoaded', function() {
		checkUserData();
	});

}
