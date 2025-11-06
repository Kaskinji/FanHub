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

            services.AddValidatorsFromAssemblyContaining<CategoryValidator>();
            services.AddValidatorsFromAssemblyContaining<FandomValidator>();
            services.AddValidatorsFromAssemblyContaining<GameValidator>();
            services.AddValidatorsFromAssemblyContaining<PostValidator>();
            services.AddValidatorsFromAssemblyContaining<UserValidator>();

            services.AddAutoMapper( typeof( CategoryProfile ).Assembly );
            services.AddAutoMapper( typeof( FandomProfile ).Assembly );
            services.AddAutoMapper( typeof( GameProfile ).Assembly );
            services.AddAutoMapper( typeof( PostProfile ).Assembly );
            services.AddAutoMapper( typeof( UserProfile ).Assembly );

            return services;
        }
    }
}