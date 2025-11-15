using Application.Mapping;
using Application.Services;
using Application.Services.Interfaces;
using Domain.Validators;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

namespace Application
{
    public static class ApplicationBindings
    {
        public static IServiceCollection AddApplication(
            this IServiceCollection services )
        {
            services.AddScoped<ICategoryService, CategoryService>();
            services.AddScoped<IFandomService, FandomService>();
            services.AddScoped<IGameService, GameService>();
            services.AddScoped<IPostService, PostService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<ICommentService, CommentService>();
            services.AddScoped<IEventService, EventService>();
            services.AddScoped<INotificationService, NotificationService>();
            services.AddScoped<IReactionService, ReactionService>();
            services.AddScoped<ISubscriptionService, SubscriptionService>();


            services.AddValidatorsFromAssemblyContaining<CategoryValidator>();
            services.AddValidatorsFromAssemblyContaining<FandomValidator>();
            services.AddValidatorsFromAssemblyContaining<GameValidator>();
            services.AddValidatorsFromAssemblyContaining<PostValidator>();
            services.AddValidatorsFromAssemblyContaining<UserValidator>();
            services.AddValidatorsFromAssemblyContaining<CommentValidator>();
            services.AddValidatorsFromAssemblyContaining<EventValidator>();
            services.AddValidatorsFromAssemblyContaining<NotificationValidator>();
            services.AddValidatorsFromAssemblyContaining<ReactionValidator>();
            services.AddValidatorsFromAssemblyContaining<SubscriptionValidator>();
            services.AddValidatorsFromAssemblyContaining<UrlValidator>();


            services.AddAutoMapper( typeof( CategoryProfile ).Assembly );
            services.AddAutoMapper( typeof( FandomProfile ).Assembly );
            services.AddAutoMapper( typeof( GameProfile ).Assembly );
            services.AddAutoMapper( typeof( PostProfile ).Assembly );
            services.AddAutoMapper( typeof( UserProfile ).Assembly );
            services.AddAutoMapper( typeof( CommentProfile ).Assembly );
            services.AddAutoMapper( typeof( EventProfile ).Assembly );
            services.AddAutoMapper( typeof( NotificationProfile ).Assembly );
            services.AddAutoMapper( typeof( ReactionProfile ).Assembly );
            services.AddAutoMapper( typeof( SubscriptionProfile ).Assembly );

            return services;
        }
    }
}