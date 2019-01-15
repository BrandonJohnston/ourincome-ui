/**
 * Created by brandonj on 8/18/16.
 */

angular
    .module('budget.ui')
    .directive('budgetSignupForm', [
        function () {
            return {
                restrict: 'E',
				replace: true,
                scope: {},
                templateUrl: 'components/userSignup/signupView.html',
                controller: 'signupController',
                controllerAs: 'vm'
            };
        }
    ]);
