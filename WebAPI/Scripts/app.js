angular.module('MyApp', ['ngMaterial', 'ngMessages', 'material.svgAssetsCache', 'ngRoute', 'pascalprecht.translate', 'ngCookies', 'chart.js']);

//============
// Routing configuration.
function router($routeProvider) {
    $routeProvider
    .when('/login', {
        templateUrl: 'public\\views\\login.html',
        controller: 'LoginController'
    })
    .when('/monitor', {
        templateUrl: 'public\\views\\main.html',
        redirectTo: '/monitor'
    })
     .when('/device/:id', {
         templateUrl: 'public\\views\\device.html',
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

angular
    .module('MyApp')
    .service('MonitorService', function ($http, $cookies) {
        var UserId = $cookies.get('userId');
        var functionName;
        //Получить группы пользователя
        this.GetGroups = function () {
            functionName = "GetGroups";
            return $http.get("api/Groups/" + UserId)
                .then(getComplete)
                .catch(getFailed);
        }
        //Получить устрйоства по группе пользователя
        this.getDeviceByGroup = function (grp) {
            functionName = "getDeviceByGroup";
            return $http.get("api/ViewDevices/group?GroupId=" + grp)
                    .then(getComplete)
                    .catch(getFailed);
        }

        function getComplete(data) {
            return data.data;
        }

        function getFailed(e) {
            $log.error('Failed for MonitorService' + functionName);
            return null;
        }
    });

angular.module('MyApp')
    .controller('MonitorController', function (MonitorService, $http, $interval) {
        var self = this;

        self.MyGroups;
        self.Devices;
        self.group = 0;
        self.ProgressLinear = 0;
        self.timeLeft = 0;
        self.isRun = false;
        self.Period = 30;
        var stop;
        self.stopMonitoring = function () {
            if (angular.isDefined(stop)) {
                $interval.cancel(stop);
                self.ProgressLinear = 0;
                self.isRun = false;
                stop = undefined;
            }
        }
        self.startMonitoring = function () {
            if (angular.isDefined(stop)) return;
            self.isRun = true;
            stop = $interval(function () {
                self.ProgressLinear = (++self.timeLeft / self.Period) * 100;
                if (self.timeLeft > self.Period) {
                    self.Refresh();
                }
            }, 1000);
        };
        self.Refresh = function () {
            if (self.UserId != null)
               // DeviceService.GetDeviceSNMPData(self.id, self.UserId).then(function (result) {
                  //  if (result != null) {
                        self.DeviceSNMP = result;
                        self.ProgressLinear = 0;
                        self.timeLeft = 0;
                   // }
                   // else
                       // return;
              //  });
        }

        $http.get("api/ViewDevices", { responseType: "json" })
        .then(function (response) { self.Devices = response.data; });

        self.getList = function () {
            MonitorService.GetGroups()
                .then(function (result) {
                    if (result == null)
                        return;
                    self.MyGroups = result;
                });
        };
        self.NewGroupSelected = function () {
            MonitorService.getDeviceByGroup(self.group)
                .then(function (result) {
                    if (result == null)
                        return;
                    self.Devices = result;
                });
        }
    });


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
