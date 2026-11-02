namespace DinoPredictorAPI.Api;

public sealed class PredictionDetailsDto
{
    public Guid Id { get; init; }

    public DateTime CreatedAt { get; init; }

    public string OriginalFileName { get; init; } = null!;

    public string ImageUrl { get; init; } = null!;

    public string? CamImageUrl { get; init; }

    public string ModelVersion { get; init; } = null!;

    public int ProcessingMs { get; init; }

    /// <summary>Top-5, sorted by rank; the first one is the predicted species.</summary>
    public IReadOnlyList<PredictionCandidateDto> Candidates { get; init; } = [];
}
