using System.Threading.Tasks;
using DidacticalEnigma.Mem.Client;
using DidacticalEnigma.Next.Models;

namespace DidacticalEnigma.Next.Controllers;

class ReducedFunctionalityDidacticalEnigmaMemConnectionSetupHandler : IDidacticalEnigmaMemConnectionSetupHandler
{
    public Task<DidacticalEnigmaMemConnectionStatusResult> UpdateAddress(DidacticalEnigmaMemUpdateAddressRequest addressRequest)
    {
        return Task.FromResult(CreateDefault());
    }

    public Task<DidacticalEnigmaMemConnectionStatusResult> Set(DidacticalEnigmaMemSetRequest addressRequest)
    {
        return Task.FromResult(CreateDefault());
    }

    public Task<DidacticalEnigmaMemConnectionStatusResult> Reset(DidacticalEnigmaMemResetRequest request)
    {
        return Task.FromResult(CreateDefault());
    }

    public Task<DidacticalEnigmaMemConnectionStatusResult> LogIn(DidacticalEnigmaMemLogInRequest request)
    {
        return Task.FromResult(CreateDefault());
    }

    public Task<DidacticalEnigmaMemConnectionStatusResult> LogOut(DidacticalEnigmaMemLogOutRequest request)
    {
        return Task.FromResult(CreateDefault());
    }

    public Task<DidacticalEnigmaMemConnectionStatusResult> CheckState(DidacticalEnigmaMemCheckStateRequest request)
    {
        return Task.FromResult(CreateDefault());
    }
    
    private static DidacticalEnigmaMemConnectionStatusResult CreateDefault()
    {
        return new DidacticalEnigmaMemConnectionStatusResult()
        {
            IsSet = false,
            IsNotSet = true,
            VerificationUri = null,
            UserCode = null,
            IsLoggedIn = false,
            IsLoggingIn = false,
            CanSet = false,
            CanReset = false,
            CanLogIn = false,
            CanLogOut = false,
            Uri = null,
            Prompt = null,
            Error = null
        };
    }
}