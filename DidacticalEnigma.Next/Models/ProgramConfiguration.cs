using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace DidacticalEnigma.Next.Models;

public class ProgramConfigurationGetResult
{
    [Required]
    public bool IsDefault { get; set; }
    
    [Required]
    public string AboutSection { get; set; }
    
    [Required]
    public string Version { get; set; }
    
    [Required]
    public IReadOnlyCollection<object> DataSourceGridLayouts { get; set; }
}