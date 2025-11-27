using Application.Options;
using Application.PasswordHasher;
using Application.Tools;
using Domain.Foundations;
using Domain.Repositories;
using Infrastructure.Foundations;
using Infrastructure.PasswordHashers;
using Infrastructure.Repositories;
using Infrastructure.Tools;
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
            services.AddDbContext<FanHubDbContext>( op =>
                op.UseInMemoryDatabase( databaseName: "FanHub" ) );

            services.AddScoped<IUnitOfWork, UnitOfWork>();

            services.AddScoped<IPasswordHasher, PasswordHasher>();
            services.AddScoped<IImageTools, ImageTools>();
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