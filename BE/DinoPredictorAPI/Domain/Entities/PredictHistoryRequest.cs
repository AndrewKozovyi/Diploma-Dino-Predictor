using System;
using System.Collections.Generic;

namespace DinoPredictorAPI.Domain.Entities;

public partial class PredictHistoryRequest
{
    public Guid Id { get; set; }

    public DateTime CreatedAt { get; set; }

    public string ImagePublicId { get; set; } = null!;

    public string? CamImagePublicId { get; set; }

    public string OriginalFileName { get; set; } = null!;

    public string ModelVersion { get; set; } = null!;

    public int ProcessingMs { get; set; }

    public virtual ICollection<PredictHistoryResult> PredictHistoryResults { get; set; } = new List<PredictHistoryResult>();
}
