namespace DinoPredictorAPI.Infrastructure;

public sealed class InvalidImageException(
    string code,
    string message,
    IReadOnlyDictionary<string, object>? parameters = null,
    Exception? innerException = null
) : Exception(message, innerException)
{
    public string Code { get; } = code;

    public IReadOnlyDictionary<string, object> Parameters { get; } = parameters ?? new Dictionary<string, object>();
}
