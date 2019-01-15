/**
 * Created by brandonj on 4/27/17.
 */

(function() {
	"use strict";

	angular
		.module('budget.ui')
		.factory('UtilsService', UtilsService);

	UtilsService.$inject = ['$sanitize'];

	function UtilsService($sanitize) {

		var service = {
			sanitizeText: sanitizeText,
			parseHTML: parseHTML
		};

		return service;


		/*
		 * sanitizeText - method used to take text and parse. Used to catch errors in bad parsing of text during
		 * sanitize processs and displaying error message.
		 */
		function sanitizeText(text) {
			try {
				return this.parseHTML($sanitize(text));
			} catch (error) {
				return (error.message || error);
			}
		}


		/*
		 * parseHTML - method used to take text and parse it to filter out any malicious text(scripts).
		 * @param text - Takes in text which need to be parsed.
		 * @returns {element} - returns a unique ID for html elements.
		 */
		function parseHTML(text) {
			var element = document.createElement("span");
			element.innerHTML = text;
			return element.innerHTML.replace(new RegExp("&amp;", "g"), "&");
		}

	}
})();
