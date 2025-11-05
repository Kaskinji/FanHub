using System.Net;

namespace FanHub.Middlewares
{
    public record ExceptionResponse(
        string Message,
        HttpStatusCode StatusCode,
        DateTime Time
    );
}
