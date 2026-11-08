namespace DinoPredictorAPI.Interfaces;

public interface IImageStorage
{
    Task<string> UploadAsync(Stream image, CancellationToken ct);
    Task DeleteAsync(IReadOnlyCollection<string> publicIds, CancellationToken ct);
    string GetUrl(string publicId);
}
