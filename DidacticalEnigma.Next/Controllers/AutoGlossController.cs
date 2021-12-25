using System.Linq;
using DidacticalEnigma.Core.Models.LanguageService;
using DidacticalEnigma.Next.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace DidacticalEnigma.Next.Controllers
{
    [ApiController]
    [Route("autoGloss")]
    [Authorize("AllowAnonymous")]
    public class AutoGlossController : ControllerBase
    {
        [HttpGet]
        [SwaggerOperation(OperationId = "RunAutomaticGloss")]
        public ActionResult<AutoGlossResult> Gloss(
            [FromQuery] string input,
            [FromServices] IAutoGlosser autoGlosser)
        {
            var result = autoGlosser.Gloss(input);
            return this.Ok(new AutoGlossResult()
            {
                Entries = result
                    .Select(entry => new AutoGlossEntry()
                    {
                        Word = entry.Foreign,
                        Definitions = entry.GlossCandidates
                    })
            });
        }
    }
}