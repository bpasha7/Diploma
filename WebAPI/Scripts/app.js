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

angular.module('MyApp').controller('UserMenuController', function ($location) {
    var self = this;
    self.email = "bpasha@mail.ru";
    self.password = "12345";
    self.goLogin = function () {
        $location.url('/login');
    };

});


angular
    .module('MyApp')
    .service('LoginService', function ($http) {
        //поправить имена функций
        this.GetUserID = function (email, password) {
            return $http.get("api/user/login?email=" + email+"&password="+password)
        .then(getUserIDComplete)
        .catch(getUserIDFailed);

            function getUserIDComplete(data, status, headers, config) {
                return data.data;
            }

            function getUserIDFailed(e) {
                var newMessage = 'XHR Failed for getUserID'
                if (e.data && e.data.description) {
                    newMessage = newMessage + '\n' + e.data.description;
                }
                e.data.description = newMessage;
                logger.error(newMessage);
                return $q.reject(e);
            }
        }
    });


angular.module('MyApp').controller('LoginController', function ( $cookies, $cookieStore, $filter, $mdDialog, LoginService, $location) {
    var self = this;
    self.email="bpasha@mail.ru";
    self.password="12345";
    self.GetUserID = function (ev) {
        LoginService.GetUserID(self.email, self.password)
            .then(function (result) {
                if (result != 0) {
                    $cookies.put('userId', result);
                    self.showAlert(ev, $filter('translate')('HEADLINE'), $filter('translate')('LOGIN_SIGNUP_OK'));
                            $location.url('/monitor');
                }
                else
                {
                    self.showAlert(ev, $filter('translate')('HEADLINE'), $filter('translate')('LOGIN_SIGNUP_FAIL'));
                    //return false;
                }
            });
    };
    self.showAlert = function (ev, title, text) {
        // Appending dialog to document.body to cover sidenav in docs app
        // Modal dialogs should fully cover application
        // to prevent interaction outside of dialog
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title(title)
            .textContent(text)
            .ariaLabel('Alert Dialog')
            .ok('OK')
            .targetEvent(ev)
        );
        //return true;
       /* .then(function (result) {
                if(result)
                    $location.url('/monitor');
            });*/
    };
   
});




angular.module('MyApp').controller('MonitoringMenuController', function ($location, $translate) {
    var self = this;
    self.selectedMode = 'md-fling';
    self.changeLanguage = function (langKey) {
        $translate.use(langKey);
    };
    self.announceClick = function (index) {
        $mdDialog.show(
          $mdDialog.alert()
            .title('You clicked!')
            .textContent('You clicked the menu item at index ' + index)
            .ok('Nice')
        );
    };
    self.goMenu = function () {
        $location.url('/monitor');
    };
});


angular
    .module('MyApp')
    .service('DeviceService', function ($http) {
        //поправить имена функций
        this.GetDeviceSNMPData = function (id) {
            return $http.get("/api/Device/snmp?id=" +id)
        .then(getDeviceComplete)
        .catch(getDeviceFailed);

            function getDeviceComplete(data, status, headers, config) {
                return data.data;
            }

            function getDeviceFailed(e) {
                var newMessage = 'XHR Failed for GetDeviceSNMPData'
                if (e.data && e.data.description) {
                    newMessage = newMessage + '\n' + e.data.description;
                }
                e.data.description = newMessage;
                logger.error(newMessage);
                return $q.reject(e);
            }
        }
    });

class MonitoringChart {
    constructor() {
        this.labels = [];      
        //this.series = null;
        this.data = [[]];
        this.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
        this.options = {
            scales: {
                yAxes: [
                  {
                      id: 'y-axis-1',
                      type: 'linear',
                      display: true,
                      position: 'left'
                  }
                ]
            }
        };
    }
    UpdateChart(MonitoingResult, time) {
        this.series = [MonitoingResult.Name];
        this.name = MonitoingResult.Name + ' ' + MonitoingResult.Measure;
        if (this.data[0].length == 10) {
            this.data[0].shift();
            this.labels.shift();
        }
        else {
            this.labels.push(time);
            this.data[0].push(MonitoingResult.Value);
        }
    }
}

