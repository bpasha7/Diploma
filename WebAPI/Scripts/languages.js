var translationsEN = {
    HEADLINE: 'Monitoring system',
    MENU_MONITOR: 'Monitor',
    MENU_DEVICES: 'Devices',
    MENU_SETTINGS: 'Settings',
	DEVICE_FORM_HEADER: 'New device form',
	DEVICE_FORM_FILLINGDATA: 'Fill in',
	DEVICE_FORM_TYPEDEVICES: 'Choose device type',
	DEVICE_FORM_IPADDRESS: 'IP-address',
	DEVICE_FORM_DEVICENAME: 'Name',
	DEVICE_FORM_AVAILABLEPARAMS: 'Available parameters'
};

var translationsRU = {
    HEADLINE: 'Система мониторинга',
    MENU_MONITOR: 'Монитор',
    MENU_DEVICES: 'Устройства',
    MENU_SETTINGS: 'Настрйоки',
	DEVICE_FORM_HEADER: 'Новое устрйоство',
	DEVICE_FORM_FILLINGDATA: 'Заполните данные',
	DEVICE_FORM_TYPEDEVICES: 'Выберите тип устройства',
	DEVICE_FORM_IPADDRESS: 'IP-Адресс',
	DEVICE_FORM_DEVICENAME: 'Название',
	DEVICE_FORM_AVAILABLEPARAMS: 'Доступных параметров'
};

//var app = angular.module('MyApp', ['pascalprecht.translate']);

angular.module('MyApp').config(['$translateProvider', function ($translateProvider) {
    // add translation tables
    $translateProvider.translations('en', translationsEN);
    $translateProvider.translations('ru', translationsRU);
    $translateProvider.preferredLanguage('ru');
    //$translateProvider.fallbackLanguage('en');
}]);
/*angular.module('MyApp').controller('LanguagesController', function ($translate, $scope) {

    $scope.changeLanguage = function (langKey) {
        $translate.use(langKey);
    };
});*/