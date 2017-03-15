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
    public class MonitoringEventsController : ApiController
    {
        private monitoringEntities2 db = new monitoringEntities2();

        // GET: api/MonitoringEvents
        public IQueryable<MonitoringEvent> GetMonitoringEvents()
        {
            return db.MonitoringEvents;
        }

        // GET: api/MonitoringEvents/5
        [ResponseType(typeof(MonitoringEvent))]
        public async Task<IHttpActionResult> GetMonitoringEvent(int id)
        {
            MonitoringEvent monitoringEvent = await db.MonitoringEvents.FindAsync(id);
            if (monitoringEvent == null)
            {
                return NotFound();
            }

            return Ok(monitoringEvent);
        }

        // PUT: api/MonitoringEvents/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutMonitoringEvent(int id, MonitoringEvent monitoringEvent)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != monitoringEvent.ID)
            {
                return BadRequest();
            }

            db.Entry(monitoringEvent).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MonitoringEventExists(id))
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

        // POST: api/MonitoringEvents
        [ResponseType(typeof(MonitoringEvent))]
        public async Task<IHttpActionResult> PostMonitoringEvent(MonitoringEvent monitoringEvent)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.MonitoringEvents.Add(monitoringEvent);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = monitoringEvent.ID }, monitoringEvent);
        }

        // DELETE: api/MonitoringEvents/5
        [ResponseType(typeof(MonitoringEvent))]
        public async Task<IHttpActionResult> DeleteMonitoringEvent(int id)
        {
            MonitoringEvent monitoringEvent = await db.MonitoringEvents.FindAsync(id);
            if (monitoringEvent == null)
            {
                return NotFound();
            }

            db.MonitoringEvents.Remove(monitoringEvent);
            await db.SaveChangesAsync();

            return Ok(monitoringEvent);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool MonitoringEventExists(int id)
        {
            return db.MonitoringEvents.Count(e => e.ID == id) > 0;
        }
    }
}