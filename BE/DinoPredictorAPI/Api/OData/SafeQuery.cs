using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Query.Validator;

namespace DinoPredictorAPI.Api;

public static class SafeQuery
{
    public const int MaxPageSize = 50;

    private static readonly ODataQuerySettings Settings = new()
    {
        HandleNullPropagation = HandleNullPropagationOption.False,
        EnsureStableOrdering = false,
        TimeZone = TimeZoneInfo.Utc,
    };

    public static ODataValidationSettings Validation(params string[] orderByProperties)
    {
        var validation = new ODataValidationSettings
        {
            AllowedQueryOptions =
                AllowedQueryOptions.Filter
                | AllowedQueryOptions.OrderBy
                | AllowedQueryOptions.Top
                | AllowedQueryOptions.Skip,
            AllowedFunctions = AllowedFunctions.None,
            AllowedArithmeticOperators = AllowedArithmeticOperators.None,
            AllowedLogicalOperators =
                AllowedLogicalOperators.And
                | AllowedLogicalOperators.Equal
                | AllowedLogicalOperators.GreaterThan
                | AllowedLogicalOperators.GreaterThanOrEqual
                | AllowedLogicalOperators.LessThan
                | AllowedLogicalOperators.LessThanOrEqual,
            MaxTop = MaxPageSize,
            MaxNodeCount = 20,
        };

        foreach (var property in orderByProperties)
        {
            validation.AllowedOrderByProperties.Add(property);
        }

        return validation;
    }

    public static async Task<PageDto<T>> ToPageAsync<T>(
        this IQueryable<T> source,
        ODataQueryOptions<T> options,
        ODataValidationSettings validation,
        CancellationToken ct
    )
    {
        options.Validate(validation);

        var filtered = options.Filter is null ? source : (IQueryable<T>)options.Filter.ApplyTo(source, Settings);
        var count = await filtered.CountAsync(ct);
        var ordered = options.OrderBy is null ? filtered : options.OrderBy.ApplyTo(filtered, Settings);
        var skipped = options.Skip is null ? ordered : options.Skip.ApplyTo(ordered, Settings);
        var items = await skipped.Take(options.Top?.Value ?? MaxPageSize).ToListAsync(ct);

        return new PageDto<T> { Items = items, Count = count };
    }
}