angular.module('MyApp').controller('DeviceController', function ($scope, $routeParams, $interval, DeviceService) {
    var self = this;
    self.id = $routeParams.id;
    self.DeviceSNMP;
    self.Period = 60;
    self.MonitoingCharts = [];
    self.MonitoingProperties = [];
    var stop;
    self.startMonitoring = function () {
        if (angular.isDefined(stop)) return;

        stop = $interval(function () {
            self.Refresh();
        }, (self.Period * 1000));
    };
    self.Refresh = function () {
        DeviceService.GetDeviceSNMPData(self.id).then(function (result) {
            self.DeviceSNMP = angular.fromJson(result);
        })
        .then(function () {
            self.UpdateMonitoingCharts();
            self.UpdateMonitoringProperies();
        });
    }
    self.UpdateMonitoringProperies = function () {
        self.MonitoingProperties = self.DeviceSNMP.monitoringProperties;
    }
    self.UpdateMonitoingCharts = function () {
        var data = self.DeviceSNMP.monitoringResults;
        var time = moment(Date.now()).format('LT');
        if (self.MonitoingCharts.length != data.length)
            self.CreateChart(data, time);
        else
            self.UpdateChart(data, time);
    }
    self.CreateChart = function (data, time) {
        for (var i = 0; i < data.length; i++) {
            self.MonitoingCharts.push(new MonitoringChart());
            self.MonitoingCharts[i].UpdateChart(data[i], time);
        }
    }
    self.UpdateChart = function (data, time) {
        for (var i = 0; i < data.length; i++) {
            self.MonitoingCharts[i].UpdateChart(data[i], time);
        }
    }
   /* self.onClick = function (points, evt) {
        console.log(points, evt);
    };*/

});



