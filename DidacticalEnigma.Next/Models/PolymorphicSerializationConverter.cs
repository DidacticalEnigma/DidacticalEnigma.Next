using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace DidacticalEnigma.Next.Models;

public abstract class PolymorphicSerializationConverter<T> : JsonConverter<T>
{
    protected abstract string DiscriminatorPropertyName { get; }

    public override T? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        Utf8JsonReader readerClone = reader;

        int currentDepth = 0;
        bool readDiscriminator = false;
        do
        {
            switch (readerClone.TokenType)
            {
                case JsonTokenType.None:
                    break;
                case JsonTokenType.StartObject:
                    currentDepth++;
                    break;
                case JsonTokenType.EndObject:
                    currentDepth--;
                    break;
                case JsonTokenType.StartArray:
                    currentDepth++;
                    break;
                case JsonTokenType.EndArray:
                    currentDepth--;
                    break;
                case JsonTokenType.PropertyName:
                    if (currentDepth == 1)
                    {
                        var propertyName = readerClone.GetString();
                        if (propertyName == DiscriminatorPropertyName)
                        {
                            readDiscriminator = true;
                        }
                    }
                    break;
                case JsonTokenType.String:
                    if (readDiscriminator)
                    {
                        var discriminatorValue = readerClone.GetString();
                        if (discriminatorValue == null)
                        {
                            throw new JsonException();
                        }
                        return ReadAsConcrete(ref reader, discriminatorValue, options);
                    }
                    break;
                default:
                    if (readDiscriminator)
                    {
                        throw new JsonException();
                    }

                    break;
            }
        } while (readerClone.Read());
        
        throw new JsonException();
    }

    protected abstract T? ReadAsConcrete(ref Utf8JsonReader reader, string discriminator, JsonSerializerOptions options);
}