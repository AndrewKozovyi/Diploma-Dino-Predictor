namespace DinoPredictorAPI.Infrastructure;

/// <param name="Candidates">Top-5 sorted by probability; the first one is the predicted class.</param>
/// <param name="Cam">Class activation map of the predicted class.</param>
public sealed record ClassificationResult(IReadOnlyList<ClassPrediction> Candidates, float[,] Cam);
