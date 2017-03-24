using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SnmpSharpNet;
using Newtonsoft.Json;

namespace WebAPI.Models
{
    public class MonitoringData
    {
        public string Name { get; set; }
        public string OID { get; set; }
        public string Conditions { get; set; }
        public bool Notification { get; set; }
        public string ValueType { get; set; }

    }
    public class MonitoringResults
    {
        public string Name { get; set; }
        public string Value { get; set; }

        public string ValueType { get; set; }
    
        public MonitoringResults(string name, string val, string valueType)
        {
            Name = name;
            Value = val;
            ValueType = valueType;
        }

    }

    public class DeviceMonitor : Device
    {
        //string DeviceIP;
        //string DeviceName
        MonitoringResults[] monitoringResults;

        public string Run(ViewDevice viewDevice, MonitoringData[] monitoringData)
        {
            try
            {
                string host = viewDevice.DeviceIP;
                string community = "public";
                SimpleSnmp snmp = new SimpleSnmp(host, community);
                if (!snmp.Valid)
                {
                    return "SNMP agent host name/ip address is invalid.";
                }
                monitoringResults = new MonitoringResults[monitoringData.Length];
                Pdu pdu = new Pdu();
                for (int i = 0; i < monitoringData.Length; i++)
                {
                    
                    Dictionary<Oid, AsnType> result;
                   /* if (result.Count == 0)
                        continue;*/
                    //monitoringResults[i] = new MonitoringResults(monitoringData[i].Name, result.First().Value.ToString(), monitoringData[i].ValueType);
                    switch (monitoringData[i].ValueType)
                    {
                        case "int":
                            pdu.VbList.Add(monitoringData[i].OID);
                            result = snmp.Get(SnmpVersion.Ver2, pdu);
                            monitoringResults[i] = new MonitoringResults(monitoringData[i].Name, result.First().Value.ToString(), monitoringData[i].ValueType);
                            continue;
                        case "list":
                            result = snmp.Walk(SnmpVersion.Ver2, monitoringData[i].OID);
                            monitoringResults[i] = new MonitoringResults(monitoringData[i].Name, JsonConvert.SerializeObject(result, Formatting.Indented), monitoringData[i].ValueType);
                            continue;
                        case "string":
                            pdu.VbList.Add(monitoringData[i].OID);
                            result = snmp.Get(SnmpVersion.Ver2, pdu);
                            monitoringResults[i] = new MonitoringResults(monitoringData[i].Name, result.First().Value.ToString(), monitoringData[i].ValueType);
                            continue;
                        default:
                            break;
                    }
                }
                // Dictionary<Oid, AsnType> result = snmp.Walk(SnmpVersion.Ver1, "1.3.6.1.2.1.25.6.3.1.2");
                /* if (result == null)
                 {
                     return "No results received.";
                 }
                 string json = JsonConvert.SerializeObject(result, Formatting.Indented);*/
                return JsonConvert.SerializeObject(monitoringResults, Formatting.Indented); ;//json;
            }
            catch (Exception ex)
            {
                ///MessageBox.Show(ex.Message.ToString());
                return ex.Message.ToString();
            }
        }
    }
}