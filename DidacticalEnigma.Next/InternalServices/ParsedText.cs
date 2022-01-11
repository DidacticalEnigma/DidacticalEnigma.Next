using System;
using System.Collections.Generic;
using DidacticalEnigma.Core.Models.LanguageService;
using Utility.Utils;

namespace DidacticalEnigma.Next.InternalServices
{
    public class ParsedText
    {
        private List<KeyValuePair<int, int>> positionInformation;

        public ParsedText(string fullText, IReadOnlyList<WordInfo> wordInformation)
        {
            this.FullText = fullText;
            WordInformation = wordInformation;

            var positionInformation = new List<KeyValuePair<int, int>>();
            int position = 0;
            foreach (var (word, index) in wordInformation.Indexed())
            {
                position = fullText.IndexOf(word.RawWord, position, StringComparison.InvariantCulture);
                positionInformation.Add(
                    KeyValuePair.Create(position, index));
            }

            this.positionInformation = positionInformation;
        }

        public string FullText { get; }

        public IReadOnlyList<Core.Models.LanguageService.WordInfo> WordInformation { get; }

        public ParsedTextCursor GetCursor(int position)
        {
            var (wordPosition, index) = GetIndicesAtPosition(position);

            return new ParsedTextCursor(this, index, position - wordPosition);
        }
        
        private (int wordPosition, int index) GetIndicesAtPosition(int position)
        {
            if(position < 0)
                throw new ArgumentException(nameof(position));

            var result = LowerBound(
                i => positionInformation[i],
                positionInformation.Count,
                position,
                kvp => kvp.Key,
                Comparer<int>.Default);
            if (result >= positionInformation.Count)
                result = positionInformation.Count - 1;
            if (position < positionInformation[result].Key)
                result--;
            return (positionInformation[result].Key, positionInformation[result].Value);
        }

        private static int LowerBound<T, TKey>(Func<int, T> lookup, int len, TKey lookupKey, Func<T, TKey> selector, IComparer<TKey> comparer)
        {
            int left = 0;
            int right = len;
            while (left < right)
            {
                var m = GetMidpoint(left, right);
                var record = lookup(m);
                var recordKey = selector(record);
                switch (comparer.Compare(recordKey, lookupKey))
                {
                    case var x when x < 0:
                        left = m + 1;
                        break;
                    default:
                        right = m;
                        break;
                }
            }

            return left;
        }

        private static int GetMidpoint(int l, int r)
        {
            // To replace if you suffer overflows
            return (l + r) / 2;
        }
    }
}
