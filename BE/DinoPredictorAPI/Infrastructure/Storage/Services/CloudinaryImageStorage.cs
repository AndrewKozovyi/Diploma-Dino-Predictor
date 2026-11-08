using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;

namespace DinoPredictorAPI.Infrastructure;

public sealed class CloudinaryImageStorage(Cloudinary cloudinary, IOptions<CloudinaryOptions> options) : IImageStorage
{
    public async Task DeleteAsync(IReadOnlyCollection<string> publicIds, CancellationToken ct)
    {
        if (publicIds.Count == 0)
        {
            return;
        }

        var result = await cloudinary.DeleteResourcesAsync(new DelResParams { PublicIds = [.. publicIds] }, ct);
        if (result.Error is not null)
        {
            throw new InvalidOperationException(GenerateFailedMessage("delete", result.Error.Message));
        }
    }

    public string GetUrl(string publicId)
    {
        return cloudinary
            .Api.UrlImgUp.Secure()
            .Transform(new Transformation().FetchFormat("auto").Quality("auto"))
            .BuildUrl(publicId);
    }

    public async Task<string> UploadAsync(Stream image, CancellationToken ct)
    {
        var result = await cloudinary.UploadAsync(
            new ImageUploadParams
            {
                File = new FileDescription($"{Guid.NewGuid():N}.jpg", image),
                Folder = options.Value.Folder,
            }
        );

        return result.Error is null
            ? result.PublicId
            : throw new InvalidOperationException(GenerateFailedMessage("upload", result.Error.Message));
    }

    private static string GenerateFailedMessage(string typeOfAction, string resultErrorMessage)
    {
        return $"Cloudinary {typeOfAction} failed: {resultErrorMessage}";
    }
}
