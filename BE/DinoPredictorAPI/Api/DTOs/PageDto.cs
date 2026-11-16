namespace DinoPredictorAPI.Api;

public sealed class PageDto<T>
{
    public IReadOnlyList<T> Items { get; init; } = [];
    public int Count { get; init; }
}
