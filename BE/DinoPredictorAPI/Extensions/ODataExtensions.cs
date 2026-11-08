using Microsoft.AspNetCore.OData;

namespace DinoPredictorAPI.Extensions;

public static class ODataExtensions
{
    public static IMvcBuilder AddODataApi(this IMvcBuilder mvc) =>
        mvc.AddOData(options =>
        {
            options.Filter().OrderBy().SetMaxTop(SafeEnableQueryAttribute.MaxPageSize);
            options.TimeZone = TimeZoneInfo.Utc;
        });
}
