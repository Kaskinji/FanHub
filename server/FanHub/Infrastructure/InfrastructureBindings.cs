using Domain.Foundations;
using Domain.Repositories;
using Infrastructure.Foundations;
using Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure
{
    public static class InfrastructureBindings
    {
        public static IServiceCollection AddInfrastructure(
            this IServiceCollection services,
            IConfiguration configuration )
        {
            //string connectionString = configuration.GetConnectionString( "DefaultConnection" )
            //    ?? throw new ArgumentNullException( "Connection string 'DefaultConnection' not found" );

            services.AddDbContext<FanHubDbContext>( op =>
                op.UseInMemoryDatabase( databaseName: "FanHub" ) );

            services.AddScoped<IUnitOfWork, UnitOfWork>();

            services.AddScoped<ICategoryRepository, CategoryRepository>();
            services.AddScoped<ICommentRepository, CommentRepository>();
            services.AddScoped<IEventRepository, EventRepository>();
            services.AddScoped<IFandomRepository, FandomRepository>();
            services.AddScoped<IGameRepository, GameRepository>();
            services.AddScoped<INotificationRepository, NotificationRepository>();
            services.AddScoped<IPostRepository, PostRepository>();
            services.AddScoped<IReactionRepository, ReactionRepository>();
            services.AddScoped<ISubscriptionRepository, SubscriptionRepository>();
            services.AddScoped<IUserRepository, UserRepository>();

            return services;
        }
    }
}