using DinoPredictorAPI.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace DinoPredictorAPI.Api;

[ApiController]
[Route("api/[controller]")]
public sealed class PredictionsController(IPredictionsService predictions) : ControllerBase, IPredictionsController
{
    [HttpGet]
    [SafeEnableQuery(AllowedOrderByProperties = "CreatedAt,Probability")]
    public IQueryable<PredictionSummaryDto> GetSummaries() => predictions.GetSummaries();

    [HttpPost]
    public async Task<ActionResult<PredictionDetailsDto>> Create(IFormFile image, CancellationToken ct) =>
        Created((string?)null, await predictions.CreateAsync(image, ct));
}
