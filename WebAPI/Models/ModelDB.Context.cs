﻿//------------------------------------------------------------------------------
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
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class monitoringEntities : DbContext
    {
        public monitoringEntities()
            : base("name=monitoringEntities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<Alert> Alerts { get; set; }
        public virtual DbSet<Device> Devices { get; set; }
        public virtual DbSet<DeviceType> DeviceTypes { get; set; }
        public virtual DbSet<Group> Groups { get; set; }
        public virtual DbSet<MonitoringEvent> MonitoringEvents { get; set; }
        public virtual DbSet<OID> OIDs { get; set; }
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<ViewDevice> ViewDevices { get; set; }
    }
}
