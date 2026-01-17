using Infrastructure.PasswordHashers;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.DesignTime
{
    public class FanHubDbContextFactory : IDesignTimeDbContextFactory<FanHubDbContext>
    {
        public FanHubDbContext CreateDbContext( string[] args )
        {
            IConfigurationRoot configuration = new ConfigurationBuilder()
                .SetBasePath( Path.Combine( Directory.GetCurrentDirectory(), "../WebApi" ) )
                .AddJsonFile( "appsettings.json", optional: true )
                .AddJsonFile( "appsettings.Development.json", optional: true )
                .AddJsonFile( Path.Combine( Directory.GetCurrentDirectory(), "../../WebApi/appsettings.json" ), optional: true )
                .Build();

            string connectionString = configuration.GetConnectionString( "DefaultConnection" )
                ?? "Server=(localdb)\\mssqllocaldb;Database=FanHubDb;Trusted_Connection=True;";

            DbContextOptionsBuilder<FanHubDbContext> optionsBuilder = new();
            optionsBuilder.UseSqlServer( connectionString );

            PasswordHasher hasher = new PasswordHasher();

            return new FanHubDbContext( optionsBuilder.Options, hasher );
        }
    }
}