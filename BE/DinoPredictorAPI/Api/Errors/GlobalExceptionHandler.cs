using DinoPredictorAPI.Infrastructure;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace DinoPredictorAPI.Api;

public sealed partial class GlobalExceptionHandler(
    IProblemDetailsService problemDetails,
    ILogger<GlobalExceptionHandler> logger
) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken
    )
    {
        var problem = exception switch
        {
            InvalidImageException invalidImage => new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Invalid image",
                Detail = exception.Message,
                Extensions = { ["code"] = invalidImage.Code, ["params"] = invalidImage.Parameters },
            },
            _ => new ProblemDetails
            {
                Status = StatusCodes.Status500InternalServerError,
                Title = "An unexpected error occurred",
                Extensions = { ["code"] = "unexpected" },
            },
        };

        if (problem.Status == StatusCodes.Status500InternalServerError)
        {
            LogUnhandledException(logger, exception, httpContext.Request.Path);
        }

        httpContext.Response.StatusCode = problem.Status!.Value;
        return await problemDetails.TryWriteAsync(
            new ProblemDetailsContext
            {
                HttpContext = httpContext,
                Exception = exception,
                ProblemDetails = problem,
            }
        );
    }

    [LoggerMessage(Level = LogLevel.Error, Message = "Unhandled exception on {Path}")]
    private static partial void LogUnhandledException(ILogger logger, Exception exception, string path);
}
