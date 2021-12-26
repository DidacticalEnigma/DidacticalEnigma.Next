using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace DidacticalEnigma.Next.Models;

public class ElementConverter : PolymorphicSerializationConverter<Element>
{
    protected override string DiscriminatorPropertyName => "Type";
    protected override Element? ReadAsConcrete(ref Utf8JsonReader reader, string discriminator, JsonSerializerOptions options)
    {
        switch (discriminator)
        {
            case "root":
                return JsonSerializer.Deserialize<Root>(ref reader);
            case "vsplit":
                return JsonSerializer.Deserialize<VSplit>(ref reader);
            case "hsplit":
                return JsonSerializer.Deserialize<HSplit>(ref reader);
            case "end":
                return JsonSerializer.Deserialize<Leaf>(ref reader);
            default:
                throw new JsonException();
        }
    }

    public override void Write(Utf8JsonWriter writer, Element value, JsonSerializerOptions options)
    {
        switch (value.Type)
        {
            case "root":
                JsonSerializer.Serialize(writer, (Root)value);
                break;
            case "vsplit":
                JsonSerializer.Serialize(writer, (VSplit)value);
                break;
            case "hsplit":
                JsonSerializer.Serialize(writer, (HSplit)value);
                break;
            case "end":
                JsonSerializer.Serialize(writer, (Leaf)value);
                break;
            default:
                throw new JsonException();
        }
    }
}