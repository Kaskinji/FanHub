using System.Net;
using FluentValidation;

namespace FanHub.Middlewares
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;

        public ExceptionMiddleware( RequestDelegate next )
        {
            _next = next;
        }

        public async Task InvokeAsync( HttpContext context )
        {
            try
            {
                await _next( context );
            }
            catch ( ArgumentException ex )
            {
                await HandleExceptionAsync( context, ex, HttpStatusCode.BadRequest );
            }
            catch ( ValidationException ex )
            {
                await HandleValidationExceptionAsync( context, ex );
            }
            catch ( KeyNotFoundException ex )
            {
                await HandleExceptionAsync( context, ex, HttpStatusCode.NotFound );
            }
            catch ( UnauthorizedAccessException ex )
            {
                await HandleExceptionAsync( context, ex, HttpStatusCode.Unauthorized );
            }
            catch ( Exception ex )
            {
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

