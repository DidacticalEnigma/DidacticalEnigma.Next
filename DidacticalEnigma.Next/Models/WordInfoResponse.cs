using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace DidacticalEnigma.Next.Models
{
    public class WordInfoResponse
    {
        [Required]
        public IEnumerable<IEnumerable<Models.WordInfo>> WordInformation { get; set; }
        
        [Required]
        public IReadOnlyDictionary<string, IReadOnlyList<SimilarLetter>> SimilarLetters { get; set; }
    }
}
