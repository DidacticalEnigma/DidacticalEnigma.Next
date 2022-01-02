using System.Threading.Tasks;
using DidacticalEnigma.Mem.Client;
using DidacticalEnigma.Next.Models;

namespace DidacticalEnigma.Next.Controllers;

public class DidacticalEnigmaMemConnectionSetupHandler : IDidacticalEnigmaMemConnectionSetupHandler
{
    private readonly DidacticalEnigmaMemViewModel vm;

    public DidacticalEnigmaMemConnectionSetupHandler(
        DidacticalEnigmaMemViewModel vm)
    {
        this.vm = vm;
    }

    public Task<DidacticalEnigmaMemConnectionStatusResult> UpdateAddress(DidacticalEnigmaMemUpdateAddressRequest addressRequest)
    {
        if (this.vm.IsNotSet)
        {
            this.vm.Uri = addressRequest.Url;
        }
        
        return Task.FromResult(Map(this.vm));
    }
    
    public Task<DidacticalEnigmaMemConnectionStatusResult> Set(DidacticalEnigmaMemSetRequest addressRequest)
    {
        if (this.vm.Initialize.CanExecute(null))
        {
            this.vm.Initialize.Execute(null);
        }
        
        return Task.FromResult(Map(this.vm));
    }
    
    public Task<DidacticalEnigmaMemConnectionStatusResult> Reset(DidacticalEnigmaMemResetRequest request)
    {
        if (this.vm.Reset.CanExecute(null))
        {
            this.vm.Reset.Execute(null);
        }

        return Task.FromResult(Map(this.vm));
    }
    
    public Task<DidacticalEnigmaMemConnectionStatusResult> LogIn(DidacticalEnigmaMemLogInRequest request)
    {
        if (this.vm.LogIn.CanExecute(null))
        {
            this.vm.LogIn.Execute(null);
        }

        return Task.FromResult(Map(this.vm));
    }
    
    public Task<DidacticalEnigmaMemConnectionStatusResult> LogOut(DidacticalEnigmaMemLogOutRequest request)
    {
        if (this.vm.LogOut.CanExecute(null))
        {
            this.vm.LogOut.Execute(null);
        }

        return Task.FromResult(Map(this.vm));
    }
    
    public Task<DidacticalEnigmaMemConnectionStatusResult> CheckState(DidacticalEnigmaMemCheckStateRequest request)
    {
        return Task.FromResult(Map(this.vm));
    }

    private static DidacticalEnigmaMemConnectionStatusResult Map(DidacticalEnigmaMemViewModel vm)
    {
        var result = new DidacticalEnigmaMemConnectionStatusResult()
        {
            IsSet = vm.IsSet,
            IsNotSet = vm.IsNotSet,
            VerificationUri = vm.VerificationUri,
            UserCode = vm.UserCode,
            IsLoggedIn = vm.IsLoggedIn,
            IsLoggingIn = vm.IsLoggingIn,
            CanSet = vm.Initialize.CanExecute(null),
            CanReset = vm.Reset.CanExecute(null),
            CanLogIn = vm.LogIn.CanExecute(null),
            CanLogOut = vm.LogOut.CanExecute(null),
            Uri = vm.Uri,
            Prompt = vm.Prompt,
            Error = vm.ErrorMessage
        };
        
        return result;
    }
}