using System;
using System.Collections.Generic;
using System.Linq;
using DidacticalEnigma.Core.Models.LanguageService;
using DidacticalEnigma.Next.InternalServices;
using DidacticalEnigma.Next.Models;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Utility.Utils;

namespace DidacticalEnigma.Next.Controllers
{
    [ApiController]
    [Route("wordInfo")]
    public class WordInfoController : ControllerBase
    {
        [HttpGet]
        [SwaggerOperation(OperationId = "GetWordInformation")]
        public WordInfoResponse Post(
            [FromQuery] string fullText,
            [FromServices] ISentenceParser parser,
            [FromServices] IRelated related)
        {
            var parsedText = new ParsedText(fullText,
                parser.BreakIntoSentences(fullText)
                    .Select(x => x.ToList())
                    .ToList());
            return new WordInfoResponse()
            {
                WordInformation = parsedText.WordInformation
                    .Select(sentence =>
                        sentence.Select(word => new Models.WordInfo()
                        {
                            DictionaryForm = word.DictionaryForm,
                            Reading = word.Reading,
                            Text = word.RawWord,
                            Type = Map(word.EstimatedPartOfSpeech)
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

        private WordType Map(PartOfSpeech estimatedPartOfSpeech)
        {
            switch (estimatedPartOfSpeech)
            {
                case PartOfSpeech.Noun:
                    return WordType.Noun;
                case PartOfSpeech.Particle:
                    return WordType.Particle;
                case PartOfSpeech.Verb:
                    return WordType.Verb;
                default:
                    return WordType.Other;
            }
        }
    }
}
