using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebAPI.Models
{
    public class AngularUser : User
    {
        public AngularUser(User user)
        {
            UserID = user.UserID;
            EmailAlert = user.EmailAlert;
            Email = user.Email;
            Pass = user.Pass;
            UserName = user.UserName;
        }
    }

    public class AngularAlert : Alert
    {
        public AngularAlert(Alert alert)
        {
            ID = alert.ID;
            UserID = alert.UserID;
            Message = alert.Message;
            MessageDate = alert.MessageDate;
            isRead = alert.isRead;
            Header = alert.Header;
            DeviceID = alert.DeviceID;
        }
    }

    public class AngularOID : OID
    {
        public AngularOID(OID oID)
        {
            ID = oID.ID;
            DeviceType = oID.DeviceType;
            Name = oID.Name;
            OID1 = oID.OID1;
            ValueType = oID.ValueType;
            Commentary = oID.Commentary;
            Measure = oID.Measure;
        }
        public OID ToOID()
        {
            OID oid = new OID();
            oid.Commentary = this.Commentary;
            oid.DeviceType = this.DeviceType;
            oid.Measure = this.Measure;
            oid.Commentary = this.Commentary;
            oid.ValueType = this.ValueType;
            oid.OID1 = this.OID1;
            oid.Name = this.Name;
            return oid;
        }
    }

    public class AngularGroup : Group
    {
        public AngularGroup(Group group)
        {
            GroupId = group.GroupId;
            GroupName = group.GroupName;
            UserID = group.UserID;
        }
    }

    public class AngularDeviceType : DeviceType
    {
        public AngularDeviceType(DeviceType deviceType)
        {
            TypeID = deviceType.TypeID;
            TypeName = deviceType.TypeName;
        }
    }
}