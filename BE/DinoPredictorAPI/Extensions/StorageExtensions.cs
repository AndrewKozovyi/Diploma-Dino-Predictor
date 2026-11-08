using CloudinaryDotNet;
using Microsoft.Extensions.Options;

namespace DinoPredictorAPI.Extensions;

public static class StorageExtensions
{
    public static IServiceCollection AddImageStorage(this IServiceCollection services)
    {
        services
            .AddOptions<CloudinaryOptions>()
            .BindConfiguration(CloudinaryOptions.Section)
            .ValidateDataAnnotations()
            .ValidateOnStart();

        services.AddSingleton(provider =>
        {
            var options = provider.GetRequiredService<IOptions<CloudinaryOptions>>().Value;
            return new Cloudinary(new Account(options.CloudName, options.ApiKey, options.ApiSecret));
        });
        services.AddSingleton<IImageStorage, CloudinaryImageStorage>();

        return services;
    }
}
