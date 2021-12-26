using System.Text.Json.Serialization;

namespace DidacticalEnigma.Next.Models
{
    public class HSplit : Split
    {
        [JsonPropertyName("Type")]
        public override string Type => "hsplit";
    }
}