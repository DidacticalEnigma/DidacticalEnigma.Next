using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace DidacticalEnigma.Next.Models;

public class ProgramConfigurationSetRequest
{
    [Required]
    public IReadOnlyCollection<object> DataSourceGridLayouts { get; set; }
}