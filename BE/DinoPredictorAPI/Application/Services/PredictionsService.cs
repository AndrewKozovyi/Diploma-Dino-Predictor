using System.Globalization;
using DinoPredictorAPI.Api;
using DinoPredictorAPI.Infrastructure;
using DinoPredictorAPI.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DinoPredictorAPI.Application;

public sealed class PredictionsService(DinoPredictorDbContext db) : IPredictionsService
{
    public IQueryable<PredictionSummaryDto> GetSummaries()
    {
        var culture = CultureInfo.CurrentUICulture.TwoLetterISOLanguageName;

        return db
            .PredictHistoryResults.AsNoTracking()
            .Where(x => x.Rank == 1)
            .Select(PredictionMappings.ToSummary(culture))
            .OrderByDescending(p => p.CreatedAt)
            .ThenByDescending(p => p.Id);
    }

    public Task<PredictionDetailsDto> CreateAsync(IFormFile image, CancellationToken ct) =>
        throw new NotImplementedException();
}
