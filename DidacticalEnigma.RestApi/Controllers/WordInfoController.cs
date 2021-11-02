using System.Collections.Generic;
using DidacticalEnigma.Core.Models.LanguageService;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using DidacticalEnigma.RestApi.InternalServices;
using DidacticalEnigma.RestApi.Models;
using Swashbuckle.AspNetCore.Annotations;
using Utility.Utils;

namespace DidacticalEnigma.RestApi.Controllers
{
    [ApiController]
    [Route("wordInfo")]
    public class WordInfoController : ControllerBase
    {
        [HttpGet]
        [SwaggerOperation(OperationId = "GetWordInformation")]
        public IEnumerable<IEnumerable<Models.WordInfo>> Post(
            [FromQuery] string fullText,
            [FromServices] ISentenceParser parser)
        {
            return parser
                .BreakIntoSentences(fullText)
                .Select(sentence => sentence.
                    Select(word => new Models.WordInfo()
                    {
                        DictionaryForm = word.DictionaryForm,
                        Reading = word.Reading,
                        Text = word.RawWord
                    }));
        }

        [HttpPost]
        [SwaggerOperation(OperationId = "PostText")]
        public WordInfoResponse Post(
            [FromQuery] string fullText,
            [FromServices] ISentenceParser parser,
            [FromServices] IStash<ParsedText> stash,
            [FromServices] IRelated related)
        {
            var parsedText = new ParsedText(fullText,
                parser.BreakIntoSentences(fullText)
                    .Select(x => x.ToList())
                    .ToList());
            var identifier = stash.Put(parsedText);
            return new WordInfoResponse()
            {
                Identifier = identifier,
                WordInformation = parsedText.WordInformation
                    .Select(sentence =>
                        sentence.Select(word => new Models.WordInfo()
                        {
                            DictionaryForm = word.DictionaryForm,
                            Reading = word.Reading,
                            Text = word.RawWord
                        })),
                SimilarLetters = fullText.AsCodePoints()
                    .Distinct()
                    .Select(cp =>
                    {
                        var codePoint = CodePoint.FromInt(cp);
                        return new KeyValuePair<string, IReadOnlyList<SimilarLetter>>(
                            codePoint.ToString(),
                            related.FindRelated(codePoint)
                                .SelectMany(g =>
                                    g.Select(letter => new SimilarLetter()
                                    {
                                        Category = g.Key,
                                        Description = letter.ToLongString(),
                                        Letter = letter.ToString()
                                    }))
                                .ToList());
                    })
                    .ToDictionary()
            };
        }

        [HttpDelete]
        [SwaggerOperation(OperationId = "DeleteText")]
        public void Delete(
            [FromQuery] string identifier,
            [FromServices] IStash<ParsedText> stash)
        {
            stash.Delete(identifier);
        }
    }
}
