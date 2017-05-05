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
        public string  Explanation { get; set; }

    }
    public class MonitoringResults : MonitoringData
    {
        public string Value { get; set; }
    
        public MonitoringResults(string name, string val, string valueType, string measure, string conditions, string explanation, bool notification)
        {
            Name = name;
            Value = val;
            ValueType = valueType;
            Measure = measure;
            Conditions = conditions;
            Explanation = explanation;
            Notification = notification;
        }
        public MonitoringResults(string name, string val, string valueType, string measure)
        {
            Name = name;
            Value = val;
            ValueType = valueType;
            Measure = measure;
        }
    }
    public class MyList
    {
        public int ID;
        public string Name;
        public MyList(int id, string name)
        {
            ID = id;
            Name = name;
        }
    }
    public class MonitoringList
    {
        public string listName;
        public List<MyList> monitoringList;// = new List<MonitoringResults>();
        public MonitoringList(string name, List<MyList> results)
        {
            listName = name;
            monitoringList = results;
        }
    }

    public class DeviceMonitor : Device
    {

        
        public List<MonitoringResults> monitoringResults = new List<MonitoringResults>();
        public List<MonitoringResults> monitoringProperties = new List<MonitoringResults>();
        public List<MonitoringList> monitoringList = new List<MonitoringList>();
        public bool OK = true;
        public string TypeName;
        SimpleSnmp snmp;
        //is null into json?
        private monitoringEntities db = new monitoringEntities();

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

        public void CheckConditions(int UserId)
        {
            var alert = new Alert();
            alert.UserID = UserId;
            alert.MessageDate = DateTime.Now;
            alert.isRead = false;
            alert.DeviceID = DeviceID;
            foreach (var monitoringResult in monitoringResults)
            {
                if (monitoringResult.Conditions == null && monitoringResult.ValueType == "numeric")
                    continue;
                if (hasProblem(monitoringResult.Conditions.Replace("res", monitoringResult.Value)) == 1)
                {
                    alert.Message = monitoringResult.Explanation;
                    alert.Header = string.Format("{0} [{1}]", DeviceName, DeviceIP);
                    db.Alerts.Add(alert);
                    /*if(monitoringResult.Notification)
                    {
                        //send to email
                    }*/
                }
            }
            db.SaveChangesAsync();
        }
        private int hasProblem(string con)
        {
            int res = -1;
            System.Text.StringBuilder Con = new System.Text.StringBuilder(con);
            string temp = "";
            while (Con.ToString().IndexOf('(') != -1)
            {
                temp = Con.ToString().Substring(Con.ToString().LastIndexOf('(') + 1);
                temp = temp.Substring(0, temp.IndexOf(')'));
                res = ParseCondition(temp);
                if (res != -1)
                    Con.Replace("(" + temp + ")", res.ToString());
                else
                    return -1;
            }
            return res;
        }
        private int ParseCondition(string con)
        {
            string[] acts = { ">=", "<=", "<", ">", "==", "!=", "&&", "||" };
            string act = "";
            foreach (var item in acts)
            {
                if (con.Contains(item))
                {
                    act = item;
                    break;
                }
            }
            var MyConditionParams = con.Split(acts, StringSplitOptions.RemoveEmptyEntries);
            if (MyConditionParams.Length != 2)
                return -1;
            return CompareParameters(Convert.ToInt32(MyConditionParams[0]), Convert.ToInt32(MyConditionParams[1]), act);

        }
        private int CompareParameters(int a, int b, string action)
        {
            switch (action)
            {
                case "&&":
                    return CaclculateBinary(a, b, action);
                case "||":
                    return CaclculateBinary(a, b, action);
                case ">=":
                    if (a >= b)
                        return 1;
                    return 0;
                case "<=":
                    if (a <= b)
                        return 1;
                    return 0;
                case ">":
                    if (a > b)
                        return 1;
                    return 0;
                case "==":
                    if (a == b)
                        return 1;
                    return 0;
                case "<":
                    if (a < b)
                        return 1;
                    return 0;
                case "!=":
                    if (a != b)
                        return 1;
                    return 0;
                default:
                    return -1;
            }
        }

        private int CaclculateBinary(int a, int b, string action)
        {
            switch (action)
            {
                case "&&":
                    a *= b;
                    break;
                case "||":
                    a += b;
                    break;
                default:
                    break;
            }
            if (a > 1)
                return 1;
            else
                return a;
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
        /// <param OID="string"></param>
        /// <returns></returns>
        private string SNMPGet(string OID)
        {
            Pdu pdu = new Pdu();
            pdu.VbList.Add(OID);
            var result = snmp.GetNext(SnmpVersion.Ver2, pdu);
            if(result == null)
            {
                OK = false;
                return "";
            }
            return result.First().Value.ToString();
        }
        private List<MyList> SNMPWalk(string OID)
        {
            Dictionary<Oid, AsnType> result = snmp.Walk(SnmpVersion.Ver2, OID);
            List<MyList> monitoringList = new List<MyList>();
            int i = 0;
            foreach (KeyValuePair<Oid, AsnType> kvp in result)
            {
                monitoringList.Add(new MyList(++i,kvp.Value.ToString().Trim()));
            }
            return monitoringList;
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
                //monitoringData = monitoringData.Where(x => x.ValueType != "list").ToArray();
                for (int i = 0; i < monitoringData.Length; i++)
                {
                    switch (monitoringData[i].ValueType)
                    {
                        case "numeric":
                            if (monitoringData[i].OID.IndexOf('{') != -1)
                                AddToList(monitoringResults, new MonitoringResults(monitoringData[i].Name, this.CaclculateComplexOID(monitoringData[i].OID), monitoringData[i].ValueType, monitoringData[i].Measure, monitoringData[i].Conditions, monitoringData[i].Explanation, monitoringData[i].Notification));
                            else
                                AddToList(monitoringResults, new MonitoringResults(monitoringData[i].Name, this.SNMPGet(monitoringData[i].OID), monitoringData[i].ValueType, monitoringData[i].Measure, monitoringData[i].Conditions, monitoringData[i].Explanation, monitoringData[i].Notification));
                            break;
                        case "string":
                            if (monitoringData[i].OID.IndexOf('{') != -1)
                                AddToList(monitoringProperties, new MonitoringResults(monitoringData[i].Name, this.CaclculateComplexOID(monitoringData[i].OID), monitoringData[i].ValueType, monitoringData[i].Measure));
                            else
                                AddToList(monitoringProperties, new MonitoringResults(monitoringData[i].Name, this.SNMPGet(monitoringData[i].OID), monitoringData[i].ValueType, monitoringData[i].Measure));
                            break;
                        case "list":
                            monitoringList.Add(new MonitoringList(monitoringData[i].Name, SNMPWalk(monitoringData[i].OID)));
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