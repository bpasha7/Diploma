using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using SnmpSharpNet;
using Newtonsoft.Json;
using System.Data.SqlClient;
using System.Data;


namespace WebAPI.Controllers
{
    public class MonitorController : ApiController
    {
        //Models.Monitor 
        Models.Monitor[] products = new Models.Monitor[]
        {
            new Models.Monitor { Id = 1, Name = "Tomato Soup", Category = "Groceries", Price = 1 },
            new Models.Monitor { Id = 2, Name = "Yo-yo", Category = "Toys", Price = 3.75M },
            new Models.Monitor { Id = 3, Name = "Hammer", Category = "Hardware", Price = 16.99M }
        };

        public IEnumerable<Models.Monitor> GetAllProducts()
        {
            return products;
        }
        [HttpGet]
        [Route("api/monitor/snmp")]
        public string SNMPTest()
        {
            try
            {
                //Data Source=ISUS;Initial Catalog=monitoring;Integrated Security=True
                SqlConnection sqlConnection1 = new SqlConnection("Data Source=ISUS;Initial Catalog=monitoring;Integrated Security=True;User ID=adm;Password=12345");
                SqlCommand cmd = new SqlCommand();
                SqlDataReader reader;

                cmd.CommandText = "SELECT * FROM Devices";
                cmd.CommandType = CommandType.Text;
                cmd.Connection = sqlConnection1;

                sqlConnection1.Open();

                reader = cmd.ExecuteReader();
                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        Console.WriteLine("{0}\t{1}", reader.GetInt32(0),
                            reader.GetString(1));
                    }
                }
                sqlConnection1.Close();
                string host = "127.0.0.1"; //Vals[0];
                string community = "public";//Vals[1];
                SimpleSnmp snmp = new SimpleSnmp(host, community);
                Pdu pdu = new Pdu();
                //pdu.Type = SnmpConstants.GETNEXT; // type GETNEXT
                pdu.VbList.Add(".1.3.6.1.2.1.25.1.1.0");
                if (!snmp.Valid)
                {
                    return "SNMP agent host name/ip address is invalid.";
                }
               Dictionary<Oid, AsnType> result = snmp.Get(SnmpVersion.Ver1, pdu);
                if (result == null)
                {
                    return "No results received.";
                }
                string json = JsonConvert.SerializeObject(result, Formatting.Indented);
                return json;
            }
            catch (Exception ex)
            {
                ///MessageBox.Show(ex.Message.ToString());
                return ex.Message.ToString();
            }
        }

        public IHttpActionResult GetProduct(int id)
        {
            var product = products.FirstOrDefault((p) => p.Id == id);
            string s = SNMPTest();
            if (product == null)
            {
                
                return NotFound();
            }
            return Ok(product);
        }

    }
}
