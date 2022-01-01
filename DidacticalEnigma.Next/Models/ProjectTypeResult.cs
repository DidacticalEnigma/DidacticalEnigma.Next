using System;
using System.ComponentModel.DataAnnotations;

namespace DidacticalEnigma.Next.Models;

public class ProjectTypeResult
{
    [Required]
    public Guid Type { get; set; }
    
    [Required]
    public string FriendlyName { get; set; }
}