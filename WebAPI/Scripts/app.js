//var app = 
angular.module('MyApp', ['ngMaterial','ngRoute']);
angular.module('MyApp').controller('AppCtrl', AppCtrl);

//============
// Routing configuration.
function router ($routeProvider) {
    $routeProvider
    .when('/test', {
        templateUrl: '/public/test.html',
        controller: 'InboxCtrl',
        controllerAs: 'test'
    })
    .otherwise({
        redirectTo: '/test.html'
    });
};

angular
  .module('MyApp')
  .config(router);

angular.module('MyApp').service('myService', function ($http) {
    this.CreateDevice = function (Device) {
        var monitoringEvent = {};
        monitoringEvent.DeviceID = 0;
        monitoringEvent.OID = 1;
        monitoringEvent.Conditions = "123";
        monitoringEvent.Notification = true;
        var indata = { Device: Device, monitoringEvent: monitoringEvent };
        
        var response = $http({
            method: "post",
            url: "api/Devices",
            data: indata,//JSON.stringify(employee),
            dataType: "json"
        });
        return response;
    }
});
angular.module('MyApp').controller('DeviceFormController', function ($http, $timeout, myService) {

    var vm = this;

    vm.DeviceType = null;
    vm.DeviceTypes = null;

    vm.Device = {};
    vm.Device.DeviceGroup = 1;


    vm.loadDeviceTypes = function () {
        if (vm.DeviceTypes != null)
            return;
        // Use timeout to simulate a 650ms request.
        return $timeout(function () {
            $http.get("api/DeviceTypes", { responseType: "json" }).then(function (response) {
                vm.DeviceTypes = response.data;
            });
        }, 650);
    };

    vm.CreateDevice = function () {
        myService.CreateDevice(vm.Device);
    }
});
/*function CreateDevice($scope) function () {
    var data = "12321313";

    $http
      .post('api/Devices', data)
      .success(function(data, status, headers, config) {
          successFn();
      })
      .errors(function(data, status, headers, config) {
          errorFn();
      });
};

function successFn() {
    alert("success");
};

function errorFn() {
    alert("error");   
};*/
//=================
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

/*angular.module('MyApp').controller('SelectAsyncController', function ($http, $timeout, $scope) {
    $scope.DeviceType = null;
    $scope.DeviceTypes = null;

    $scope.loadDeviceTypes = function () {
        if ($scope.DeviceTypes != null)
            return;
        // Use timeout to simulate a 650ms request.
        return $timeout(function () {
            $http.get("api/DeviceTypes", { responseType: "json" }).then(function (response) {
                $scope.DeviceTypes = response.data;
            });
        }, 650);
    };
});*/