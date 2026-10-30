using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace DinoPredictorAPI.Persistence.Converters;

internal sealed class UtcDateTimeConverter() : ValueConverter<DateTime, DateTime>(
    value => value,
    value => DateTime.SpecifyKind(value, DateTimeKind.Utc));
