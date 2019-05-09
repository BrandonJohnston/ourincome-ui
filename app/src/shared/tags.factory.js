/**
 * Created by brandonj on 4/10/18.
 */

(function() {
	"use strict";

	angular
		.module('budget.ui')
		.factory('TagsFactory', TagsFactory);

	TagsFactory.$inject = ['$log', '$http', '$q'];

	function TagsFactory($log, $http, $q) {

		var userTagsData = {
			tags: [],
			tagsFlatList: []
		};

		var service = {
			getTags: getTags,
			setUserTagsData: setUserTagsData,
			setUserTagsFlatData: setUserTagsFlatData,
			getUserTagsData: getUserTagsData
		};

		return service;


		/*
		 * getTags - get users tag data from API
		 */
		function getTags() {

			var deferred = $q.defer();

			$http.get('/api.php/api/tags/getTags',
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json; charset=utf-8'
					}
				})
				.then(
				function successCallback(response) {

					var hierarchyTagsArray = convertTagsToHierarchy(response.data);
					setUserTagsFlatData(response.data);

					return deferred.resolve(hierarchyTagsArray);
				},
				function errorCallback(errorResponse) {
					$log.debug('tags.factory :: getTags() error:');
					$log.debug(errorResponse);

					return deferred.resolve(errorResponse);
				}
			);

			return deferred.promise;
		}


		/*
		 * setUserTagsData - save users tag data for use throughout the application
		 */
		function setUserTagsData(userData) {

			userTagsData.tags = userData;
		}


		/*
		 * setUserTagsFlatData - save users tag data for use throughout the application
		 */
		function setUserTagsFlatData(userData) {

			userTagsData.tagsFlatList = userData;
		}


		/*
		 * getUserData - returns the users tag data
		 */
		function getUserTagsData() {

			return userTagsData;
		}


		/*******************************************************************
		 * Private Functions
		 *******************************************************************/

		/*
		 * convertTagsToHierarchy - nest child tags as children of parent tags
		 */
		function convertTagsToHierarchy(tagsArray) {

			var hierarchyTags = [],
				i;

			// Loop over each item in tagsArray (flat list)
			// Assign all level 0 tags to the new array
			for (i = 0; i < tagsArray.length; i++) {

				tagsArray[i].tagId = tagsArray[i].id;
				tagsArray[i].name = tagsArray[i].tag_name;
				tagsArray[i].value = tagsArray[i].tag_name;

				if (tagsArray[i].tag_level === '0') {

					tagsArray[i].children = [];

					// tag is level 0, add it to the hierarchy array
					hierarchyTags.push(tagsArray[i]);

				}
			}

			// Loop over each item in tagsArray (flat list)
			// Assign all level 1 tags to their parent
			for (i = 0; i < tagsArray.length; i++) {

				if (tagsArray[i].tag_level === '1') {

					// tag is level 1, look for it's parent
					for (var j = 0; j < hierarchyTags.length; j++) {

						if (hierarchyTags[j].id === tagsArray[i].tag_parent) {

							hierarchyTags[j].children.push(tagsArray[i]);
						}
					}

				}
			}

			return hierarchyTags;
		}

	}
})();
