using System.Text.Json.Serialization;

namespace DidacticalEnigma.Next.Models
{
    public class VSplit : Split
    {
        [JsonPropertyName("Type")]
        public override string Type => "vsplit";
    }
}