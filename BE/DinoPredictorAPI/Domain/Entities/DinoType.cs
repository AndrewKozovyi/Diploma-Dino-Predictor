using System;
using System.Collections.Generic;

namespace DinoPredictorAPI.Domain.Entities;

public partial class DinoType
{
    public byte Id { get; set; }

    public string Code { get; set; } = null!;

    public virtual ICollection<DinoTypeTranslation> DinoTypeTranslations { get; set; } = new List<DinoTypeTranslation>();

    public virtual ICollection<PredictHistoryResult> PredictHistoryResults { get; set; } = new List<PredictHistoryResult>();
}
