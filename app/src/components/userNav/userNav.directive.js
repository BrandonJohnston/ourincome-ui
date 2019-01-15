/**
 * Created by brandonj on 5/4/17.
 */

angular
	.module('budget.ui')
	.directive('budgetUserNav', [
		'$document', '$timeout',
		function ($document, $timeout) {
			return {
				restrict: 'E',
				replace: true,
				scope: {
					close: "&"
				},
				templateUrl: 'components/userNav/userNavView.html',
				controller: 'userNavController',
				controllerAs: 'vm',
				link: function($scope, element) {

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
