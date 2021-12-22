using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DidacticalEnigma.RestApi.Models
{
    public class DataSourceParseRequest
    {
        public IReadOnlyCollection<string> RequestedDataSources { get; set; }

        public string Text { get; set; }

        public IReadOnlyCollection<DataSourceParseRequestPosition> Positions { get; set; }
    }
}
