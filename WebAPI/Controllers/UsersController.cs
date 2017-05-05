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

namespace WebAPI.Controllers
{
    public class UsersController : ApiController
    {
        private monitoringEntities db = new monitoringEntities();

        /// <summary>
        /// Возращение ключа пользователя, если такой существует
        /// </summary>
        /// <param name="email"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("api/user/login")]
        [ResponseType(typeof(AngularUser))]
        public async Task<IHttpActionResult> LogiProcess([FromUri]string email, [FromUri]string password)
        {
            AngularUser user = null;
            await Task.Run(() =>
                    user = new AngularUser( db.Users.Where(x => (x.Email == email) && (x.Pass == password)).Single())
                );
            if (user == null)
            {
                return NotFound();
            }
            else
                return Ok(user);
        }
        /// <summary>
        /// Получение настроек аккаунта
        /// </summary>
        /// <param name="UserId">Id пользователя</param>
        /// <returns>Объект с настройками пользотвателя</returns>
        [HttpGet]
        [Route("api/user/info")]
        [ResponseType(typeof(UserInfo))]
        public async Task<IHttpActionResult> GetUserInfo([FromUri] int UserId)
        {
            UserInfo userInfo = null;
            await Task.Run(() =>
                    userInfo = new UserInfo(db.Users.Where(x => x.UserID == UserId).ToList()[0])
                );
            if (userInfo == null)
            {
                return NotFound();
            }
            else
                return Ok(userInfo);
        }

        // GET: api/Users
        public IQueryable<User> GetUsers()
        {
            return db.Users;
        }

        // GET: api/Users/5
        [ResponseType(typeof(User))]
        public async Task<IHttpActionResult> GetUser(int id)
        {
            User user = await db.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        // PUT: api/Users/5
        [ResponseType(typeof(UserSettings))]
        public async Task<IHttpActionResult> PutUser(UserSettings userSettings)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            User usr = db.Users.Where(u => u.UserID == userSettings.UserID).Single();

            usr.Settings = Newtonsoft.Json.JsonConvert.SerializeObject(userSettings);
            
            db.Entry(usr).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(usr.UserID))
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

        // POST: api/Users
        [ResponseType(typeof(User))]
        public async Task<IHttpActionResult> PostUser(User user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Users.Add(user);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = user.UserID }, user);
        }

        // DELETE: api/Users/5
        [ResponseType(typeof(User))]
        public async Task<IHttpActionResult> DeleteUser(int id)
        {
            User user = await db.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            db.Users.Remove(user);
            await db.SaveChangesAsync();

            return Ok(user);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool UserExists(int id)
        {
            return db.Users.Count(e => e.UserID == id) > 0;
        }
    }
}