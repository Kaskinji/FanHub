using Application;
using Application.Options;
using FanHub.Middlewares;
using Infrastructure;
using WebApi.Bindings;

public class Program
{
    public static async Task Main()
    {
        WebApplicationBuilder builder = WebApplication.CreateBuilder();

        builder.Services.AddInfrastructure( builder.Configuration );
        builder.Services.AddApplication();
        builder.Services.AddControllers();

        builder.Services.AddEndpointsApiExplorer();

        builder.Services.Configure<JwtOptions>( builder.Configuration.GetSection( "JwtOptions" ) );
        builder.Services.Configure<FileToolsOptions>( builder.Configuration.GetSection( "FileToolsOptions" ) );
        builder.Services.AddJwtAuthAndSwagger( builder.Configuration );

        WebApplication app = builder.Build();

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