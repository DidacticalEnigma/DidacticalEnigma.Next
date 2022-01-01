using System;
using System.ComponentModel.DataAnnotations;

namespace DidacticalEnigma.Next.Models;

public class OpenProjectRequest
{
    [Required]
    public Guid ProjectType { get; set; }
}