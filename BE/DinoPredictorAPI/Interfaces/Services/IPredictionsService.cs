using Microsoft.AspNetCore.OData.Query;

namespace DinoPredictorAPI.Interfaces;

public interface IPredictionsService
{
    Task<PageDto<PredictionSummaryDto>> GetSummaries(
        ODataQueryOptions<PredictionSummaryDto> query,
        CancellationToken ct
    );

    Task<PredictionDetailsDto> GetByIdAsync(Guid id, CancellationToken ct);

    Task<PredictionDetailsDto> CreateAsync(IFormFile image, CancellationToken ct);
}
