using System;
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
    public class DevicesController : ApiController
    {
        private monitoringEntities db = new monitoringEntities();

        // GET: api/Devices
        public IQueryable<Device> GetDevices()
        {
            return db.Devices;
        }

        // GET: api/Devices/5
        [ResponseType(typeof(Device))]
        public async Task<IHttpActionResult> GetDevice(int id)
        {
            Device device = await db.Devices.FindAsync(id);
            if (device == null)
            {
                return NotFound();
            }

            return Ok(device);
        }

        // PUT: api/Devices/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutDevice(int id, Device device)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != device.DeviceID)
            {
                return BadRequest();
            }

            db.Entry(device).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DeviceExists(id))
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

        // POST: api/Devices
        /// <summary>
        /// Добавление нового устройства в БД
        /// </summary>
        /// <param name="DeviceAndOIDs">Объект содержащий данные устройства и его OIDs</param>
        /// <returns></returns>
        [ResponseType(typeof(Device))]
        public async Task<IHttpActionResult> PostDevice([FromBody]JObject DeviceAndOIDs )//([FromBody]Device device, [FromBody]MonitoringEvent monitoringEvent)//([FromBody] string devicestr)//(Device device)
        {
            //Проверка валидности принятых объектов
            if (!ModelState.IsValid)
             {
                 return BadRequest(ModelState);
             }
            //Разбиваем переданные объекты
            Device device = DeviceAndOIDs["Device"].ToObject<Device>();
            MonitoringEvent[] monitoringEvents = DeviceAndOIDs["monitoringEvents"].ToObject<MonitoringEvent[]>();
            //Добавляем новое устройство в БД
            db.Devices.Add(device);
            await db.SaveChangesAsync();
            //Добавляем OIDs устойства в БД
            foreach (var monitoringEvent in monitoringEvents)
            {
                monitoringEvent.DeviceID = device.DeviceID;
                db.MonitoringEvents.Add(monitoringEvent);
            }           
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = device.DeviceID }, device);
        }
        [HttpPost]
        [Route("api/Test")]
        public string Test(string tt)
        {
            return "2";
        } 

        // DELETE: api/Devices/5
        [ResponseType(typeof(Device))]
        public async Task<IHttpActionResult> DeleteDevice(int id)
        {
            Device device = await db.Devices.FindAsync(id);
            if (device == null)
            {
                return NotFound();
            }

            db.Devices.Remove(device);
            await db.SaveChangesAsync();

            return Ok(device);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool DeviceExists(int id)
        {
            return db.Devices.Count(e => e.DeviceID == id) > 0;
        }
    }
}