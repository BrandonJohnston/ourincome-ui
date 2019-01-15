/**
 * Created by brandonj on 10/30/17.
 */

angular
	.module('budget.ui')
	.directive('budgetPopover', [
		'$document', '$timeout',
		function ($document, $timeout) {
			return {
				restrict: 'E',
				replace: true,
				scope: {
					changeFn: "&?",
					close: "&?",
					config: '='
				},
				templateUrl: 'components/oiPopover/popoverView.html',
				controller: 'budgetPopoverController',
				controllerAs: 'vm',
				link: function($scope, element) {

					// If there is a close function
					if ($scope.close && $scope.config.outsideClick) {

						$timeout(function() {
							element.on('click', elementClick);
							$document.on('click', documentClick);
						}, 0);

						// User clicked on the popover content
						function elementClick(e) {
							e.stopPropagation();
						}

						// User clicked on the document
						function documentClick(e) {
							$scope.close({apply: true});
						}

						// remove event handlers when directive is destroyed
						$scope.$on('$destroy', function () {
							element.off('click', elementClick);
							$document.off('click', documentClick);
						});
					}
				}
			};
		}
	]);
