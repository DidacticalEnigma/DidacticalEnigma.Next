using System.Security.Claims;
using System.Threading.Tasks;
using DidacticalEnigma.Next.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace DidacticalEnigma.Next.Controllers;

[ApiController]
[Route("session")]
public class SessionController : ControllerBase
{
    [Authorize("AllowAnonymous")]
    [HttpGet]
    [SwaggerOperation(OperationId = "LoadSession")]
    public async Task<ActionResult<ProgramConfiguration>> LoadSession()
    {
        var defaultConfig = new ProgramConfiguration()
        {

        };
        if (HttpContext.User.HasClaim(claim => claim.Type == ClaimTypes.Anonymous))
        {
            return defaultConfig;
        }
        
        // load config, if does not exist, return default
        return defaultConfig;
    }
    
    [Authorize("RejectAnonymous")]
    [HttpPost]
    [SwaggerOperation(OperationId = "SaveSession")]
    public async Task<ActionResult> SaveSession(ProgramConfiguration configuration)
    {
        return Ok();
    }
}