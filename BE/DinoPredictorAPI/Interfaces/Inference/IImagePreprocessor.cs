using DinoPredictorAPI.Infrastructure;

namespace DinoPredictorAPI.Interfaces;

public interface IImagePreprocessor
{
    PreparedImage Prepare(Stream image);
}
