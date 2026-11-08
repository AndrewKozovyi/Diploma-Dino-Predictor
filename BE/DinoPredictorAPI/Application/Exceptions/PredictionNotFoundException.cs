namespace DinoPredictorAPI.Application;

public sealed class PredictionNotFoundException(Guid id) : Exception($"Prediction {id} was not found.")
{
    public const string Code = "prediction.notFound";
}
