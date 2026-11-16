namespace DinoPredictorAPI.Application;

public sealed class DinoTypesService(DinoPredictorDbContext db, IRequestLanguage language) : IDinoTypesService
{
    public async Task<IReadOnlyList<DinoTypeDto>> GetAllAsync(CancellationToken ct)
    {
        return await db
            .DinoTypes.AsNoTracking()
            .Select(DinoTypeMappings.ToDto(language.Code))
            .OrderBy(x => x.Name)
            .ToListAsync(ct);
    }
}
