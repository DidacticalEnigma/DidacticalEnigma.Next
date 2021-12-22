using System.ComponentModel.DataAnnotations;

namespace DidacticalEnigma.RestApi.Models;

public class DataSourceParseRequestPosition
{
    [Required]
    public int Position { get; set; }
        
    public int? PositionEnd { get; set; }
}