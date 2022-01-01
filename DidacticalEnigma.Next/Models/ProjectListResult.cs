using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace DidacticalEnigma.Next.Models;

public class ProjectListResult
{
    [Required]
    public IReadOnlyCollection<ProjectInfoResult> Projects { get; set; }
}