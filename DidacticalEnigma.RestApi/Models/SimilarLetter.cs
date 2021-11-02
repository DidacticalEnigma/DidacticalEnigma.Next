using System.ComponentModel.DataAnnotations;

namespace DidacticalEnigma.RestApi.Models
{
    public class SimilarLetter
    {
        [Required]
        public string Letter { get; set; }
        
        [Required]
        public string Description { get; set; }
    }
}