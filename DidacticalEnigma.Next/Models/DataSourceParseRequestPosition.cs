using System.ComponentModel.DataAnnotations;

namespace DidacticalEnigma.Next.Models;

public class DataSourceParseRequestPosition
{
    [Required]
    public int Position { get; set; }
        
    public int? PositionEnd { get; set; }
}