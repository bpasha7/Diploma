//------------------------------------------------------------------------------
// <auto-generated>
//     Этот код создан по шаблону.
//
//     Изменения, вносимые в этот файл вручную, могут привести к непредвиденной работе приложения.
//     Изменения, вносимые в этот файл вручную, будут перезаписаны при повторном создании кода.
// </auto-generated>
//------------------------------------------------------------------------------

namespace WebAPI.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class MonitoringEvent
    {
        public int ID { get; set; }
        public int DeviceID { get; set; }
        public int OID { get; set; }
        public string Conditions { get; set; }
        public bool Notification { get; set; }
        public string Explanation { get; set; }
    
        public virtual Device Device { get; set; }
    }
}
