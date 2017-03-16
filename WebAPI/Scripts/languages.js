var translationsEN = {
    HEADLINE: 'What an awesome module!',
    PARAGRAPH: 'Srsly!',
    BUTTON_LANG_DE: 'German',
    BUTTON_LANG_EN: 'English'
};

var translationsRU = {
    HEADLINE: 'Was für ein großartiges Modul!',
    PARAGRAPH: 'Ernsthaft!',
    BUTTON_LANG_RU: 'Deutsch',
    BUTTON_LANG_EN: 'Englisch'
};

var app = angular.module('myApp', ['pascalprecht.translate']);

app.config(['$translateProvider', function ($translateProvider) {
    // add translation tables
    $translateProvider.translations('en', translationsEN);
    $translateProvider.translations('de', translationsDE);
    $translateProvider.preferredLanguage('en');
    $translateProvider.fallbackLanguage('en');
}]);

app.controller('Ctrl', ['$translate', '$scope', function ($translate, $scope) {

    $scope.changeLanguage = function (langKey) {
        $translate.use(langKey);
    };
}]);