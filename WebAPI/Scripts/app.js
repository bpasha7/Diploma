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

angular
    .module('MyApp')
    .service('myService', function ($http) {
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
            data: indata,
            dataType: "json"
        });
        return response;
    }
        //поправить имена функций
    this.GetOIDs = function (DeviceType) {
        return $http.get("api/OIDs/Type?ForDevices=" + DeviceType)
    .then(getCustomerComplete)
    .catch(getCustomerFailed);

        function getCustomerComplete(data, status, headers, config) {
            return data.data;
        }

        function getCustomerFailed(e) {
            var newMessage = 'XHR Failed for getCustomer'
            if (e.data && e.data.description) {
                newMessage = newMessage + '\n' + e.data.description;
            }
            e.data.description = newMessage;
            logger.error(newMessage);
            return $q.reject(e);
        }
    }
    });

angular.module('MyApp').controller('DeviceFormController', function ($http, $timeout, myService) {

    var self = this;
    //Выбранный тип устройств
    self.DeviceType = null;
    //Типы устройств из БД
    self.DeviceTypes = null;
    //Устройство
    self.Device = {};
    //Удалить
    self.Device.DeviceGroup = 1;
    self.ShowNext = false;


    //==========

    

    //Загрузка типов устройств из БД
    self.loadDeviceTypes = function () {
        if (self.DeviceTypes != null)
            return;
        //Показываем область

        // Use timeout to simulate a 650ms request.
        return $timeout(function () {
            $http.get("api/DeviceTypes", { responseType: "json" }).then(function (response) {
                self.DeviceTypes = response.data;
            });
        }, 650);
    };
    self.TypeChanged = function () {
        if (self.DeviceTypes != null) {
           // loadOIDs();
           /* self.allOIDs = loadOIDs();//.then(function (result) {
                self.OIDs = [self.allOIDs[0]];*/
                self.ShowNext = true;
           // });
            
        }
            
        
    };
    //Сохраниние данных в БД
    self.CreateDevice = function () {
        myService.CreateDevice(self.Device);
    }
});

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
