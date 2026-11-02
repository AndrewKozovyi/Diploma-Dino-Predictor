using System.Linq.Expressions;
using DinoPredictorAPI.Api;
using DinoPredictorAPI.Infrastructure;

namespace DinoPredictorAPI.Application;

public static class PredictionMappings
{
    public static Expression<Func<PredictHistoryResult, PredictionSummaryDto>> ToSummary(string culture) =>
        x => new PredictionSummaryDto
        {
            Id = x.RequestId,
            CreatedAt = x.Request.CreatedAt,
            OriginalFileName = x.Request.OriginalFileName,
            Probability = x.Probability,
            DinoType = new DinoTypeDto
            {
                Code = x.DinoType.Code,
                Name =
                    x.DinoType.DinoTypeTranslations.Where(t => t.Culture == culture)
                        .Select(t => t.Name)
                        .FirstOrDefault()
                    ?? x.DinoType.Code,
            },
        };
}
