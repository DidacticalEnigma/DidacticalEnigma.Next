using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json;

namespace DidacticalEnigma.Next.Models;

public class ProgramConfigurationSetRequest
{
    [Required]
    public IReadOnlyCollection<JsonElement> DataSourceGridLayouts { get; set; }
}