angular
    .module('MyApp')
    .service('DeviceFormService', function ($http) {
        //Добавление нового устройства с параметрами мониторинга
        var isCreated;
        this.CreateDevice = function (Device, monitoringEvents) {
            $http({
                method: "post",
                url: "api/Devices",
                data: { Device: Device, monitoringEvents: monitoringEvents },
                dataType: "json"
            })
                .then(function () {
                    return true;
                })
                .catch(function (status) {
                    console.log('ERROR: DeviceFormService.CreateDevice, Exception type: ' + status.data.ExceptionType + ', Message:' + status.data.Message);
                    return false;
                });

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

class MonitoringEvent {
    constructor(oid, conditions, notification) {
        this.ID = 0;
        this.DeviceID = 0;
        this.OID = oid;
        this.Conditions = conditions;
        this.Notification = notification;
    }
}



///--
angular.module('MyApp').controller('DeviceFormController', function ($http, $mdDialog, $timeout, DeviceFormService) {

    var self = this;

    //Выбранный тип устройств
    self.DeviceType = null;
    //Типы устройств из БД
    self.DeviceTypes = null;
    //Устройство
    self.Device = {};
    //Удалить
    self.Device.DeviceGroup = 1;
    self.Device.DeviceIP = "";
    self.ColorIP = 'rgba(0,0,0,0.87)';
    //Видимость элемента с OIDs
    self.ShowNext = false;
    //Выбор из списка OIDs
    var pendingSearch, cancelSearch = angular.noop;
    var lastSearch;
    self.asyncOIDs = [];
    self.filterSelected = true;
    self.querySearch = querySearch;
    self.delayedQuerySearch = delayedQuerySearch;

    /**
     * Search for contacts; use a random delay to simulate a remote call
     */
    function querySearch(criteria) {
        return criteria ? self.allOIDs.filter(createFilterFor(criteria)) : [];
    }

    //Проверка IP-Адреса, и выделение красным
    self.isIPv4 = function () {
        if (self.Device.DeviceIP == "" || self.Device.DeviceIP == undefined) {
            self.ColorIP = 'red';
            return;
        }
        var Parts = self.Device.DeviceIP.split(".");
        if (Parts.length < 4 || Parts.length > 4) {
            self.ColorIP = 'red';
            return;
        }
        for (var i = 0; i < Parts.length; i++) {
            if (Parts[i] > 255 || Parts[i] < 0 || Parts[i] == "") {
                self.ColorIP = 'red';
                return;
            }
        }
        self.ColorIP = 'rgba(0,0,0,0.87)';
    }
    /**
     * Async search for contacts
     * Also debounce the queries; since the md-contact-chips does not support this
     */
    function delayedQuerySearch(criteria) {
        if (!pendingSearch || !debounceSearch()) {
            cancelSearch();

            return pendingSearch = $q(function (resolve, reject) {
                // Simulate async search... (after debouncing)
                cancelSearch = reject;
                $timeout(function () {

                    resolve(self.querySearch(criteria));

                    refreshDebounce();
                }, Math.random() * 500, true)
            });
        }

        return pendingSearch;
    }

    function refreshDebounce() {
        lastSearch = 0;
        pendingSearch = null;
        cancelSearch = angular.noop;
    }

    /**
     * Debounce if querying faster than 300ms
     */
    function debounceSearch() {
        var now = new Date().getMilliseconds();
        lastSearch = lastSearch || now;

        return ((now - lastSearch) < 300);
    }

    //Создание функции фильтра для строки запроса
    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);

        return function filterFn(oid) {
            return (oid._lowername.indexOf(lowercaseQuery) != -1);
        };

    }

    //Загрузка списка OID для группы устрйоств, выбранной из списка
    function loadOIDs() {
        if (self.Device.DeviceType != null) {
            DeviceFormService.GetOIDs(self.Device.DeviceType).then(function (result) {
                self.allOIDs =
                result.map(function (c, index) {
                    var oid = {
                        Id: c.ID,
                        name: c.Name + GetCommentaryNotNull(c.Commentary),
                        email: c.OID1,
                        commentary: c.Commentary,
                        Conditions: "",
                        Type: c.ValueType,
                        Notification: false,
                        image: '/public/images/eye.png'
                    };
                    oid._lowername = oid.name.toLowerCase() + ' ' + oid.email.toLowerCase() + ' ' + oid.commentary.toLowerCase();
                    return oid;
                });
                self.oids = [self.allOIDs[0]];
                self.ShowNext = true;
            });
        }
        else {
            self.ShowNext = false;
            return;
        }
    }

    function GetCommentaryNotNull(Commentary) {
        if (Commentary != null && Commentary.trim() != "")
            return ' [' + Commentary + ']';
        else
            return '';
    }
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
            loadOIDs();
        }
    };
    //Сохраниние данных в БД
    self.CreateDevice = function (ev) {
        var monitoringEvents = [];
        for (var i = 0; i < self.oids.length; i++) {
            monitoringEvents.push(new MonitoringEvent(self.oids[i].Id, self.oids[i].Conditions, self.oids[i].Notification));
        }
        DeviceFormService.CreateDevice(self.Device, monitoringEvents)
        .then(function (result) {
            if (result)
                self.showAlert(ev, $filter('translate')('HEADLINE'), $filter('translate')('DEVICE_FORM_ALLER_TEXT_OK'));
            else
                self.showAlert(ev, $filter('translate')('HEADLINE'), $filter('translate')('DEVICE_FORM_ALLER_TEXT_FAIL'));
        })
    }

    self.showAlert = function (ev, titel, text) {
        // Appending dialog to document.body to cover sidenav in docs app
        // Modal dialogs should fully cover application
        // to prevent interaction outside of dialog
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title(titel)
            .textContent(text)
            .ariaLabel('Alert Dialog Demo')
            .ok('ОК')
            .targetEvent(ev)
        );
    };

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
