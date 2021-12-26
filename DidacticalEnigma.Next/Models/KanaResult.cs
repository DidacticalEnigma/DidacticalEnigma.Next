using System.ComponentModel.DataAnnotations;

namespace DidacticalEnigma.Next.Models;

public class KanaResult
{
    [Required]
    public KanaBoard Hiragana { get; set; }
    
    [Required]
    public KanaBoard Katakana { get; set; }
}