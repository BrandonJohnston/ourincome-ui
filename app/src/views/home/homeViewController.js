/**
 * Created by brandonj on 2/3/16.
 */

angular
    .module('budget.ui')
    .controller('homeViewController', homeViewController);


homeViewController.$inject = [
    '$rootScope',
    '$log',
    '$state',
    'UserService'
];


function homeViewController($rootScope, $log, $state, UserService) {

    var vm = this;
    $log.debug("homeViewController");


    // Setup functions
    vm.checkUserData = checkUserData;


    // Setup variables
    vm.userData = null;


    /*
     * Get any user data
     */
    checkUserData();


    /*
     * UserDataLoaded - initial run user data has been returned
     * this helps users if they are already logged in on first page load
     */
    function checkUserData() {

        vm.userData = UserService.getUserData();

		// We have userData & loggedin is true - send to the dashboard instead of the homepage
        if (vm.userData && vm.userData.loggedin) {
            $state.go('dashboard');
        }
    }


    $rootScope.$on('UserDataLoaded', function() {
        checkUserData();
    });

}
