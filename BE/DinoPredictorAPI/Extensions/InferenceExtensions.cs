using DinoPredictorAPI.Infrastructure;
using DinoPredictorAPI.Interfaces;

namespace DinoPredictorAPI.Extensions;

public static class InferenceExtensions
{
    public static IServiceCollection AddInference(this IServiceCollection services)
    {
        services.AddOptions<ModelOptions>().BindConfiguration(ModelOptions.Section);
        services.AddSingleton<IImagePreprocessor, ImagePreprocessor>();
        services.AddSingleton<IDinoClassifier, DinoClassifier>();
        services.AddSingleton<ICamRenderer, CamRenderer>();
        services.AddHostedService<ModelLabelsValidator>();

        return services;
    }
}
