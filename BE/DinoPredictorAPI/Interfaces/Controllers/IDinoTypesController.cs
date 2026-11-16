namespace DinoPredictorAPI.Interfaces;

public interface IDinoTypesController
{
    Task<IReadOnlyList<DinoTypeDto>> GetAll(CancellationToken ct);
}
