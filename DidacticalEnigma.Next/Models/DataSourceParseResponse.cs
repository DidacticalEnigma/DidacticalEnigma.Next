using System.ComponentModel.DataAnnotations;

namespace DidacticalEnigma.Next.Models
{
    public class DataSourceParseResponse
    {
        [Required]
        public int Position { get; set; }
        
        public int? PositionEnd { get; set; }
        
        [Required]
        public string DataSource { get; set; }
        
        public string? Context { get; set; }

        public string? Error { get; set; }
        
        public double ProcessingTime { get; set; }
    }
}
