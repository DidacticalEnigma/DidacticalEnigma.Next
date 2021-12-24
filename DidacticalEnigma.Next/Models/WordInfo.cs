using System.ComponentModel.DataAnnotations;

namespace DidacticalEnigma.Next.Models
{
    public class WordInfo
    {
        [Required]
        public string Text { get; set; }

        [Required]
        public string DictionaryForm { get; set; }

        [Required]
        public string Reading { get; set; }
    }
}
