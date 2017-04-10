angular
    .module('MyApp')
    .service('LoginService', function ($http) {
        //поправить имена функций
        this.GetUserID = function (email, password) {
            return $http.get("api/user/login?email=" + email + "&password=" + password)
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