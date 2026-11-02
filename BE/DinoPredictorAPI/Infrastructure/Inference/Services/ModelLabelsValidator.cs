using DinoPredictorAPI.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DinoPredictorAPI.Infrastructure;

/// <summary>
/// Fails the startup if the model can predict a class missing from DinoTypes. It also creates the classifier,
/// so a missing or corrupted model file is reported on startup instead of on the first request.
/// </summary>
internal sealed class ModelLabelsValidator(IDinoClassifier classifier, IServiceScopeFactory scopes) : IHostedService
{
    public async Task StartAsync(CancellationToken cancellationToken)
    {
        await using var scope = scopes.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<DinoPredictorDbContext>();

        var knownCodes = await db.DinoTypes.AsNoTracking().Select(t => t.Code).ToListAsync(cancellationToken);
        var missing = classifier.Labels.Except(knownCodes).ToArray();

        if (missing.Length > 0)
        {
            throw new InvalidOperationException(
                $"Model labels are missing from DinoTypes: {string.Join(", ", missing)}.");
        }
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}
