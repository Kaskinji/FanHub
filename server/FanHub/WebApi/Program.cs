using Application;
using Application.Options;
using FanHub.Middlewares;
using Infrastructure;
using Serilog;
using Serilog.Events;
using WebApi.Bindings;
using WebApi.Extensions;
using WebApi.Options;
using HttpOnlyPolicy = Microsoft.AspNetCore.CookiePolicy.HttpOnlyPolicy;

public class Program
{
    public static async Task Main()
    {
        WebApplicationBuilder builder = WebApplication.CreateBuilder();

        builder.Services.AddInfrastructure( builder.Configuration );
        builder.Services.AddApplication();
        builder.Services.AddControllers();

        builder.Services.AddEndpointsApiExplorer();

        Log.Logger = new LoggerConfiguration()
            .ReadFrom.Configuration( builder.Configuration )
            .Enrich.FromLogContext()
            .WriteTo.Console( outputTemplate: LoggerConfig.LogFormat )
            .WriteTo.File( "logs/errors/log-.txt", outputTemplate: LoggerConfig.LogFormat, restrictedToMinimumLevel: LogEventLevel.Warning, rollingInterval: RollingInterval.Day )
            .WriteTo.File( "logs/info/log-.txt", outputTemplate: LoggerConfig.LogFormat, rollingInterval: RollingInterval.Day )
            .CreateLogger();

        builder.Host.UseSerilog();

        builder.Services.Configure<JwtOptions>( builder.Configuration.GetSection( "JwtOptions" ) );
        builder.Services.Configure<FileToolsOptions>( builder.Configuration.GetSection( "FileToolsOptions" ) );
        builder.Services.Configure<AuthCookieOptions>( builder.Configuration.GetSection( "AuthCookieOptions" ) );

        builder.Services.AddAutoMapper( typeof( WebApi.Mapping.UserProfile ).Assembly );
        builder.Services.AddAutoMapper( typeof( WebApi.Mapping.FandomProfile ).Assembly );
        builder.Services.AddAutoMapper( typeof( WebApi.Mapping.EventProfile ).Assembly );
        builder.Services.AddAutoMapper( typeof( WebApi.Mapping.CommentProfile ).Assembly );
        builder.Services.AddAutoMapper( typeof( WebApi.Mapping.PostProfile ).Assembly );
        builder.Services.AddAutoMapper( typeof( WebApi.Mapping.ReactionProfile ).Assembly );
        builder.Services.AddAutoMapper( typeof( WebApi.Mapping.SubscriptionProfile ).Assembly );

        builder.Services.AddJwtAuthAndSwagger( builder.Configuration );

        builder.Services.AddCors( options =>
        {
            options.AddPolicy( "AllowFrontend", policy =>
            {
                policy.WithOrigins(
                    "http://localhost:5173"
                )
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
            } );
        } );

        WebApplication app = builder.Build();

        app.UseStaticFiles( new StaticFileOptions
        {
            OnPrepareResponse = ctx =>
            {
                string path = ctx.File.Name;

                if ( path.EndsWith( ".jpg" ) ||
                    path.EndsWith( ".jpeg" ) ||
                    path.EndsWith( ".png" ) ||
                    path.EndsWith( ".webp" ) ||
                    path.EndsWith( ".gif" ) )
                {
                    if ( path.Contains( "_v" ) || path.Contains( "?v=" ) )
                    {
                        ctx.Context.Response.Headers.CacheControl =
                            "public, max-age=31536000, immutable";
                    }
                    else
                    {
                        ctx.Context.Response.Headers.CacheControl =
                            "public, max-age=31536000";
                    }
                }
            }
        } );

        app.UseCors( "AllowFrontend" );
        app.UseCookiePolicy( new CookiePolicyOptions
        {
            MinimumSameSitePolicy = SameSiteMode.Strict,
            HttpOnly = HttpOnlyPolicy.Always,
            Secure = CookieSecurePolicy.None,
        } );

        if ( app.Environment.IsDevelopment() )
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();
        using ( IServiceScope scope = app.Services.CreateScope() )
        {
            DataSeeder seeder = scope.ServiceProvider.GetRequiredService<DataSeeder>();
            await seeder.SeedAsync();
        }

        app.UseRouting();

        app.UseAuthentication();

        app.UseAuthorization();

        app.MapControllers();

        app.UseMiddleware<ExceptionMiddleware>();

        app.Run();
    }
}