using DinoPredictorAPI.Infrastructure;
using DinoPredictorAPI.Interfaces;

namespace DinoPredictorAPI.Extensions;

public static class LocalizationExtensions
{
    public static IServiceCollection AddRequestLanguages(this IServiceCollection services)
    {
        services.AddHttpContextAccessor();
        services.AddScoped<IRequestLanguage, RequestLanguage>();

        return services;
    }
}
