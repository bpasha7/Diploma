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

namespace WebAPI.Controllers
{
    public class AlertsController : ApiController
    {
        private monitoringEntities db = new monitoringEntities();

        /*  [HttpPut]
          [Route("api/Allerts/read")]
          public string GetMonitoringData([FromUri]int id, [FromUri]int userId)
          {
              ViewDevice viewDevice = db.ViewDevices.Where(x => x.DeviceID == id).ToList()[0];
              // var r = JObject.Parse(viewDevice.OIDS).ToObject<DeviceMonitor[]>();
              string oidsArray = JObject.Parse(viewDevice.OIDS)["OIDs"].ToString();
              MonitoringData[] monitoringData = Newtonsoft.Json.JsonConvert.DeserializeObject<MonitoringData[]>(oidsArray);
              DeviceMonitor deviceMonitor = new DeviceMonitor(viewDevice);
              deviceMonitor.Run(monitoringData);
              deviceMonitor.CheckConditions(userId);

              return deviceMonitor.ToJSON();


          }*/

        //GET: api/Allerts/Count/User
        [HttpGet]
        [Route("api/Alerts/Count")]
        [ResponseType(typeof(int))]
        public async Task<IHttpActionResult> GetCountUserAlerts([FromUri]int UserId)
        {
            int count = 0;
            await Task.Run(() =>
                count = db.Alerts.Where(x => x.UserID == UserId && x.isRead == false).Count()
            );
            return Ok(count);
        }

        // GET: api/Allerts
        public IQueryable<Alert> GetAllerts([FromUri]int UserId)
        {
            return db.Alerts.Where(a => (a.UserID == UserId) && (a.isRead == false)).OrderByDescending(a => a.MessageDate);
        }

        // GET: api/Allerts/5
        [ResponseType(typeof(Alert))]
        public async Task<IHttpActionResult> GetAllert(int id)
        {
            Alert allert = await db.Alerts.FindAsync(id);
            if (allert == null)
            {
                return NotFound();
            }

            return Ok(allert);
        }

        // PUT: api/Allerts/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutAllert(Alert alert)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            /* if (id != allert.ID)
             {
                 return BadRequest();
             }*/

            db.Entry(alert).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                /*if (!AllertExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }*/
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Allerts
        [ResponseType(typeof(Alert))]
        public async Task<IHttpActionResult> PostAllert(Alert alert)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Alerts.Add(alert);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = alert.ID }, alert);
        }

        // DELETE: api/Allerts/5
        [ResponseType(typeof(Alert))]
        public async Task<IHttpActionResult> DeleteAllert(int id)
        {
            Alert allert = await db.Alerts.FindAsync(id);
            if (allert == null)
            {
                return NotFound();
            }

            db.Alerts.Remove(allert);
            await db.SaveChangesAsync();

            return Ok(allert);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool AllertExists(int id)
        {
            return db.Alerts.Count(e => e.ID == id) > 0;
        }
    }
}