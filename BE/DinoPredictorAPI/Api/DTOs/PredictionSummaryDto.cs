namespace DinoPredictorAPI.Api;

public sealed class PredictionSummaryDto
{
    public Guid Id { get; init; }

    public DateTime CreatedAt { get; init; }

    public string OriginalFileName { get; init; } = null!;

    public DinoTypeDto DinoType { get; init; } = null!;

    public decimal Probability { get; init; }
}
