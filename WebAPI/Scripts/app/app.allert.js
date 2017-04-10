angular.module('MyApp').controller('MenuAlertController', MenuAlertController);
angular.module('MyApp').controller('DialogController', DialogController);

angular
    .module('MyApp')
    .service('AlertService', function ($http, $cookies) {
        //поправить имена функций
        this.GetAllerts = function () {
            var UserId = $cookies.get('userId');
            return $http.get("/api/Allerts?UserId=" + UserId)
        .then(getAllertsComplete)
        .catch(getAllertsFailed);

            function getAllertsComplete(data, status, headers, config) {
                return data.data;
            }

            function getAllertsFailed(e) {
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

function MenuAlertController($mdPanel) {
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
        templateUrl: 'alerts.html',
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

    self.Allerts = null;
    self._mdPanelRef = mdPanelRef;
    self.closeDialog = function () {
        self._mdPanelRef && self._mdPanelRef.close();
    }

    self.UpdateAllerts = function () {
        
        AlertService.GetAllerts().then(function (result) {
            self.Allerts = angular.fromJson(result);
        })
    }
    self.UpdateAllerts();

}