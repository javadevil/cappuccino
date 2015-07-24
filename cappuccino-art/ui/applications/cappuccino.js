var app = angular.module('Cappuccino', ['ngMaterial']);

app.config(function($mdThemingProvider) {
    $mdThemingProvider.theme("default")
        .primaryPalette("brown")
        .accentPalette("cyan");
});

//Iconset config
app.config(function($mdIconProvider) {
    $mdIconProvider
        .iconSet("action", "l/material-design-icons/sprites/svg-sprite/svg-sprite-action.svg")
        .iconSet("alert", "l/material-design-icons/sprites/svg-sprite/svg-sprite-alert.svg")
        .iconSet("av", "l/material-design-icons/sprites/svg-sprite/svg-sprite-av.svg")
        .iconSet("communication", "l/material-design-icons/sprites/svg-sprite/svg-sprite-communication.svg")
        .iconSet("content", "l/material-design-icons/sprites/svg-sprite/svg-sprite-content.svg")
        .iconSet("device", "l/material-design-icons/sprites/svg-sprite/svg-sprite-device.svg")
        .iconSet("editor", "l/material-design-icons/sprites/svg-sprite/svg-sprite-editor.svg")
        .iconSet("file", "l/material-design-icons/sprites/svg-sprite/svg-sprite-file.svg")
        .iconSet("hardware", "l/material-design-icons/sprites/svg-sprite/svg-sprite-hardware.svg")
        .iconSet("image", "l/material-design-icons/sprites/svg-sprite/svg-sprite-image.svg")
        .iconSet("maps", "l/material-design-icons/sprites/svg-sprite/svg-sprite-maps.svg")
        .iconSet("navigation", "l/material-design-icons/sprites/svg-sprite/svg-sprite-navigation.svg")
        .iconSet("notification", "l/material-design-icons/sprites/svg-sprite/svg-sprite-notification.svg")
        .iconSet("social", "l/material-design-icons/sprites/svg-sprite/svg-sprite-social.svg")
        .iconSet("toggle", "l/material-design-icons/sprites/svg-sprite/svg-sprite-toggle.svg")
});

app.controller('AppCtrl', ['$scope', '$mdSidenav', '$mdDialog', '$http', function($scope, $mdSidenav, $mdDialog, $http) {
    $scope.title = "Cappuccino";

    $scope.toggleSidenav = function(id) {
        $mdSidenav(id).toggle();
    };
    $scope.setTitle = function(title) {
        $scope.title = title;
    }
    $scope.requestAuthenticate = function() {
        $mdDialog.show({
            parent: angular.element(document.body),
            templateUrl: 'templates/authenticate/authenticate.dialog.html',
            controller: 'AuthenticateCtrl',
            onRemoving: $scope.getUserProfile
        });
    };
    $scope.getUserProfile = function(){
    	$http.get('/auth')
            .success(function(data, status, headers, config) {
                $scope.user = data;
            })
            .error(function(data, status, headers, config) {
                $scope.requestAuthenticate();
            });
    }

    $scope.openMenu = function($mdOpenMenu, ev) {
        console.log(ev);
        originatorEv = ev;
        $mdOpenMenu(ev);
    };

    $scope.logout = function() {
        $http.get('/auth/logout')
            .success(function(data, status, headers, config) {
                $scope.requestAuthenticate();
                $scope.user = false;
            })
            .error(function(data, status, headers, config) {

            })
    }

    angular.element(document).ready($scope.getUserProfile);
}]);

app.controller('AuthenticateCtrl', ['$scope', '$mdDialog', '$http', function($scope, $mdDialog, $http) {

    $scope.authenticate = function() {
        $scope.pending = true;
        $http.post('/auth/login', $scope.user)
            .success(function(data, status, headers, config) {
                $scope.pending = false;
                $mdDialog.hide();
            })
            .error(function(data, status, headers, config) {
                $scope.errText = data.message;
                $scope.pending = false;
                $scope.user.password = '';
            })
    }

}]);
