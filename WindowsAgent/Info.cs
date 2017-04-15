using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WindowsAgent
{
    class Info
    {
        public string Name { get; set; }
        public string Value { get; set; }

        public Info(string name, string value)
        {
            Name = name;
            Value = value;
        }
    }
}
