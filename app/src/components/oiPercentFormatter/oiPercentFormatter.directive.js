/**
 * Created by brandonj on 9/22/18.
 */

angular
	.module('budget.ui')
	.directive('oiPercentFormat', ['$filter',
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
							plainNumber = $filter('currency')(plainNumber, '', 0);
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
							element.val($filter('currency')(plainNumber, '', 0) + '%');

						} else {

							element.val('');

						}
					});
				}
			}
		}
	]);
