using System.IO;
using System.Text;
using System.Threading.Tasks;
using DidacticalEnigma.Next.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Swashbuckle.AspNetCore.Annotations;

namespace DidacticalEnigma.Next.Controllers;

[ApiController]
[Route("kana")]
[Authorize("AllowAnonymous")]
public class KanaController : ControllerBase
{
    private static KanaResult? result;
    
    [HttpGet("list")]
    [SwaggerOperation(OperationId = "ListKana")]
    public async Task<ActionResult<KanaResult>> GetKana(
        [FromServices] IOptions<ServiceConfiguration> config)
    {
        if (result != null)
        {
            return result;
        }

        var dataDir = config.Value.DataDirectory;

        using var hiraganaReader = System.IO.File.OpenText(Path.Combine(dataDir, "character", "hiragana_romaji.txt"));
        using var katakanaReader = System.IO.File.OpenText(Path.Combine(dataDir, "character", "katakana_romaji.txt"));
        var localResult = new KanaResult()
        {
            Hiragana = await KanaBoard.ParseAsync(hiraganaReader),
            Katakana = await KanaBoard.ParseAsync(katakanaReader)
        };

        result = localResult;

        return result;
    }
}