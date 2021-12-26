using System;
using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace DidacticalEnigma.Next.Models;

[JsonConverter(typeof(LengthConverter))]
public struct Length
{
    public double Value { get; }

    public Length(double value)
    {
        Value = value;
    }
}

public class LengthConverter : JsonConverter<Length>
{
    public override Length Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var value = reader.GetString();
        if (value == null)
        {
            throw new JsonException();
        }
        value = value[..^1];
        if (value == "")
            return new Length(1);
        return new Length(double.Parse(value, CultureInfo.InvariantCulture));
    }

    public override void Write(Utf8JsonWriter writer, Length value, JsonSerializerOptions options)
    {
        writer.WriteStringValue(value.Value.ToString(CultureInfo.InvariantCulture) + "*");
    }
}