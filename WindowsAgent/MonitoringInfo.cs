using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Management;
using Newtonsoft.Json;

namespace WindowsAgent
{
    class MonitoringInfo
    {
        public List<Info> listInfo = new List<Info>();
        private List<string> WMIClassProperties = new List<string>();
        private ObjectQuery Query;
        public MonitoringInfo(string WMIclassAndObject)
        {
            var parsedParameters = WMIclassAndObject.Split(new string[] { "->", ";" }, StringSplitOptions.RemoveEmptyEntries);
            var WMIClass = parsedParameters[0];
            WMIClassProperties = parsedParameters.ToList();
            WMIClassProperties.RemoveAt(0);
            try
            {
                Query = new System.Management.ObjectQuery("select * from " + WMIClass);
            }
            catch (Exception ex)
            {

            }
        }
        public string ToJSON()
        {
            return JsonConvert.SerializeObject(listInfo,
                Newtonsoft.Json.Formatting.None,
                new JsonSerializerSettings
                {
                    NullValueHandling = NullValueHandling.Ignore
                });
        }
        public void GetMonitoringParams()
        {
            if (Query == null)
                return;
            ManagementObjectSearcher Searcher = new ManagementObjectSearcher(Query);
            var WMIClassObject = Searcher.Get();
            ManagementObjectCollection Collection = Searcher.Get();
            foreach (ManagementObject item in Collection)
            {
                for (int i = 0; i < WMIClassProperties.Count; i ++)
                {
                    try
                    {
                        listInfo.Add(new Info(WMIClassProperties[i], item[WMIClassProperties[i]].ToString()));
                    }
                    catch (Exception ex)
                    {
                        listInfo.Add(new Info(WMIClassProperties[i], null));

                        continue;
                    }
                }
                listInfo.Add(new Info("name", item["CSName"].ToString()));
            }
        }
    }
}
