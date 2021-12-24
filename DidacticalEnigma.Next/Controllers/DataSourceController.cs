using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DidacticalEnigma.Core.Models.DataSources;
using DidacticalEnigma.Core.Models.Formatting;
using DidacticalEnigma.Core.Models.LanguageService;
using DidacticalEnigma.Next.InternalServices;
using DidacticalEnigma.Next.Models;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Utility.Utils;
using WordInfo = DidacticalEnigma.Core.Models.LanguageService.WordInfo;

namespace DidacticalEnigma.Next.Controllers
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
        public async Task<ActionResult<IEnumerable<DataSourceParseResponse>>> RequestInformation(
            [FromBody] DataSourceParseRequest request,
            [FromServices] XmlRichFormattingRenderer renderer,
            [FromServices] ISentenceParser parser,
            [FromServices] DataSourceDispatcher dataSourceDispatcher)
        {
            var rawText = request.Text.TrimEnd();
            var parsedText = new ParsedText(rawText,
                parser.BreakIntoSentences(rawText)
                    .Select(x => x.ToList())
                    .ToList());
            var result = new List<DataSourceParseResponse>();
            foreach (var position in request.Positions)
            {
                var dataSourceRequest = DataSourceRequestFromParsedText(parsedText, position.Position, position.PositionEnd);

                var requestedDataSources = request.RequestedDataSources.Distinct();
                foreach (var identifier in requestedDataSources)
                {
                    var answerOpt = await dataSourceDispatcher.GetAnswer(
                        identifier,
                        dataSourceRequest);
                    result.Add(new DataSourceParseResponse()
                    {
                        Position = position.Position,
                        PositionEnd = position.PositionEnd,
                        DataSource = identifier,
                        Context = answerOpt
                            .Map(a => renderer.Render(a).OuterXml)
                            .ValueOr(null as string),
                        Error = !answerOpt.HasValue ? "nothing found" : null
                    });
                }
            }

            return result;
        }

        private Request DataSourceRequestFromParsedText(ParsedText text, int position, int? positionEnd)
        {
            position = Math.Clamp(position, 0, text.FullText.Length - 1);
            positionEnd = positionEnd != null ? Math.Clamp(positionEnd.Value, 0, text.FullText.Length) : null;
            var cursor = text.GetCursor(position);
            var wordInfo = positionEnd != null
                ? new WordInfo(text.FullText.SubstringFromTo(position, positionEnd.Value))
                : cursor.CurrentWord;

            return new Request(
                cursor.CurrentCharacter,
                wordInfo,
                wordInfo.RawWord,
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