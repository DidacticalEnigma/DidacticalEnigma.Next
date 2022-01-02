using System.Threading.Tasks;
using DidacticalEnigma.Next.Models;

namespace DidacticalEnigma.Next.Controllers;

public interface IDidacticalEnigmaMemConnectionSetupHandler
{
    Task<DidacticalEnigmaMemConnectionStatusResult> UpdateAddress(DidacticalEnigmaMemUpdateAddressRequest request);
    Task<DidacticalEnigmaMemConnectionStatusResult> Set(DidacticalEnigmaMemSetRequest addressRequest);
    Task<DidacticalEnigmaMemConnectionStatusResult> Reset(DidacticalEnigmaMemResetRequest request);
    Task<DidacticalEnigmaMemConnectionStatusResult> LogIn(DidacticalEnigmaMemLogInRequest request);
    Task<DidacticalEnigmaMemConnectionStatusResult> LogOut(DidacticalEnigmaMemLogOutRequest request);
    Task<DidacticalEnigmaMemConnectionStatusResult> CheckState(DidacticalEnigmaMemCheckStateRequest request);
}