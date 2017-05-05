using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace WebAPI.Models
{
    public class UserInfo : User
    {
        public UserSettings Settings{ get; set; }
        public UserInfo(User user)
        {
            UserID = user.UserID;
            Email = user.Email;
            UserName = user.UserName;
            var SettingsFromJSON = JObject.Parse(user.Settings).ToString();
            Settings = Newtonsoft.Json.JsonConvert.DeserializeObject<UserSettings>(SettingsFromJSON);
        }
    }
    public class UserSettings
    {
        public bool EmailAlert { get; set; }
        public int Interval { get; set; }
        public int MaxAlerts { get; set; }

        public int UserID { get; set; }
    }
}