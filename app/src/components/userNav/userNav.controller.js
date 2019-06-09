/**
 * Created by brandonj on 5/4/17.
 */

angular
	.module('budget.ui')
	.controller('userNavController', userNavController);


userNavController.$inject = [
	'$log',
	'$state',
	'UserService',
	'TagsFactory'
];


function userNavController($log, $state, UserService, TagsFactory) {

	var vm = this;
	$log.debug('userNavController');


	// Setup functions
	vm.navigate = navigate;
	vm.logout = logout;


	// Setup variables
	//


	/*******************************************************************
	 * Public Functions
	 *******************************************************************/

	/*
	 * navigate
	 */
	function navigate() {
		$log.debug('userNavController :: navigate()');

		// Add navigate logic
	}


	/*
	 * logout
	 */
	function logout() {
		$log.debug('userNavController :: logout()');

		UserService.logoutUser().then(function(response) {

			// update user data ( should be {"loggedin": false} )
			UserService.setUserData(response.data);

			// Set tags data to empty
			TagsFactory.setUserTagsData([]);

			$state.go('home');

		},
		function (errorResp) {
			$log.debug('UserService errorResp:');
			$log.debug(errorResp);
		});
	}

}
