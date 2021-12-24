using Microsoft.AspNetCore.Authentication;

namespace DidacticalEnigma.Next.Auth;

public class AuthenticationSecretConfig : AuthenticationSchemeOptions
{
    public static readonly string Scheme = "AuthenticationSecretScheme";

    public bool AnonymousMode { get; set; }
}