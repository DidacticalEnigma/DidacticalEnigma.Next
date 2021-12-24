using System.ComponentModel.DataAnnotations;

namespace DidacticalEnigma.Next.Models
{
    public class SimilarLetter
    {
        [Required]
        public string Letter { get; set; }
        
        [Required]
        public string Description { get; set; }
        
        [Required]
        public string Category { get; set; }
    }
}