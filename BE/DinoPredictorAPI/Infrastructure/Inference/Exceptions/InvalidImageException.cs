namespace DinoPredictorAPI.Infrastructure;

public sealed class InvalidImageException(string message, Exception? innerException = null)
    : Exception(message, innerException);
