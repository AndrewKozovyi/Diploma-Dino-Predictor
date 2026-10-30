using System;
using System.Collections.Generic;

namespace DinoPredictorAPI.Domain.Entities;

public partial class PredictHistoryResult
{
    public Guid RequestId { get; set; }

    public byte DinoTypeId { get; set; }

    public byte Rank { get; set; }

    public decimal Probability { get; set; }

    public virtual DinoType DinoType { get; set; } = null!;

    public virtual PredictHistoryRequest Request { get; set; } = null!;
}
