using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;

namespace DinoPredictorAPI.Interfaces;

public interface IPredictionsController
{
    Task<PageDto<PredictionSummaryDto>> GetSummaries(
        ODataQueryOptions<PredictionSummaryDto> query,
        CancellationToken ct
    );

    Task<PredictionDetailsDto> GetById(Guid id, CancellationToken ct);

    Task<ActionResult<PredictionDetailsDto>> Create(IFormFile image, CancellationToken ct);
}
