using DinoPredictorAPI.Interfaces;

namespace DinoPredictorAPI.Infrastructure;

public sealed class RequestLanguage(IHttpContextAccessor httpContextAccessor) : IRequestLanguage
{
    public string Code =>
        httpContextAccessor
            .HttpContext?.Request.GetTypedHeaders()
            .AcceptLanguage.OrderByDescending(language => language.Quality ?? 1)
            .Select(language => language.Value.Value?.Split('-')[0].ToLowerInvariant())
            .FirstOrDefault(code => code is not null && SupportedLanguages.All.Contains(code))
        ?? SupportedLanguages.Default;
}
