namespace DidacticalEnigma.Next.InternalServices
{
    public class ParsedTextCursor
    {
        private readonly ParsedText parsedText;
        private int linePosition;
        private int wordPosition;
        private int characterPosition;

        public ParsedTextCursor(ParsedText parsedText, int linePosition, int wordPosition, int characterPosition)
        {
            this.parsedText = parsedText;
            this.linePosition = linePosition;
            this.wordPosition = wordPosition;
            this.characterPosition = characterPosition;
        }

        public string CurrentCharacter =>
            parsedText.WordInformation[linePosition][wordPosition].RawWord[characterPosition].ToString();

        public DidacticalEnigma.Core.Models.LanguageService.WordInfo CurrentWord => parsedText.WordInformation[linePosition][wordPosition];

        public bool MoveNextCharacter()
        {
            bool moved = false;
            for (int i = linePosition; i < parsedText.WordInformation.Count; i++)
            {
                for (int j = (i == linePosition) ? wordPosition : 0; j < parsedText.WordInformation[i].Count; j++)
                {
                    for (int k = (j == wordPosition) ? characterPosition : 0; k < parsedText.WordInformation[i][j].RawWord.Length; k++)
                    {
                        if (moved)
                        {
                            linePosition = i;
                            wordPosition = j;
                            characterPosition = k;
                            return true;
                        }

                        moved = true;
                    }
                }
            }

            return false;
        }
        
        public bool MoveNextWord()
        {
            bool moved = false;
            for (int i = linePosition; i < parsedText.WordInformation.Count; i++)
            {
                for (int j = (i == linePosition) ? wordPosition : 0; j < parsedText.WordInformation[i].Count; j++)
                {
                    if (moved)
                    {
                        linePosition = i;
                        wordPosition = j;
                        return true;
                    }

                    moved = true;
                }
            }

            return false;
        }

        public ParsedTextCursor Clone()
        {
            return new ParsedTextCursor(parsedText, linePosition, wordPosition, characterPosition);
        }
    }
}