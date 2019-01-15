/**
 * Created by brandonj on 3/26/18.
 */

angular
	.module('budget.ui')
	.service('budgetModal', ['$timeout', '$uibModal', 'modalOptions', 'modalSettings',
		function($timeout, $modal, modalOptions, modalSettings) {
			'use strict';

			var cancel = false;

			this.getCancel = function() {
				return cancel;
			};

			var modalInstances = [];

			/*
			 * open
			 */
			this.open = function(customOptions) {

				/*
				 * create private versions of options and settings
				 */
				var options = getUserOptions(customOptions, 'options');
				var settings = getUserOptions(customOptions, 'settings');
				var data = getUserOptions(customOptions, 'data');
				var modalInstance;

				if (settings.windowClass) {
					settings.windowClass += ' ' + modalSettings.windowClass;
				} else {
					settings.windowClass = modalSettings.windowClass;
				}

				extendConfigs(options, modalOptions);
				extendConfigs(settings, modalSettings);

				/*
				 * set contentTemplate
				 */
				options.contentTemplate = settings.contentTemplate;

				/*
				 * override class
				 */
				var settingsType = new RegExp(settings.type, 'g');
				var settingsSize = new RegExp(settings.size, 'g');
				settings.windowClass = settings.windowClass
					.replace(settingsType, '')
					.replace(settingsSize, '');
				settings.windowClass += ' ' + settings.type;
				settings.windowClass += ' ' + settings.size;

				/*
				 * define modal template
				 */
				if (!settings.templateUrl) {
					settings.templateUrl = settings.template || '/components/oiModal/oiModal.html';
				}

				/*
				 * conditionally define modal controller
				 */
				if (!settings.controller) {
					settings.controller = ['$scope', '$uibModalInstance', '$rootScope',
						function($scope, $modalInstance, $rootScope) {

							/*
							 * click on ADDITIONAL buttons
							 */
							$scope.additionalButtonClickHandler = function(index) {
								$rootScope.$broadcast(options.additionalButtons[index].eventName);
							};


							/*
							 * click on OK button
							 */
							$scope.ok = function() {

								if ($scope.options.actionDisabled) {
									return;
								}

								// Set the animation class
								$scope.options.actionProcessing = true;

								// Close the modal after 250ms delay, accommodate the animation
								$timeout(function() {
									cancel = false;
									$modalInstance.close($scope.data);
								}, 250);
							};


							/*
							 * click on CANCEL button
							 */
							$scope.close = function() {
								cancel = true;
								$modalInstance.dismiss('cancel');
							};

							$scope.$on('$destroy', function() {
								removeModalInstance(modalInstance);
							});


							/*
							 * bind properties
							 */
							$scope.options = options;
							$scope.data = data;
						}
					];
				}


				/*
				 * extend result with helper methods
				 */
				modalInstance = $modal.open(settings);
				modalInstance.result.close = modalInstance.close;
				modalInstance.result.dismiss = modalInstance.dismiss;
				modalInstance.result.opened = modalInstance.opened;
				modalInstances.push(modalInstance);

				return modalInstance.result;
			};

			/*
			 * close all opened modal
			 */
			this.dismissAll = function() {
				modalInstances.forEach(function(modalInstance) {
					modalInstance.dismiss();
				});
				modalInstances.length = 0;
			};

			function removeModalInstance(modalInstance) {
				var index = modalInstances.indexOf(modalInstance);
				modalInstances.splice(index, 1);
			}

			function extendConfigs(options, defaults) {
				//user may not have defined custom settings
				options = options || {};
				for (var prop in defaults) {
					if (!options.hasOwnProperty(prop) && defaults.hasOwnProperty(prop)) {
						options[prop] = defaults[prop];
					}
				}
			}

			function getUserOptions(configs, data) {
				configs = configs || {};

				if (typeof configs[data] === 'undefined') {
					configs[data] = {};
				}
				return configs[data];
			}
		}
	]);
