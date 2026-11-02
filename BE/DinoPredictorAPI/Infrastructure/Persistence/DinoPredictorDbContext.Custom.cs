using Microsoft.EntityFrameworkCore;

namespace DinoPredictorAPI.Infrastructure;

public partial class DinoPredictorDbContext
{
    protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder) =>
        configurationBuilder.Properties<DateTime>().HaveConversion<UtcDateTimeConverter>();
}
