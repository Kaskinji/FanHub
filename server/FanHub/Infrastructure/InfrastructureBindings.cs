using Application.PasswordHasher;
using Application.Services.Auth;
using Application.Tools;
using Domain.Foundations;
using Domain.Repositories;
using Infrastructure.Auth;
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
            services.AddDbContext<FanHubDbContext>( options =>
                options.UseSqlServer( configuration.GetConnectionString( "DefaultConnection" ) ) );

            services.AddScoped<IUnitOfWork, UnitOfWork>();

            services.AddScoped<IImageTools, ImageTools>();

            services.AddScoped<ITokenGenerator, JwtTokenGenerator>();
            services.AddScoped<ITokenValidator, JwtTokenValidator>();

            services.AddScoped<IPasswordHasher, PasswordHasher>();
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

            services.AddScoped<DataSeeder>();

            return services;
        }
    }
}