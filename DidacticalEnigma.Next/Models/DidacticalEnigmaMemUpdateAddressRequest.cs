using System.ComponentModel.DataAnnotations;

namespace DidacticalEnigma.Next.Models;

public class DidacticalEnigmaMemUpdateAddressRequest
{
    [Required]
    public string Url { get; set; }
}