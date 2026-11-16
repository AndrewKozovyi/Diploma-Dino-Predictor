namespace DinoPredictorAPI.Interfaces;

public interface IDinoTypesService
{
    Task<IReadOnlyList<DinoTypeDto>> GetAllAsync(CancellationToken ct);
}
