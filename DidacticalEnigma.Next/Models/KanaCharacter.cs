using System.ComponentModel.DataAnnotations;

namespace DidacticalEnigma.Next.Models;

public class KanaCharacter
{
    [Required]
    public string Kana { get; }

    [Required]
    public string Romaji { get; }

    public KanaCharacter(string kana, string romaji)
    {
        Kana = kana;
        Romaji = romaji;
    }
}