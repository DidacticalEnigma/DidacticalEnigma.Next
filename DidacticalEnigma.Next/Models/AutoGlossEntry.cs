using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace DidacticalEnigma.Next.Models
{
    public class AutoGlossEntry
    {
        [Required]
        public string Word { get; set; }
        
        [Required]
        public IReadOnlyCollection<string> Definitions { get; set; }
    }
}