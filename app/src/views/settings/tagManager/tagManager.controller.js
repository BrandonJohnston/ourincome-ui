/**
 * Created by brandonj on 2/7/19.
 */

angular
	.module('budget.ui')
	.controller('tagManagerController', tagManagerController);


tagManagerController.$inject = [
	'$log',
	'TagsFactory',
	'UserService',
	'CalendarConstants'
];


function tagManagerController($log, TagsFactory, UserService, CalendarConstants) {

	var vm = this;
	$log.debug("tagManagerController");


	// Setup functions
	vm.getTagParent = getTagParent;
	vm.getTagDisplayDate = getTagDisplayDate;


	// Setup variables
	vm.loading = true;
	vm.userTags = [];


	init();


	function init() {

		// Get the user's data
		var userData = UserService.getUserData();

		// Save the user's tags into an array
		var allUserTags = TagsFactory.getUserTagsData();

		vm.userTags = allUserTags.tagsFlatList.filter(function(tag){
			return tag.owner_id === userData.id;
		});

		$log.debug("vm.userTags");
		$log.debug(vm.userTags);

		vm.loading = false;
	}


	/*******************************************************************
	 * Public Functions
	 *******************************************************************/

	function getTagParent(tagParent) {

		return tagParent ? tagParent : '--';
	}


	function getTagDisplayDate(tagDate) {

		if (!tagDate) {
			return '--';
		}

		var date = tagDate.split('-');

		return date[1] === '05' ?
			moment(tagDate, CalendarConstants.DATE_ID_FORMAT).format(CalendarConstants.DATE_NICE_FULL_FORMAT_MAY) :
			moment(tagDate, CalendarConstants.DATE_ID_FORMAT).format(CalendarConstants.DATE_NICE_FULL_FORMAT);
	}


	/*******************************************************************
	 * Private Functions
	 *******************************************************************/

	//
}
