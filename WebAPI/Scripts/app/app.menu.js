﻿angular.module('MyApp').controller('UserMenuController', function ($location, $cookies) {
    var self = this;
    self.email = "bpasha@mail.ru";
    self.password = "12345";
    self.UserName = null;
    self.goLogin = function () {
        $location.url('/login');
    };
    self.isLogined = function () {
        self.UserName = $cookies.get('UserName');
        if (self.UserName != null) {
            return true;
        }
        else
            return false;
    }
    self.LogOut = function () {
        $cookies.remove('UserName');
        $cookies.remove('UserId');
        self.UserName = null;
    }

});

angular.module('MyApp').controller('MonitoringMenuController', function ($location, $translate) {
    var self = this;
    self.selectedMode = 'md-fling';
    self.changeLanguage = function (langKey) {
        $translate.use(langKey);
    };

    self.goMenu = function () {
        $location.url('/monitor');
    };
});