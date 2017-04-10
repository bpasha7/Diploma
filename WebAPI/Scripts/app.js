angular.module('MyApp', ['ngMaterial', 'ngMessages', 'material.svgAssetsCache', 'ngRoute', 'pascalprecht.translate', 'ngCookies', 'chart.js']);


angular.module('MyApp').controller('AppCtrl', AppCtrl);

//============
// Routing configuration.
function router($routeProvider) {
    $routeProvider
    .when('/login', {
        templateUrl: 'login.html',
        controller: 'LoginController'//,
       // controllerAs: 'Login'
    })
    .when('/monitor', {
        templateUrl: 'main.html',
        redirectTo: '/monitor'//,
        //controller: 'MonitorCtrl'//,
        //controllerAs: 'Monitor'
    })
     .when('/device/:id', {//'/device/:id'
         templateUrl: 'device.html',
         //redirectTo: '/device:id',
         controller: 'DeviceController',
         controllerAs: 'Device'
     })
    .otherwise({
        redirectTo: ''
    });
};

angular
  .module('MyApp')
  .config(router);


function AppCtrl($scope) {
    $scope.currentNavItem = 'page2';
}
angular.module('MyApp').controller('MonitorCtrl', function ($scope, $http) {
    $http.get("api/ViewDevices", { responseType: "json" })
    .then(function (response) { $scope.Devices = response.data; });
});

//angular.module('MyApp').controller('DeviceController')



angular.module('MyApp').controller('SwitchDemoCtrl', function ($scope) {
    $scope.data = {
        cb1: true,
        cb4: true,
        cb5: false
    };

    $scope.message = 'false';

    $scope.onChange = function (cbState) {
        $scope.message = cbState;
    };
});
