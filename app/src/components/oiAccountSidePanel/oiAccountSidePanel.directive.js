/**
 * Created by brandonj on 6/22/17.
 */

angular
	.module('budget.ui')
	.directive('oiAccountSidePanel', [
		function () {
			return {
				restrict: 'E',
				replace: true,
				scope: {
					accountId: "="
				},
				templateUrl: 'components/oiAccountSidePanel/oiAccountSidePanelView.html',
				controller: 'oiAccountSidePanelController',
				controllerAs: 'vm'
			};
		}
	]);
