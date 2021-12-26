#if AVALONIA
using Avalonia.Controls;
#else
#endif
using System.Collections.Generic;
using Newtonsoft.Json;
using Utility.Utils;

namespace DidacticalEnigma.Next.Models
{
    public abstract class Split : Element
    {
        public Element First { get; set; }

        public Element Second { get; set; }

        public Length LeftDimension { get; set; } = new Length(1);
        
        public Length RightDimension { get; set; } = new Length(1);
    }
}
