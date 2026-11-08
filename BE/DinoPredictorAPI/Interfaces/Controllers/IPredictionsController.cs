using Microsoft.AspNetCore.Mvc;

namespace DinoPredictorAPI.Interfaces;

public interface IPredictionsController
{
    IQueryable<PredictionSummaryDto> GetSummaries();

    Task<PredictionDetailsDto> GetById(Guid id, CancellationToken ct);

    Task<ActionResult<PredictionDetailsDto>> Create(IFormFile image, CancellationToken ct);
}
