(function(){
	var app = angular.module('app.directives.gui',[]);
	
	app.directive("gui", function() {
		return {
		    restrict : 'E',
		    templateUrl : "js/templates/gui.html",
		};
	});

}());	
