angular
    .module('MyApp')
    .service('AccountService', function ($http, $log, $cookies) {
    	var functionName;
    	var UserID;
    	/*Get user settings*/

    	this.GetUserInfo = function () {
    		functionName = "GetUserInfo";
    		UserID = $cookies.get('userId');
    		return $http.get("api/user/info?UserId=" + UserID)
        .then(getComplete)
        .catch(getFailed);
    	}
    	/*Update user settings*/
    	this.UpdateUserInfo = function (UserInfo) {
    		functionName = "UpdateUserInfo";
    		UserID = $cookies.get('userId');
    		UserInfo.Settings.UserID = UserID;
    		return $http({
    			method: "put",
    			url: "api/Users/",
    			data: UserInfo.Settings,
    			dataType: "json"
    		})
        .then(getComplete)
        .catch(getFailed);
    	}

    	function getComplete(data) {
    		return data.data;
    	}

    	function getFailed(e) {
    		$log.error('Failed for AccountService->' + functionName);
    		return null;
    	}

    });
angular
	.module('MyApp')
		.controller('AccountController', function (MonitorService, AccountService) {
			var self = this;
			self.MyGroups;
			self.UserInfo;
			//Save changes
			self.Save = function () {
				AccountService.UpdateUserInfo(self.UserInfo);
			}
			//Set User info into fields
			self.GetUserInfo = function () {
				AccountService.GetUserInfo()
                    .then(function (result) {
                    	if (result != null)
                    		self.UserInfo = result;
                    });
			}
			//Open list of users devices groups
			self.getList = function () {
				MonitorService.GetGroups()
					.then(function (result) {
						if (result == null)
							return;
						self.MyGroups = result;
					});
			};
		});
//User info class
/*class UserInfo {
	constructor(userID, userName, email, settings) {
		this.UserID = userID;
		this.UserName = userName;
		this.Email = email;
		this.Settings = settings;
	}
}*/