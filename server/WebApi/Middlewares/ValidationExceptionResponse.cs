using System.Net;

namespace FanHub.Middlewares
{
    public record ValidationExceptionResponse(
        string Message,
        List<string> Errors,
        HttpStatusCode StatusCode,
        DateTime Time
    );
}
