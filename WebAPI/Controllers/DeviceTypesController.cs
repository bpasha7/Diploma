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
    public class DeviceTypesController : ApiController
    {
        private monitoringEntities db = new monitoringEntities();

        // GET: api/DeviceTypes
        public IQueryable<DeviceType> GetDeviceTypes()
        {
            return db.DeviceTypes;
        }

        // GET: api/DeviceTypes/5
        [ResponseType(typeof(DeviceType))]
        public async Task<IHttpActionResult> GetDeviceType(int id)
        {
            DeviceType deviceType = await db.DeviceTypes.FindAsync(id);
            if (deviceType == null)
            {
                return NotFound();
            }

            return Ok(deviceType);
        }

        // PUT: api/DeviceTypes/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutDeviceType(int id, DeviceType deviceType)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != deviceType.TypeID)
            {
                return BadRequest();
            }

            db.Entry(deviceType).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DeviceTypeExists(id))
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

        // POST: api/DeviceTypes
        [ResponseType(typeof(DeviceType))]
        public async Task<IHttpActionResult> PostDeviceType(DeviceType deviceType)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.DeviceTypes.Add(deviceType);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = deviceType.TypeID }, deviceType);
        }

        // DELETE: api/DeviceTypes/5
        [ResponseType(typeof(DeviceType))]
        public async Task<IHttpActionResult> DeleteDeviceType(int id)
        {
            DeviceType deviceType = await db.DeviceTypes.FindAsync(id);
            if (deviceType == null)
            {
                return NotFound();
            }

            db.DeviceTypes.Remove(deviceType);
            await db.SaveChangesAsync();

            return Ok(deviceType);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool DeviceTypeExists(int id)
        {
            return db.DeviceTypes.Count(e => e.TypeID == id) > 0;
        }
    }
}