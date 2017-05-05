var translationsEN = {
    HEADLINE: 'Monitoring system',
    MENU_MONITOR: 'Monitor',
    MENU_DEVICES: 'Devices',
    MENU_PARAM: 'Parameters',
    //
    MENU_SETTINGS: 'Settings',
	DEVICE_FORM_HEADER: 'New device form',
	FORM_FILLINGDATA: 'Fill in',//Uniform name
	FORM_LABELTYPESDEVICE: 'Device type',//Uniform name
	DEVICE_FORM_TYPEDEVICES: 'Choose device type',
	DEVICE_FORM_IPADDRESS: 'IP-address',
	FORM_NAME: 'Name',//Uniform name
	DEVICE_FORM_DEVICECOMMUNITY: 'Community',
	DEVICE_FORM_AVAILABLEPARAMS: 'Available parameters',
	DEVICE_FORM_PARAMETERS: 'Parameters',
	DEVICE_FORM_PARAMETER: 'Parameter',
	DEVICE_FORM_CONDOTIONS: 'Conditions',
	DEVICE_FORM_EMAIL_ALLERT: 'E-mail alert',
	FORM_BUTTON_CREATE: 'Create',//Uniform name
	DEVICE_FORM_ALLER_TEXT_OK: 'Device was created!',
	DEVICE_FORM_ALLER_TEXT_FAIL: 'Device was not created!',
	LOGIN_HEADER: 'Sign In',
	LOGIN_EMAIL: 'Email',
	LOGIN_PASSWORD: 'Password',
	LOGIN_SIGNUP: 'Sgin Up',
	LOGIN_SIGNUP_OK: 'You are logged, now!',
	LOGIN_SIGNUP_FAIL: 'Not corret email/password! Try again!',
	ACCOUNT: 'Account',
	SIGNOUT: 'Sign Out',
	DEVICE_MONITOR_LABEL_DURATION: 'Duration',
	DEVICE_MONITOR_BUTTON_START: 'Start',
	DEVICE_MONITOR_BUTTON_STOP: 'Stop',
	DEVICE_MONITOR_PROPERIES: 'Properties',
	CONTROL_PANEL: 'Monitorin control panel',
	ALERT_DIALOG_CLEAR: 'Clear',
	ALERT_DIALOG_HEADER: 'Alerts',
	PARAMETERS_FORM_HEADDER: 'New parameter',
	FORM_GROUPS: 'Groups',
	FORM_GROUP: 'Group',
	PARAMETERS_FORM_PARAM_TYPE: 'Type',
	PARAMETERS_FORM_PARAM_COMMENTARY: 'Commentary',
	PARAMETERS_FORM_PARAM_VALUE: 'Value',
	PARAMETERS_FORM_PARAM_MEASURE: 'Measure',
	SETTINGS_FORM_HEADER: 'Account setteings',
	SETTINGS_FORM_ALERT: 'E-mail alerts',
	SETTINGS_FORM_DEFAULT_INTERVAL: 'Default monitoring interval',
	SETTINGS_FORM_SEC: 'Seconds',
	SETTINGS_FORM_MAX: 'Maximum alerts',
	SETTINGS_FORM_WHEN: 'When',
	SETTINGS_FORM_PASSWORD_MANAGE: 'Password managment',
	FORM_EDIT: 'Edit',
	FORM_SAVE: 'Save',
	FORM_DELETE: 'Delete',
	SETTINGS_FORM_GROUPS_MANAGE: 'Groups managment'
};

var translationsRU = {
    HEADLINE: 'Система мониторинга',
    MENU_MONITOR: 'Монитор',
    MENU_DEVICES: 'Устройства',
    MENU_PARAM: 'Параметры',
    MENU_SETTINGS: 'Настрйоки',
	DEVICE_FORM_HEADER: 'Новое устройство',
	FORM_FILLINGDATA: 'Заполните данные',//Uniform name
	FORM_LABELTYPESDEVICE: 'Тип устройства',//Uniform name
	DEVICE_FORM_TYPEDEVICES: 'Выберите тип устройства',
	DEVICE_FORM_IPADDRESS: 'IP-Адрес',
	FORM_NAME: 'Название',//Uniform name
	DEVICE_FORM_DEVICECOMMUNITY: 'Доступ',
	DEVICE_FORM_AVAILABLEPARAMS: 'Доступных параметров',
	DEVICE_FORM_PARAMETERS: 'Параматры',
	DEVICE_FORM_PARAMETER: 'Параметр',
	DEVICE_FORM_CONDOTIONS: 'Условия',
	DEVICE_FORM_EMAIL_ALLERT: 'Оповещение на e-mail',
	FORM_BUTTON_CREATE: 'Добавить',//Uniform name
	DEVICE_FORM_ALLER_TEXT_OK: 'Устройство добавлено!',
	DEVICE_FORM_ALLER_TEXT_FAIL: 'Устройство не добавлено, произошла ошибка!',
	LOGIN_HEADER: 'Вход в систему',
	LOGIN_EMAIL: 'Email',
	LOGIN_PASSWORD: 'Пароль',
	LOGIN_SIGNUP: 'Создать',
	LOGIN_SIGNUP_OK: 'Успешно авторизованы!',
	LOGIN_SIGNUP_FAIL: 'Не правильные email/пароль! Попробуйте заново!',
	ACCOUNT: 'Учетная запись',
	SIGNOUT: 'Выйти',
	DEVICE_MONITOR_LABEL_DURATION: 'Обновление',
	DEVICE_MONITOR_BUTTON_START: 'Запуск',
	DEVICE_MONITOR_BUTTON_STOP: 'Стоп',
	DEVICE_MONITOR_PROPERIES: 'Свойства',
	CONTROL_PANEL: 'Панель управления',
	ALERT_DIALOG_CLEAR: 'Очистить',
	ALERT_DIALOG_HEADER: 'Оповещения',
	PARAMETERS_FORM_HEADDER: 'Новый параметр',
	FORM_GROUPS: 'Группы',
	FORM_GROUP: 'Группа',
	PARAMETERS_FORM_PARAM_TYPE: 'Формат',
	PARAMETERS_FORM_PARAM_COMMENTARY: 'Комментарий',
	PARAMETERS_FORM_PARAM_VALUE: 'Значение',
	PARAMETERS_FORM_PARAM_MEASURE: 'Мера измерения',
	SETTINGS_FORM_HEADER: 'Настройки учетной записи',
	SETTINGS_FORM_ALERT: 'Оповещать по e-mail',
	SETTINGS_FORM_DEFAULT_INTERVAL: 'Интервал мониторинга по умоланию',
	SETTINGS_FORM_SEC: 'Секунды',
	SETTINGS_FORM_MAX: 'Максимум неполадок',
	SETTINGS_FORM_WHEN: 'Оповещать при',
	SETTINGS_FORM_PASSWORD_MANAGE: 'Управление паролем',
	FORM_EDIT: 'Изменить',
	FORM_SAVE: 'Сохранить',
	FORM_DELETE: 'Удалить',
	SETTINGS_FORM_GROUPS_MANAGE: 'Управление группами'
};

angular.module('MyApp').config(['$translateProvider', function ($translateProvider) {
    // Добавляем таблицы переводов
    $translateProvider.translations('en', translationsEN);
    $translateProvider.translations('ru', translationsRU);
    $translateProvider.preferredLanguage('ru');
}]);
