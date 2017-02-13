'use strict';

angular.module('frontendApp')
  .directive("modals", function() {
	return {
		templateUrl : "views/partials/modals.html"
	};
});

// angular.module('frontendApp').directive("createdStoryEditModal" , function(){
// 	return {
// 		templateUrl : "views/partials/editstory-modal.html"
// 		// controller: "createdstoryModalController", 
// 		// controllerAs: "$ctrl"
// 	}
// });
