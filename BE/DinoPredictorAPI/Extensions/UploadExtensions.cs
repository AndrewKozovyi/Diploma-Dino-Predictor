using Microsoft.AspNetCore.Http.Features;

namespace DinoPredictorAPI.Extensions;

public static class UploadExtensions
{
    private const long MultipartOverheadBytes = 64 * 1024;

    public static WebApplicationBuilder AddUploadLimits(this WebApplicationBuilder builder)
    {
        builder.Services.Configure<FormOptions>(form => form.MultipartBodyLengthLimit = UploadLimits.MaxFileSizeBytes);
        builder.WebHost.ConfigureKestrel(kestrel =>
            kestrel.Limits.MaxRequestBodySize = UploadLimits.MaxFileSizeBytes + MultipartOverheadBytes
        );

        return builder;
    }
}
