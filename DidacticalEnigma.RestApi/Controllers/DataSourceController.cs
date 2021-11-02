using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DidacticalEnigma.Core.Models.DataSources;
using DidacticalEnigma.Core.Models.Formatting;
using DidacticalEnigma.Core.Models.LanguageService;
using DidacticalEnigma.RestApi.InternalServices;
using DidacticalEnigma.RestApi.Models;
using Microsoft.AspNetCore.Mvc;
using Optional.Unsafe;
using Swashbuckle.AspNetCore.Annotations;
using Utility.Utils;
using WordInfo = DidacticalEnigma.Core.Models.LanguageService.WordInfo;

namespace DidacticalEnigma.RestApi.Controllers
{
    [ApiController]
    [Route("dataSource")]
    public class DataSourceController : ControllerBase
    {
        [HttpGet("list")]
        [SwaggerOperation(OperationId = "ListDataSources")]
        public IEnumerable<DataSourceInformation> List(
            [FromServices] DataSourceDispatcher dataSourceDispatcher)
        {
            return dataSourceDispatcher.DataSourceIdentifiers;
        }

        [HttpPost("request")]
        [SwaggerOperation(OperationId = "RequestInformationFromDataSources")]
        public async Task<ActionResult<Dictionary<string, DataSourceParseResponse>>> RequestInformation(
            [FromBody] DataSourceParseRequest request,
            [FromServices] IStash<ParsedText> stash,
            [FromServices] XmlRichFormattingRenderer renderer,
            [FromServices] DataSourceDispatcher dataSourceDispatcher)
        {
            var parsedTextOpt = stash.Get(request.Id);
            if (!parsedTextOpt.HasValue)
            {
                return this.Conflict();
            }

            var parsedText = parsedTextOpt.ValueOrFailure();
            var dataSourceRequest = request.PositionEnd != null 
                ? DataSourceRequestFromParsedText(parsedText, request.Position, request.PositionEnd.Value)
                : DataSourceRequestFromParsedText(parsedText, request.Position);

            var requestedDataSources = request.RequestedDataSources.Distinct();
            var result = new Dictionary<string, DataSourceParseResponse>();
            foreach (var identifier in requestedDataSources)
            {
                var answerOpt = await dataSourceDispatcher.GetAnswer(
                    identifier,
                    dataSourceRequest);
                result[identifier] = new DataSourceParseResponse()
                {
                    Context = answerOpt
                        .Map(a => renderer.Render(a).OuterXml)
                        .ValueOr(null as string)
                };
            }

            return result;
        }

        private Request DataSourceRequestFromParsedText(ParsedText text, int position, int positionEnd)
        {
            var cursor = text.GetCursor(position);
            var wordInfo = new WordInfo(text.FullText.SubstringFromTo(position, positionEnd));

            return new Request(
                cursor.CurrentCharacter,
                wordInfo,
                wordInfo.RawWord,
                () => text.FullText,
                SubsequentWords(cursor));
        }

        private Request DataSourceRequestFromParsedText(ParsedText text, int position)
        {
            var cursor = text.GetCursor(position);

            return new Request(
                cursor.CurrentCharacter,
                cursor.CurrentWord,
                cursor.CurrentWord.RawWord,
                () => text.FullText,
                SubsequentWords(cursor));
        }
        
        IEnumerable<string> SubsequentWords(ParsedTextCursor cursor)
        {
            cursor = cursor.Clone();
            do
            {
                yield return cursor.CurrentWord.RawWord;
            } while (cursor.MoveNextWord());
        }
    }
}