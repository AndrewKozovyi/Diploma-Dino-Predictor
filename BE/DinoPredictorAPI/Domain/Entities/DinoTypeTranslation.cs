using System;
using System.Collections.Generic;

namespace DinoPredictorAPI.Domain.Entities;

public partial class DinoTypeTranslation
{
    public byte DinoTypeId { get; set; }

    public string Culture { get; set; } = null!;

    public string Name { get; set; } = null!;

    public virtual DinoType DinoType { get; set; } = null!;
}
