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
        public string Measure { get; set; }

    }
    public class MonitoringResults : MonitoringData
    {
       // public string Name { get; set; }
        public string Value { get; set; }
/*
        public string ValueType { get; set; }
        public string Measure { get; set; }*/
    
        public MonitoringResults(string name, string val, string valueType, string measure)
        {
            Name = name;
            Value = val;
            ValueType = valueType;
            Measure = measure;
        }

    }

    public class DeviceMonitor : Device
    {
        public List<MonitoringResults> monitoringResults = new List<MonitoringResults>();
        public List<MonitoringResults> monitoringProperties = new List<MonitoringResults>();
        public string TypeName;
        SimpleSnmp snmp;

        public DeviceMonitor(ViewDevice viewDevice)
        {
            DeviceIP = viewDevice.DeviceIP;
            DeviceCommunity = viewDevice.DeviceCommunity;
            DeviceID = viewDevice.DeviceID;
            DeviceName = viewDevice.DeviceName;
            DeviceType = viewDevice.DeviceType;
            TypeName = viewDevice.TypeName;

            snmp = new SimpleSnmp(DeviceIP, DeviceCommunity);


        }
        public string ToJSON()
        {
            snmp = null;
            return JsonConvert.SerializeObject(this,
                            Newtonsoft.Json.Formatting.None,
                            new JsonSerializerSettings
                            {
                                NullValueHandling = NullValueHandling.Ignore
                            });
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="OIDs">строка со значениями</param>
        /// <returns></returns>
        private string CaclculateComplexOID(string OIDs)
        {
            try
            {
                ParseAndReplaceOIDs(ref OIDs);
                ParserFunction.addFunction("pi", new PiFunction());
                ParserFunction.addFunction("exp", new ExpFunction());
                ParserFunction.addFunction("pow", new PowFunction());
                ParserFunction.addFunction("sin", new SinFunction());
                ParserFunction.addFunction("abs", new AbsFunction());
                ParserFunction.addFunction("sqrt", new SqrtFunction());
                double result = Parser.process(OIDs);
                return Math.Round(result, 2).ToString();
            }
            catch(Exception ex)
            {
                return null;
            }
        }
        /// <summary>
        /// Разбор и вычисление строки с OID
        /// </summary>
        /// <param name="str">строка с выражениями</param>
        private void ParseAndReplaceOIDs(ref string str)
        {
            string result = "";
            string parts = "";
            int startIndex = str.LastIndexOf('{');
            parts = str.Substring(startIndex + 1);
            int lastIndex = parts.IndexOf('}');
            parts = parts.Substring(0, lastIndex);

            result = SNMPGet(parts);
            str = str.Replace("{"+parts+"}", result);
            if (str.IndexOf('{') != -1)
                ParseAndReplaceOIDs(ref str);
        }
        /// <summary>
        /// Выполнение get команды для получения параметра мониторинга
        /// </summary>
        /// <param name="pdu"></param>
        /// <returns></returns>
        private string SNMPGet(string OID)
        {
            Pdu pdu = new Pdu();
            pdu.VbList.Add(OID);
            var result = snmp.GetNext(SnmpVersion.Ver2, pdu);
            //pdu.VbList.Clear();
            return result.First().Value.ToString();
        }
        private void AddToList(List<MonitoringResults> MyListResult, MonitoringResults MyResult)
        {
                MyListResult.Add(MyResult);
        }
        public void Run(MonitoringData[] monitoringData)
        {
            try
            {
                SimpleSnmp snmp = new SimpleSnmp(DeviceIP, DeviceCommunity);
                if (!snmp.Valid)
                {
                    return;
                }
                monitoringData = monitoringData.Where(x => x.ValueType != "list").ToArray();
                //monitoringResults = new MonitoringResults[monitoringData.Length];
                for (int i = 0; i < monitoringData.Length; i++)
                {
                    switch (monitoringData[i].ValueType)
                    {
                        case "int":
                            if (monitoringData[i].OID.IndexOf('{') != -1)
                                AddToList(monitoringResults, new MonitoringResults(monitoringData[i].Name, this.CaclculateComplexOID(monitoringData[i].OID), monitoringData[i].ValueType, monitoringData[i].Measure));
                            else
                                AddToList(monitoringResults, new MonitoringResults(monitoringData[i].Name, this.SNMPGet(monitoringData[i].OID), monitoringData[i].ValueType, monitoringData[i].Measure));
                            break;
                        case "string":
                            if (monitoringData[i].OID.IndexOf('{') != -1)
                                AddToList(monitoringProperties, new MonitoringResults(monitoringData[i].Name, this.CaclculateComplexOID(monitoringData[i].OID), monitoringData[i].ValueType, monitoringData[i].Measure));
                            else
                                AddToList(monitoringProperties, new MonitoringResults(monitoringData[i].Name, this.SNMPGet(monitoringData[i].OID), monitoringData[i].ValueType, monitoringData[i].Measure));
                            break;
                        default:
                            break;
                    }
                    
                }
            }
            catch (Exception ex)
            {
                return;
            }
        }
    }
}