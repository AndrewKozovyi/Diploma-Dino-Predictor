using System.Diagnostics;

namespace DinoPredictorAPI.Application;

public sealed class PredictionsService(
    DinoPredictorDbContext db,
    IRequestLanguage language,
    IImagePreprocessor preprocessor,
    IDinoClassifier classifier,
    ICamRenderer сamRenderer,
    IImageStorage storage
) : IPredictionsService
{
    private const int MaxFileNameLength = 255;

    public IQueryable<PredictionSummaryDto> GetSummaries()
    {
        return db
            .PredictHistoryResults.AsNoTracking()
            .Where(x => x.Rank == 1)
            .Select(PredictionMappings.ToSummary(language.Code))
            .OrderByDescending(p => p.CreatedAt)
            .ThenByDescending(p => p.Id);
    }

    public async Task<PredictionDetailsDto> GetByIdAsync(Guid id, CancellationToken ct)
    {
        return await db
                .PredictHistoryRequests.AsNoTracking()
                .Where(x => x.Id == id)
                .Select(PredictionMappings.ToDetails(language.Code, storage))
                .FirstOrDefaultAsync(ct)
            ?? throw new PredictionNotFoundException(id);
    }

    public async Task<PredictionDetailsDto> CreateAsync(IFormFile image, CancellationToken ct)
    {
        var stopwatch = Stopwatch.StartNew();

        await using var upload = image.OpenReadStream();
        using var prepared = preprocessor.Prepare(upload);
        var classification = classifier.Classify(prepared.Tensor);

        var fileName = Path.GetFileName(image.FileName);
        var request = new PredictHistoryRequest
        {
            Id = Guid.NewGuid(),
            CreatedAt = DateTime.UtcNow,
            OriginalFileName = fileName[..Math.Min(fileName.Length, MaxFileNameLength)],
            ModelVersion = classifier.ModelVersion,
            ProcessingMs = (int)stopwatch.ElapsedMilliseconds,
            PredictHistoryResults = await ToResultAsync(classification.Candidates, ct),
        };

        var uploaded = new List<string>();
        try
        {
            using (var original = prepared.ToCleanJpeg())
            {
                request.ImagePublicId = await storage.UploadAsync(original, ct);
                uploaded.Add(request.ImagePublicId);
            }

            using (var cam = сamRenderer.Render(prepared.ModelView, classification.Cam))
            {
                request.CamImagePublicId = await storage.UploadAsync(cam, ct);
                uploaded.Add(request.CamImagePublicId);
            }

            db.PredictHistoryRequests.Add(request);
            await db.SaveChangesAsync(ct);
        }
        catch
        {
            await storage.DeleteAsync(uploaded, CancellationToken.None);
            throw;
        }

        return await GetByIdAsync(request.Id, ct);
    }

    private async Task<List<PredictHistoryResult>> ToResultAsync(
        IReadOnlyList<ClassPrediction> candidates,
        CancellationToken ct
    )
    {
        var codes = candidates.Select(c => c.Code).ToArray();

        var ids = await db
            .DinoTypes.AsNoTracking()
            .Where(t => codes.Contains(t.Code))
            .ToDictionaryAsync(t => t.Code, t => t.Id, ct);

        return candidates
            .Select(
                (candidate, index) =>
                    new PredictHistoryResult
                    {
                        DinoTypeId = ids[candidate.Code],
                        Rank = (byte)(index + 1),
                        Probability = Math.Round((decimal)Math.Clamp(candidate.Probability, 0f, 1f), 4),
                    }
            )
            .ToList();
    }
}
