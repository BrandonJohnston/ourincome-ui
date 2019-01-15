/**
 * Created by brandonj on 8/18/16.
 */

(function() {
    "use strict";

    angular
        .module('budget.ui')
        .factory('UserService', UserService);

    UserService.$inject = ['$log', '$http', '$q', '$translate'];

    function UserService($log, $http, $q, $translate) {

		var currUserData = {
			loggedin: false
		};

		var userLang;

        var service = {
			getInUseLocaleKey: getInUseLocaleKey,
			setLocale: setLocale,
            checkLoggedIn: checkLoggedIn,
            setUserData: setUserData,
            getUserData: getUserData,
            signupUser: signupUser,
            loginUser: loginUser,
            logoutUser: logoutUser,
			transformUserData: transformUserData
        };

        return service;


		/*
		 * getInUseLocale - returns the currently used locale
		 */
		function getInUseLocaleKey() {
			var langKey;

			if (userLang) {

				// If a langKey is already stored, return it
				langKey = userLang;

			} else {

				// langKey isn't stored and we don't have a cookie, return the in use language.
				langKey = $translate.use();
			}

			return langKey;
		}


		/*
		 * setLocale - sets all of the appropriate locale items
		 */
		function setLocale(langKey) {
			// Can only set a language on the login page, no need to set the cookie here

			// Save the langKey to the factory for future use
			userLang = langKey;

			// Tell the translate service to use the new key
			$translate.use(langKey);

			// Set the moment.js locale for date formatting
			moment.locale(langKey);

			// Set the rave locale for number formatting
			//rave doesn't include pre-formatted locale definitions for formatting, so use our constants
			// TODO: Don't currently have RAVE setup, need to do this later
			//if (RAVE_LOCALES[langKey]) {
			//	localeObj.locale = rave.locale(RAVE_LOCALES[langKey]);
			//}
		}


		/*
         * checkLoggedIn - see if the user already has a session
         */
        function checkLoggedIn() {

			var deferred = $q.defer();

			$http.get('/api.php/api/user/currentUser',
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json; charset=utf-8'
					}
				})
				.then(
					function successCallback(response) {

						var data = transformUserData(response.data);

						return deferred.resolve(data);
					},
					function errorCallback(errorResponse) {
						$log.debug("user.service :: checkLoggedIn() error:");
						$log.debug(errorResponse);

						var userData = {
							loggedin: false
						};
						return deferred.resolve(userData);
					}
				);


			return deferred.promise;
        }


        /*
         * setUserData - save data for use throughout the application
         * @userData - object {name, email, id}
         */
        function setUserData(userData) {

            currUserData = userData;
        }


        /*
         * getUserData - returns the current user's data
         */
        function getUserData() {

            return currUserData;
        }


        /*
         * signupUser - sign up a new user
         * @userData - object {name, email, password}
         */
        function signupUser(userData) {

			// Prepare data
            var postData = {
                'first_name': userData.userFirstName,
				'last_name': userData.userLastName,
                'email': userData.userEmail,
                'password': userData.userPassword
            };

			var deferred = $q.defer();

			// Submit POST and process API reponse
			$http.post('/api.php/api/user/signup',
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json; charset=utf-8'
					},
					data: postData
				})
				.then(
				function successCallback(response) {

					// Prepare the user data before returning
					var data = transformUserData(response.data);

					return deferred.resolve(data);
				},
				function errorCallback(errorResponse) {

					$log.debug("user.service :: signupUser() error:");
					$log.debug(errorResponse);

					var userData = {
						loggedin: false
					};

					return deferred.resolve(userData);
				}
			);

			return deferred.promise;
        }


        /*
         * signupUser - sign up a new user
         * @userData - object {name, email, password}
         */
        function loginUser(userData) {

            var postData = {
                'email': userData.userEmail,
                'password': userData.userPassword
            };

            return $http({
                url: '/api.php/api/user/login',
                method: 'POST',
                data: postData,
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
			});
        }


        /*
         * logoutUser - sign up a new user
         */
        function logoutUser() {

            return $http({
                url: '/api.php/api/user/logout',
                method: 'POST',
                data: currUserData,
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            });
        }


		/*******************************************************************
		 * Private Functions
		 *******************************************************************/

		/*
		 * transformUserData - transform the user data from API syntax to UI syntax
		 * TODO: This is currently public, need to refactor loginUser() function then make this private
		 */
		function transformUserData(userData) {

			return {
				firstName: userData.first_name,
				lastName: userData.last_name,
				email: userData.email,
				id: userData.id,
				loggedin: userData.loggedin
			};
		}

    }
})();
