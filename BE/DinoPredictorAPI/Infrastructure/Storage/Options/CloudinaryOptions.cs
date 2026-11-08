using System.ComponentModel.DataAnnotations;

namespace DinoPredictorAPI.Infrastructure;

public sealed class CloudinaryOptions
{
    public const string Section = "Cloudinary";

    [Required]
    public string CloudName { get; init; } = null!;

    [Required]
    public string ApiKey { get; init; } = null!;

    [Required]
    public string ApiSecret { get; init; } = null!;

    [Required]
    public string Folder { get; init; } = null!;
}
