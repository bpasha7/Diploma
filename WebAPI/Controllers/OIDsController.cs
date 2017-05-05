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
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace WebAPI.Controllers
{
    public class OIDsController : ApiController
    {
        private monitoringEntities db = new monitoringEntities();

        // GET: api/OIDs
        public IQueryable<OID> GetOIDs([FromBody] string ForDevices)
        {
            return db.OIDs;
        }

        [HttpGet]
        [Route("api/OIDs/Type")]
        [ResponseType(typeof(AngularOID))]
        public async Task<IHttpActionResult> GetOIDsByGroup([FromUri]string ForDevices)
        {
            List<OID> oidList = null;
            int DeviceType = Convert.ToInt32(ForDevices);
            await Task.Run(() =>
              oidList = db.OIDs.Where(x => x.DeviceType == DeviceType).ToList()
            );
            if (oidList == null)
            {
                return NotFound();
            }
                var Types = new List<AngularOID>();
                foreach (var item in oidList)
                {
                    Types.Add(new AngularOID(item));
                }
                return Ok(Types);
            //return db.OIDs.Where(x => x.DeviceType == DeviceType);
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
        [ResponseType(typeof(AngularOID))]
        public async Task<IHttpActionResult> PostOID([FromBody]AngularOID oid)
        {
            //  oID
            //var newOID = oID.ToObject<AngularOID>());
           // var oid = (OID)oID;
            //AngularOID oi = null;
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            //OID oid = (OID)oID;
            //AngularOID t = oID.ToObject<AngularOID>();
            OID newOid = oid.ToOID();
            db.OIDs.Add(newOid);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = newOid.ID }, newOid);
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