using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;

namespace DinoPredictorAPI.Api;

[ApiController]
[Route("api/[controller]")]
public sealed class PredictionsController(IPredictionsService predictions) : ControllerBase, IPredictionsController
{
    [HttpGet]
    public Task<PageDto<PredictionSummaryDto>> GetSummaries(
        ODataQueryOptions<PredictionSummaryDto> query,
        CancellationToken ct
    )
    {
        return predictions.GetSummaries(query, ct);
    }

    [HttpGet("{id:guid}")]
    public Task<PredictionDetailsDto> GetById(Guid id, CancellationToken ct) => predictions.GetByIdAsync(id, ct);

    [HttpPost]
    public async Task<ActionResult<PredictionDetailsDto>> Create(IFormFile image, CancellationToken ct)
    {
        var details = await predictions.CreateAsync(image, ct);
        return CreatedAtAction(nameof(GetById), new { id = details.Id }, details);
    }
}
