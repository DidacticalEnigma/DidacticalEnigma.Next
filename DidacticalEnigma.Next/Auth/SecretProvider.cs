using System;
using System.Security.Cryptography;

namespace DidacticalEnigma.Next.Auth;

public class SecretProvider
{
    public SecretProvider()
    {
        using var rng = RandomNumberGenerator.Create();
        var bytes = new byte[64];
        rng.GetBytes(bytes);
        Secret = Convert.ToBase64String(bytes);
    }
    
    public bool UnsafeDebugMode { get; set; }
    
    public bool LaunchWebView { get; set; }
    
    public string Secret { get; }
    
    public int Port { get; set; }
}