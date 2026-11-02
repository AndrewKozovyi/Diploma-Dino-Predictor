using DinoPredictorAPI.Api;

namespace DinoPredictorAPI.Interfaces;

public interface IPredictionsService
{
    IQueryable<PredictionSummaryDto> GetSummaries();

    Task<PredictionDetailsDto> CreateAsync(IFormFile image, CancellationToken ct);
}
