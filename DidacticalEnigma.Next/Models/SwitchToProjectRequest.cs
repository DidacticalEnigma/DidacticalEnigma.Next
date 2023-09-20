using System.ComponentModel.DataAnnotations;

namespace DidacticalEnigma.Next.Models;

public class SwitchToProjectRequest
{
    [Required]
    public string ProjectId { get; set; }
}