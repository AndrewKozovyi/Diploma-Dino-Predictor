namespace DinoPredictorAPI.Extensions;

public static class CorsExtensions
{
    private const string AllowedOriginsKey = "Cors:AllowedOrigins";

    public static IServiceCollection AddFrontendCors(this IServiceCollection services, IConfiguration configuration)
    {
        var origins = configuration.GetSection(AllowedOriginsKey).Get<string[]>() ?? [];

        services.AddCors(options =>
            options.AddDefaultPolicy(policy => policy.WithOrigins(origins).AllowAnyHeader().AllowAnyMethod())
        );

        return services;
    }
}
