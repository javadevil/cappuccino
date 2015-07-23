var app = angular.module('Cappuccino',['ngMaterial']);

app.controller('AppCtrl', ['$scope','$mdSidenav',function($scope,$mdSidenav){
	$scope.toggleSidenav = function(id){
		$mdSidenav(id).toggle();
	}
}]);