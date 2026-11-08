using System.Linq.Expressions;

namespace DinoPredictorAPI.Application;

public static class PredictionMappings
{
    public static Expression<Func<PredictHistoryResult, PredictionSummaryDto>> ToSummary(string language) =>
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
                    x.DinoType.DinoTypeTranslations.Where(t => t.Language.Code == language)
                        .Select(t => t.Name)
                        .FirstOrDefault()
                    ?? x.DinoType.Code,
            },
        };
}
