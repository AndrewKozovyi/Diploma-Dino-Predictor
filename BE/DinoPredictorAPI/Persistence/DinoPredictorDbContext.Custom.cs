using DinoPredictorAPI.Persistence.Converters;
using Microsoft.EntityFrameworkCore;

namespace DinoPredictorAPI.Persistence;

public partial class DinoPredictorDbContext
{
    protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder) =>
        configurationBuilder.Properties<DateTime>().HaveConversion<UtcDateTimeConverter>();
}
