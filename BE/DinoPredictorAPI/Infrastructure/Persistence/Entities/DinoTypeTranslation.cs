using System;
using System.Collections.Generic;

namespace DinoPredictorAPI.Infrastructure;

public partial class DinoTypeTranslation
{
    public byte DinoTypeId { get; set; }
    
    public byte LanguageId { get; set; }

    public string Name { get; set; } = null!;

    public virtual Language Language { get; set; } = null!;
    public virtual DinoType DinoType { get; set; } = null!;
}
