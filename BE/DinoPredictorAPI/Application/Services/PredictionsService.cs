namespace DinoPredictorAPI.Application;

public sealed class PredictionsService(DinoPredictorDbContext db, IRequestLanguage language) : IPredictionsService
{
    public IQueryable<PredictionSummaryDto> GetSummaries()
    {
        return db
            .PredictHistoryResults.AsNoTracking()
            .Where(x => x.Rank == 1)
            .Select(PredictionMappings.ToSummary(language.Code))
            .OrderByDescending(p => p.CreatedAt)
            .ThenByDescending(p => p.Id);
    }

    public Task<PredictionDetailsDto> CreateAsync(IFormFile image, CancellationToken ct) =>
        throw new NotImplementedException();
}
