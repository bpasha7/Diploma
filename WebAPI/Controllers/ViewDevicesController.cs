﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using WebAPI.Models;
using Newtonsoft.Json.Linq;

namespace WebAPI.Controllers
{
    public class ViewDevicesController : ApiController
    {
        private monitoringEntities db = new monitoringEntities();

        // GET: api/ViewDevices
        public IQueryable<ViewDevice> GetViewDevices()
        {
            return db.ViewDevices;
        }

        [HttpGet]
        [Route("api/Device/snmp")]
        [ResponseType(typeof(DeviceMonitor))]
        public async Task<IHttpActionResult> GetMonitoringData([FromUri]int id, [FromUri]int userId)
        {
            DeviceMonitor deviceMonitor = null;
            await Task.Run(() =>
              deviceMonitor = CreateDeviceMonitor(id, userId)
            );
            if (deviceMonitor == null)
            {
                return NotFound();
            }
            return Ok(deviceMonitor);
        }

        private DeviceMonitor CreateDeviceMonitor(int id, int userId)
        {
            ViewDevice viewDevice = null;
            DeviceMonitor deviceMonitor = null;
            try
            {
                viewDevice = db.ViewDevices.Where(x => x.DeviceID == id).ToList()[0];
                deviceMonitor = new DeviceMonitor(viewDevice);
                var oidsArray = JObject.Parse(viewDevice.OIDS)["OIDs"].ToString();///
                MonitoringData[] monitoringData = Newtonsoft.Json.JsonConvert.DeserializeObject<MonitoringData[]>(oidsArray);
                deviceMonitor.Run(monitoringData);
                deviceMonitor.CheckConditions(userId);
                return deviceMonitor;
            }
            catch(Exception ex)
            {
                deviceMonitor.OK = false;
                return deviceMonitor;
            }
        }

        [HttpGet]
        [Route("api/ViewDevices/group")]
        [ResponseType(typeof(ViewDevice))]
        public async Task<IHttpActionResult> GetViewDeviceByUserGroup([FromUri]int GroupId)
        {
            var viewDevices = new List<ViewDevice>();
            await Task.Run(() =>
              viewDevices =  db.ViewDevices.Where(x => x.DeviceGroup == GroupId).ToList()
            );
            if (viewDevices == null)
            {
                return NotFound();
            }
            return Ok(viewDevices);
        }

        // GET: api/ViewDevices/5
        [ResponseType(typeof(ViewDevice))]
        public async Task<IHttpActionResult> GetViewDevice(int id)
        {
            ViewDevice viewDevice = db.ViewDevices.Where(x => x.DeviceID == id).ToList()[0];
           // var r = JObject.Parse(viewDevice.OIDS).ToObject<DeviceMonitor[]>();
            string oids = JObject.Parse(viewDevice.OIDS)["OIDs"].ToString();
            var t = Newtonsoft.Json.JsonConvert.DeserializeObject<DeviceMonitor[]>(oids);
            //ViewDevice viewDevice = await db.ViewDevices.FindAsync(id);
            if (viewDevice == null)
            {
                return NotFound();
            }

            return Ok(viewDevice);
        }

        // PUT: api/ViewDevices/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutViewDevice(int id, ViewDevice viewDevice)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != viewDevice.DeviceID)
            {
                return BadRequest();
            }

            db.Entry(viewDevice).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ViewDeviceExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/ViewDevices
        [ResponseType(typeof(ViewDevice))]
        public async Task<IHttpActionResult> PostViewDevice(ViewDevice viewDevice)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.ViewDevices.Add(viewDevice);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = viewDevice.DeviceID }, viewDevice);
        }

        // DELETE: api/ViewDevices/5
        [ResponseType(typeof(ViewDevice))]
        public async Task<IHttpActionResult> DeleteViewDevice(int id)
        {
            ViewDevice viewDevice = await db.ViewDevices.FindAsync(id);
            if (viewDevice == null)
            {
                return NotFound();
            }

            db.ViewDevices.Remove(viewDevice);
            await db.SaveChangesAsync();

            return Ok(viewDevice);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ViewDeviceExists(int id)
        {
            return db.ViewDevices.Count(e => e.DeviceID == id) > 0;
        }
    }
}