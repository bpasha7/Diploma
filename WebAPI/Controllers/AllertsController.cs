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
    public class AllertsController : ApiController
    {
        private monitoringEntities db = new monitoringEntities();

        // GET: api/Allerts
        public IQueryable<Allert> GetAllerts([FromUri]int UserId)
        {
            return db.Allerts.Where(a=> (a.UserID == UserId) && (a.isRead == false)).OrderByDescending(a=> a.MessageDate);
        }

        // GET: api/Allerts/5
        [ResponseType(typeof(Allert))]
        public async Task<IHttpActionResult> GetAllert(int id)
        {
            Allert allert = await db.Allerts.FindAsync(id);
            if (allert == null)
            {
                return NotFound();
            }

            return Ok(allert);
        }

        // PUT: api/Allerts/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutAllert(int id, Allert allert)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != allert.ID)
            {
                return BadRequest();
            }

            db.Entry(allert).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AllertExists(id))
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

        // POST: api/Allerts
        [ResponseType(typeof(Allert))]
        public async Task<IHttpActionResult> PostAllert(Allert allert)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Allerts.Add(allert);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = allert.ID }, allert);
        }

        // DELETE: api/Allerts/5
        [ResponseType(typeof(Allert))]
        public async Task<IHttpActionResult> DeleteAllert(int id)
        {
            Allert allert = await db.Allerts.FindAsync(id);
            if (allert == null)
            {
                return NotFound();
            }

            db.Allerts.Remove(allert);
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
            return db.Allerts.Count(e => e.ID == id) > 0;
        }
    }
}