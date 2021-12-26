using System.Drawing;
using System.Text.Json.Serialization;
using Swashbuckle.AspNetCore.Annotations;

namespace DidacticalEnigma.Next.Models
{
    [JsonConverter(typeof(ElementConverter))]
    [SwaggerDiscriminator(nameof(Element.Type))]
    [SwaggerSubType(typeof(Root), DiscriminatorValue = "root")]
    [SwaggerSubType(typeof(HSplit), DiscriminatorValue = "hsplit")]
    [SwaggerSubType(typeof(VSplit), DiscriminatorValue = "vsplit")]
    [SwaggerSubType(typeof(Leaf), DiscriminatorValue = "end")]
    public abstract class Element
    {
        [JsonPropertyName("Type")]
        public abstract string Type { get; }
    }
}