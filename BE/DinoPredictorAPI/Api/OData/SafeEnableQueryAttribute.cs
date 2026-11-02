using Microsoft.AspNetCore.OData.Query;

namespace DinoPredictorAPI.Api;

public sealed class SafeEnableQueryAttribute : EnableQueryAttribute
{
    public const int MaxPageSize = 50;

    public SafeEnableQueryAttribute()
    {
        AllowedQueryOptions = AllowedQueryOptions.Filter | AllowedQueryOptions.OrderBy
            | AllowedQueryOptions.Top | AllowedQueryOptions.Skip;
        AllowedFunctions = AllowedFunctions.None;
        AllowedArithmeticOperators = AllowedArithmeticOperators.None;
        AllowedLogicalOperators = AllowedLogicalOperators.And | AllowedLogicalOperators.Equal
            | AllowedLogicalOperators.GreaterThan | AllowedLogicalOperators.GreaterThanOrEqual
            | AllowedLogicalOperators.LessThan | AllowedLogicalOperators.LessThanOrEqual;
        MaxTop = MaxPageSize;
        PageSize = MaxPageSize;
        MaxNodeCount = 20;
        HandleNullPropagation = HandleNullPropagationOption.False;
        EnsureStableOrdering = false;
    }
}