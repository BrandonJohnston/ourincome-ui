/**
 * Created by brandonj on 6/9/19.
 */

(function() {
	"use strict";

	angular
		.module('budget.ui')
		.factory('TagManagerFactory', TagManagerFactory);

	TagManagerFactory.$inject = [
		'$log',
		'$translate'
	];

	function TagManagerFactory($log, $translate) {

		var tagParentDropdown = {
			config: {
				displayMode: 'block',
				label: $translate.instant('budget.SETTINGS.TAG_MANAGER.CREATE_TAG.PARENT_LABEL'),
				multiSelect: false
			},
			tags: []
		};

		var service = {
			getTagParentConfig: getTagParentConfig
		};

		return service;


		/*******************************************************************
		 * Public Functions
		 *******************************************************************/

		/*
		 * getTagParentConfig - returns a config for tag manager - tag parent dropdown
		 */
		function getTagParentConfig(userTags) {
			
			tagParentDropdown.tags = [];

			// Add 'Select a tag'
			var defaultTag = {
				id: '0',
				owner_id: '0',
				name: $translate.instant('budget.ACCOUNT.SIDE_PANEL.DEFAULT_TAG'),
				value: $translate.instant('budget.ACCOUNT.SIDE_PANEL.DEFAULT_TAG')
			};

			tagParentDropdown.tags.push(defaultTag);

			// Add any top level user tags as options
			angular.forEach(userTags, function(tag, key) {

				if (tag.tag_level === '0' && !tag.tag_parent) {
					tagParentDropdown.tags.push(tag);
				}
			});

			// Select a default
			tagParentDropdown.selectedTag = tagParentDropdown.tags[0];

			return tagParentDropdown;
		}


		/*******************************************************************
		 * Private Functions
		 *******************************************************************/

		//

	}
})();
