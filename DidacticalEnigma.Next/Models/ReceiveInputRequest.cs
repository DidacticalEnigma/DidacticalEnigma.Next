using System.ComponentModel.DataAnnotations;

namespace DidacticalEnigma.Next.Models;

public class ReceiveInputRequest
{
    [Required]
    public string Input { get; set; }
}