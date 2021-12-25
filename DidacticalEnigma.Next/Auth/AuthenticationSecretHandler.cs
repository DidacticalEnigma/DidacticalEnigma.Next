using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using JetBrains.Annotations;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace DidacticalEnigma.Next.Auth;

public class AuthenticationSecretHandler : AuthenticationHandler<AuthenticationSecretConfig>
{
    [NotNull] private readonly LaunchConfiguration launchConfiguration;

    public AuthenticationSecretHandler(
        IOptionsMonitor<AuthenticationSecretConfig> options,
        ILoggerFactory logger,
        UrlEncoder encoder,
        ISystemClock clock,
        LaunchConfiguration launchConfiguration)
        : base(options, logger, encoder, clock)
    {
        this.launchConfiguration = launchConfiguration;
    }

    protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        var content = Request.Cookies["secret"] ?? Request.Query["secret"];
        bool hasMatchingSecret = CryptographicOperations.FixedTimeEquals(
            MemoryMarshal.AsBytes(content.AsSpan()),
            MemoryMarshal.AsBytes(launchConfiguration.Secret.AsSpan()));
        
        if (launchConfiguration.UnsafeDebugMode ||
            launchConfiguration.PublicMode ||
            hasMatchingSecret)
        {
            var claims = new List<Claim>()
            {
                
            };
            if (hasMatchingSecret || launchConfiguration.UnsafeDebugMode)
            {
                claims.Add(new Claim(ClaimTypes.Name, "user"));
            }
            else
            {
                claims.Add(new Claim(ClaimTypes.Anonymous, "true"));
            }
            var identity = new ClaimsIdentity(claims, Scheme.Name);
            var principal = new ClaimsPrincipal(identity);
            var ticket = new AuthenticationTicket(principal, Scheme.Name);
            if (!launchConfiguration.PublicMode)
            {
                Response.Cookies.Append("secret", launchConfiguration.Secret);
            }

            return AuthenticateResult.Success(ticket);
        }
        else
        {
            return AuthenticateResult.Fail("missing secret");
        }
    }
}