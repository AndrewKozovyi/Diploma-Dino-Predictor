namespace DinoPredictorAPI.Infrastructure;

public sealed class ModelOptions
{
    public const string Section = "Model";

    public string Directory { get; init; } = null!;
}
