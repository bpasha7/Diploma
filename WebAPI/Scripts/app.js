﻿angular.module('MyApp', ['ngMaterial', 'ngMessages', 'material.svgAssetsCache', 'ngRoute', 'pascalprecht.translate']);


angular.module('MyApp').controller('AppCtrl', AppCtrl);

//============
// Routing configuration.
function router ($routeProvider) {
    $routeProvider
    .when('/monitor', {
        templateUrl: 'monitor.html',
        redirectTo: '/monitor',
        controller: 'MonitorCtrl'//,
        //controllerAs: 'Monitor'
    })
     .when('/device/:id', {//'/device/:id'
         templateUrl: 'test.html',
         //redirectTo: '/device:id',
               controller: 'DeviceController',
               controllerAs: 'Device'
           })
    .otherwise({
        redirectTo: ''
    });
};

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
    self.goMenu = function() {
        $location.url('http://localhost:63384/#/monitor');
        };
});

angular.module('MyApp').controller('DeviceController', function ($scope, $routeParams) {
    var self = this;
    self.temp = $routeParams.id;

});


angular
  .module('MyApp')
  .config(router);

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
                .then(function (data, status, headers, config) {
                    return data.data;
                })
                .catch(function (status) {
                    console.log('ERROR: DeviceFormService.CreateDevice, Exception type: ' + status.data.ExceptionType + ', Message:' + status.data.Message);
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
    function querySearch (criteria) {
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
        if ( !pendingSearch || !debounceSearch() )  {
            cancelSearch();

            return pendingSearch = $q(function(resolve, reject) {
                // Simulate async search... (after debouncing)
                cancelSearch = reject;
                $timeout(function() {

                    resolve( self.querySearch(criteria) );

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
                        name: c.Name,
                        email: c.OID1,
                        Conditions: "",
                        Type: c.ValueType,
                        Notification: false,
                        image: '/public/images/eye.png'
                    };
                    oid._lowername = oid.name.toLowerCase() + ' ' + oid.email.toLowerCase();
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
        var rew =
        DeviceFormService.CreateDevice(self.Device, monitoringEvents);
            //self.showAlert(ev);
    }

    self.showAlert = function (ev) {
        // Appending dialog to document.body to cover sidenav in docs app
        // Modal dialogs should fully cover application
        // to prevent interaction outside of dialog
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title('This is an alert title')
            .textContent('You can specify some description text in here.')
            .ariaLabel('Alert Dialog Demo')
            .ok('Got it!')
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
