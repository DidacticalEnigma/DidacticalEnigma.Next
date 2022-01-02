using System.ComponentModel.DataAnnotations;

namespace DidacticalEnigma.Next.Models;

public class DidacticalEnigmaMemConnectionStatusResult
{
    [Required]
    public bool IsSet { get; set; }
    [Required]
    public bool IsNotSet { get; set; }
    public string? VerificationUri { get; set; }
    public string? UserCode { get; set; }
    [Required]
    public bool IsLoggedIn { get; set; }
    [Required]
    public bool IsLoggingIn { get; set; }
    [Required]
    public bool CanSet { get; set; }
    [Required]
    public bool CanReset { get; set; }
    [Required]
    public bool CanLogIn { get; set; }
    [Required]
    public bool CanLogOut { get; set; }
    public string? Uri { get; set; }
    public string? Prompt { get; set; }
    public string? Error { get; set; }
}