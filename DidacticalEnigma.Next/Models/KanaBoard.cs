using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace DidacticalEnigma.Next.Models;

public class KanaBoard
{
    [Required]
    public int Width { get; }
    
    [Required]
    public int Height { get; }
    
    [Required]
    public KanaBoardLayout Layout { get; }
    
    [Required]
    public IReadOnlyCollection<KanaCharacter?> Characters { get; }

    public KanaBoard(int width, int height, KanaBoardLayout layout, IReadOnlyCollection<KanaCharacter?> characters)
    {
        Width = width;
        Height = height;
        Layout = layout;
        Characters = characters;
    }

    public static async Task<KanaBoard> ParseAsync(TextReader reader)
    {
        var characters = new List<(KanaCharacter? kana, int x, int y)>();
        int x = 0;
        int y = 0;
        string? line;
        while ((line = await reader.ReadLineAsync()) != null)
        {
            var components = line.Split(' ');
            if (components.Length > 1)
                characters.Add((new KanaCharacter(components[0], components[1]), x, y));
            else
                characters.Add((null, x, y));
            
            x++;
            if (x == 5)
            {
                x = 0;
                y++;
            }
        }
        
        int width = x == 0 ? y : y + 1;
        int height = 5;
        
        var contents = characters
            .OrderBy(k => k.x * width + -k.y)
            .Select(k => k.kana)
            .ToList();

        return new KanaBoard(
            width,
            height,
            KanaBoardLayout.TopToBottomLeftToRight,
            contents);
    }
}