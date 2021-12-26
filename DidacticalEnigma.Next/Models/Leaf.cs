using System.Text.Json.Serialization;

namespace DidacticalEnigma.Next.Models
{
    public class Leaf : Element
    {
        [JsonPropertyName("Content")]
        public string? Identifier { get; set; }

        [JsonPropertyName("Type")]
        public override string Type => "end";
    }
}