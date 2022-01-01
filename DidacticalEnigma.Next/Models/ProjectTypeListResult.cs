using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace DidacticalEnigma.Next.Models;

public class ProjectTypeListResult
{
    [Required]
    public IReadOnlyCollection<ProjectTypeResult> ProjectTypes { get; set; }
}