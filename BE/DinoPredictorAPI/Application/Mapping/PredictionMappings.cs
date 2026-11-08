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

    public static Expression<Func<PredictHistoryRequest, PredictionDetailsDto>> ToDetails(
        string language,
        IImageStorage storage
    ) =>
        x => new PredictionDetailsDto
        {
            Id = x.Id,
            CreatedAt = x.CreatedAt,
            OriginalFileName = x.OriginalFileName,
            ImageUrl = storage.GetUrl(x.ImagePublicId),
            CamImageUrl = x.CamImagePublicId == null ? null : storage.GetUrl(x.CamImagePublicId),
            ModelVersion = x.ModelVersion,
            ProcessingMs = x.ProcessingMs,
            Candidates = x
                .PredictHistoryResults.OrderBy(r => r.Rank)
                .Select(r => new PredictionCandidateDto
                {
                    Rank = r.Rank,
                    Probability = r.Probability,
                    DinoType = new DinoTypeDto
                    {
                        Code = r.DinoType.Code,
                        Name =
                            r.DinoType.DinoTypeTranslations.Where(t => t.Language.Code == language)
                                .Select(t => t.Name)
                                .FirstOrDefault()
                            ?? r.DinoType.Code,
                    },
                })
                .ToList(),
        };
}
