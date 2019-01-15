/**
 * Created by brandonj on 6/7/16.
 */

angular
    .module('budget.ui')
    .directive('budgetLoginForm', [
		'$rootScope', '$document', '$timeout',
        function ($rootScope, $document, $timeout) {
            return {
                restrict: 'E',
				replace: true,
                scope: {
					close: "&"
				},
                templateUrl: 'components/userLogin/loginView.html',
                controller: 'loginController',
                controllerAs: 'vm',
				link: function($scope, element) {

					// Focus the first input box when opening the login popover
					document.getElementById('login-email-input').focus();

					// TODO:	Look into making this directive attribute based and closing itself on outside click
					//			Rather than the $broadcast / $on method below

					$timeout(function() {
						element.on('click', elementClick);
						$document.on('click', documentClick);
					}, 500);

					// User clicked on the user nav
					function elementClick(e) {
						e.stopPropagation();
					}

					// User clicked on the document
					function documentClick(e) {
						$scope.close();
					}

					// remove event handlers when directive is destroyed
					$scope.$on('$destroy', function () {
						element.off('click', elementClick);
						$document.off('click', documentClick);
					});

				}
            };
        }
    ]);
