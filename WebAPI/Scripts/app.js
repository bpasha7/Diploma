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
        .when('/settings', {
            templateUrl: 'public\\views\\settings.html',
            controller: 'AccountController',
            controllerAs: 'Account'
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
    .service('NewParamFormService', function ($http, $cookies, $log) {
        var functionName = "";
        this.CreateParam = function (NewParam) {
            functionName = "CreateParam";
            return $http({
                method: "post",
                url: "api/OIDs",
                data: { oID: NewParam },
                dataType: "json"
            })
                .then(getComplete)
                .catch(getFailed);
        }

        function getComplete(data) {
            return data.data;
        }

        function getFailed(e) {
            $log.error('Failed for NewParamFormService->' + functionName);
            return null;
        }
    });


angular.module('MyApp')
    .controller('NewParamFormController', function (DeviceFormService, NewParamFormService, $timeout) {
        var self = this;
        self.ValueTypes = [
            { id: 0, name: 'string'},
            { id: 1, name: 'list'},
            { id: 2, name: 'numeric'}
        ];
        //Выбранный тип устройств
        self.NewParam = {};
        self.NewParam.DeviceType1 = null;
        self.NewParam.ID = 0;
        //Типы устройств из БД
        self.DeviceTypes = null;
        //Загрузка типов устройств из БД
        self.loadDeviceTypes = function () {
            if (self.DeviceTypes != null)
                return;
            return $timeout(function () {
                DeviceFormService.GetTypes()
                .then(function (data) {
                    self.DeviceTypes = data;
                });
            }, 650);
        };
        self.CreateParam = function () {
            NewParamFormService.CreateParam(self.NewParam)
                .then(function (result) {
                    if (result)
                        alert('ere');
                })
        }
        self.TypeSelected = function () {

        }

        self.showAlert = function (ev, title, text) {
            $mdDialog.show(
              $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .title(title)
                .textContent(text)
                .ariaLabel('Alert Dialog')
                .ok('OK')
                .targetEvent(ev)
            )
        }
    });


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
    .controller('MonitorController', function (MonitorService, $interval) {
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

        /*$http.get("api/ViewDevices", { responseType: "json" })
        .then(function (response) { self.Devices = response.data; });*/

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
