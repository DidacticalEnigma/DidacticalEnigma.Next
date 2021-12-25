using System;
using System.Security.Cryptography;

namespace DidacticalEnigma.Next.Auth;

public class LaunchConfiguration
{
    public const string SectionName = "LaunchConfiguration";
    
    public bool UnsafeDebugMode { get; set; }
    
    public bool PublicMode { get; set; }
    
    public bool HeadlessMode { get; set; }
    
    public string Secret { get; set; }
    
    public Uri LocalAddress { get; set; }

    public static string GenerateSecret()
    {
        using var rng = RandomNumberGenerator.Create();
        var bytes = new byte[64];
        rng.GetBytes(bytes);
        return Convert.ToBase64String(bytes);
    }
}