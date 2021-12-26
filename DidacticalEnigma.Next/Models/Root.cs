using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using Newtonsoft.Json;
using Utility.Utils;

namespace DidacticalEnigma.Next.Models
{
    public class Root : Element
    {
        [JsonPropertyName("Tree")]
        public Element Tree { get; set; }

        [JsonPropertyName("Type")]
        public override string Type => "root";
    }
}