angular
    .module('MyApp')
    .service('LoginService', function ($http) {
        //поправить имена функций
        this.GetUserID = function (email, password) {
            return $http.get("api/user/login?email=" + email + "&password=" + password)
        .then(getComplete)
        .catch(getFailed);

            function getComplete(data) {
                return data.data;
            }

            function getFailed(e) {
                $log.error('Failed for LoginService');
                return null;
            }
        }
    });
angular.module('MyApp').controller('LoginController', function ($cookies, $filter, $mdDialog, LoginService, $location) {//$cookieStore,
    var self = this;
    self.email = "bpasha@mail.ru";
    self.password = "12345";
    self.GetUserID = function (ev) {
        LoginService.GetUserID(self.email, self.password)
            .then(function (result) {
                result = angular.fromJson(result)
                if (result != null) {
                    $cookies.put('userId', result.UserID);
                    $cookies.put('UserName', result.UserName);
                    self.showAlert(ev, $filter('translate')('HEADLINE'), $filter('translate')('LOGIN_SIGNUP_OK'));
                    $location.url('/monitor');
                }
                else {
                    self.showAlert(ev, $filter('translate')('HEADLINE'), $filter('translate')('LOGIN_SIGNUP_FAIL'));
                    //return false;
                }
            });
    };
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
        );
        //return true;
        /* .then(function (result) {
                 if(result)
                     $location.url('/monitor');
             });*/
    };

});