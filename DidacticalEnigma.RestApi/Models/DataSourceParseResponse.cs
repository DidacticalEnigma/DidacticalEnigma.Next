using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DidacticalEnigma.RestApi.Models
{
    public class DataSourceParseResponse
    {
        public int Position { get; set; }
        
        public int? PositionEnd { get; set; }
        
        public string DataSource { get; set; }
        
        public string Context { get; set; }

        public string Error { get; set; }
    }
}
