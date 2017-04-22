angular
    .module('MyApp')
    .service('DeviceService', function ($http, $log) {
        //Получение данных мониторинга для пользователя по id устройства
        this.GetDeviceSNMPData = function (id, userId) {
            return $http.get("/api/Device/snmp?id=" + id + "&userId=" + userId)
        .then(getComplete)
        .catch(getFailed);

            function getComplete(data) {
                return data.data;
            }

            function getFailed(e) {
                $log.error('Failed for GetDeviceSNMPData');
                return null;
            }
        }
    });

class MonitoringChart {
    constructor() {
        this.labels = [];
        this.data = [[]];
        this.datasetOverride = [{ yAxisID: 'y-axis-1' }];
        this.options = {
            scales: {
                yAxes: [
                  {
                      id: 'y-axis-1',
                      //ticks: { min: 0 },
                      //pointDot: false,
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

angular.module('MyApp').controller('DeviceController', function ($cookies, $scope, $routeParams, $interval, DeviceService) {
    var self = this;
    self.id = $routeParams.id;
    self.DeviceSNMP;
    self.Period = 20;
    self.MonitoingCharts = [];
    self.MonitoingProperties = [];
    self.MonitoingTabs;
    self.ProgressLinear = 0;
    self.timeLeft = 0;
    self.isRun = false;
    self.UserId = $cookies.get('userId');
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
            DeviceService.GetDeviceSNMPData(self.id, self.UserId).then(function (result) {
                if (result != null) {
                    self.DeviceSNMP = result;
                    self.ProgressLinear = 0;
                    self.timeLeft = 0;
                    return 1;
                }
                else
                    return null;
            })
        .then(function (result) {
            if (result == null)
                return;
            self.UpdateMonitoingCharts();
            self.UpdateMonitoringProperies();
            //self.UpdateMonitoringLists();
        });
    }
    self.UpdateMonitoringProperies = function () {
        self.MonitoingProperties = self.DeviceSNMP.monitoringProperties;
    }
    self.UpdateMonitoringLists = function () {
        self.MonitoingTabs = self.DeviceSNMP.monitoringList;
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
});