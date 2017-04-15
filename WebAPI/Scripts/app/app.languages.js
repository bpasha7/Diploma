var translationsEN = {
    HEADLINE: 'Monitoring system',
    MENU_MONITOR: 'Monitor',
    MENU_DEVICES: 'Devices',
    MENU_SETTINGS: 'Settings',
	DEVICE_FORM_HEADER: 'New device form',
	DEVICE_FORM_FILLINGDATA: 'Fill in',
	DEVICE_FORM_LABELTYPESDEVICE: 'Device type',
	DEVICE_FORM_TYPEDEVICES: 'Choose device type',
	DEVICE_FORM_IPADDRESS: 'IP-address',
	DEVICE_FORM_DEVICENAME: 'Name',
	DEVICE_FORM_DEVICECOMMUNITY: 'Community',
	DEVICE_FORM_AVAILABLEPARAMS: 'Available parameters',
	DEVICE_FORM_PARAMETERS: 'Parameters',
	DEVICE_FORM_PARAMETERS: 'Parameter',
	DEVICE_FORM_CONDOTIONS: 'Conditions',
	DEVICE_FORM_EMAIL_ALLERT: 'E-mail alert',
	DEVICE_FORM_BUTTON_CREATE: 'Create',
	DEVICE_FORM_ALLER_TEXT_OK: 'Device was created!',
	DEVICE_FORM_ALLER_TEXT_FAIL: 'Device was not created!',
	LOGIN_HEADER: 'Sign In',
	LOGIN_EMAIL: 'Email',
	LOGIN_PASSWORD: 'Password',
	LOGIN_SIGNUP: 'Sgin Up',
	LOGIN_SIGNUP_OK: 'You are logged, now!',
	LOGIN_SIGNUP_FAIL: 'Not corret email/password! Try again!',
	DEVICE_MONITOR_LABEL_DURATION: 'Duration',
	DEVICE_MONITOR_BUTTON_START: 'Start',
	DEVICE_MONITOR_BUTTON_EDIT: 'Edit',
	DEVICE_MONITOR_BUTTON_STOP: 'Stop',
	DEVICE_MONITOR_PROPERIES: 'Properties',
	ALERT_DIALOG_CLEAR: 'Clear',
	ALERT_DIALOG_HEADER: 'Alerts'

	
	
};

var translationsRU = {
    HEADLINE: 'Система мониторинга',
    MENU_MONITOR: 'Монитор',
    MENU_DEVICES: 'Устройства',
    MENU_SETTINGS: 'Настрйоки',
	DEVICE_FORM_HEADER: 'Новое устрйоство',
	DEVICE_FORM_FILLINGDATA: 'Заполните данные',
	DEVICE_FORM_LABELTYPESDEVICE: 'Тип устройства',
	DEVICE_FORM_TYPEDEVICES: 'Выберите тип устройства',
	DEVICE_FORM_IPADDRESS: 'IP-Адрес',
	DEVICE_FORM_DEVICENAME: 'Название',
	DEVICE_FORM_DEVICECOMMUNITY: 'Доступ',
	DEVICE_FORM_AVAILABLEPARAMS: 'Доступных параметров',
	DEVICE_FORM_PARAMETERS: 'Параматры',
	DEVICE_FORM_PARAMETERS: 'Параматр',
	DEVICE_FORM_CONDOTIONS: 'Условия',
	DEVICE_FORM_EMAIL_ALLERT: 'Оповещение на e-mail',
	DEVICE_FORM_BUTTON_CREATE: 'Добавить',
	DEVICE_FORM_ALLER_TEXT_OK: 'Устройство добавлено!',
	DEVICE_FORM_ALLER_TEXT_FAIL: 'Устройство не добавлено, произошла ошибка!',
	LOGIN_HEADER: 'Вход в систему',
	LOGIN_EMAIL: 'Email',
	LOGIN_PASSWORD: 'Пароль',
	LOGIN_SIGNUP: 'Создать',
	LOGIN_SIGNUP_OK: 'Успешно авторизованы!',
	LOGIN_SIGNUP_FAIL: 'Не правильные email/пароль! Попробуйте заново!',
	DEVICE_MONITOR_LABEL_DURATION: 'Обновление',
	DEVICE_MONITOR_BUTTON_START: 'Запуск',
	DEVICE_MONITOR_BUTTON_EDIT: 'Изменить',
	DEVICE_MONITOR_BUTTON_STOP: 'Стоп',
	DEVICE_MONITOR_PROPERIES: 'Свойства',
	ALERT_DIALOG_CLEAR: 'Очистить',
	ALERT_DIALOG_HEADER: 'Оповещения'
};

angular.module('MyApp').config(['$translateProvider', function ($translateProvider) {
    // Добавляем таблицы переводов
    $translateProvider.translations('en', translationsEN);
    $translateProvider.translations('ru', translationsRU);
    $translateProvider.preferredLanguage('ru');
}]);
