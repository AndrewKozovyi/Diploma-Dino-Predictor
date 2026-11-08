namespace DinoPredictorAPI.Interfaces;

public interface IPredictionsService
{
    IQueryable<PredictionSummaryDto> GetSummaries();

    Task<PredictionDetailsDto> GetByIdAsync(Guid id, CancellationToken ct);

    Task<PredictionDetailsDto> CreateAsync(IFormFile image, CancellationToken ct);
}
