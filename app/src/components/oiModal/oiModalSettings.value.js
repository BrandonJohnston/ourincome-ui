/**
 * Created by brandonj on 3/26/18.
 */

(function() {
	'use strict';

	angular.module('budget.ui')
		.value('modalSettings', {
			windowClass: 'budget-modal',
			size: 'md',
			type: 'default',
			backdrop: true,
			keyboard: true,
			modalFade: true,
			contentTemplate: '/components/oiModal/oiModalDefault.html'
		});
})();
