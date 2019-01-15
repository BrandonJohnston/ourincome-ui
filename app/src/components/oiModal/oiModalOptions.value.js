/**
 * Created by brandonj on 3/26/18.
 */

(function() {
	'use strict';

	angular.module('budget.ui')
		.value('modalOptions', {
			actionButtonText: 'budget.BUDGET_MODAL.PRIMARY_BUTTON',
			closeButtonText: 'budget.BUDGET_MODAL.SECONDARY_BUTTON',
			headerText: 'budget.BUDGET_MODAL.HEADER',
			showCloseButton: true,
			showActionButton: true,
			additionalButtons: []
		});
})();
