(function(){
	var app = angular.module('app.directives.forms',[]);
	
	app.directive("forms", function() {
		return {
		    restrict : 'E',
		    templateUrl : "js/templates/forms.html",
		};
	});

}());	
