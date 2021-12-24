using System.Collections.Generic;

namespace DidacticalEnigma.Next.Models
{
    public class DataSourceParseRequest
    {
        public IReadOnlyCollection<string> RequestedDataSources { get; set; }

        public string Text { get; set; }

        public IReadOnlyCollection<DataSourceParseRequestPosition> Positions { get; set; }
    }
}
