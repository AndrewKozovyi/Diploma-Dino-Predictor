namespace DinoPredictorAPI.Api;

public sealed class PredictionCandidateDto
{
    public byte Rank { get; init; }

    public decimal Probability { get; init; }

    public DinoTypeDto DinoType { get; init; } = null!;
}
