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
    public class OIDsController : ApiController
    {
        private monitoringEntities2 db = new monitoringEntities2();

        // GET: api/OIDs
        public IQueryable<OID> GetOIDs([FromBody] string ForDevices)
        {
            return db.OIDs;
        }

        [HttpGet]
        [Route("api/OIDs/Type")]
        public IQueryable<OID> GetOIDsByGroup([FromUri]string ForDevices)
        {
            var DeviceType = Convert.ToInt32(ForDevices);
            return db.OIDs.Where(x => x.DeviceType == DeviceType);
        }

        // GET: api/OIDs/5
        [ResponseType(typeof(OID))]
        public async Task<IHttpActionResult> GetOID(int id)
        {
            OID oID = await db.OIDs.FindAsync(id);
            if (oID == null)
            {
                return NotFound();
            }

            return Ok(oID);
        }

        // PUT: api/OIDs/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutOID(int id, OID oID)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != oID.ID)
            {
                return BadRequest();
            }

            db.Entry(oID).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OIDExists(id))
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

        // POST: api/OIDs
        [ResponseType(typeof(OID))]
        public async Task<IHttpActionResult> PostOID(OID oID)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.OIDs.Add(oID);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = oID.ID }, oID);
        }

        // DELETE: api/OIDs/5
        [ResponseType(typeof(OID))]
        public async Task<IHttpActionResult> DeleteOID(int id)
        {
            OID oID = await db.OIDs.FindAsync(id);
            if (oID == null)
            {
                return NotFound();
            }

            db.OIDs.Remove(oID);
            await db.SaveChangesAsync();

            return Ok(oID);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool OIDExists(int id)
        {
            return db.OIDs.Count(e => e.ID == id) > 0;
        }
    }
}