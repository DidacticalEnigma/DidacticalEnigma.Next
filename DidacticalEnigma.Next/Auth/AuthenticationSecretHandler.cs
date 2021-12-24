using System;
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
    [NotNull] private readonly SecretProvider secretProvider;

    public AuthenticationSecretHandler(
        IOptionsMonitor<AuthenticationSecretConfig> options,
        ILoggerFactory logger,
        UrlEncoder encoder,
        ISystemClock clock,
        SecretProvider secretProvider)
        : base(options, logger, encoder, clock)
    {
        this.secretProvider = secretProvider;
    }

    protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        var content = Request.Cookies["secret"] ?? Request.Query["secret"];
        if (secretProvider.UnsafeDebugMode ||
            CryptographicOperations.FixedTimeEquals(
                MemoryMarshal.AsBytes(content.AsSpan()),
                MemoryMarshal.AsBytes(secretProvider.Secret.AsSpan())))
        {
            var claims = new[] { new Claim(ClaimTypes.Name, "user") };
            var identity = new ClaimsIdentity(claims, Scheme.Name);
            var principal = new ClaimsPrincipal(identity);
            var ticket = new AuthenticationTicket(principal, Scheme.Name);
            if (!Options.AnonymousMode)
            {
                Response.Cookies.Append("secret", secretProvider.Secret);
            }

            return AuthenticateResult.Success(ticket);
        }
        else
        {
            return AuthenticateResult.Fail("missing secret");
        }
    }
}