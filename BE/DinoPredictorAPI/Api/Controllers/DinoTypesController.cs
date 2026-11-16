using Microsoft.AspNetCore.Mvc;

namespace DinoPredictorAPI.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DinoTypesController(IDinoTypesService dinoTypesService) : ControllerBase, IDinoTypesController
{
    [HttpGet]
    public Task<IReadOnlyList<DinoTypeDto>> GetAll(CancellationToken ct)
    {
        return dinoTypesService.GetAllAsync(ct);
    }
}
