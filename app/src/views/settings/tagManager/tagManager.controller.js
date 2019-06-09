/**
 * Created by brandonj on 2/7/19.
 */

angular
	.module('budget.ui')
	.controller('tagManagerController', tagManagerController);


tagManagerController.$inject = [
	'$log',
	'TagsFactory',
	'TagManagerFactory',
	'UserService',
	'CalendarConstants',
	'budgetModal'
];


function tagManagerController($log, TagsFactory, TagManagerFactory, UserService, CalendarConstants, budgetModal) {

	var vm = this;
	$log.debug("tagManagerController");


	// Setup functions
	vm.getTagParent = getTagParent;
	vm.getTagDisplayDate = getTagDisplayDate;
	vm.createTag = createTag;
	vm.editTag = editTag;
	vm.deleteTag = deleteTag;


	// Setup variables
	vm.loading = true;
	vm.userTags = [];
	vm.newTagModel = {
		name: null
	};
	vm.tagParentDropdown = {};


	init();


	function init() {

		// Get the user's data
		var userData = UserService.getUserData();

		// Save the user's tags into an array
		var allUserTags = TagsFactory.getUserTagsData();

		vm.userTags = allUserTags.tagsFlatList.filter(function(tag){
			return tag.owner_id === userData.id;
		});

		// Setup the new tag parent dropdown
		vm.tagParentDropdown = TagManagerFactory.getTagParentConfig(vm.userTags);

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


	function createTag() {

		$log.debug('createTag()');

		$log.debug('vm.newTagModel');
		$log.debug(vm.newTagModel);
		$log.debug('vm.tagParentDropdown.selectedTag');
		$log.debug(vm.tagParentDropdown.selectedTag);
	}


	function editTag() {

		$log.debug('editTag()');
	}


	function deleteTag() {

		$log.debug('deleteTag()');
	}


	/*******************************************************************
	 * Private Functions
	 *******************************************************************/

	//
}
