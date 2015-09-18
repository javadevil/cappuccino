var app = angular.module('Cappuccino', ['ngMaterial']);

app.config(function iconProvider($mdIconProvider) {
    var baseUrl = '/bower_components/material-design-icons/sprites/svg-sprite/';
    $mdIconProvider
    .iconSet('action', baseUrl + 'svg-sprite-action.svg')
    .iconSet('alert', baseUrl + 'svg-sprite-alert.svg')
    .iconSet('av', baseUrl + 'svg-sprite-av.svg')
    .iconSet('communication', baseUrl + 'svg-sprite-communication.svg')
    .iconSet('content', baseUrl + 'svg-sprite-content.svg')
    .iconSet('device', baseUrl + 'svg-sprite-device.svg')
    .iconSet('editor', baseUrl + 'svg-sprite-editor.svg')
    .iconSet('file', baseUrl + 'svg-sprite-file.svg')
    .iconSet('hardware', baseUrl + 'svg-sprite-hardware.svg')
    .iconSet('image', baseUrl + 'svg-sprite-image.svg')
    .iconSet('maps', baseUrl + 'svg-sprite-maps.svg')
    .iconSet('navigation', baseUrl + 'svg-sprite-navigation.svg')
    .iconSet('notification', baseUrl + 'svg-sprite-notification.svg')
    .iconSet('social', baseUrl + 'svg-sprite-social.svg')
    .iconSet('toggle', baseUrl + 'svg-sprite-toggle.svg');
});

app.controller('AppCtrl', ['$scope', '$mdSidenav', function($scope, $mdSidenav) {
    $scope.toggleSidenav = function(menuId) {
        $mdSidenav(menuId).toggle();
    };
    $scope.mydate = new Date();

}]);
