/**
 * Created by brandonj on 6/23/17.
 */

(function() {
	"use strict";

	angular
		.module('budget.ui')
		.constant('TransactionConstant', TransactionConstant());

	function TransactionConstant() {
		return {
			TRANS_TYPES: [
				{
					id: '1',
					name: 'income',
					value: '1'
				},
				{
					id: '2',
					name: 'expense',
					value: '2'
				}
			],
			PANEL_MODES: {
				ADD: 'add',
				EDIT: 'edit'
			},
			TAG_VALUE_OPTIONS: [
				{
					id: 1,
					name: 'percent',
					value: 'P'
				},
				{
					id: 2,
					name: 'currency',
					value: 'C'
				}
			],
			DEFAULT_TAG_VALUES: {
				TAG_TYPE: "P",
				TAG_AMOUNT: 100
			}
		};
	}

})();
