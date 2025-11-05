using Application.Mapping;
using Application.Services;
using Application.Services.Interfaces;
using Domain.Validators;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

namespace Application
{
    public static class ServiceBindings
    {
        public static IServiceCollection AddApplication(
            this IServiceCollection services )
        {
            services.AddScoped<IGameService, GameService>();

            services.AddValidatorsFromAssemblyContaining<GameValidator>();
            services.AddValidatorsFromAssemblyContaining<PostValidator>();

            services.AddAutoMapper( typeof( GameProfile ).Assembly );
            services.AddAutoMapper( typeof( PostProfile ).Assembly );

            return services;
        }
    }
}