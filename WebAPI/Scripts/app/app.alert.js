angular.module('MyApp').controller('MenuAlertController', MenuAlertController);
angular.module('MyApp').controller('DialogController', DialogController);

angular
    .module('MyApp')
    .service('AlertService', function ($http, $cookies, $log) {
        var UserId = $cookies.get('userId');
        //поправить имена функций
        var functionName;
        //Првоерить оповешения пользователя
        this.AlertsCount = function () {
            functionName = "AlertsCount";
            return $http.get("api/Alerts/Count?UserId=" + UserId)
                .then(getComplete)
                .catch(getFailed);
        }
        this.GetAlerts = function () {
            functionName = "GetAlerts";
            return $http.get("/api/Alerts?UserId=" + UserId)
        .then(getComplete)
        .catch(getFailed);
        }
        this.SetRead = function (msg) {
            return $http({
                method: 'put',
                url: '/api/Alerts/',// + msg.ID,
                data: msg
            }).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        }

        function getComplete(data) {
            return data.data;
        }

        function getFailed(e) {
            $log.error('Failed for MonitorService' + functionName);
            return null;
        }
    });

function MenuAlertController($mdPanel, AlertService) {
    var self = this;
    self._mdPanel = $mdPanel;
    self.duration = 300;
    self.separateDurations = {
        open: self.duration,
        close: self.duration
    };

};

MenuAlertController.prototype.ShowDialog = function () {
    var position = this._mdPanel.newPanelPosition()
		.absolute()
		.right()
		.top();

    var animation = this._mdPanel.newPanelAnimation();

    animation.duration(this.duration || this.separateDurations);

    animation.openFrom('.animation-target');

    animation.closeTo('.animation-target');

    animation.withAnimation(this._mdPanel.animation.SCALE);


    var config = {
        animation: animation,
        attachTo: angular.element(document.body),
        controller: DialogController,
        controllerAs: 'Ctrl',
        templateUrl: 'public\\views\\alerts.html',
        panelClass: 'demo-dialog-example',
        position: position,
        trapFocus: true,
        zIndex: 150,
        clickOutsideToClose: true,
        clickEscapeToClose: true,
        hasBackdrop: true,
    };

    this._mdPanel.open(config);


};

// Necessary to pass locals to the dialog template.
function DialogController(mdPanelRef, AlertService) {
    var self = this;
    //

    self.Alerts = null;
    self._mdPanelRef = mdPanelRef;
    self.closeDialog = function () {
        self._mdPanelRef && self._mdPanelRef.close();
    }

    self.HasAlerts = function () {
        if (self.Alerts == null || self.Alerts.length == 0)
            return false;
        else
            return true;
    }

    self.UpdateAlerts = function () {
        
        AlertService.GetAlerts().then(function (result) {
            self.Alerts = angular.fromJson(result);
        })
    }

    self.Read = function (id) {
        var msg = self.Alerts.filter(function (obj) {
            return obj.ID == id;
        })[0];
        msg.isRead = true;
        AlertService.SetRead(msg)
            .then(function () {
                self.UpdateAlerts();
            });
    }
    //self.UpdateAlerts();

}