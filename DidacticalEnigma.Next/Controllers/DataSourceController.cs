using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using DidacticalEnigma.Core.Models.DataSources;
using DidacticalEnigma.Core.Models.Formatting;
using DidacticalEnigma.Core.Models.LanguageService;
using DidacticalEnigma.Mem.Client;
using DidacticalEnigma.Mem.DataSource;
using DidacticalEnigma.Next.InternalServices;
using DidacticalEnigma.Next.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Optional;
using Swashbuckle.AspNetCore.Annotations;
using Utility.Utils;
using WordInfo = DidacticalEnigma.Core.Models.LanguageService.WordInfo;

namespace DidacticalEnigma.Next.Controllers
{
    [ApiController]
    [Route("dataSource")]
    [Authorize("AllowAnonymous")]
    public class DataSourceController : ControllerBase
    {
        private readonly DataSourceDispatcher dataSourceDispatcher;

        public DataSourceController(
            DataSourceDispatcher dataSourceDispatcher)
        {
            this.dataSourceDispatcher = dataSourceDispatcher;
        }

        [HttpGet("list")]
        [SwaggerOperation(OperationId = "ListDataSources")]
        public IEnumerable<DataSourceInformation> List()
        {
            return dataSourceDispatcher.DataSourceIdentifiers;
        }

        [HttpPost("request")]
        [SwaggerOperation(OperationId = "RequestInformationFromDataSources")]
        public async Task<ActionResult<IEnumerable<DataSourceParseResponse>>> RequestInformation(
            [FromBody] DataSourceParseRequest request,
            [FromServices] XmlRichFormattingRenderer renderer,
            [FromServices] ISentenceParser parser)
        {
            var rawText = request.Text.TrimEnd();
            var parsedText = new ParsedText(rawText,
                parser.BreakIntoWords(rawText).ToList());
            var result = new List<DataSourceParseResponse>();
            foreach (var position in request.Positions)
            {
                var dataSourceRequest = DataSourceRequestFromParsedText(parsedText, position.Position, position.PositionEnd);

                var requestedDataSources = request.RequestedDataSources.Distinct();

                var stopwatch = Stopwatch.StartNew();
                var responseTasks = requestedDataSources
                    .Select(async identifier =>
                    {
                        var response = await dataSourceDispatcher.GetAnswer(
                            identifier,
                            dataSourceRequest);
                        return (identifier, response);
                    })
                    .ToList();

                while (responseTasks.Count != 0)
                {
                    var responseTask = await Task.WhenAny(responseTasks);
                    responseTasks.Remove(responseTask);
                    var (identifier, answerOpt) = await responseTask;
                    var elapsed = stopwatch.Elapsed.TotalMilliseconds;
                    result.Add(new DataSourceParseResponse()
                    {
                        Position = position.Position,
                        PositionEnd = position.PositionEnd,
                        DataSource = identifier,
                        Context = answerOpt
                            .Map(a => renderer.Render(a).OuterXml)
                            .ValueOr(null as string),
                        Error = !answerOpt.HasValue ? "nothing found" : null,
                        ProcessingTime = elapsed,
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
            var wordInfo = positionEnd != null && position != positionEnd
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