using System;

namespace DidacticalEnigma.Next.InternalServices
{
    public class ParsedTextCursor
    {
        private readonly ParsedText parsedText;
        private int wordPosition;
        private int characterPosition;

        public ParsedTextCursor(ParsedText parsedText, int wordPosition, int characterPosition)
        {
            this.parsedText = parsedText;
            this.wordPosition = wordPosition;
            this.characterPosition = characterPosition;
        }

        public string CurrentCharacter
        {
            get
            {
                var word = parsedText.WordInformation[wordPosition].RawWord;
                return word[Math.Min(characterPosition, word.Length-1)].ToString();
            }
        }

        public DidacticalEnigma.Core.Models.LanguageService.WordInfo CurrentWord => parsedText.WordInformation[wordPosition];

        public bool MoveNextCharacter()
        {
            bool moved = false;
            for (int j = wordPosition; j < parsedText.WordInformation.Count; j++)
            {
                for (int k = (j == wordPosition) ? characterPosition : 0; k < parsedText.WordInformation[j].RawWord.Length; k++)
                {
                    if (moved)
                    {
                        wordPosition = j;
                        characterPosition = k;
                        return true;
                    }

                    moved = true;
                }
            }

            return false;
        }
        
        public bool MoveNextWord()
        {
            bool moved = false;
            for (int j = wordPosition; j < parsedText.WordInformation.Count; j++)
            {
                if (moved)
                {
                    wordPosition = j;
                    return true;
                }

                moved = true;
            }

            return false;
        }

        public ParsedTextCursor Clone()
        {
            return new ParsedTextCursor(parsedText, wordPosition, characterPosition);
        }
    }
}