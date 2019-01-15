/**
 * Created by brandonj on 6/15/17.
 */

angular
	.module('budget.ui')
	.directive('oiCurrencyFormat', ['$filter',
		function($filter) {
			return {
				require: 'ngModel',
				link: function(scope, element, attrs, ngModelController) {


					/*
					 * sets the value of the model
					 */
					ngModelController.$parsers.push(function(data) {
						//convert data from view format to model format

						if (element.val()) {

							var plainNumber = element.val().replace(/[^\d|\-+|\.+]/g, '');
							plainNumber = $filter('currency')(plainNumber, '');
							plainNumber = plainNumber.replace(/\,/g,'');
							return plainNumber;

						} else {

							return '';

						}

					});


					/*
					 * update the view value when user blurs the element
					 */
					element.bind('blur', function() {

						if (element.val()) {

							var plainNumber = element.val().replace(/[^\d|\-+|\.+]/g, '');
							element.val($filter('currency')(plainNumber));

						} else {

							element.val('');

						}
					});
				}
			}
		}
	]);
