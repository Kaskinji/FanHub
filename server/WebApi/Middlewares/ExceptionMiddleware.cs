using System.Net;
using FluentValidation;

namespace FanHub.Middlewares
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private ILogger<ExceptionMiddleware> _logger;

        public ExceptionMiddleware( RequestDelegate next, ILogger<ExceptionMiddleware> logger )
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync( HttpContext context )
        {
            try
            {
                await _next( context );
            }
            catch ( ArgumentException ex )
            {
                _logger.LogWarning( ex, "Bad request: {Message}", ex.Message );
                await HandleExceptionAsync( context, ex, HttpStatusCode.BadRequest );
            }
            catch ( ValidationException ex )
            {
                _logger.LogWarning( ex, "Validation failed: {ErrorCount} errors", ex.Errors.Count() );
                await HandleValidationExceptionAsync( context, ex );
            }
            catch ( KeyNotFoundException ex )
            {
                _logger.LogWarning( ex, "Resource not found" );
                await HandleExceptionAsync( context, ex, HttpStatusCode.NotFound );
            }
            catch ( UnauthorizedAccessException ex )
            {
                _logger.LogWarning( ex, "Unauthorized access attempt" );
                await HandleExceptionAsync( context, ex, HttpStatusCode.Unauthorized );
            }
            catch ( Exception ex )
            {
                _logger.LogError( ex, "Unhandled exception at {Path}", context.Request.Path );
                await HandleExceptionAsync( context, ex, HttpStatusCode.InternalServerError );
            }
        }

        private static Task HandleExceptionAsync( HttpContext context, Exception exception, HttpStatusCode statusCode )
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = ( int )statusCode;

            ExceptionResponse response = new
            (
                exception.Message,
                statusCode,
                DateTime.UtcNow
            );

            return context.Response.WriteAsJsonAsync( response );
        }
        private static Task HandleValidationExceptionAsync( HttpContext context, ValidationException ex )
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = ( int )HttpStatusCode.BadRequest;

            List<string> errorMessages = ex.Errors
                .Select( error => $"{error.PropertyName}: {error.ErrorMessage}" )
                .ToList();

            ValidationExceptionResponse response = new
            (
                "Validation failed",
                errorMessages,
                HttpStatusCode.BadRequest,
                DateTime.UtcNow
            );

            return context.Response.WriteAsJsonAsync( response );
        }
    }
}

