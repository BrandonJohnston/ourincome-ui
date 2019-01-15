/**
 * Created by brandonj on 8/18/16.
 */

angular
    .module('budget.ui')
    .controller('signupController', signupController);


signupController.$inject = [
    '$scope',
    '$log',
    '$state',
    'UserService'
];


function signupController($scope, $log, $state, UserService) {

    var vm = this;
    $log.debug('signupController');


    // Setup functions
    vm.signup = signup;


    // Setup variables
    vm.signupData = {
        userFirstName: null,
		userLastName: null,
        userEmail: null,
        userPassword: null,
        signupError: false
    };


    /*
     * signup
     */
    function signup() {
        $log.debug('signupController::signup');

        UserService.signupUser(vm.signupData).then(function(response) {

            if (response.loggedin) {

                UserService.setUserData(response);
                $state.go('dashboard');

            } else {

                $log.debug('signupUser failed - response.data:');
                $log.debug(response);

                if (response.error === 102) {
                    vm.signupData.signupError = true;
                }
            }

        });
    }

}
