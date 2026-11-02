namespace DinoPredictorAPI.Infrastructure;

public static class UploadLimits
{
    public const long MaxFileSizeBytes = 10 * 1024 * 1024; // 10 MB

    /// <summary>Protects memory: a small compressed file can decode into gigabytes of pixels.</summary>
    public const int MaxImageDimension = 12_000;
}
