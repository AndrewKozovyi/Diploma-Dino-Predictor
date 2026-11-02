using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace DinoPredictorAPI.Infrastructure;

internal sealed class UtcDateTimeConverter() : ValueConverter<DateTime, DateTime>(
    value => value,
    value => DateTime.SpecifyKind(value, DateTimeKind.Utc));
