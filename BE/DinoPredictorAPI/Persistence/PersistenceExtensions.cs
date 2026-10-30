using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace DinoPredictorAPI.Persistence;

public static class PersistenceExtensions
{
    private const string ConnectionStringName = "Default";

    public static IServiceCollection AddPersistence(
        this IServiceCollection services, IConfiguration configuration, IHostEnvironment environment)
    {
        var connectionString = GetConnectionString(configuration);

        services.AddDbContextPool<DinoPredictorDbContext>(options =>
        {
            options.UseSqlServer(connectionString, sql => sql.EnableRetryOnFailure());

            if (environment.IsDevelopment())
            {
                options.EnableSensitiveDataLogging().EnableDetailedErrors();
            }
        });

        services.AddOptions<DatabaseOptions>().BindConfiguration(DatabaseOptions.Section);
        services.AddHealthChecks().AddDbContextCheck<DinoPredictorDbContext>();

        return services;
    }

    public static void MigrateDatabase(this IHost host)
    {
        var options = host.Services.GetRequiredService<IOptions<DatabaseOptions>>().Value;
        if (!options.AutoMigrate)
        {
            return;
        }

        var configuration = host.Services.GetRequiredService<IConfiguration>();
        DatabaseMigrator.Migrate(GetConnectionString(configuration), options.CreateIfMissing);
    }

    private static string GetConnectionString(IConfiguration configuration) =>
        configuration.GetConnectionString(ConnectionStringName)
        ?? throw new InvalidOperationException(
            $"ConnectionStrings:{ConnectionStringName} is not configured.");
}
