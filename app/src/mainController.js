/**
 * Created by brandonj on 2/3/16.
 */

(function() {
    "use strict";

    angular
        .module('budget.ui')
        .controller('mainController', mainController);


    mainController.$inject = [
        '$rootScope',
        '$log',
	    'UserService',
	    'TagsFactory'
    ];


    function mainController($rootScope, $log, UserService, TagsFactory) {

        var vm = this;
        $log.debug('mainController');


        // Setup functions
        vm.checkIsUserLoading = checkIsUserLoading;


        // Setup variables
	    var userData = null;
        vm.isSideboardOpen = false;
		vm.isUserLoading = {
			userData: true,
			tagsData: true
		};

	    init();

	    function init() {

	    }


	    /*******************************************************************
	     * Public Functions
	     *******************************************************************/

	    /*
	     * checkIsUserLoading - check if the user's data is done loading
	     */
	    function checkIsUserLoading() {

		    return vm.isUserLoading.userData && vm.isUserLoading.tagsData;
	    }


	    /*******************************************************************
	     * Private Functions
	     *******************************************************************/

	    /*
	     * getUserTagData - retrieve user's Tag data when application loads or user logs in
	     */
	    function getUserTagData() {

		    // Get account-wide data (tags)
		    TagsFactory.getTags().then(function(response) {

			    // Save the returned data for use later
			    if (response.length > 0) {
				    TagsFactory.setUserTagsData(response);

				    vm.isUserLoading.tagsData = false;
			    }
		    });
	    }


	    /*******************************************************************
	     * Listeners
	     *******************************************************************/

        /*
         * toggleSideboard
         */
        $rootScope.$on('sideboardToggle', function() {
            vm.isSideboardOpen = !vm.isSideboardOpen;
        });


		/*
		 * the run block has retrieved initial user data
		 */
		$rootScope.$on('UserDataLoaded', function() {

			// Get saved user data from factory
			userData = UserService.getUserData();

			// if user is logged in, get their Tag data
			if (userData.loggedin) {

				getUserTagData();

			} else {

				vm.isUserLoading.userData = false;
			}
		});

    }
})();
