namespace DinoPredictorAPI.Persistence;

public sealed class DatabaseOptions
{
    public const string Section = "Database";

    public bool AutoMigrate { get; init; }

    public bool CreateIfMissing { get; init; }
}
